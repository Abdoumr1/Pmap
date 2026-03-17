// Simple Math Game Component
import { useState, useEffect } from 'react';

const MathGame = () => {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [question, setQuestion] = useState({ num1: 0, num2: 0, answer: 0 });
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    generateQuestion();
    // Load saved progress from localStorage
    const savedScore = localStorage.getItem('mathGame_score');
    const savedLevel = localStorage.getItem('mathGame_level');
    if (savedScore) setScore(parseInt(savedScore));
    if (savedLevel) setLevel(parseInt(savedLevel));
  }, []);

  const generateQuestion = () => {
    const num1 = Math.floor(Math.random() * (10 * level)) + 1;
    const num2 = Math.floor(Math.random() * (10 * level)) + 1;
    setQuestion({
      num1,
      num2,
      answer: num1 + num2
    });
  };

  const checkAnswer = () => {
    if (parseInt(userAnswer) === question.answer) {
      const newScore = score + 10;
      setScore(newScore);
      setFeedback('✅ Correct!');
      localStorage.setItem('mathGame_score', newScore);
      
      if (newScore % 50 === 0) {
        setLevel(level + 1);
        localStorage.setItem('mathGame_level', level + 1);
      }
      
      generateQuestion();
      setUserAnswer('');
    } else {
      setFeedback('❌ Try again!');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-center mb-6">Math Trainer</h2>
      
      <div className="flex justify-between mb-4">
        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
          Level {level}
        </span>
        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
          Score: {score}
        </span>
      </div>

      <div className="text-center mb-8">
        <span className="text-6xl font-bold text-gray-800">
          {question.num1} + {question.num2} = ?
        </span>
      </div>

      <input
        type="number"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        className="w-full p-4 border-2 border-gray-200 rounded-xl text-center text-2xl mb-4 focus:border-purple-500 focus:outline-none"
        placeholder="Enter answer"
        onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
      />

      <button
        onClick={checkAnswer}
        className="w-full bg-purple-600 text-white py-4 rounded-xl text-lg font-semibold hover:bg-purple-700 transition-colors"
      >
        Check Answer
      </button>

      {feedback && (
        <p className="text-center mt-4 text-lg">{feedback}</p>
      )}
    </div>
  );
};