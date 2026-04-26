// Games.jsx - Main games listing page
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trophy, Star, Users,
  ChevronRight, Filter, Search,
  Brain, Calculator, Puzzle, Languages, Globe,
  WifiOff
} from 'lucide-react';

import crosswordimg from "./images/crossword.png";

const Games = () => {
  const navigate = useNavigate();
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

  const games = [
    {
      id: 1,
      title: "Cross Word",
      description: "Find hidden words in the grid",
      category: "Word",
      image: crosswordimg,
      players: 1234,
      rating: 4.8,
      difficulty: "Beginner",
      offline: true,
      popular: true
    },

    // 👉 ADD FIND DIFFERENCE GAME HERE
    {
      id: 2,
      title: "Find the Difference",
      description: "Spot differences between two images",
      category: "Memory",
      image: crosswordimg,
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

  const handleGameClick = (game) => {
    if (game.id === 2) {
      navigate("/find-difference");
    } else {
      navigate(`/game/${game.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <div className="bg-gradient-to-r">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">

          <h1 className="text-4xl font-bold text-green-800 mb-3">
            🎮 Brain Training Games
          </h1>

          <p className="text-gray-600">
            Sharpen your mind with fun educational games
          </p>

        </div>
      </div>

      {/* SEARCH + FILTER */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row gap-4">

        {/* SEARCH */}
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

        {/* CATEGORY FILTER */}
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

        {filteredGames.map((game) => (
          <div
            key={game.id}
            onClick={() => handleGameClick(game)}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl cursor-pointer transition overflow-hidden"
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

              <button className="w-full bg-green-700 text-white py-2 rounded-lg flex justify-center items-center gap-2 hover:bg-green-800">
                Play Now <ChevronRight className="w-4 h-4" />
              </button>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Games;