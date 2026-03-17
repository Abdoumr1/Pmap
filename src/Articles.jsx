// Articles.jsx - Main articles listing page with navigation to article detail
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // IMPORTANT: Add this import
import { Calendar, Clock, User, Eye, Bookmark, ChevronLeft, ChevronRight } from 'lucide-react';
import articleImage1 from "./images/article1.webp";
import articleImage2 from "./images/logopfe.png";
import articleImage3 from "./images/logopfe.png";
import { MdArticle } from "react-icons/md";


const Articles = () => {
  const navigate = useNavigate(); // IMPORTANT: Add this hook
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [bookmarkedArticles, setBookmarkedArticles] = useState([]);

  const categories = [
    "All",
    "News",
    "Education",
    "Technology",
    "History",
    "Society"
  ];

  const articles = [
    {
      id: 1,
      title: "The Future of Micro-Learning in Algeria",
      excerpt: "How 5-minute learning sessions are transforming education in our country, especially during daily commutes.",
      content: "Full article here...",
      author: {
        name: "Dr. Sarah Benali",
        avatar: "/avatars/sarah.jpg",
        title: "Education Researcher"
      },
      category: "Education",
      image: articleImage1,
      readTime: "5 min",
      publishDate: "March 14, 2026",
      views: 1240,
      comments: 23,
      featured: true,
      trending: true
    },
    {
      id: 2,
      title: "Preserving Algerian Cultural Heritage in the Digital Age",
      excerpt: "How technology is helping preserve and share Algeria's rich cultural heritage with new generations.",
      author: {
        name: "Karim Mansour",
        avatar: "/avatars/karim.jpg",
        title: "Historian"
      },
      category: "Culture",
      image: articleImage2,
      readTime: "8 min",
      publishDate: "March 12, 2026",
      views: 890,
      comments: 15,
      featured: false,
      trending: true
    },
    {
      id: 3,
      title: "Ancient Trade Routes: From Algiers to Timbuktu",
      excerpt: "Exploring historical routes that connected North and West Africa, and their legacy in today's cultural exchanges.",
      author: {
        name: "Dr. Fatima Zohra",
        avatar: "/avatars/fatima.jpg",
        title: "Historian"
      },
      category: "History",
      image: articleImage3,
      readTime: "10 min",
      publishDate: "March 10, 2026",
      views: 670,
      comments: 8,
      featured: false,
      trending: false
    },
    {
      id: 4,
      title: "The Rise of Tech Startups in Algiers",
      excerpt: "How Algeria's new generation of entrepreneurs is shaping the future of technology in the capital.",
      author: {
        name: "Yacine Boudiaf",
        avatar: "/avatars/yacine.jpg",
        title: "Tech Journalist"
      },
      category: "Technology",
      image: articleImage1,
      readTime: "6 min",
      publishDate: "March 8, 2026",
      views: 2100,
      comments: 42,
      featured: false,
      trending: true
    },
    {
      id: 5,
      title: "Digital Education in Rural Areas",
      excerpt: "Challenges and opportunities of digital learning in remote regions of Algeria.",
      author: {
        name: "Nadia Cherif",
        avatar: "/avatars/nadia.jpg",
        title: "Education Expert"
      },
      category: "Education",
      image: articleImage2,
      readTime: "7 min",
      publishDate: "March 6, 2026",
      views: 540,
      comments: 12,
      featured: false,
      trending: false
    },
    {
      id: 6,
      title: "The New Algerian Art Scene",
      excerpt: "Discover contemporary artists redefining Algerian culture on the international stage.",
      author: {
        name: "Amira Said",
        avatar: "/avatars/amira.jpg",
        title: "Art Critic"
      },
      category: "Culture",
      image: articleImage3,
      readTime: "9 min",
      publishDate: "March 4, 2026",
      views: 780,
      comments: 19,
      featured: false,
      trending: false
    }
  ];

  const featuredArticle = articles.find(article => article.featured);
  const trendingArticles = articles.filter(article => article.trending);
  const regularArticles = articles.filter(article => !article.featured);

  const toggleBookmark = (articleId) => {
    if (bookmarkedArticles.includes(articleId)) {
      setBookmarkedArticles(bookmarkedArticles.filter(id => id !== articleId));
    } else {
      setBookmarkedArticles([...bookmarkedArticles, articleId]);
    }
  };

  // Function to handle article click
  const handleArticleClick = (articleId) => {
    navigate(`/article/${articleId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter',_'Poppins',_sans-serif]">
      {/* Top Navigation Bar - Eldjazer style */}
      <div className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* You can add your navigation items here */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-green-800 mb-2 border-l-4 border-green-00 pl-4">
            <MdArticle  className="text-4xl"/>Articles & Analysis
          </h1>
          <p className="text-gray-600 ml-6">
            Discover our latest publications on education, culture, and innovation in Algeria
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

       
        {featuredArticle && (
          <div 
            className="mb-12 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleArticleClick(featuredArticle.id)}
          >
            <div className="grid md:grid-cols-2">
              <div className="relative h-64 md:h-96 overflow-hidden">
                <img
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-green-700 text-white px-3 py-1 text-sm font-medium">
                  Featured
                </div>
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                  <span className="text-green-700 font-medium">{featuredArticle.category}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {featuredArticle.publishDate}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight hover:text-green-700 transition-colors">
                  {featuredArticle.title}
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {featuredArticle.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={featuredArticle.author.avatar}
                      alt={featuredArticle.author.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-green-100"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{featuredArticle.author.name}</p>
                      <p className="text-xs text-gray-500">{featuredArticle.author.title}</p>
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

            {/* Trending Section */}
            {trendingArticles.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-green-600"></span>
                  Popular Articles
                </h2>
                <div className="space-y-4">
                  {trendingArticles.map((article, index) => (
                    <div 
                      key={article.id} 
                      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 flex gap-4 cursor-pointer"
                      onClick={() => handleArticleClick(article.id)}
                    >
                      <div className="w-16 h-16 flex-shrink-0 bg-green-100 rounded flex items-center justify-center text-green-700 font-bold text-xl">
                        #{index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1 hover:text-green-700 transition-colors">
                          {article.title}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {article.author.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {article.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {article.readTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Latest Articles */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-green-600"></span>
                Latest Articles
              </h2>
              <div className="space-y-6">
                {regularArticles.map((article) => (
                  <article 
                    key={article.id} 
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
                    onClick={() => handleArticleClick(article.id)}
                  >
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-48 h-48 sm:h-auto overflow-hidden">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1 p-5">
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                          <span className="text-green-700 font-medium">{article.category}</span>
                          <span>•</span>
                          <span>{article.publishDate}</span>
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 mb-2 hover:text-green-700 transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              src={article.author.avatar}
                              alt={article.author.name}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                            <span className="text-xs text-gray-700">{article.author.name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent triggering the article click
                                toggleBookmark(article.id);
                              }}
                              className={`hover:text-green-700 ${bookmarkedArticles.includes(article.id) ? 'text-green-700' : 'text-gray-400'}`}
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

            {/* Pagination - Eldjazer style */}
            <div className="mt-10 flex items-center justify-center gap-2">
              <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded hover:bg-green-50 hover:border-green-300 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 flex items-center justify-center bg-green-700 text-white rounded">1</button>
              <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded hover:bg-green-50">2</button>
              <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded hover:bg-green-50">3</button>
              <span className="px-2">...</span>
              <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded hover:bg-green-50">12</button>
              <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded hover:bg-green-50 hover:border-green-300 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sidebar - Eldjazer style */}
          <div className="lg:col-span-1">

            {/* Most Read */}
            <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-green-600"></span>
                Most Read
              </h3>
              <div className="space-y-4">
                {articles.slice(0, 4).map((article, index) => (
                  <div 
                    key={index} 
                    className="flex gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                    onClick={() => handleArticleClick(article.id)}
                  >
                    <span className="text-2xl font-light text-green-700 w-6">{index + 1}</span>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-1 hover:text-green-700 transition-colors">
                        {article.title}
                      </h4>
                      <span className="text-xs text-gray-500">{article.views} views</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-lg shadow-sm p-5">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-green-600"></span>
                Categories
              </h3>
              <div className="space-y-2">
                {categories.slice(1).map((category) => (
                  <a
                    key={category}
                    href="#"
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 hover:text-green-700 transition-colors"
                  >
                    <span>{category}</span>
                    <span className="text-xs text-gray-400">(1)</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Eldjazer style */}
      <footer className="bg-gray-700 text-gray-300 mt-16">
        <div className="border-t border-gray-800 mt-8 pb-7 pt-10 text-sm text-center">
          © 2026 P-MAP. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Articles;