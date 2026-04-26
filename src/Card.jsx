import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BookOpenCheck, Newspaper, HelpCircle, Gamepad2, AlertCircle } from 'lucide-react';
import { motion } from "framer-motion";
import { IoMdArrowRoundBack } from "react-icons/io";

const Card = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [ageCategory, setAgeCategory] = useState(null);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    let selectedAge = null;

    if (location.state?.ageCategory) {
      selectedAge = location.state.ageCategory;
      setAgeCategory(selectedAge);
      localStorage.setItem('userAgeCategory', selectedAge);
    } else {
      const savedAgeCategory = localStorage.getItem('userAgeCategory');
      if (savedAgeCategory) setAgeCategory(savedAgeCategory);
    }

    if (!selectedAge && !localStorage.getItem('userAgeCategory')) {
      setShowWarning(true);
      setTimeout(() => {
        navigate('/age-selection', { state: { returnTo: '/card' } });
      }, 2000);
    }
  }, [location, navigate]);

  const features = [
    {
      id: 1,
      name: "Books",
      logo: <BookOpenCheck className="w-8 h-8 text-white" />,
      path: "/books",
      color: "from-green-600 to-green-700"
    },
    {
      id: 2,
      name: "Articles",
      logo: <Newspaper className="w-8 h-8 text-white" />,
      path: "/articles",
      color: "from-blue-500 to-blue-700"
    },
    {
      id: 3,
      name: "Quiz",
      logo: <HelpCircle className="w-8 h-8 text-white" />,
      path: "/quiz",
      color: "from-red-500 to-red-700"
    },
    {
      id: 4,
      name: "Games",
      logo: <Gamepad2 className="w-8 h-8 text-white" />,
      path: "/games",
      color: "from-gray-700 to-black"
    }
  ];

  const getPersonalizedDescription = (featureName, ageCategory) => {
    const descriptions = {
      Kids: {
        Books: "Fun and simple stories ",
        Articles: "Colorful easy learning ",
        Quiz: "Play and learn ",
        Games: "Fun educational games"
      },
      Teens: {
        Books: "Interesting novels",
        Articles: "Explore new ideas",
        Quiz: "Challenge yourself",
        Games: "Smart games"
      },
      Adults: {
        Books: "Deep knowledge",
        Articles: "Professional insights",
        Quiz: "Advanced challenges",
        Games: "Brain training"
      }
    };

    return descriptions[ageCategory]?.[featureName] || featureName;
  };

  if (!ageCategory && showWarning) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="bg-gray-100 p-6 rounded-xl shadow flex items-center gap-3"
        >
          <AlertCircle className="text-yellow-500" />
          <p>Redirecting...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">

      {/* Center Container */}
      <div className="w-full max-w-2xl">

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center text-green-800 mb-4"
        >
          Choose your activity
        </motion.h1>

        {/* Age */}

        <div className="flex justify-center mb-6">
          <span className="bg-green-100 text-green-700 px-5 py-2 rounded-full text-lg font-semibold">
            {ageCategory}
          </span>
        </div>


        {/* Cards */}
        <div className="flex flex-col gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={feature.path} state={{ ageCategory }}>
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className={`
                    bg-gradient-to-r ${feature.color}
                    text-white
                    rounded-2xl
                    p-5
                    shadow-md
                    hover:shadow-xl
                    transition
                  `}
                >
                  <div className="flex items-center gap-4">

                    <div className="bg-white/20 p-3 rounded-xl">
                      {feature.logo}
                    </div>

                    <div>
                      <h3 className="text-xl font-bold">
                        {feature.name}
                      </h3>
                      <p className="text-sm text-white/80">
                        {getPersonalizedDescription(feature.name, ageCategory)}
                      </p>
                    </div>

                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => navigate("/AgeSelection")}
            className="
              w-full max-w-sm
              py-3
              rounded-xl
              font-bold
              flex items-center justify-center gap-2
              bg-gradient-to-r from-green-700 to-green-800
              text-white
              hover:shadow-xl
              hover:scale-105
              transition
            "
          >
            <IoMdArrowRoundBack />
            Change Age Group
          </button>
        </div>

      </div>
    </div>
  );
};

export default Card;