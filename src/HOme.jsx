import { useNavigate } from "react-router-dom";
import { Target, Award, Sparkles, BookOpen, ChevronRight } from "lucide-react";

// Home.jsx - Main landing page component
const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl">

        {/* Header */}
        <div className="flex items-center gap-3 p-6 pb-0">
        </div>

        {/* Hero Section */}
        <div className="p-6 pt-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-700 to-green-800 px-4 py-2 rounded-full mb-4 shadow-md">
              <Target className="w-4 h-4 text-white" />
              <span className="text-l font-bold text-white uppercase tracking-wide">Micro Learning Platform</span>
            </div>

            <h1 className="text-4xl font-bold leading-tight mb-4 text-gray-800">
              Welcome to
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-green-600">
                Thaqefni
              </span>
            </h1>

            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="h-0.5 w-12 bg-green-700 rounded-full"></div>
              <Award className="w-5 h-5 text-green-700" />
              <div className="h-0.5 w-12 bg-green-700 rounded-full"></div>
            </div>

            <p className="text-gray-600 text-xl">
              Learn Everywhere, Even on the Way<br />
              <span className="font-semibold text-green-700">to Your Destination</span>
            </p>
          </div>

          {/* Info Card */}
          <div className="mb-6 animate-slideUp">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-700 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-700 to-green-800 rounded-full flex items-center justify-center shadow-md">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xl text-green-800 font-bold uppercase tracking-wide">
                    No Internet?
                  </p>
                  <p className="text-xl text-green-800 font-bold uppercase tracking-wide">
                    No Problem.
                  </p>
                  <p className="text-sm font-bold text-gray-800">
                    Learn Offline Ready
                  </p>
                </div>
                <div className="text-3xl">
                  📱
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-green-200">
                <p className="text-lg text-gray-700 leading-relaxed">
                  <span className="font-bold text-green-800">Thaqefni</span> works fully offline.
                  Download content at the station, and it's ready whenever you are — no connection needed.
                  Your learning never stops, even underground.
                </p>
              </div>
            </div>
          </div>
          {/* Quote Section */}
          <div className="mb-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-green-700 mt-0.5 animate-pulse" />
                <p className="text-gray-700 text-ls italic leading-relaxed">
                  <span className="font-bold text-green-800">Thaqefni</span> adapts its library, quizzes, and challenges for every stage of your life.
                  <span className="block text-green-800 font-semibold mt-1">🎯 Start your learning journey today!</span>
                </p>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <div className="pb-2">
            <button
              onClick={() => navigate("/AgeSelection")}
              className="w-full py-3.5 rounded-xl font-bold text-lg transition-all duration-300 shadow-md
                flex items-center justify-center gap-2 bg-gradient-to-r from-green-700 to-green-800 
                text-white hover:from-green-800 hover:to-green-900 hover:shadow-xl transform hover:scale-102 active:scale-98"
            >
              <span>Get Started</span>
              <ChevronRight className="w-5 h-5" />
            </button>

            <p className="text-center text-xs text-gray-400 mt-3">
              👆 Click to begin your personalized learning experience
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add animations (if not already added by AgeSelection)
const styleSheet = document.createElement("style");
if (!document.head.querySelector('#home-styles')) {
  styleSheet.id = 'home-styles';
  styleSheet.textContent = `
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .animate-slideUp {
      animation: slideUp 0.4s ease-out;
    }
    
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }
    
    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    
    .hover\\:scale-102:hover {
      transform: scale(1.02);
    }
    
    .active\\:scale-98:active {
      transform: scale(0.98);
    }
  `;
  document.head.appendChild(styleSheet);
}

export default Home;