import React, { useState } from "react";
import Book from "./components/Book";

export default function App() {
  const [books, setBooks] = useState([
        { 
            id: 1,
            title: "הארי פוטר", 
            author: "ג'יי קיי רולינג", 
            likes: 150, 
            onshelf: true, 
            sample: "הארי הביט במכתב, לא מאמין למה שראה..."
        },
        { 
            id: 2,
            title: "שר הטבעות", 
            author: "ג'יי. ר. ר. טולקין", 
            likes: 95, 
            onshelf: false, 
            sample: "דרך אפלה וצרה השתרעה לפניו, נעלמת בערפל..."
        },
        { 
            id: 3,
            title: "הנסיך הקטן", 
            author: "אנטואן דה סנט-אכזופרי", 
            likes: 200, 
            onshelf: true, 
            sample: "צייר לי כבשה, ביקש הנסיך הקטן."
        },
        { 
            id: 4,
            title: "מלכת הצללים", 
            author: "שרה ג'יי מאס", 
            likes: 101, 
            onshelf: false,
            sample: "המלכה חזרה" 
         }
    ]);

    function takeBook(id) {
        setBooks(books.map(book => book.id === id ? { ...book, onshelf: false } : book));
    }

    function addLike(id) {
        setBooks(books.map(book => book.id === id ? { ...book, likes: book.likes + 1 } : book));
    }

    return (
      <div className="app">
          <h1>📚 חנות הספרים</h1>
          <div className="book-list">
                {books.map((book) => (
                    <Book
                        key={book.id}
                        title={book.title}
                        author={book.author}
                        likes={book.likes}
                        onshelf={book.onshelf}
                        sample={book.sample}
                        
                        takeBook={() => takeBook(book.id)}
                        addLike={() => addLike(book.id)}
                    />
                ))}
            </div>
      </div>
  );
}
