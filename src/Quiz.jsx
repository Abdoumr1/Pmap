// Quiz.jsx - Main quiz listing page
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Clock, Trophy, Star, Users, BookOpen, 
  ChevronRight, Filter, Search, Award 
} from 'lucide-react';
import articleImage1 from "./images/article1.webp"; 
import logopfe from "./images/logopfe.png"; 
import dz from "./images/dzflag.gif"; 
import { MdArticle } from "react-icons/md";



const Quiz = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    "All",
    "Education",
    "Technology",
    "History",
    "Culture",
    "Science",
    "Languages"
  ];

  const quizzes = [
    {
      id: 1,
      title: "Micro-Learning Fundamentals",
      description: "Test your knowledge about micro-learning techniques and benefits",
      category: "Education",
      image: articleImage1, 
      questions: 15,
      time: "10 min",
      difficulty: "Beginner",
      participants: 1234,
      rating: 4.8,
      completed: false,
      popular: true
    },
    {
      id: 2,
      title: "Algerian History Quiz",
      description: "Explore key events and figures in Algerian history",
      category: "History",
      image: dz, 
      questions: 20,
      time: "10 min",
      difficulty: "Intermediate",
      participants: 892,
      rating: 4.6,
      completed: false,
      popular: true
    },
    
  ]
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
      {/* Header Section */}
            <div className="text-center mb-10 sm:mb-14">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-800 mb-4">
                          <span><MdArticle /></span> <span>Knoweldge Quiz</span>
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                        Test your knowledge, track your progress, and earn badges
                    </p>
                </div>

      {/* Categories Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Browse Quizzes
          </h2>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? "bg-green-700 text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-green-50 border border-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Quiz Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              onClick={() => navigate(`/quiz/${quiz.id}`)}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 hover:border-green-300"
            >
              {/* Quiz Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={quiz.image} // FIXED: Use quiz.image from the data
                  alt={quiz.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = logopfe; // Fallback to logo if image fails to load
                  }}
                />
                {/* Popular Badge */}
                {quiz.popular && (
                  <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Trophy className="w-3 h-3" />
                    Popular
                  </div>
                )}
                {/* Difficulty Badge */}
                <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(quiz.difficulty)}`}>
                  {quiz.difficulty}
                </div>
              </div>

              {/* Quiz Content */}
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

                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-700 transition-colors">
                  {quiz.title}
                </h3>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {quiz.description}
                </p>

                {/* Quiz Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{quiz.questions} questions</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{quiz.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{quiz.participants}</span>
                  </div>
                </div>

                {/* Start Button */}
                <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-xl text-sm font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform group-hover:scale-[1.02] shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                  <span>Start Quiz</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quiz;