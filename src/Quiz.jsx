import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  Clock, Trophy, Star, Users, BookOpen, 
  ChevronRight, Filter, Search, Award 
} from 'lucide-react';

import logopfe from "./images/logopfe.png";

const Quiz = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ ONLY API CHANGE (no design change)
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/quizzes/")
      .then((res) => {
        setQuizzes(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching quizzes:", err);
        setLoading(false);
      });
  }, []);

  const categories = [
    "All",
    "Education",
    "Technology",
    "History",
    "Culture",
    "Science",
    "Languages"
  ];

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case "Beginner": return "bg-green-100 text-green-700";
      case "Intermediate": return "bg-yellow-100 text-yellow-700";
      case "Advanced": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const filteredQuizzes = quizzes.filter(quiz => 
    (selectedCategory === "All" || quiz.category === selectedCategory) &&
    quiz.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header Section (UNCHANGED) */}
      <div className="text-center mb-10 sm:mb-14">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-800 mb-4">
          Knowledge Quizzes
        </h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          Test your knowledge, track your progress, and earn badges
        </p>
      </div>

      {/* Categories Filter (UNCHANGED) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">

          <div className="flex flex-wrap justify-center gap-3 mb-3">
            {["All", "Health", "Policy", "History", "Technology"].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-full border-2 text-sm font-semibold transition-all duration-300
                  ${selectedCategory === category
                    ? "bg-green-800 text-white border-green-600"
                    : "border-green-700 text-gray-700 hover:bg-green-800 hover:text-white"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

        </div>

        {/* Loading */}
        {loading ? (
          <p className="text-center">Loading quizzes...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {filteredQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                onClick={() => navigate(`/quiz/${quiz.id}`)}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 hover:border-green-300"
              >

                {/* Image (ONLY FIX HERE) */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={
                      quiz.image
                        ? `http://127.0.0.1:8000${quiz.image}`
                        : logopfe
                    }
                    alt={quiz.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => (e.target.src = logopfe)}
                  />

                  {/* Difficulty Badge */}
                  <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(quiz.difficulty)}`}>
                    {quiz.difficulty}
                  </div>

                  {/* Popular Badge */}
                  {quiz.popular && (
                    <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Trophy className="w-3 h-3" />
                      Popular
                    </div>
                  )}
                </div>

                {/* Content (UNCHANGED) */}
                <div className="p-5">

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">
                      {quiz.category}
                    </span>

                    <div className="flex items-center gap-1 text-sm text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-medium">{quiz.rating}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {quiz.title}
                  </h3>

                  <p className="text-sm text-gray-600 mb-4">
                    {quiz.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{quiz.questions} questions</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{quiz.time} min</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{quiz.participants}</span>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
                    <span>Start Quiz</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                </div>
              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;