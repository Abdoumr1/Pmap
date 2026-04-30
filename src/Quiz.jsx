// Quiz.jsx - With category counts only (no age group filter)
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Clock, Trophy, Star, Users,
  ChevronRight, Sparkles, TrendingUp
} from 'lucide-react';
import { RiQuestionnaireFill } from "react-icons/ri";



const Quiz = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [quizzes, setQuizzes] = useState([]);
  const [allQuizzes, setAllQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch all quizzes first
  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/quizzes/`)
      .then((res) => {
        const quizData = res.data.results || res.data;
        setAllQuizzes(quizData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching quizzes:", err);
        setLoading(false);
      });
  }, []);

  // Filter quizzes based on category
  useEffect(() => {
    if (allQuizzes.length === 0) return;

    let filtered = [...allQuizzes];

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(quiz => quiz.category === selectedCategory);
    }

    setQuizzes(filtered);
  }, [selectedCategory, allQuizzes]);

  const categories = [
    "All", "Education", "Technology", "History",
    "Culture", "Science", "Languages", "Health", "Policy"
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "beginner": return { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200" };
      case "intermediate": return { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200" };
      case "advanced": return { bg: "bg-rose-100", text: "text-rose-700", border: "border-rose-200" };
      default: return { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200" };
    }
  };

  const getImageUrl = (quiz) => {
    if (quiz.cover_image) {
      if (quiz.cover_image.startsWith('http')) {
        return quiz.cover_image;
      }
      return `http://127.0.0.1:8000${quiz.cover_image}`;
    }
    if (quiz.image) {
      if (quiz.image.startsWith('http')) {
        return quiz.image;
      }
      return `http://127.0.0.1:8000${quiz.image}`;
    }
    return logopfe;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-green-800 mb-2 border-l-4 border-green-700 pl-4 flex items-center gap-2">
          Articles & Analysis
        </h1>
        <p className="text-gray-600 ml-6">
          Discover our latest publications on education, culture, and innovation in Algeria
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories Filter - Shows counts for each category */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => {
            // Get count for this category
            let count;
            if (category === "All") {
              count = allQuizzes.length;
            } else {
              count = allQuizzes.filter(q => q.category === category).length;
            }

            // Don't show category if no quizzes (optional)
            if (count === 0 && category !== "All") return null;

            return (
              <button
                key={category}
                className={`px-5 py-2.5 rounded-full border-2 transition-all duration-300 text-l font-semibold 
                  ${selectedCategory === category
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

        {/* Results Stats */}
        {!loading && quizzes.length > 0 && (
          <div className="mb-6 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Found <span className="font-semibold text-green-600">{quizzes.length}</span> quizzes
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <TrendingUp className="w-4 h-4" />
              <span>Sorted by popularity</span>
            </div>
          </div>
        )}

        {/* Quiz Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading amazing quizzes...</p>
            </div>
          </div>
        ) : (
          <>
            {quizzes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {quizzes.map((quiz, index) => {
                  const difficultyStyle = getDifficultyColor(quiz.difficulty);
                  return (
                    <div
                      key={quiz.id}
                      onClick={() => navigate(`/quizzes/${quiz.id}`)}
                      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer border border-gray-100 hover:border-green-300 transform hover:-translate-y-2"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Image Container */}
                      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                        <img
                          src={getImageUrl(quiz)}
                          alt={quiz.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          onError={(e) => {
                            e.target.src = logopfe;
                            e.target.onerror = null;
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        {/* Difficulty Badge */}
                        <div className={`absolute top-3 left-3 px-3 py-1.5 rounded-xl text-xs font-bold ${difficultyStyle.bg} ${difficultyStyle.text} shadow-md`}>
                          {quiz.difficulty || "Standard"}
                        </div>

                        {/* Popular Badge */}
                        {quiz.popular && (
                          <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shadow-md">
                            <Trophy className="w-3 h-3" />
                            Popular
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        {/* Category */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-lg">
                            {quiz.category} {quiz.category}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-700 transition">
                          {quiz.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {quiz.description || "Test your knowledge with this exciting quiz!"}
                        </p>

                        {/* Quiz Stats */}
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          <div className="flex items-center justify-center gap-1.5 text-2xl font-bold text-black bg-gray-200 shadow-l rounded-lg py-2">
                            <RiQuestionnaireFill className="w-6 h-6" />
                            <span className="font-medium">Number Questions : {quiz.nbr_question || quiz.questions || 0}</span>
                          </div>
                          <div className="flex items-center justify-center gap-1.5 text-2xl font-bold text-white bg-green-700 rounded-lg py-2">
                            <Clock className="w-3.5 h-3.5" />
                            <span className="font-medium">Time To solve : {quiz.solve_time || 5} min</span>
                          </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(quiz.rating || 0)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">
                            ({quiz.reviews || 0} reviews)
                          </span>
                        </div>

                        {/* Start Button */}
                        <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 group-hover:from-green-700 group-hover:to-emerald-700 transition-all duration-300 transform group-hover:scale-105">
                          <span>Start Quiz</span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Show message when no quizzes in selected category */
              <div className="text-center py-12 bg-white rounded-lg shadow-sm mb-8">
                <p className="text-gray-500 text-lg">
                  No quizzes found in "{selectedCategory}" category.
                </p>
                <button
                  onClick={() => setSelectedCategory("All")}
                  className="mt-4 px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
                >
                  View All Quizzes
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};


export default Quiz;