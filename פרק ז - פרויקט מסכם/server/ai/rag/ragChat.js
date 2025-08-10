import { GoogleGenAI } from "@google/genai";
import { ChromaClient } from "chromadb";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const chroma = new ChromaClient({ persistDirectory: "./chroma" });

async function embedText(text) {
  const resp = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: [text],
    taskType: "RETRIEVAL_QUERY",
  });
  return resp.embeddings[0].values;
}

function formatChatHistory(messages) {
  // Exclude the last message (current question)
  return messages
    .slice(0, -1)
    .map(
      (msg) =>
        `${msg.role === "user" ? "Customer" : "Assistant"}: ${msg.text}`
    )
    .join("\n");
}

function buildPrompt(question, retrieved, chatHistory) {
  const context = retrieved
    .map(
      (r, i) =>
        `---\nContext ${i + 1}:\n${r.document}\nMetadata: ${JSON.stringify(
          r.metadata
        )}`
    )
    .join("\n\n");

  return `You are an assistant answering questions about products in our store. The given chat history is the beginning of the conversation with the customer, so use the info from it when constructing an answer. Aside from it, use ONLY the provided contexts to answer and use keywords from them. However, if the contexts are completely irrelevant to the answer, you may ignore them. Answer in detail and offer the customer some related products that they might be interested in. Prices are in ILS (ש\"ח in Hebrew).

Chat history:
${chatHistory}

Question: ${question}

Contexts:
${context}`;
}

export async function getRagAnswer(questions) {
  const question = questions[questions.length - 1].text;
  const chatHistory = formatChatHistory(questions);
  
  const qEmb = await embedText(question);
  const collection = await chroma.getOrCreateCollection({ name: "products" });

  const results = await collection.query({
    queryEmbeddings: [qEmb],
    nResults: 16,
    include: ["documents", "metadatas", "distances"],
  });

  const docs = results.documents[0] || [];
  const metas = results.metadatas[0] || [];
  const retrieved = docs.map((doc, i) => ({
    document: doc,
    metadata: metas[i],
  }));

  const prompt = buildPrompt(question, retrieved, chatHistory);
  const gen = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
        temperature: 0,
    }
  });

  return gen.text;
}
