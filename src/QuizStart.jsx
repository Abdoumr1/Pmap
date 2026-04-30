// QuizStart.jsx - Fixed parsing for questions with spaces
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Clock, ChevronLeft, Send, CheckCircle, XCircle } from 'lucide-react';

const QuizStart = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [timeRemaining, setTimeRemaining] = useState(null);

    // Parse questions from the questions_answers string
    const parseQuestionsFromString = (questionsAnswersString) => {
        if (!questionsAnswersString) return [];

        console.log("Raw questions string:", questionsAnswersString);

        // Split by new lines first
        let lines = questionsAnswersString.split('\n').filter(line => line.trim());

        // If no new lines, try splitting by numbers (1-, 2-, etc.)
        if (lines.length === 0 || lines.length === 1) {
            // Split by pattern: number followed by dash and then content until next number or end
            const regex = /\d+-[^0-9]+?\([^)]+\)/g;
            const matches = questionsAnswersString.match(regex);
            if (matches) {
                lines = matches;
            } else {
                // Manual split by "2-", "3-", etc.
                const result = [];
                let current = "";
                for (let i = 0; i < questionsAnswersString.length; i++) {
                    current += questionsAnswersString[i];
                    // Check if we're at a new question number (2-, 3-, etc.)
                    if (i < questionsAnswersString.length - 1 &&
                        /\d-/.test(questionsAnswersString[i] + questionsAnswersString[i + 1]) &&
                        questionsAnswersString[i] !== '1') {
                        result.push(current.slice(0, -1));
                        current = questionsAnswersString[i] + questionsAnswersString[i + 1];
                        i++; // Skip the next character
                    }
                }
                if (current) result.push(current);
                lines = result;
            }
        }

        console.log("Split lines:", lines);

        const questions = [];

        lines.forEach((line, index) => {
            // More flexible regex that handles spaces in question text
            // Matches: number-anything until ( then options )
            const regex = /^(\d+)-(.+?)\((.+?)\)$/;
            const match = line.match(regex);

            if (match) {
                const questionNumber = match[1];
                const questionText = match[2].trim();
                const optionsStr = match[3];
                const options = [];
                let correctAnswer = null;

                // Split options by '/'
                const optionParts = optionsStr.split('/');

                optionParts.forEach((option) => {
                    // Clean up option (remove leading/trailing spaces)
                    const cleanOption = option.trim();
                    // Check if option contains [c] for correct answer
                    if (cleanOption.includes('[c]')) {
                        const finalOption = cleanOption.replace('[c]', '').trim();
                        options.push(finalOption);
                        correctAnswer = finalOption;
                    } else {
                        options.push(cleanOption);
                    }
                });

                questions.push({
                    id: index + 1,
                    number: questionNumber,
                    text: questionText,
                    options: options,
                    correctAnswer: correctAnswer,
                });

                console.log(`Parsed question ${questionNumber}:`, {
                    text: questionText,
                    options: options,
                    correct: correctAnswer
                });
            } else {
                console.warn("Could not parse question part:", line);

                // Fallback: try to parse without regex for this specific format
                // Find the last '(' and ')'
                const lastOpenParen = line.lastIndexOf('(');
                const lastCloseParen = line.lastIndexOf(')');

                if (lastOpenParen !== -1 && lastCloseParen !== -1) {
                    const questionPart = line.substring(0, lastOpenParen);
                    const optionsPart = line.substring(lastOpenParen + 1, lastCloseParen);

                    // Extract question number and text
                    const dashIndex = questionPart.indexOf('-');
                    if (dashIndex !== -1) {
                        const questionNumber = questionPart.substring(0, dashIndex);
                        const questionText = questionPart.substring(dashIndex + 1).trim();
                        const optionParts = optionsPart.split('/');
                        const options = [];
                        let correctAnswer = null;

                        optionParts.forEach((option) => {
                            const cleanOption = option.trim();
                            if (cleanOption.includes('[c]')) {
                                const finalOption = cleanOption.replace('[c]', '').trim();
                                options.push(finalOption);
                                correctAnswer = finalOption;
                            } else {
                                options.push(cleanOption);
                            }
                        });

                        questions.push({
                            id: index + 1,
                            number: questionNumber,
                            text: questionText,
                            options: options,
                            correctAnswer: correctAnswer,
                        });

                        console.log(`Fallback - Parsed question ${questionNumber}:`, {
                            text: questionText,
                            options: options,
                            correct: correctAnswer
                        });
                    }
                }
            }
        });

        console.log(`Total parsed ${questions.length} questions`);
        return questions;
    };

    useEffect(() => {
        // Fetch ALL quizzes first
        axios.get('http://127.0.0.1:8000/api/quizzes/')
            .then((res) => {
                // Get the array of quizzes from response
                const quizzesData = res.data.results || res.data;

                // FILTER the quiz by ID from the URL parameter
                const selectedQuiz = quizzesData.find(quiz => quiz.id === parseInt(id));

                if (selectedQuiz) {
                    console.log("Selected quiz found:", selectedQuiz);
                    console.log("Questions_answers string:", selectedQuiz.questions_answers);

                    // Parse questions from questions_answers field
                    let parsedQuestions = [];

                    if (selectedQuiz.questions_answers) {
                        parsedQuestions = parseQuestionsFromString(selectedQuiz.questions_answers);
                        console.log(`Successfully parsed ${parsedQuestions.length} questions`);
                    } else {
                        console.log("No questions_answers field found");
                    }

                    setQuiz({
                        ...selectedQuiz,
                        parsedQuestions: parsedQuestions,
                        time: selectedQuiz.time || 10
                    });
                    setTimeRemaining((selectedQuiz.time || 10) * 60);
                } else {
                    console.error("Quiz with ID", id, "not found in the list");
                    navigate('/quizzes');
                }

                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching quizzes:", err);
                setLoading(false);
            });
    }, [id, navigate]);

    // Timer effect
    useEffect(() => {
        if (timeRemaining > 0 && !showResults && quiz && quiz.parsedQuestions?.length > 0) {
            const timer = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        handleSubmitQuiz();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [timeRemaining, showResults, quiz]);

    const handleAnswerSelect = (questionId, answer) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    const handleNextQuestion = () => {
        if (quiz && currentQuestionIndex < quiz.parsedQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleSubmitQuiz = () => {
        if (!quiz || !quiz.parsedQuestions) return;

        let correctCount = 0;
        quiz.parsedQuestions.forEach(q => {
            const userAnswer = answers[q.id];
            const isCorrect = userAnswer === q.correctAnswer;
            if (isCorrect) correctCount++;
        });

        setScore(correctCount);
        setShowResults(true);

        // Submit attempt to API
        const attemptData = {
            user_id: localStorage.getItem('userId') || 'anonymous',
            quiz_id: quiz.id,
            score: correctCount,
            total_questions: quiz.parsedQuestions.length,
            answers: Object.entries(answers).map(([questionId, answer]) => ({
                question_id: parseInt(questionId),
                answer: answer
            }))
        };

        axios.post(`http://127.0.0.1:8000/api/quizs/${id}/submit_attempt/`, attemptData)
            .then((res) => {
                console.log("Quiz submitted:", res.data);
            })
            .catch((err) => {
                console.error("Error submitting quiz:", err);
            });
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading quiz...</p>
                </div>
            </div>
        );
    }

    if (!quiz) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600">Quiz not found</p>
                    <button
                        onClick={() => navigate('/quizzes')}
                        className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg"
                    >
                        Back to Quizzes
                    </button>
                </div>
            </div>
        );
    }

    if (!quiz.parsedQuestions || quiz.parsedQuestions.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-6">
                    <p className="text-red-600 font-semibold">No questions found for this quiz</p>
                    <p className="text-sm text-gray-500 mt-2 break-all">
                        Raw data: {quiz.questions_answers}
                    </p>
                    <button
                        onClick={() => navigate('/quizzes')}
                        className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg"
                    >
                        Back to Quizzes
                    </button>
                </div>
            </div>
        );
    }

    if (showResults) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                                <CheckCircle className="w-10 h-10 text-green-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Completed!</h2>
                            <p className="text-lg text-gray-600">
                                Your Score: {score} / {quiz.parsedQuestions.length}
                            </p>
                            <div className="mt-2 text-2xl font-bold text-green-600">
                                {Math.round((score / quiz.parsedQuestions.length) * 100)}%
                            </div>
                        </div>

                        <div className="space-y-6 mb-8">
                            <h3 className="text-xl font-semibold text-gray-900">Detailed Results:</h3>
                            {quiz.parsedQuestions.map((q, idx) => {
                                const userAnswer = answers[q.id];
                                const isCorrect = userAnswer === q.correctAnswer;
                                return (
                                    <div key={q.id} className={`p-4 rounded-lg border ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0 mt-1">
                                                {isCorrect ? (
                                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                                ) : (
                                                    <XCircle className="w-5 h-5 text-red-600" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900 mb-2">
                                                    {idx + 1}. {q.text}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Your answer: <span className={isCorrect ? 'text-green-600 font-medium' : 'text-red-600'}>{userAnswer || "Not answered"}</span>
                                                </p>
                                                {!isCorrect && (
                                                    <p className="text-sm text-green-600 mt-1">
                                                        Correct answer: {q.correctAnswer}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => navigate('/quizzes')}
                                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition"
                            >
                                Back to Quizzes
                            </button>
                            <button
                                onClick={() => {
                                    setShowResults(false);
                                    setCurrentQuestionIndex(0);
                                    setAnswers({});
                                    setScore(0);
                                }}
                                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const currentQuestion = quiz.parsedQuestions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === quiz.parsedQuestions.length - 1;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <button
                            onClick={() => navigate('/quizzes')}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            Back
                        </button>
                        <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="w-5 h-5" />
                            <span className="font-mono text-lg">{formatTime(timeRemaining)}</span>
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Question {currentQuestionIndex + 1} of {quiz.parsedQuestions.length}</span>
                            <span>{Math.round(((currentQuestionIndex + 1) / quiz.parsedQuestions.length) * 100)}% Complete</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${((currentQuestionIndex + 1) / quiz.parsedQuestions.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900">
                        {quiz.title}
                    </h2>
                </div>

                {/* Question Card */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">
                        {currentQuestionIndex + 1}. {currentQuestion.text}
                    </h3>

                    <div className="space-y-3">
                        {currentQuestion.options && currentQuestion.options.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleAnswerSelect(currentQuestion.id, option)}
                                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200
                  ${answers[currentQuestion.id] === option
                                        ? 'border-green-500 bg-green-50 text-green-900'
                                        : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                    ${answers[currentQuestion.id] === option
                                            ? 'border-green-500 bg-green-500'
                                            : 'border-gray-400'
                                        }`}
                                    >
                                        {answers[currentQuestion.id] === option && (
                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                        )}
                                    </div>
                                    <span className="text-gray-800">{String.fromCharCode(65 + idx)}. {option}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-4">
                    <button
                        onClick={handlePrevQuestion}
                        disabled={currentQuestionIndex === 0}
                        className={`flex-1 px-6 py-3 rounded-xl font-semibold transition
              ${currentQuestionIndex === 0
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        Previous
                    </button>

                    {!isLastQuestion ? (
                        <button
                            onClick={handleNextQuestion}
                            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
                        >
                            Next Question
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmitQuiz}
                            disabled={Object.keys(answers).length !== quiz.parsedQuestions.length}
                            className={`flex-1 px-6 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2
                ${Object.keys(answers).length === quiz.parsedQuestions.length
                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            <Send className="w-5 h-5" />
                            Submit Quiz
                        </button>
                    )}
                </div>

                {/* Progress Indicator */}
                <div className="mt-6 flex justify-center gap-2">
                    {quiz.parsedQuestions.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentQuestionIndex(idx)}
                            className={`w-3 h-3 rounded-full transition-all
                ${currentQuestionIndex === idx
                                    ? 'bg-green-600 w-6'
                                    : answers[quiz.parsedQuestions[idx].id]
                                        ? 'bg-green-300'
                                        : 'bg-gray-300'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default QuizStart;