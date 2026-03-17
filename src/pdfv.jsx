// PDFViewer.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import pdfbook1 from "./pdfbooks/book1.pdf";

const PDFViewer = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const bookDetails = {
    "1": { title: "The Art of Micro-Learning", author: "Dr. Ahmed Benali", pdfUrl: pdfbook1 },
    "2": { title: "Productivity During Commute", author: "Sarah Mansour", pdfUrl: "/books/productivity.pdf" },
    "3": { title: "Algerian Cultural Heritage", author: "Prof. Karim Bensaid", pdfUrl: "/books/algerian-heritage.pdf" },
  };

  const book = bookDetails[bookId] || {
    title: "Book not found",
    author: "Unknown",
    pdfUrl: "/books/default.pdf",
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col items-center">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">{book.title}</h1>
          <p className="text-sm md:text-base text-gray-500 mt-1">by {book.author}</p>
        </div>
      </header>

      {/* PDF Viewer */}
      <main className="flex-1 w-full relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
              <p className="mt-3 text-gray-600 font-medium">Loading PDF...</p>
            </div>
          </div>
        )}

        <iframe
          src={`${book.pdfUrl}#toolbar=1&navpanes=1`}
          className="w-full h-full"
          title={book.title}
          onLoad={() => setLoading(false)}
          style={{ minHeight: "calc(100vh - 96px)" }}
        />
      </main>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-inner p-3 flex justify-between">
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 bg-gray-100 hover:bg-gray-200 transition rounded-lg text-sm font-semibold"
        >
          ← Back
        </button>
        <a
          href={book.pdfUrl}
          download
          className="px-5 py-2 bg-green-600 hover:bg-green-700 transition text-white rounded-lg text-sm font-semibold flex items-center gap-2"
        >
          📥 Download
        </a>
      </div>
    </div>
  );
};

export default PDFViewer;