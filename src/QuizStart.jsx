// QuizTaking.jsx - Interactive quiz taking page
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Clock, CheckCircle, XCircle, ArrowLeft,
    Award, ChevronLeft, ChevronRight, Flag,
    HelpCircle, Trophy
} from 'lucide-react'; // Added Trophy import

const QuizStart = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);
    const [flaggedQuestions, setFlaggedQuestions] = useState([]);
    
    // FIXED: Get the correct quiz data based on quizId
    const quizDataArray = [
        {
            id: 1,
            title: "Micro-Learning Fundamentals",
            description: "Test your knowledge about micro-learning techniques",
            timeLimit: 600, // 10 minutes
            questions: [
                {
                    id: 1,
                    question: "What is micro-learning?",
                    options: [
                        "Learning in large chunks of 2-3 hours",
                        "Bite-sized learning modules of 5-10 minutes",
                        "Learning only through videos",
                        "Traditional classroom learning"
                    ],
                    correct: 1,
                    explanation: "Micro-learning involves short, focused learning sessions typically lasting 5-10 minutes."
                },
                {
                    id: 2,
                    question: "What is the ideal duration for a micro-learning session?",
                    options: [
                        "30-45 minutes",
                        "5-10 minutes",
                        "1-2 hours",
                        "All day"
                    ],
                    correct: 1,
                    explanation: "Research shows that 5-10 minute sessions are optimal for retention and engagement."
                },
                {
                    id: 3,
                    question: "Which of the following is a benefit of micro-learning?",
                    options: [
                        "Better information retention",
                        "Flexible learning schedule",
                        "Focused on one concept at a time",
                        "All of the above"
                    ],
                    correct: 3,
                    explanation: "Micro-learning offers all these benefits: better retention, flexibility, and focused learning."
                },
                {
                    id: 4,
                    question: "Micro-learning is most effective for:",
                    options: [
                        "Complex technical skills",
                        "Quick knowledge updates",
                        "Full university courses",
                        "Physical training"
                    ],
                    correct: 1,
                    explanation: "Micro-learning excels at delivering quick, focused knowledge updates and reinforcements."
                },
                {
                    id: 5,
                    question: "True or False: Micro-learning works offline",
                    options: [
                        "True",
                        "False"
                    ],
                    correct: 0,
                    explanation: "True! P-MAP allows downloading content for offline learning during commutes."
                }
            ]
        },
        {
            id: 2,
            title: "Algerian History",
            description: "Test your knowledge about Algeria history",
            timeLimit: 600,
            questions: [
                {
                    id: 1,
                    question: "When did Algeria gain independence from France?",
                    options: ["1954", "1962", "1970", "1945"],
                    correct: 1,
                    explanation: "Algeria gained independence on July 5, 1962."
                },
                {
                    id: 2,
                    question: "Which organization led the Algerian War of Independence?",
                    options: [
                        "FLN (National Liberation Front)",
                        "NATO",
                        "Arab League",
                        "United Nations"
                    ],
                    correct: 0,
                    explanation: "The FLN led the struggle for Algerian independence."
                },
                {
                    id: 3,
                    question: "The Algerian War of Independence started in which year?",
                    options: ["1954", "1962", "1940", "1975"],
                    correct: 0,
                    explanation: "The war began on November 1, 1954."
                },
                {
                    id: 4,
                    question: "Who was the first president of independent Algeria?",
                    options: [
                        "Houari Boumediene",
                        "Ahmed Ben Bella",
                        "Chadli Bendjedid",
                        "Abdelaziz Bouteflika"
                    ],
                    correct: 1,
                    explanation: "Ahmed Ben Bella became president in 1963."
                },
                {
                    id: 5,
                    question: "Which civilization built cities like Timgad and Djemila?",
                    options: [
                        "Roman Empire",
                        "Ottoman Empire",
                        "French Empire",
                        "Persian Empire"
                    ],
                    correct: 0,
                    explanation: "The Romans built Timgad and Djemila in Algeria."
                }
            ]
        }
    ];

    // FIXED: Find the correct quiz based on quizId
    const quizData = quizDataArray.find(quiz => quiz.id === parseInt(quizId)) || quizDataArray[0];

    // Timer effect
    useEffect(() => {
        if (timeLeft > 0 && !quizCompleted) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && !quizCompleted) {
            handleSubmitQuiz();
        }
    }, [timeLeft, quizCompleted]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswerSelect = (questionIndex, answerIndex) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [questionIndex]: answerIndex
        });
    };

    const toggleFlagQuestion = (questionIndex) => {
        if (flaggedQuestions.includes(questionIndex)) {
            setFlaggedQuestions(flaggedQuestions.filter(q => q !== questionIndex));
        } else {
            setFlaggedQuestions([...flaggedQuestions, questionIndex]);
        }
    };

    const handleNext = () => {
        if (currentQuestion < quizData.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleSubmitQuiz = () => {
        // Calculate score
        let correctAnswers = 0;
        quizData.questions.forEach((question, index) => {
            if (selectedAnswers[index] === question.correct) {
                correctAnswers++;
            }
        });
        setScore(correctAnswers);
        setQuizCompleted(true);
        setShowResults(true);
    };

    const progress = ((currentQuestion + 1) / quizData.questions.length) * 100;

    // Results Page
    if (showResults) {
        const percentage = (score / quizData.questions.length) * 100;
        const passed = percentage >= 70;

        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
                    {/* Trophy Icon */}
                    <div className="text-center mb-6">
                        <div className="inline-block p-4 bg-yellow-100 rounded-full mb-4">
                            {passed ? (
                                <Trophy className="w-16 h-16 text-yellow-600" />
                            ) : (
                                <Award className="w-16 h-16 text-gray-600" />
                            )}
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            {passed ? "Congratulations!" : "Good Try!"}
                        </h2>
                        <p className="text-gray-600">
                            {passed
                                ? "You've successfully completed the quiz"
                                : "Keep practicing, you'll do better next time"}
                        </p>
                    </div>

                    {/* Score Card */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-6">
                        <div className="text-center">
                            <span className="text-5xl font-bold text-green-700">{Math.round(percentage)}%</span>
                            <p className="text-gray-600 mt-2">
                                You got {score} out of {quizData.questions.length} questions correct
                            </p>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-4">
                            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${passed ? 'bg-green-600' : 'bg-yellow-500'}`}
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Question Review */}
                    <div className="mb-6">
                        <h3 className="font-bold text-lg mb-4">Question Review</h3>
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                            {quizData.questions.map((question, index) => {
                                const isCorrect = selectedAnswers[index] === question.correct;
                                return (
                                    <div
                                        key={index}
                                        className={`p-3 rounded-lg border ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                                            }`}
                                    >
                                        <div className="flex items-start gap-2">
                                            {isCorrect ? (
                                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            ) : (
                                                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                            )}
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    Question {index + 1}: {question.question}
                                                </p>
                                                <p className="text-xs text-gray-600 mt-1">
                                                    {question.explanation}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/quiz')}
                            className="flex-1 px-6 py-3 border-2 border-green-600 text-green-700 rounded-xl font-semibold hover:bg-green-50 transition-colors"
                        >
                            Back to Quizzes
                        </button>
                        <button
                            onClick={() => {
                                setCurrentQuestion(0);
                                setSelectedAnswers({});
                                setQuizCompleted(false);
                                setShowResults(false);
                                setTimeLeft(quizData.timeLimit);
                            }}
                            className="flex-1 px-6 py-3 bg-green-700 text-white rounded-xl font-semibold hover:bg-green-800 transition-colors"
                        >
                            Retry Quiz
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Quiz Taking Interface
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-gray-600 hover:text-green-700 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="hidden sm:inline">Back</span>
                        </button>

                        <div className="text-center">
                            <h1 className="font-semibold text-gray-900">{quizData.title}</h1>
                            <p className="text-sm text-gray-500">Question {currentQuestion + 1} of {quizData.questions.length}</p>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Timer */}
                            <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full ${timeLeft < 60 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                                }`}>
                                <Clock className="w-4 h-4" />
                                <span className="font-mono font-medium">{formatTime(timeLeft)}</span>
                            </div>

                            {/* Flag Button */}
                            <button
                                onClick={() => toggleFlagQuestion(currentQuestion)}
                                className={`p-2 rounded-full transition-colors ${flaggedQuestions.includes(currentQuestion)
                                    ? 'text-yellow-500 bg-yellow-50'
                                    : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
                                    }`}
                            >
                                <Flag className="w-5 h-5" fill={flaggedQuestions.includes(currentQuestion) ? "currentColor" : "none"} />
                            </button>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-green-600 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Question Content */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    {/* Question Number */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <HelpCircle className="w-4 h-4" />
                        <span>Question {currentQuestion + 1}</span>
                    </div>

                    {/* Question Text */}
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-8">
                        {quizData.questions[currentQuestion].question}
                    </h2>

                    {/* Options */}
                    <div className="space-y-3 mb-8">
                        {quizData.questions[currentQuestion].options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswerSelect(currentQuestion, index)}
                                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selectedAnswers[currentQuestion] === index
                                    ? 'border-green-600 bg-green-50 shadow-md'
                                    : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${selectedAnswers[currentQuestion] === index
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {String.fromCharCode(65 + index)}
                                    </span>
                                    <span className="text-gray-800">{option}</span>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between">
                        <button
                            onClick={handlePrevious}
                            disabled={currentQuestion === 0}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${currentQuestion === 0
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                        </button>

                        {currentQuestion === quizData.questions.length - 1 ? (
                            <button
                                onClick={handleSubmitQuiz}
                                className="px-6 py-3 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800 transition-all shadow-md hover:shadow-lg"
                            >
                                Submit Quiz
                            </button>
                        ) : (
                            <button
                                onClick={handleNext}
                                className="flex items-center gap-2 px-6 py-3 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800 transition-all shadow-md hover:shadow-lg"
                            >
                                Next
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Flagged Questions Summary */}
                    {flaggedQuestions.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <p className="text-sm text-gray-600 flex items-center gap-2">
                                <Flag className="w-4 h-4 text-yellow-500" fill="currentColor" />
                                <span>Flagged questions: </span>
                                {flaggedQuestions.map((q, i) => (
                                    <button
                                        key={q}
                                        onClick={() => setCurrentQuestion(q)}
                                        className="inline-flex items-center justify-center w-6 h-6 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium hover:bg-yellow-200 transition-colors"
                                    >
                                        {q + 1}
                                    </button>
                                ))}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizStart;