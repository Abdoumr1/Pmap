// Games.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Trophy, Star, ChevronRight,
  Search, Brain, Calculator, Puzzle, Languages, Globe, WifiOff
} from 'lucide-react';

import crosswordimg from "./images/crossword.png";
import memorygame from "./images/memorygame.png";

const Games = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", "Math", "Word", "Memory", "Strategy", "Quiz"];

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

  // ✅ IMPORTANT: add path instead of id logic
  const games = [
    {
      title: "Cross Word",
      path: "/crossword",
      description: "Find hidden words in the grid",
      category: "Word",
      image: crosswordimg,
      players: 1234,
      rating: 4.8,
      difficulty: "Beginner",
      offline: true,
      popular: true
    },
    {
      title: "Find the Difference",
      path: "/find-difference",
      description: "Spot differences between two images",
      category: "Memory",
      image: crosswordimg,
      players: 842,
      rating: 4.7,
      difficulty: "Beginner",
      offline: true,
      popular: true
    },
    {
      title: "Memory Game",
      path: "/games/memory",
      description: "Select matching cards",
      category: "Memory",
      image: memorygame,
      players: 842,
      rating: 4.7,
      difficulty: "Beginner",
      offline: true,
      popular: true
    }
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

      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold text-green-800 mb-3">
          🎮 Brain Training Games
        </h1>
        <p className="text-gray-600">
          Sharpen your mind with fun educational games
        </p>
      </div>

      {/* SEARCH + FILTER */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row gap-4">

        <div className="flex items-center bg-white border rounded-lg px-3 py-2 w-full md:w-1/2">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search games..."
            className="w-full outline-none px-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm border transition ${selectedCategory === cat
                ? "bg-green-700 text-white"
                : "bg-white hover:bg-gray-100"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* GAMES GRID */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {filteredGames.map((game, index) => (
          <Link
            to={game.path}
            key={index}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition overflow-hidden block"
          >

            {/* IMAGE */}
            <div className="relative h-48">
              <img
                src={game.image}
                alt={game.title}
                className="w-full h-full object-cover"
              />

              {game.popular && (
                <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 text-xs rounded">
                  <Trophy className="w-3 h-3 inline" /> Popular
                </div>
              )}

              {game.offline && (
                <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 text-xs rounded">
                  <WifiOff className="w-3 h-3 inline" /> Offline
                </div>
              )}
            </div>

            {/* CONTENT */}
            <div className="p-5">

              <div className="flex justify-between items-center mb-2">
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded flex items-center gap-1">
                  {getCategoryIcon(game.category)}
                  {game.category}
                </span>

                <span className="text-yellow-500 text-sm flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  {game.rating}
                </span>
              </div>

              <h3 className="font-bold text-lg">{game.title}</h3>
              <p className="text-gray-500 text-sm mb-3">{game.description}</p>

              <div className="flex justify-between text-sm text-gray-500 mb-4">
                <span>👥 {game.players}</span>
                <span className={`px-2 py-1 rounded ${getDifficultyColor(game.difficulty)}`}>
                  {game.difficulty}
                </span>
              </div>

              <div className="w-full bg-green-700 text-white py-2 rounded-lg flex justify-center items-center gap-2 hover:bg-green-800">
                Play Now <ChevronRight className="w-4 h-4" />
              </div>

            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Games;