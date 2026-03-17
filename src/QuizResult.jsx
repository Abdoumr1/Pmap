// QuizBadge.jsx - Achievement badges for quiz completion
const QuizResult = ({ score, total, quizTitle }) => {
  const percentage = (score / total) * 100;
  
  const getBadge = () => {
    if (percentage >= 90) {
      return {
        title: "Gold Master",
        icon: "🏆",
        color: "from-yellow-400 to-yellow-600",
        text: "Excellent! You're a master!"
      };
    } else if (percentage >= 70) {
      return {
        title: "Silver Scholar",
        icon: "🥈",
        color: "from-gray-300 to-gray-500",
        text: "Great job! Keep learning!"
      };
    } else if (percentage >= 50) {
      return {
        title: "Bronze Learner",
        icon: "🥉",
        color: "from-orange-400 to-orange-600",
        text: "Good effort! Practice makes perfect!"
      };
    } else {
      return {
        title: "Keep Trying",
        icon: "📚",
        color: "from-green-400 to-green-600",
        text: "Every expert was once a beginner!"
      };
    }
  };

  const badge = getBadge();

  return (
    <div className={`bg-gradient-to-r ${badge.color} rounded-2xl p-6 text-white text-center`}>
      <div className="text-6xl mb-3">{badge.icon}</div>
      <h3 className="text-2xl font-bold mb-1">{badge.title}</h3>
      <p className="text-white/90 mb-3">{badge.text}</p>
      <div className="bg-white/20 rounded-full px-4 py-2 inline-block">
        Score: {score}/{total} ({Math.round(percentage)}%)
      </div>
    </div>
  );
};

export default QuizResult;