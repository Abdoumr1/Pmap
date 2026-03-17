import Card from "./Card";
import Navbar from "./Navbar";

// Home.jsx - Main landing page component
const Home = () => {
  const features = [
    {
      icon: "🎓",
      title: "Learn in Bites",
      description: "Short articles, videos, and quizzes for micro-learning"
    },
    {
      icon: "📝",
      title: "Stay Productive",
      description: "Tasks, notes, and goals at your fingertips"
    },
    {
      icon: "📰",
      title: "Read & Explore",
      description: "Daily news and Algerian culture"
    },
    {
      icon: "🧩",
      title: "Play & Challenge",
      description: "Fun games to sharpen your mind"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-green-900 mb-4">
          Welcome to P-MAP Home
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Micro Learning Platform • Metro
        </p>
        
        <div className=" rounded-2xl shadow-lg p-8 mb-12 text-left">
          <h2 className="text-xl font-bold text-green-900 mb-4">
            Learn Everywhere, Even on the Way to Your Destination
          </h2>
          {/* <p className="text-gray-600 leading-relaxed mb-6">
            P-MAP (Micro-learning and Productivity Portal) transforms your daily commute 
            into a powerful opportunity for growth. Whether you're waiting for the metro, 
            traveling between stations, or simply taking a short break, P-MAP turns every 
            spare moment into a chance to learn, achieve, and stay inspired.
          </p> */}
          
          <div className="bg-blue-50 border-l-4 border-green-900 p-4 rounded">
            <p className="text-gray-600 font-semibold mb-2">🌟 No Internet? No Problem.</p>
            <p className="text-gray-600">
              P-MAP works fully offline. Download content at the station, and it's ready 
              whenever you are — no connection needed. Your learning never stops, even underground.
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl">
        <h2 className="text-3xl font-bold text-center text-green-900 mb-10">
          ✨ What Awaits You:
        </h2>
        
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 text-center border border-gray-100"
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
};

export default Home;