import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";

const Books = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [selectedCategory, setSelectedCategory] = useState("All");
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [ageCategory, setAgeCategory] = useState(null);
    const [showWarning, setShowWarning] = useState(false);

    const categories = ["All", "Health", "Policy", "History", "Technology", "Education", "Science"];

    // Age category check effect
    useEffect(() => {
        let selectedAge = null;

        if (location.state?.ageCategory) {
            selectedAge = location.state.ageCategory;
            setAgeCategory(selectedAge);
            localStorage.setItem('userAgeCategory', selectedAge);
        } else {
            const savedAgeCategory = localStorage.getItem('userAgeCategory');
            if (savedAgeCategory) setAgeCategory(savedAgeCategory);
        }

        if (!selectedAge && !localStorage.getItem('userAgeCategory')) {
            setShowWarning(true);
            setTimeout(() => {
                navigate('/age-selection', { state: { returnTo: '/books' } });
            }, 2000);
        }
    }, [location, navigate]);

    const matchAge = (bookAge, userAge) => {
        if (!bookAge || !userAge) return false;

        // Handle case where bookAge might be an array or string
        if (Array.isArray(bookAge)) {
            return bookAge.some(age =>
                age.toLowerCase().includes(userAge.toLowerCase())
            );
        }

        return bookAge.toLowerCase().includes(userAge.toLowerCase())
            || bookAge.toLowerCase().includes("all");
    };

    // Fetch books from Django API
    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/books/")
            .then((res) => {
                console.log("API DATA:", res.data);

                let booksData = [];
                if (Array.isArray(res.data)) {
                    booksData = res.data;
                } else if (res.data.results) {
                    booksData = res.data.results;
                }

                // Format books with additional fields
                const formatted = booksData.map((book, index) => ({
                    id: book.id,
                    title: book.title,
                    description: book.description || "No description available",
                    category: book.category || "General",
                    age_groupe: book.age_groups || book.age_category || "All",
                    cover_image: book.cover_image,
                    pdf_file: book.pdf_file,
                    author: book.author || "Unknown",
                    publishDate: book.publish_date ? new Date(book.publish_date).toLocaleDateString() : new Date().toLocaleDateString(),
                    readTime: book.read_time || `${Math.floor(Math.random() * 20) + 5} min`,
                    trending: book.trending || false,
                    featured: index === 0
                }));

                setBooks(formatted);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching books:", err);
                setBooks([]);
                setLoading(false);
            });
    }, []);

    // Get latest book (most recent by publish date or id)
    const latestBook = [...books]
        .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
        .find(book => matchAge(book.age_groupe, ageCategory));

    // Filter books by selected category and age
    const filteredBooks = books.filter(book => {
        const categoryOk =
            selectedCategory === "All" ||
            book.category === selectedCategory;

        const ageOk = matchAge(book.age_groupe, ageCategory);

        // If showing "All" category, exclude the latest book from the main list
        if (selectedCategory === "All" && latestBook && book.id === latestBook.id) {
            return false;
        }

        return categoryOk && ageOk;
    });

    // Get category count - filters by age
    const getCategoryCount = (category) => {
        const ageFilteredBooks = books.filter(book =>
            matchAge(book.age_groupe, ageCategory)
        );

        if (category === "All") return ageFilteredBooks.length;
        return ageFilteredBooks.filter(book => book.category === category).length;
    };

    // Get trending books (for sidebar)
    const trendingBooks = books.filter(book =>
        book.trending &&
        (selectedCategory === "All" || book.category === selectedCategory) &&
        matchAge(book.age_groupe, ageCategory) &&
        (!latestBook || book.id !== latestBook.id)
    ).slice(0, 4);

    // Pagination logic
    const booksPerPage = 8;
    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

    const openPDFInApp = (bookId) => {
        navigate(`/read/${bookId}`);
    };

    // Reset to first page when changing category
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
                    <p className="text-gray-500 mt-4">Loading books...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-10">
                {/* Back Button */}
                <div className="flex gap-3 p-6 pl-2 pb-0">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 bg-green-700 hover:bg-gray-800 rounded-full transition-colors duration-200"
                    >
                        <ArrowLeft className="w-7 h-7 text-white" />
                    </button>
                </div>

                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-green-800 mb-4 flex items-center justify-center gap-2">
                        <BookOpen className="text-5xl" />
                        📚 Micro-Books Library
                    </h1>
                    <p className="text-gray-600">
                        Discover concise books perfect for your daily learning.
                    </p>
                </div>

                {/* Age Category Display */}
                {ageCategory && (
                    <div className="flex justify-center mb-6">
                        <span className="bg-green-100 text-green-700 px-5 py-2 rounded-full text-lg font-semibold">
                            Books for {ageCategory}
                        </span>
                    </div>
                )}

                {/* Categories Filter - Now shows counts based on age */}
                <div className="flex flex-wrap justify-center gap-3 mb-10">
                    {categories.map((category) => {
                        const count = getCategoryCount(category);
                        // Don't show category if no books for this age group
                        if (count === 0 && category !== "All") return null;

                        return (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-5 py-2 rounded-full border-2 font-semibold transition
                                    ${selectedCategory === category
                                        ? "bg-green-800 text-white border-green-800"
                                        : "border-green-700 text-gray-700 hover:bg-green-800 hover:text-white"
                                    }`}
                            >
                                {category}
                                {category !== "All" && (
                                    <span className="ml-2 text-xs">
                                        ({count})
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Latest Book Section - Featured */}
                {latestBook && selectedCategory === "All" && (
                    <div className="mb-12 bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                        <div className="grid md:grid-cols-2">
                            <div className="relative h-80 md:h-auto overflow-hidden">
                                <img
                                    src={`http://127.0.0.1:8000${latestBook.cover_image}`}
                                    alt={latestBook.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = "https://via.placeholder.com/400x300?text=Book+Cover";
                                    }}
                                />
                                <div className="absolute top-4 left-4 bg-green-700 text-white px-3 py-1 text-sm font-medium rounded">
                                    Latest Book
                                </div>
                            </div>
                            <div className="p-8 flex flex-col justify-center">
                                <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                                        {latestBook.category}
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {latestBook.publishDate}
                                    </span>
                                    <span>•</span>
                                    <span>{latestBook.readTime}</span>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight hover:text-green-700 transition-colors">
                                    {latestBook.title}
                                </h2>
                                <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                                    {latestBook.description}
                                </p>
                                <p className="text-sm text-gray-500 mb-6">
                                    by {latestBook.author}
                                </p>
                                <button
                                    onClick={() => openPDFInApp(latestBook.id)}
                                    className="px-6 py-3 bg-green-700 text-white text-sm font-medium hover:bg-green-800 transition-colors rounded-lg self-start"
                                >
                                    Read Now
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* No Books Message */}
                {filteredBooks.length === 0 && !latestBook && (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm mb-8">
                        <p className="text-gray-500 text-lg">No books found in "{selectedCategory}" category for {ageCategory}.</p>
                        <button
                            onClick={() => setSelectedCategory("All")}
                            className="mt-4 px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
                        >
                            View All Books
                        </button>
                    </div>
                )}

                {/* Books Grid */}
                {filteredBooks.length > 0 && (
                    <>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <span className="w-1 h-6 bg-green-600"></span>
                            {selectedCategory === "All" ? "More Books" : `${selectedCategory} Books`}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {currentBooks.map((book) => (
                                <div
                                    key={book.id}
                                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
                                >
                                    <div className="h-56 bg-gray-200 overflow-hidden">
                                        <img
                                            src={`http://127.0.0.1:8000${book.cover_image}`}
                                            alt={book.title}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                            onError={(e) => {
                                                e.target.src = "https://via.placeholder.com/400x300?text=Book+Cover";
                                            }}
                                        />
                                    </div>

                                    <div className="p-4">
                                        <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                            {book.category}
                                        </span>

                                        <h3 className="font-bold mt-2 text-lg line-clamp-2 hover:text-green-700 transition-colors">
                                            {book.title}
                                        </h3>

                                        <p className="text-sm text-gray-600 mt-1">
                                            by {book.author}
                                        </p>

                                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                                            <Calendar className="w-3 h-3" />
                                            <span>{book.publishDate}</span>
                                            <span>•</span>
                                            <span>{book.readTime}</span>
                                        </div>

                                        <button
                                            onClick={() => openPDFInApp(book.id)}
                                            className="mt-3 w-full bg-green-700 hover:bg-green-800 text-white py-2 rounded-lg transition-colors font-medium"
                                        >
                                            Read Book
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-10 flex items-center justify-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className={`w-10 h-10 flex items-center justify-center border border-gray-200 rounded transition-colors ${currentPage === 1
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'hover:bg-green-50 hover:border-green-300'
                                        }`}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                {[...Array(Math.min(3, totalPages))].map((_, i) => {
                                    const page = i + 1;
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-10 h-10 flex items-center justify-center rounded transition-colors ${currentPage === page
                                                ? 'bg-green-700 text-white'
                                                : 'border border-gray-200 hover:bg-green-50'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}
                                {totalPages > 3 && (
                                    <>
                                        <span className="px-2">...</span>
                                        <button
                                            onClick={() => setCurrentPage(totalPages)}
                                            className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded hover:bg-green-50 transition-colors"
                                        >
                                            {totalPages}
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className={`w-10 h-10 flex items-center justify-center border border-gray-200 rounded transition-colors ${currentPage === totalPages
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'hover:bg-green-50 hover:border-green-300'
                                        }`}
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Books;