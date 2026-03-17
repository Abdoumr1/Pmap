// Games.jsx - Main games listing page
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock, Trophy, Star, Users, Download,
  ChevronRight, Filter, Search, Wifi, WifiOff,
  Brain, Calculator, Puzzle, Languages, Globe
} from 'lucide-react';
import crosswordimg from "./images/crossword.png"
const Games = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    "All", "Math", "Word", "Memory", "Strategy", "Quiz"
  ];

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Math": return <Calculator className="w-4 h-4" />;
      case "Word": return <Languages className="w-4 h-4" />;
      case "Memory": return <Brain className="w-4 h-4" />;
      case "Strategy": return <Puzzle className="w-4 h-4" />;
      case "Quiz": return <Globe className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };


  const games = [
    {
      id: 1,
      title: "Cross word",
      description: "find word",
      category: "Word",
      image: crosswordimg,
      players: 1234,
      rating: 4.8,
      difficulty: "Adjustable",
      offline: true,
      popular: true
    },

  ];

  const getDifficultyColor = (difficulty) => {
    if (difficulty.includes("Beginner")) return "bg-green-100 text-green-700";
    if (difficulty.includes("Intermediate")) return "bg-yellow-100 text-yellow-700";
    if (difficulty.includes("Advanced")) return "bg-red-100 text-red-700";
    return "bg-blue-100 text-blue-700";
  };

  const filteredGames = games.filter(game =>
    (selectedCategory === "All" || game.category === selectedCategory) &&
    game.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          <div className="text-center mb-10 sm:mb-14">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-800 mb-4">
              🎮 Brain Training Games
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Sharpen your mind with fun, educational games - play anywhere, even offline                    </p>
          </div>

        </div>
      </div>

      {/* Categories Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => (
            <div
              key={game.id}
              onClick={() => navigate(`/game/${game.id}`)}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 hover:border-purple-300"
            >
              {/* Game Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Popular Badge */}
                {game.popular && (
                  <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Trophy className="w-3 h-3" />
                    Popular
                  </div>
                )}
                {/* Offline Badge */}
                {game.offline && (
                  <div className="absolute top-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <WifiOff className="w-3 h-3" />
                    Offline
                  </div>
                )}
              </div>

              {/* Game Content */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-purple-700 bg-purple-50 px-2 py-1 rounded-full flex items-center gap-1">
                    {getCategoryIcon(game.category)}
                    {game.category}
                  </span>
                  <div className="flex items-center gap-1 text-sm text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-medium">{game.rating}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-700 transition-colors">
                  {game.title}
                </h3>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {game.description}
                </p>

                {/* Game Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{game.players}</span>
                  </div>
                  <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(game.difficulty)}`}>
                    {game.difficulty}
                  </div>
                </div>

                {/* Play Button */}
                <button className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-xl text-sm font-semibold hover:from-purple-700 hover:to-purple-600 transition-all duration-300 transform group-hover:scale-[1.02] shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                  <span>Play Now</span>
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

export default Games;