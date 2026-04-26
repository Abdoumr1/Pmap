// Articles.jsx - Main articles listing page with navigation to article detail
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Calendar, Clock, User, Eye, Bookmark, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import articleImage1 from "./images/article1.webp";
import articleImage2 from "./images/logopfe.png";
import articleImage3 from "./images/logopfe.png";
import { MdArticle } from "react-icons/md";
import axios from "axios";

const Articles = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [bookmarkedArticles, setBookmarkedArticles] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ageCategory, setAgeCategory] = useState(null);
  const [showWarning, setShowWarning] = useState(false);

  const categories = [
    "All",
    "News",
    "Education",
    "Technology",
    "History",
    "Society"
  ];

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
        navigate('/age-selection', { state: { returnTo: '/card' } });
      }, 2000);
    }
  }, [location, navigate]);

  const matchAge = (articleAge, userAge) => {
    if (!articleAge || !userAge) return false;

    // Handle case where articleAge might be an array or string
    if (Array.isArray(articleAge)) {
      return articleAge.some(age =>
        age.toLowerCase().includes(userAge.toLowerCase())
      );
    }

    return articleAge.toLowerCase().includes(userAge.toLowerCase())
      || articleAge.toLowerCase().includes("all");
  };

  // Fetch articles effect
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/articles/")
      .then((res) => {
        const formatted = res.data.map((article, index) => ({
          id: article.id,
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          category: article.category,
          age_groupe: article.age_groups,
          image: article.image,
          readTime: article.read_time || "5 min",
          publishDate: new Date(article.publish_date).toLocaleDateString(),
          trending: article.trending || false,
          author: {
            name: article.name_author || "Unknown",
            avatar: "/avatars/default.jpg",
            title: article.job_author || "Writer"
          }
        }));

        setArticles(formatted);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Get latest article (most recent by publish date or id)
  const latestArticle = [...articles]
    .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
    .find(article => matchAge(article.age_groupe, ageCategory));

  // Filter articles by selected category and age (excluding the latest article if showing "All" category)
  const filteredArticles = articles.filter(article => {
    const categoryOk =
      selectedCategory === "All" ||
      article.category === selectedCategory;

    const ageOk = matchAge(article.age_groupe, ageCategory);

    // If showing "All" category, exclude the latest article from the main list
    // since it's already featured at the top
    if (selectedCategory === "All" && latestArticle && article.id === latestArticle.id) {
      return false;
    }

    return categoryOk && ageOk;
  });

  // Get category count for sidebar - FILTERS BY AGE
  const getCategoryCount = (category) => {
    // First filter by age category
    const ageFilteredArticles = articles.filter(article =>
      matchAge(article.age_groupe, ageCategory)
    );

    if (category === "All") return ageFilteredArticles.length;
    return ageFilteredArticles.filter(article => article.category === category).length;
  };

  // Get trending articles (for sidebar) - filtered by category and age
  const trendingArticles = articles.filter(article =>
    article.trending &&
    (selectedCategory === "All" || article.category === selectedCategory) &&
    matchAge(article.age_groupe, ageCategory) &&
    (!latestArticle || article.id !== latestArticle.id)
  ).slice(0, 4);

  // Get most read articles (for sidebar) - filtered by category and age
  const mostReadArticles = [...filteredArticles].slice(0, 4);

  const toggleBookmark = (articleId) => {
    if (bookmarkedArticles.includes(articleId)) {
      setBookmarkedArticles(bookmarkedArticles.filter(id => id !== articleId));
    } else {
      setBookmarkedArticles([...bookmarkedArticles, articleId]);
    }
  };

  const handleArticleClick = (articleId) => {
    navigate(`/article/${articleId}`);
  };

  // Pagination logic
  const articlesPerPage = 6;
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  if (loading) {
    return <div className="text-center p-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter',_'Poppins',_sans-serif]">
      {/* Top Navigation Bar - Eldjazer style */}
      <div className="bg-white shadow-sm sticky top-0 z-20 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
          </div>
        </div>
      </div>

      <div className="flex gap-3 p-6 pl-3 pb-0">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-green-700 hover:bg-gray-800 rounded-full transition-colors duration-200"
        >
          <ArrowLeft className="w-7 h-7 text-white" />
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-green-800 mb-2 border-l-4 border-green-700 pl-4 flex items-center gap-2">
            <MdArticle className="text-4xl" />
            Articles & Analysis
          </h1>
          <p className="text-gray-600 ml-6">
            Discover our latest publications on education, culture, and innovation in Algeria
          </p>
        </div>

        {/* Categories Filter - Now shows counts based on age */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => {
            // Get count for this category filtered by age
            let count;
            if (category === "All") {
              count = articles.filter(a => matchAge(a.age_groupe, ageCategory)).length;
            } else {
              count = articles.filter(a =>
                a.category === category && matchAge(a.age_groupe, ageCategory)
              ).length;
            }

            // Don't show category if no articles for this age group (optional)
            if (count === 0 && category !== "All") return null;

            return (
              <button
                key={category}
                className={`px-5 py-2.5 rounded-full border-2 transition-all duration-300 text-sm font-semibold ${selectedCategory === category
                  ? "bg-green-700 text-white border-green-700"
                  : "border-green-700 text-gray-700 hover:bg-green-800 hover:text-white hover:border-green-600"
                  }`}
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPage(1);
                }}
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

        {ageCategory && (
          <div className="flex justify-center mb-6">
            <span className="bg-green-100 text-green-700 px-5 py-2 rounded-full text-lg font-semibold">
              Articles for {ageCategory}
            </span>
          </div>
        )}

        {/* Show message when no articles in selected category */}
        {filteredArticles.length === 0 && !latestArticle && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm mb-8">
            <p className="text-gray-500 text-lg">No articles found in "{selectedCategory}" category for {ageCategory}.</p>
            <button
              onClick={() => setSelectedCategory("All")}
              className="mt-4 px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
            >
              View All Articles
            </button>
          </div>
        )}

        {/* Latest Article Section - Replaces Featured Article */}
        {latestArticle && selectedCategory === "All" && (
          <div
            className="mb-12 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleArticleClick(latestArticle.id)}
          >
            <div className="grid md:grid-cols-2">
              <div className="relative h-64 md:h-96 overflow-hidden">
                <img
                  src={`http://127.0.0.1:8000${latestArticle.image}`}
                  alt={latestArticle.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = articleImage1;
                  }}
                />
                <div className="absolute top-4 left-4 bg-green-700 text-white px-3 py-1 text-sm font-medium">
                  Latest Article
                </div>
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-3 text-xl text-gray-500 mb-3">
                  <span className="bg-green-800 rounded text-white px-3 py-1 text-center">
                    {latestArticle.category}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {latestArticle.publishDate}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight hover:text-green-700 transition-colors">
                  {latestArticle.title}
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {latestArticle.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-900 text-ms">
                        {latestArticle.author.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{latestArticle.author.name}</p>
                      <p className="text-xs text-gray-500">{latestArticle.author.title}</p>
                    </div>
                  </div>
                  <button className="px-5 py-2 bg-green-700 text-white text-sm font-medium hover:bg-green-800 transition-colors rounded">
                    Read Article
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Two Column Layout - Eldjazer style */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Articles Column */}
          <div className="lg:col-span-2">
            {/* Latest Articles */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-green-600"></span>
                {selectedCategory === "All" ? "More Articles" : `${selectedCategory} Articles`}
              </h2>
              <div className="space-y-6">
                {currentArticles.map((article) => (
                  <article
                    key={article.id}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
                    onClick={() => handleArticleClick(article.id)}
                  >
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-48 h-48 sm:h-auto overflow-hidden">
                        <img
                          src={`http://127.0.0.1:8000${article.image}`}
                          alt={article.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = articleImage1;
                          }}
                        />
                      </div>
                      <div className="flex-1 p-5">
                        <div className="flex items-center gap-2 text-l mb-2">
                          <span className="bg-green-800 text-white text-center rounded px-3 py-1">
                            {article.category}
                          </span>
                          <span>•</span>
                          <span>{article.publishDate}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {article.readTime} min
                          </span>
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 mb-2 hover:text-green-700 transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                              <span className="text-green-900 text-sm font-semibold">
                                {article.author.name?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-gray-700">{article.author.name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleBookmark(article.id);
                              }}
                              className={`hover:text-green-700 transition-colors ${bookmarkedArticles.includes(article.id) ? 'text-green-700' : 'text-gray-400'
                                }`}
                            >
                              <Bookmark className="w-4 h-4" fill={bookmarkedArticles.includes(article.id) ? "currentColor" : "none"} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Pagination - only show if more than articlesPerPage */}
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
          </div>

          {/* Sidebar - Eldjazer style */}
          <div className="lg:col-span-1">
            {/* Most Read - Now filtered by category */}
            <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
              <h3 className="font-bold text-gray-900 mb-4 text-2xl flex items-center gap-2">
                <span className="w-1 h-6 bg-green-600"></span>
                Most Read
              </h3>
              {mostReadArticles.length > 0 ? (
                <div className="space-y-4">
                  {mostReadArticles.map((article, index) => (
                    <div
                      key={article.id}
                      className="flex gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors group"
                      onClick={() => handleArticleClick(article.id)}
                    >
                      <span className="text-2xl font-bold text-green-700 w-6 group-hover:text-green-800">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 group-hover:text-green-700 transition-colors line-clamp-2">
                          {article.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">{article.publishDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No articles found</p>
              )}
            </div>

            {/* Categories - Now shows counts based on age category */}
            <div className="bg-white rounded-lg shadow-sm p-5">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-green-600"></span>
                Categories
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setCurrentPage(1);
                  }}
                  className={`flex items-center justify-between py-2 px-3 rounded-lg transition-colors w-full ${selectedCategory === "All"
                    ? 'bg-green-50 text-green-700 font-semibold'
                    : 'hover:bg-gray-50'
                    }`}
                >
                  <span>All Articles</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${selectedCategory === "All"
                    ? 'bg-green-200 text-green-800'
                    : 'bg-gray-100 text-gray-600'
                    }`}>
                    ({articles.filter(a => matchAge(a.age_groupe, ageCategory)).length})
                  </span>
                </button>

                {categories.slice(1).map((category) => {
                  // Count only articles matching both category AND age
                  const count = articles.filter(a =>
                    a.category === category && matchAge(a.age_groupe, ageCategory)
                  ).length;

                  // Don't show category if count is 0 for this age group
                  if (count === 0) return null;

                  return (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setCurrentPage(1);
                      }}
                      className={`flex items-center justify-between py-2 px-3 rounded-lg transition-colors w-full ${selectedCategory === category
                        ? 'bg-green-50 text-green-700 font-semibold'
                        : 'hover:bg-gray-50'
                        }`}
                    >
                      <span>{category}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${selectedCategory === category
                        ? 'bg-green-200 text-green-800'
                        : 'bg-gray-100 text-gray-600'
                        }`}>
                        ({count})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Articles;