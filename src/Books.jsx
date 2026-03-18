// Books.jsx
import logopfe from "./images/logopfe.png";
import book1img from "./images/book1.png";
import pdfbook1 from "./pdfbooks/book1.pdf";
import { useNavigate } from "react-router-dom";

const Books = () => {
    const navigate = useNavigate();

    const books = [
        {
            id: 1,
            title: "تاريخ الافكار السياسية",
            author: "Jhon",
            category: "Policy",

            pages: 124,

            image: book1img,
            rating: 4.8,
            readers: "1.2k",
            pdfUrl: pdfbook1
        },
        
    ];

    const openPDFInApp= (bookId) => {
        navigate(`/read/${bookId}`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Header Section */}
                <div className="text-center mb-10 sm:mb-14">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-800 mb-4">
                        📚 Micro-Books Library
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                        Discover concise books perfect for your daily commute. Learn efficiently, grow continuously.
                    </p>
                </div>

                {/* Categories Filter */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {["All", "Religious", "Policy", "History", "Technology"].map((category) => (
                        <button
                            key={category}
                            className="px-5 py-2.5 rounded-full border-2 border-green-700 text-gray-700 hover:bg-green-800 hover:text-white hover:border-green-600 transition-all duration-300 text-sm font-semibold"
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Books Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {books.map((book) => (
                        <div
                            key={book.id}
                            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-green-300"
                        >
                            {/* Book Cover */}
                            <div className="relative w-full h-70 sm:h-70 md:h-56 bg-gradient-to-br from-green-100 to-emerald-100 overflow-hidden">
                                <img
                                    src={book.image}
                                    alt={book.title}
                                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            {/* Book Details */}
                            <div className="p-4 sm:p-5">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1.5 rounded-full">
                                        {book.category}
                                    </span>
                                    <span className="flex items-center gap-1 text-sm font-bold text-yellow-600">
                                        ⭐ {book.rating}
                                    </span>
                                </div>
                                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-green-700 transition-colors">
                                    {book.title}
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-600 mb-2 font-medium">by {book.author}</p>

                                {/* Read Button */}
                                <button
                                    onClick={() => openPDFInApp(book.id)}
                                    className="w-full bg-green-700 hover:bg-green-700 text-white py-2.5 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                     Read 
                                </button>

                                {/* Download */}
                                <div className="mt-2 text-center">
                                    <a
                                        href={book.pdfUrl}
                                        download
                                        className="text-xs text-green-600 hover:text-green-800 flex items-center justify-center gap-1"
                                    >
                                        ⬇️ Download PDF
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Load More Button */}
                <div className="text-center mt-12">
                    <button className="px-10 py-4 bg-white border-2 border-green-600 text-green-700 rounded-xl font-semibold hover:bg-green-600 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg text-base">
                        Load More Books
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Books;