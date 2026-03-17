import React from 'react';
import { Link } from "react-router-dom";
import { BookOpenCheck, Newspaper, HelpCircle, Gamepad2 } from 'lucide-react';
import Home from "./HOme";

const Card = () => {
  const features = [
    {
      id: 1,
      name: "Books",
      logo: <BookOpenCheck className="w-6 h-6 text-green-600" />,
      description: "Short books and summaries for quick learning",
      path: "/books",
      bgColor: "bg-green-800 hover:bg-green-900",
      iconBg: "bg-green-100",
      shadowColor: "shadow-green-500/20"
    },
    {
      id: 2,
      name: "Articles",
      logo: <Newspaper className="w-6 h-6 text-blue-600" />,
      description: "Educational articles with deep insights",
      path: "/articles",
      bgColor: "bg-blue-600 hover:bg-blue-800",
      iconBg: "bg-blue-100",
      shadowColor: "shadow-blue-500/20"
    },
    {
      id: 3,
      name: "Quiz",
      logo: <HelpCircle className="w-6 h-6 text-red-600" />,
      description: "Interactive quizzes to test your knowledge",
      path: "/quiz",
      bgColor: "bg-red-500 hover:bg-red-700",
      iconBg: "bg-red-100",
      shadowColor: "shadow-red-500/20"
    },
    {
      id: 4,
      name: "Games",
      logo: <Gamepad2 className="w-6 h-6 text-gray-600" />,
      description: "Fun learning games while you commute",
      path: "/games",
      bgColor: "bg-black hover:bg-gray-900",
      iconBg: "bg-gray-100",
      shadowColor: "shadow-gray-500/20"
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Feature Cards with Name, Logo, and Description */}
      <div className="w-full max-w-2xl">
        <Home/>
        
        <div className="mb-6 space-y-4">
          {features.map((feature) => (
            <Link
              key={feature.id}
              to={feature.path}
              className="block w-full"
            >
              <div className={`
                ${feature.bgColor} 
                text-white 
                rounded-xl 
                p-4 
                transition-all 
                duration-300 
                transform 
                hover:scale-102 
                hover:-translate-y-1
                shadow-lg
                hover:shadow-2xl
                ${feature.shadowColor}
                hover:shadow-xl
                relative
                overflow-hidden
                group
              `}>
                {/* Inner shadow overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                
                <div className="flex items-center space-x-4 relative z-10">
                  {/* Logo Circle with enhanced shadow */}
                  <div className={`
                    ${feature.iconBg} 
                    w-12 
                    h-12 
                    rounded-full 
                    flex 
                    items-center 
                    justify-center 
                    shadow-inner
                    border-2
                    border-white/30
                    group-hover:shadow-xl
                    group-hover:scale-110
                    transition-all
                    duration-300
                  `}>
                    {feature.logo}
                  </div>

                  {/* Name and Description */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold drop-shadow-md">{feature.name}</h3>
                    <p className="text-sm text-white/80 drop-shadow">{feature.description}</p>
                  </div>

                  {/* Arrow Icon with shadow */}
                  <div className="transform group-hover:translate-x-1 transition-transform duration-300">
                    <svg
                      className="w-5 h-5 text-white/80 drop-shadow-lg"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Card;