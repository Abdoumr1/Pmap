// CrosswordGame.jsx - Complete crossword game with level selection and persistent score
import React, { useState, useEffect } from 'react';

const CrosswordGame = () => {
  // Game data
  const crosswordData = [
    {
      id: 1,
      title: "Animals & Objects",
      description: "Test your knowledge of animal names and common objects",
      data: [
        {
          answer: "TIGER",
          hint: "The powerful predator roams the jungle",
          startx: 4,
          starty: 1,
          orientation: "down",
          position: 1,
        },
        {
          answer: "EAGLE",
          hint: "A majestic bird known for its keen eyesight",
          startx: 4,
          starty: 4,
          orientation: "across",
          position: 2,
        },
        {
          answer: "ITALIC",
          hint: "It's a style of typeface characterized by slanted letters",
          startx: 7,
          starty: 1,
          orientation: "down",
          position: 3,
        },
        {
          answer: "INFINITE",
          hint: "It describes something boundless or limitless in extent or quantity",
          startx: 1,
          starty: 2,
          orientation: "across",
          position: 4,
        },
      ]
    },
    {
      id: 2,
      title: "Action Words",
      description: "Learn verbs and action words",
      data: [
        {
          answer: "QUIVER",
          hint: "To shake or tremble slightly, often with rapid movements",
          startx: 1,
          starty: 4,
          orientation: "across",
          position: 1,
        },
        {
          answer: "TWIRL",
          hint: "To spin or rotate quickly",
          startx: 3,
          starty: 2,
          orientation: "down",
          position: 2,
        },
        {
          answer: "GAZE",
          hint: "To look steadily and intently at something, often implying concentration or contemplation",
          startx: 5,
          starty: 1,
          orientation: "down",
          position: 3,
        },
        {
          answer: "FLUTE",
          hint: "A musical instrument with a high-pitched sound",
          startx: 2,
          starty: 6,
          orientation: "across",
          position: 4,
        },
      ]
    },
    {
      id: 3,
      title: "Geography Terms",
      description: "Explore geographical features and terms",
      data: [
        {
          answer: "RIVER",
          hint: "A natural flowing watercourse",
          startx: 2,
          starty: 1,
          orientation: "across",
          position: 1,
        },
        {
          answer: "MOUNTAIN",
          hint: "A large natural elevation of the earth's surface",
          startx: 1,
          starty: 3,
          orientation: "down",
          position: 2,
        },
        {
          answer: "OCEAN",
          hint: "A vast body of salt water",
          startx: 5,
          starty: 2,
          orientation: "across",
          position: 3,
        },
        {
          answer: "DESERT",
          hint: "A barren area with little precipitation",
          startx: 3,
          starty: 5,
          orientation: "down",
          position: 4,
        },
      ]
    }
  ];

  const [selectedLevel, setSelectedLevel] = useState(null);
  const [grid, setGrid] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [completedWords, setCompletedWords] = useState([]);
  const [wordMessages, setWordMessages] = useState({});
  const [scores, setScores] = useState({});
  const [showLevelMenu, setShowLevelMenu] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);

  // Load scores from localStorage on component mount
  useEffect(() => {
    const savedScores = localStorage.getItem('crosswordScores');
    if (savedScores) {
      setScores(JSON.parse(savedScores));
    }
  }, []);

  // Save scores to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(scores).length > 0) {
      localStorage.setItem('crosswordScores', JSON.stringify(scores));
    }
  }, [scores]);

  // Generate initial grid when level is selected
  useEffect(() => {
    if (selectedLevel !== null) {
      generateInitialGrid();
      setCompletedWords([]);
      setWordMessages({});
      setShowSuccess(false);
      setGameStarted(true);
      setShowLevelMenu(false);
    }
  }, [selectedLevel]);

  const generateInitialGrid = () => {
    const currentLevelData = crosswordData[selectedLevel].data;
    const initialGrid = Array(7).fill(0).map(() => Array(8).fill('X'));
    
    currentLevelData.forEach(({ answer, startx, starty, orientation }) => {
      let x = startx - 1;
      let y = starty - 1;

      for (let i = 0; i < answer.length; i++) {
        if (orientation === 'across') {
          initialGrid[y][x + i] = '';
        } else if (orientation === 'down') {
          initialGrid[y + i][x] = '';
        }
      }
    });
    setGrid(initialGrid);
  };

  const generateAnswerGrid = () => {
    const currentLevelData = crosswordData[selectedLevel].data;
    const answerGrid = Array(7).fill(0).map(() => Array(8).fill('X'));
    
    currentLevelData.forEach(({ answer, startx, starty, orientation }) => {
      let x = startx - 1;
      let y = starty - 1;

      for (let i = 0; i < answer.length; i++) {
        if (orientation === 'across') {
          answerGrid[y][x + i] = answer[i];
        } else if (orientation === 'down') {
          answerGrid[y + i][x] = answer[i];
        }
      }
    });
    return answerGrid;
  };

  // Check if a specific word is correct
  const checkWordCorrect = (wordEntry) => {
    const { answer, startx, starty, orientation, position } = wordEntry;
    let x = startx - 1;
    let y = starty - 1;

    for (let i = 0; i < answer.length; i++) {
      let row, col;
      if (orientation === 'across') {
        row = y;
        col = x + i;
      } else {
        row = y + i;
        col = x;
      }
      
      if (grid[row][col] !== answer[i]) {
        return false;
      }
    }
    return true;
  };

  // Check all words for completion
  const checkAllWords = () => {
    if (selectedLevel === null) return;
    
    const currentLevelData = crosswordData[selectedLevel].data;
    const newCompletedWords = [];
    const newMessages = { ...wordMessages };
    
    currentLevelData.forEach((wordEntry) => {
      const isCorrect = checkWordCorrect(wordEntry);
      
      if (isCorrect && !completedWords.includes(wordEntry.position)) {
        newCompletedWords.push(wordEntry.position);
        newMessages[wordEntry.position] = {
          show: true,
          word: wordEntry.answer
        };
        
        // Update score for this level
        setScores(prev => ({
          ...prev,
          [selectedLevel]: (prev[selectedLevel] || 0) + 10
        }));
        
        // Hide message after 3 seconds
        setTimeout(() => {
          setWordMessages(prev => ({
            ...prev,
            [wordEntry.position]: { ...prev[wordEntry.position], show: false }
          }));
        }, 3000);
      }
    });
    
    if (newCompletedWords.length > 0) {
      setCompletedWords([...completedWords, ...newCompletedWords]);
      setWordMessages(newMessages);
    }
    
    // Check if all words are completed
    if (completedWords.length + newCompletedWords.length === currentLevelData.length) {
      setShowSuccess(true);
      
      // Bonus points for completing the level
      setScores(prev => ({
        ...prev,
        [selectedLevel]: (prev[selectedLevel] || 0) + 50
      }));
    }
  };

  const handleInputChange = (row, col, text) => {
    const newGrid = [...grid];
    newGrid[row][col] = text.toUpperCase();
    setGrid(newGrid);
    
    // Check word completion after a short delay
    setTimeout(() => {
      checkAllWords();
    }, 100);
  };

  const handleLevelSelect = (index) => {
    setSelectedLevel(index);
  };

  const handleBackToMenu = () => {
    setShowLevelMenu(true);
    setGameStarted(false);
    setSelectedLevel(null);
  };

  const handleReset = () => {
    generateInitialGrid();
    setCompletedWords([]);
    setWordMessages({});
    setShowSuccess(false);
    
    // Reset score for this level (optional - remove if you want to keep score)
    // setScores(prev => ({
    //   ...prev,
    //   [selectedLevel]: 0
    // }));
  };

  const handleSolve = () => {
    const answerGrid = generateAnswerGrid();
    setGrid(answerGrid);
    setCompletedWords(crosswordData[selectedLevel].data.map(w => w.position));
    
    // Calculate maximum score for this level
    const maxScore = crosswordData[selectedLevel].data.length * 10 + 50;
    setScores(prev => ({
      ...prev,
      [selectedLevel]: maxScore
    }));
    
    setShowSuccess(false);
    
    // Show success messages for all words
    const newMessages = {};
    crosswordData[selectedLevel].data.forEach(word => {
      newMessages[word.position] = {
        show: true,
        word: word.answer
      };
    });
    setWordMessages(newMessages);
    
    // Hide messages after 3 seconds
    setTimeout(() => {
      setWordMessages({});
    }, 3000);
  };

  // Check if a cell is part of a completed word
  const isCellInCompletedWord = (row, col) => {
    if (selectedLevel === null) return false;
    
    return crosswordData[selectedLevel].data.some(wordEntry => {
      if (!completedWords.includes(wordEntry.position)) return false;
      
      const { startx, starty, orientation, answer } = wordEntry;
      let x = startx - 1;
      let y = starty - 1;
      
      for (let i = 0; i < answer.length; i++) {
        let cellRow, cellCol;
        if (orientation === 'across') {
          cellRow = y;
          cellCol = x + i;
        } else {
          cellRow = y + i;
          cellCol = x;
        }
        
        if (cellRow === row && cellCol === col) {
          return true;
        }
      }
      return false;
    });
  };

  const renderGrid = () => (
    <div className="inline-block bg-white p-4 rounded-xl shadow-lg">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((cell, colIndex) => {
            // Find if this cell has a position number
            const positionEntry = selectedLevel !== null ? crosswordData[selectedLevel].data.find(
              (entry) => entry.starty - 1 === rowIndex && entry.startx - 1 === colIndex
            ) : null;

            const isCompletedCell = isCellInCompletedWord(rowIndex, colIndex);

            return (
              <div key={`${rowIndex}-${colIndex}`} className="relative">
                {positionEntry && (
                  <span className="absolute top-0 left-0 text-[10px] font-bold text-green-700 z-10">
                    {positionEntry.position}
                  </span>
                )}
                <input
                  type="text"
                  className={`
                    w-10 h-10 sm:w-12 sm:h-12 border-2 text-center text-lg font-bold uppercase
                    focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200
                    transition-all duration-200
                    ${grid[rowIndex][colIndex] === 'X' 
                      ? 'bg-gray-800 border-gray-600 text-transparent' 
                      : isCompletedCell
                        ? 'bg-green-100 border-green-600 text-green-800'
                        : 'bg-white border-gray-300 hover:border-green-400'
                    }
                  `}
                  value={cell === 'X' ? '' : cell}
                  disabled={grid[rowIndex][colIndex] === 'X'}
                  onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                  maxLength={1}
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );

  const renderQuestions = () => {
    if (selectedLevel === null) return null;
    
    const questions = { across: [], down: [] };
    const currentLevelData = crosswordData[selectedLevel].data;

    currentLevelData.forEach(({ hint, orientation, position, answer }) => {
      const isCompleted = completedWords.includes(position);
      
      questions[orientation].push(
        <div 
          key={`question-${position}`} 
          className={`
            mb-2 p-3 rounded-lg transition-all duration-300
            ${isCompleted 
              ? 'bg-green-100 border-l-4 border-green-600' 
              : 'bg-gray-50 hover:bg-green-50 border-l-4 border-transparent'
            }
          `}
        >
          <div className="flex items-start justify-between">
            <p className={`text-sm ${isCompleted ? 'text-green-800 font-medium' : 'text-gray-700'}`}>
              <span className="font-bold text-green-700 mr-2">{position}.</span>
              {hint}
            </p>
            {isCompleted && (
              <span className="text-green-600 text-xs font-medium bg-white px-2 py-1 rounded-full">
                ✓ Completed
              </span>
            )}
          </div>
          {wordMessages[position]?.show && (
            <div className="mt-2 text-xs text-green-600 font-medium animate-pulse">
              ✨ Correct! You found: {wordMessages[position].word}
            </div>
          )}
        </div>
      );
    });

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="w-1 h-6 bg-green-600"></span>
            {crosswordData[selectedLevel].title}
          </h2>
          <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
            Score: {scores[selectedLevel] || 0}
          </div>
        </div>
        
        {/* Across Questions */}
        <div className="mb-6">
          <h3 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
            <span>Across</span>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
              {questions.across.length}
            </span>
          </h3>
          <div className="space-y-1">
            {questions.across}
          </div>
        </div>

        {/* Down Questions */}
        <div>
          <h3 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
            <span>Down</span>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
              {questions.down.length}
            </span>
          </h3>
          <div className="space-y-1">
            {questions.down}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{completedWords.length}/{currentLevelData.length} words</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${(completedWords.length / currentLevelData.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  };

  const renderLevelMenu = () => (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-green-800 mb-4">
            🧩 Crossword Puzzles
          </h1>
          <p className="text-lg text-gray-600">
            Select a level to start playing. Your scores will be saved!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {crosswordData.map((level, index) => (
            <div
              key={level.id}
              onClick={() => handleLevelSelect(index)}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-200 hover:border-green-400 group"
            >
              <div className="h-32 bg-gradient-to-r from-green-700 to-green-600 flex items-center justify-center">
                <span className="text-5xl">🧩</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">
                  {level.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {level.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {level.data.length} words
                  </span>
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    Score: {scores[index] || 0}
                  </div>
                </div>
                {scores[index] >= level.data.length * 10 && (
                  <div className="mt-3 text-xs text-green-600 font-medium flex items-center gap-1">
                    <span>✓</span> Completed
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Your progress is automatically saved. Come back anytime!
          </p>
        </div>
      </div>
    </div>
  );

  const renderGame = () => (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-green-800 mb-2 border-l-4 border-green-600 pl-4">
              🧩 {crosswordData[selectedLevel].title}
            </h1>
            <p className="text-gray-600 ml-6">
              {crosswordData[selectedLevel].description}
            </p>
          </div>
          <button
            onClick={handleBackToMenu}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
          >
            <span>←</span> Back to Menu
          </button>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Side - Questions */}
          <div className="lg:col-span-1">
            {renderQuestions()}
          </div>

          {/* Right Side - Grid and Controls */}
          <div className="lg:col-span-2">
            {/* Grid */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6 overflow-x-auto">
              <div className="flex justify-center">
                {renderGrid()}
              </div>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <button
                  onClick={handleReset}
                  className="px-4 py-3 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 transition-colors flex items-center justify-center gap-2"
                >
                  <span>↺</span>
                  Reset
                </button>
                <button
                  onClick={handleSolve}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <span>✨</span>
                  Solve
                </button>
                <button
                  onClick={handleBackToMenu}
                  className="px-4 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                >
                  <span>📋</span>
                  Levels
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
              <span className="text-5xl">🏆</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Congratulations!
            </h2>
            <p className="text-gray-600 mb-4">
              You've completed {crosswordData[selectedLevel].title}!
            </p>
            <div className="bg-green-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">Final Score:</p>
              <p className="text-4xl font-bold text-green-700">{scores[selectedLevel] || 0}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleBackToMenu}
                className="flex-1 px-6 py-3 bg-green-700 text-white rounded-xl font-semibold hover:bg-green-800 transition-colors"
              >
                More Levels
              </button>
              <button
                onClick={() => setShowSuccess(false)}
                className="flex-1 px-6 py-3 border-2 border-green-700 text-green-700 rounded-xl font-semibold hover:bg-green-50 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return showLevelMenu ? renderLevelMenu() : renderGame();
};

export default CrosswordGame;