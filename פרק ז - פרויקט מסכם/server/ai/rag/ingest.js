// ingest.js
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { ChromaClient } from "chromadb";

dotenv.config();

const GEMINI_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_KEY) throw new Error("Set GEMINI_API_KEY in .env");

// Gemini client
const ai = new GoogleGenAI({ apiKey: GEMINI_KEY });

// Local Chroma instance, persisted to ../chroma folder
const chroma = new ChromaClient({ persistDirectory: "../chroma" });

const EMBEDDINGS_CACHE_PATH = path.join(import.meta.dirname || ".", "embeddings_cache.json");

function loadEmbeddingsCache() {
  if (fs.existsSync(EMBEDDINGS_CACHE_PATH)) {
    return JSON.parse(fs.readFileSync(EMBEDDINGS_CACHE_PATH, "utf-8"));
  }
  return {};
}

function saveEmbeddingsCache(cache) {
  fs.writeFileSync(EMBEDDINGS_CACHE_PATH, JSON.stringify(cache, null, 2), "utf-8");
}

async function readCsv(filePath) {
  return new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => rows.push(data))
      .on("end", () => resolve(rows))
      .on("error", reject);
  });
}

function productToText(p) {
  return `Product: ${p.name}
Category: ${p.category}
Price: ${p.price}
Description: ${p.description || ""}`.trim();
}

async function embedTexts(texts) {
  const resp = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: texts,
    taskType: "RETRIEVAL_DOCUMENT",
  });
  return resp.embeddings.map((e) => e.values);
}

export async function ingest() {
  const rows = await readCsv("../insert_products.csv");
  if (!rows.length) throw new Error("CSV is empty");

  const ids = [];
  const docs = [];
  const metadatas = [];

  const cache = loadEmbeddingsCache();
  const textsToEmbed = [];
  const embedIndices = [];

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const id = r.id || `product-${Math.random().toString(36).slice(2, 9)}`;
    ids.push(id);
    const doc = productToText(r);
    docs.push(doc);
    metadatas.push({
      name: r.name,
      category: r.category,
      price: r.price,
      raw: JSON.stringify(r),
    });

    // Use a hash of the doc as cache key (or just the id if doc never changes)
    const cacheKey = id + ":" + Buffer.from(doc).toString("base64");
    if (cache[cacheKey]) {
      // Already embedded
      continue;
    }
    textsToEmbed.push(doc);
    embedIndices.push(i);
  }

  let embeddings = new Array(docs.length);

  // Fill from cache
  for (let i = 0; i < docs.length; i++) {
    const id = ids[i];
    const doc = docs[i];
    const cacheKey = id + ":" + Buffer.from(doc).toString("base64");
    if (cache[cacheKey]) {
      embeddings[i] = cache[cacheKey];
    }
  }

  // Embed only new/changed docs
  if (textsToEmbed.length) {
    console.log(`Embedding ${textsToEmbed.length} new/changed products...`);
    const newEmbeddings = await embedTexts(textsToEmbed);
    for (let j = 0; j < embedIndices.length; j++) {
      const i = embedIndices[j];
      const id = ids[i];
      const doc = docs[i];
      const cacheKey = id + ":" + Buffer.from(doc).toString("base64");
      embeddings[i] = newEmbeddings[j];
      cache[cacheKey] = newEmbeddings[j];
    }
    saveEmbeddingsCache(cache);
  }

  const collection = await chroma.getOrCreateCollection({ name: "products" });
  console.log("ids: ", ids[0]);
  console.log("docs: ", docs[0]);
  console.log("metadatas: ", metadatas[0]);
  console.log("embeddings: ", embeddings[0]);
  
  await collection.upsert({
    ids,
    documents: docs,
    metadatas,
    embeddings,
  });

  console.log("Ingestion complete. Data stored in ./chroma folder.");
}

ingest();