import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, ChevronRight, Users, BookOpen, Sparkles, Rocket, Brain, Heart, CheckCircle, Award, Target } from "lucide-react";

const ageGroups = [
    {
        id: 1,
        title: "Kids",
        age: "8–15 years",
        iconName: "Rocket", // Store icon name instead of component
        description: "Exciting adventures and fun learning",
        ageRange: { min: 8, max: 15 },
        emoji: "🧒",
    },
    {
        id: 2,
        title: "Teens",
        age: "15–25 years",
        iconName: "Brain", // Store icon name instead of component
        description: "Engaging content for young adults",
        ageRange: { min: 15, max: 25 },
        emoji: "👨‍🎓",
    },
    {
        id: 3,
        title: "Adults",
        age: "25+ years",
        iconName: "Heart", // Store icon name instead of component
        description: "Personal development and deep knowledge",
        ageRange: { min: 25, max: 100 },
        emoji: "👨‍💼",
    },
];

// Map icon names to components
const iconMap = {
    Rocket: Rocket,
    Brain: Brain,
    Heart: Heart
};

export default function AgeSelection() {
    const [selected, setSelected] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const handleContinue = () => {
        if (selected) {
            const selectedGroup = ageGroups.find(g => g.id === selected);

            // Create serializable data object (no functions, components, or symbols)
            const serializableData = {
                id: selectedGroup.id,
                title: selectedGroup.title,
                age: selectedGroup.age,
                iconName: selectedGroup.iconName,
                description: selectedGroup.description,
                ageRange: {
                    min: selectedGroup.ageRange.min,
                    max: selectedGroup.ageRange.max
                },
                emoji: selectedGroup.emoji,
                selectedAt: new Date().toISOString()
            };

            // Save to localStorage (only serializable data)
            localStorage.setItem('userAgeGroup', JSON.stringify(serializableData));
            localStorage.setItem('userAgeCategory', selectedGroup.title);

            // Check where to return to
            const returnTo = location.state?.returnTo || '/card';

            // Navigate with only serializable data
            navigate(returnTo, {
                state: {
                    ageCategory: selectedGroup.title,
                    ageGroupData: serializableData // Pass serializable data only
                }
            });
        }
    };

    const selectedGroup = selected ? ageGroups.find(g => g.id === selected) : null;
    const SelectedIcon = selectedGroup ? iconMap[selectedGroup.iconName] : Users;

    return (
        <div className="min-h-screen flex justify-center items-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl">

                {/* Header */}
                <div className="flex items-center gap-3 p-6 pb-0">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 bg-green-700 hover:bg-gray-800 rounded-full transition-colors duration-200"
                    >
                        <ArrowLeft className="w-7 h-7 text-white" />
                    </button>
                </div>

                {/* Title Section */}
                <div className="p-6 pt-4">
                    <div className="text-center mb-8">


                        <h1 className="text-4xl font-bold leading-tight mb-4 text-gray-800">
                            Choose your
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-green-600">
                                Age Group
                            </span>
                        </h1>

                        <div className="flex items-center justify-center gap-2 mb-3">
                            <div className="h-0.5 w-12 bg-green-700 rounded-full"></div>
                            <Award className="w-5 h-5 text-green-700" />
                            <div className="h-0.5 w-12 bg-green-700 rounded-full"></div>
                        </div>

                        <p className="text-gray-600 text-xl">
                            Select the age group that matches you to<br />
                            <span className="font-semibold text-green-700">personalize your learning experience</span>
                        </p>
                    </div>
                </div>

                {/* Age Selection Cards */}
                <div className="px-6 space-y-3">
                    {ageGroups.map((item) => {
                        const isActive = selected === item.id;
                        const IconComponent = iconMap[item.iconName];

                        return (
                            <div
                                key={item.id}
                                onClick={() => setSelected(item.id)}
                                className={`
                                    group relative flex items-center justify-between p-4 rounded-xl cursor-pointer 
                                    transition-all duration-300 transform hover:scale-102
                                    ${isActive
                                        ? "bg-gradient-to-r from-green-700 to-green-800 text-white shadow-xl ring-2 ring-green-600 ring-offset-2"
                                        : "bg-gray-50 text-gray-800 hover:bg-gray-100 border-2 border-gray-100 hover:border-green-300"
                                    }
                                `}
                            >
                                <div className="flex items-center gap-4 flex-1">
                                    <div className={`
                                        relative w-12 h-12 rounded-xl
                                        ${isActive ? "bg-white/20" : "bg-white"}
                                        flex items-center justify-center transition-all duration-300
                                    `}>
                                        <IconComponent
                                            className={`w-6 h-6 ${isActive ? "text-white" : "text-green-700"}`}
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-2xl">
                                                {item.title}
                                            </h3>
                                            <span className="text-sm">
                                                {item.emoji}
                                            </span>
                                        </div>
                                        <p className={`text-xl font-semibold ${isActive ? "text-green-100" : "text-green-700"}`}>
                                            {item.age}
                                        </p>
                                        {isActive && (
                                            <p className="text-xs text-green-100 mt-1 animate-fadeIn">
                                                {item.description}
                                            </p>
                                        )}
                                    </div>

                                    {isActive ? (
                                        <CheckCircle className="w-6 h-6 text-white" />
                                    ) : (
                                        <ChevronRight className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Selected Age Section */}
                {selected && selectedGroup && (
                    <div className="m-6 animate-slideUp">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-700 shadow-lg">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-700 to-green-800 rounded-full flex items-center justify-center shadow-md">
                                    <CheckCircle className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xl text-underline text-green-800 font-bold uppercase tracking-wide">
                                        Selected Age Group
                                    </p>
                                    <p className="text-xl font-bold text-gray-800">
                                        {selectedGroup.title} • {selectedGroup.age}
                                    </p>
                                </div>
                                <div className="text-3xl">
                                    {selectedGroup.emoji}
                                </div>
                            </div>

                            {/* <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-green-200">
                                <div>
                                    <p className="text-xs text-gray-600 mb-1">📊 Minimum Age</p>
                                    <p className="text-lg font-bold text-green-800">{selectedGroup.ageRange.min} years</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 mb-1">📈 Maximum Age</p>
                                    <p className="text-lg font-bold text-green-800">
                                        {selectedGroup.ageRange.max === 100 ? "100+" : `${selectedGroup.ageRange.max} years`}
                                    </p>
                                </div>
                            </div> */}
                        </div>
                    </div>
                )}

                {/* Quote Section */}
                <div className="px-6 mb-4">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                        <div className="flex items-start gap-2">
                            <Sparkles className="w-4 h-4 text-green-700 mt-0.5 animate-pulse" />
                            <p className="text-gray-700 text-ls italic leading-relaxed">
                                <span className="font-bold text-green-800">Thaqefni</span> adapts its library, quizzes, and challenges for every stage of your life.
                                <span className="block text-green-800 font-semibold mt-1">🎯 Personalized learning guaranteed!</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Continue Button */}
                <div className="px-6 pb-8">
                    <button
                        onClick={handleContinue}
                        disabled={!selected}
                        className={`
                            w-full py-3.5 rounded-xl font-bold text-lg transition-all duration-300 shadow-md
                            flex items-center justify-center gap-2
                            ${selected
                                ? "bg-gradient-to-r from-green-700 to-green-800 text-white hover:from-green-800 hover:to-green-900 hover:shadow-xl transform hover:scale-102 active:scale-98"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }
                        `}
                    >
                        {selected ? (
                            <>
                                <span>✓ Continue with {selectedGroup?.title}</span>
                                <ChevronRight className="w-5 h-5" />
                            </>
                        ) : (
                            "Please select an age group"
                        )}
                    </button>

                    {!selected && (
                        <p className="text-center text-xs text-gray-400 mt-3">
                            👆 Click on an age group above to continue
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

// Add animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-5px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
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
    
    .animate-fadeIn {
        animation: fadeIn 0.3s ease-out;
    }
    
    .animate-slideUp {
        animation: slideUp 0.4s ease-out;
    }
    
    .hover\\:scale-102:hover {
        transform: scale(1.02);
    }
    
    .active\\:scale-98:active {
        transform: scale(0.98);
    }
`;
document.head.appendChild(styleSheet);