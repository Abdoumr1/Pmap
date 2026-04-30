import { useEffect, useState, useCallback } from "react";
import { Trophy, RotateCcw, Star, Zap, Clock, Skull, Timer, Target } from "lucide-react";

const THEMES = {
    fruits: ["🍎", "🍌", "🍇", "🍉", "🍒", "🥝", "🍍", "🥑", "🍊", "🍓", "🥭", "🍐"],
    animals: ["🐶", "🦊", "🐸", "🐼", "🦁", "🐨", "🐯", "🐻", "🐧", "🦄", "🐙", "🦋"],
    space: ["🚀", "🌙", "⭐", "🪐", "☄️", "🌍", "🛸", "🔭", "🌌", "🌠", "☀️", "🛰️"],
};

const LEVELS = {
    easy: { pairs: 6, cols: 3, timeLimit: 90, penaltyMoves: 0, label: "🍃 Easy" },
    medium: { pairs: 8, cols: 4, timeLimit: 60, penaltyMoves: 2, label: "⚡ Medium" },
    hard: { pairs: 12, cols: 4, timeLimit: 45, penaltyMoves: 4, label: "💀 Hard" },
    expert: { pairs: 16, cols: 4, timeLimit: 30, penaltyMoves: 6, label: "🔥 Expert" },
};

function buildCards(theme, pairs) {
    const pool = THEMES[theme].slice(0, pairs);
    return [...pool, ...pool]
        .map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }))
        .sort(() => Math.random() - 0.5);
}

export default function MemoryGame() {
    const [theme, setTheme] = useState("fruits");
    const [level, setLevel] = useState("medium");
    const [cards, setCards] = useState([]);
    const [firstCard, setFirstCard] = useState(null);
    const [secondCard, setSecondCard] = useState(null);
    const [lock, setLock] = useState(false);
    const [moves, setMoves] = useState(0);
    const [matches, setMatches] = useState(0);
    const [win, setWin] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [secs, setSecs] = useState(0);
    const [running, setRunning] = useState(false);
    const [bestScores, setBestScores] = useState({});
    const [hint, setHint] = useState(null);
    const [hintUsed, setHintUsed] = useState(false);
    const [shakeTarget, setShakeTarget] = useState(null);

    const { pairs, cols, timeLimit, penaltyMoves, label } = LEVELS[level];

    // Timer logic
    useEffect(() => {
        if (!running || win || gameOver) return;
        const id = setInterval(() => {
            setSecs(s => {
                if (s + 1 >= timeLimit) {
                    setGameOver(true);
                    setRunning(false);
                    return timeLimit;
                }
                return s + 1;
            });
        }, 1000);
        return () => clearInterval(id);
    }, [running, win, gameOver, timeLimit]);

    const fmt = (s) => {
        const mins = Math.floor(s / 60);
        const secsRem = s % 60;
        return `${mins}:${String(secsRem).padStart(2, "0")}`;
    };

    // Restart game
    const restart = useCallback(() => {
        setCards(buildCards(theme, LEVELS[level].pairs));
        setFirstCard(null); setSecondCard(null);
        setLock(false); setMoves(0); setMatches(0);
        setWin(false); setGameOver(false); setSecs(0);
        setRunning(false); setHint(null); setHintUsed(false);
    }, [theme, level]);

    useEffect(() => { restart(); }, [theme, level, restart]);

    // Hint system
    const useHint = () => {
        if (hintUsed || win || gameOver) return;

        const unmatchedCards = cards.filter(c => !c.matched && !c.flipped);
        if (unmatchedCards.length < 2) return;

        // Find a pair that hasn't been matched yet
        const emojiCounts = {};
        unmatchedCards.forEach(card => {
            emojiCounts[card.emoji] = (emojiCounts[card.emoji] || 0) + 1;
        });

        const availablePairs = Object.keys(emojiCounts).filter(emoji => emojiCounts[emoji] >= 2);
        if (availablePairs.length === 0) return;

        const randomPair = availablePairs[Math.floor(Math.random() * availablePairs.length)];
        const [firstHint, secondHint] = unmatchedCards.filter(c => c.emoji === randomPair);

        setHint({ first: firstHint.id, second: secondHint.id });
        setHintUsed(true);

        // Flash hint
        setTimeout(() => setHint(null), 2000);
    };

    // Click handler with penality for wrong matches
    const handleClick = (card) => {
        if (lock || card.flipped || card.matched || win || gameOver) return;
        if (!running) setRunning(true);

        setCards(prev => prev.map(c => c.id === card.id ? { ...c, flipped: true } : c));

        if (!firstCard) {
            setFirstCard(card);
        } else if (firstCard.id === card.id) {
            // Clicked same card, flip it back
            setCards(prev => prev.map(c => c.id === card.id ? { ...c, flipped: false } : c));
            setFirstCard(null);
        } else {
            setSecondCard(card);
            setLock(true);
            setMoves(m => m + 1);
        }
    };

    // Check match with penalty for incorrect matches
    useEffect(() => {
        if (!firstCard || !secondCard) return;

        const isMatch = firstCard.emoji === secondCard.emoji;

        if (isMatch) {
            // Correct match
            setCards(prev => prev.map(c =>
                c.emoji === firstCard.emoji && !c.matched ? { ...c, matched: true } : c
            ));
            setMatches(m => {
                const next = m + 1;
                if (next === pairs) {
                    setWin(true);
                    setRunning(false);
                    // Save best score for this level and theme
                    const key = `${level}_${theme}`;
                    const currentScore = moves + 1;
                    setBestScores(prev => ({
                        ...prev,
                        [key]: prev[key] ? Math.min(prev[key], currentScore) : currentScore
                    }));
                }
                return next;
            });
            resetTurn();
        } else {
            // Wrong match - apply penalty
            if (penaltyMoves > 0) {
                setMoves(m => m + penaltyMoves);
                setShakeTarget("wrong");
                setTimeout(() => setShakeTarget(null), 500);
            }

            setTimeout(() => {
                setCards(prev => prev.map(c =>
                    c.id === firstCard.id || c.id === secondCard.id
                        ? { ...c, flipped: false } : c
                ));
                resetTurn();
            }, 1000);
        }
    }, [secondCard]);

    const resetTurn = () => {
        setFirstCard(null); setSecondCard(null); setLock(false);
    };

    // Calculate stars based on moves and time
    const getStars = () => {
        const timeBonus = Math.max(0, 1 - (secs / timeLimit));
        const moveEfficiency = Math.max(0, 1 - (moves / (pairs * 3)));
        const totalScore = (moveEfficiency * 0.6 + timeBonus * 0.4);

        if (totalScore > 0.7) return 3;
        if (totalScore > 0.4) return 2;
        return 1;
    };

    const stars = win ? getStars() : 0;
    const progress = (matches / pairs) * 100;

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800&display=swap');

                .memory-wrap { font-family: 'Nunito', sans-serif; }

                .card-scene {
                    perspective: 600px;
                    cursor: pointer;
                }
                .card-inner {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    transform-style: preserve-3d;
                    transition: transform 0.45s cubic-bezier(.4,0,.2,1);
                }
                .card-inner.is-flipped {
                    transform: rotateY(180deg);
                }
                .card-front, .card-back {
                    position: absolute;
                    inset: 0;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    backface-visibility: hidden;
                }
                .card-front {
                    background: linear-gradient(135deg, #166534, #15803d);
                    box-shadow: 0 4px 14px rgba(0,0,0,.18);
                    font-size: 1.5rem;
                    color: rgba(255,255,255,.35);
                    font-family: 'Fredoka One', cursive;
                    user-select: none;
                }
                .card-front::after {
                    content: '?';
                    font-size: 1.8rem;
                }
                .card-back {
                    background: #fff;
                    transform: rotateY(180deg);
                    box-shadow: 0 4px 14px rgba(0,0,0,.12);
                    font-size: 2.2rem;
                }
                .card-back.matched-card {
                    background: linear-gradient(135deg, #dcfce7, #bbf7d0);
                    box-shadow: 0 0 0 3px #16a34a, 0 4px 14px rgba(0,0,0,.1);
                    animation: matchPop .35s ease;
                }
                .hint-highlight {
                    animation: hintPulse 0.5s ease 3;
                    box-shadow: 0 0 0 3px #fbbf24, 0 0 0 6px rgba(251,191,36,0.3);
                }
                .shake {
                    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
                }
                @keyframes matchPop {
                    0% { transform: rotateY(180deg) scale(1); }
                    50% { transform: rotateY(180deg) scale(1.15); }
                    100% { transform: rotateY(180deg) scale(1); }
                }
                @keyframes winBounce {
                    0%,100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
                @keyframes hintPulse {
                    0%,100% { box-shadow: 0 0 0 3px #fbbf24; }
                    50% { box-shadow: 0 0 0 8px rgba(251,191,36,0.5); }
                }
                @keyframes shake {
                    10%,90% { transform: translate3d(-1px, 0, 0); }
                    20%,80% { transform: translate3d(2px, 0, 0); }
                    30%,50%,70% { transform: translate3d(-3px, 0, 0); }
                    40%,60% { transform: translate3d(3px, 0, 0); }
                }
                .win-emoji { animation: winBounce .7s ease infinite; }
                .timer-critical {
                    animation: pulse 1s infinite;
                }
                @keyframes pulse {
                    0%,100% { opacity: 1; }
                    50% { opacity: 0.6; }
                }
            `}</style>

            <div className="memory-wrap min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex flex-col items-center py-8 px-4">

                {/* Title */}
                <div className="text-center mb-6">
                    <h1 style={{ fontFamily: "'Fredoka One',cursive" }}
                        className="text-4xl text-green-800 mb-1">
                        Extreme Memory Game 🧠
                    </h1>
                    <p className="text-gray-500 text-sm">Wrong matches cost extra moves! Beat the clock!</p>
                </div>

                {/* Controls */}
                <div className="flex flex-wrap gap-3 justify-center mb-6">
                    {/* Theme */}
                    <div className="flex bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        {Object.keys(THEMES).map(t => (
                            <button key={t} onClick={() => setTheme(t)}
                                className={`px-4 py-2 text-sm font-700 capitalize transition-all ${theme === t ? "bg-green-700 text-white" : "text-gray-600 hover:bg-green-50"
                                    }`}>
                                {t === "fruits" ? "🍎" : t === "animals" ? "🦊" : "🚀"} {t}
                            </button>
                        ))}
                    </div>

                    {/* Level */}
                    <div className="flex bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        {Object.entries(LEVELS).map(([k, v]) => (
                            <button key={k} onClick={() => setLevel(k)}
                                className={`px-4 py-2 text-sm transition-all ${level === k ? "bg-green-700 text-white" : "text-gray-600 hover:bg-green-50"
                                    }`}>
                                {v.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stats bar */}
                <div className="flex gap-4 mb-6 flex-wrap justify-center">
                    <Chip icon={<Zap className="w-4 h-4 text-yellow-500" />} label="Moves" val={moves} />
                    <Chip icon={<Clock className="w-4 h-4 text-blue-500" />}
                        label="Time"
                        val={`${fmt(secs)} / ${fmt(timeLimit)}`}
                        className={secs > timeLimit * 0.8 && !win && !gameOver ? "timer-critical" : ""} />
                    <Chip icon={<Target className="w-4 h-4 text-green-500" />} label="Pairs" val={`${matches}/${pairs}`} />
                    {penaltyMoves > 0 && <Chip icon={<Skull className="w-4 h-4 text-red-500" />} label="Penalty" val={`+${penaltyMoves}`} />}

                    {bestScores[`${level}_${theme}`] && (
                        <Chip icon={<Trophy className="w-4 h-4 text-orange-500" />}
                            label="Best"
                            val={bestScores[`${level}_${theme}`]} />
                    )}

                    <button onClick={useHint} disabled={hintUsed || win || gameOver}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold shadow transition-all active:scale-95 ${!hintUsed && !win && !gameOver ? "bg-amber-500 hover:bg-amber-600 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}>
                        <Timer className="w-4 h-4" /> Hint {hintUsed ? "Used" : "Available"}
                    </button>

                    <button onClick={restart}
                        className="flex items-center gap-2 px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-xl text-sm font-semibold shadow transition-all active:scale-95">
                        <RotateCcw className="w-4 h-4" /> Restart
                    </button>
                </div>

                {/* Progress bar */}
                <div className="w-full max-w-md bg-gray-100 rounded-full h-2.5 mb-6 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }} />
                </div>

                {/* Card grid */}
                <div
                    className="grid gap-3"
                    style={{
                        gridTemplateColumns: `repeat(${cols}, 1fr)`,
                        maxWidth: cols === 3 ? 300 : cols === 4 ? 460 : 520,
                        width: "100%",
                    }}>
                    {cards.map(card => {
                        const isFlipped = card.flipped || card.matched;
                        const isHint = hint && (card.id === hint.first || card.id === hint.second);
                        const cardClasses = `card-inner ${isFlipped ? "is-flipped" : ""} ${isHint ? "hint-highlight" : ""}`;

                        return (
                            <div key={card.id}
                                className={`card-scene ${shakeTarget === "wrong" ? "shake" : ""}`}
                                style={{ width: "100%", aspectRatio: "1 / 1.1" }}
                                onClick={() => handleClick(card)}>
                                <div className={cardClasses}>
                                    <div className="card-front" />
                                    <div className={`card-back ${card.matched ? "matched-card" : ""}`}>
                                        {card.emoji}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Win Screen */}
                {win && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
                        onClick={restart}>
                        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-sm w-full"
                            onClick={e => e.stopPropagation()}>
                            <div className="win-emoji text-6xl mb-4">🏆</div>
                            <h2 style={{ fontFamily: "'Fredoka One',cursive" }}
                                className="text-3xl text-green-800 mb-2">Victory!</h2>

                            <div className="flex justify-center gap-1 mb-4">
                                {[1, 2, 3].map(i => (
                                    <Star key={i}
                                        className={`w-8 h-8 ${i <= stars ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`} />
                                ))}
                            </div>

                            <div className="flex justify-center gap-6 mb-6 text-sm text-gray-600">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-700">{moves}</div>
                                    <div>Moves</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">{fmt(secs)}</div>
                                    <div>Time</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-amber-500">
                                        {Math.floor((timeLimit - secs) / timeLimit * 100)}%
                                    </div>
                                    <div>Speed</div>
                                </div>
                            </div>

                            <button onClick={restart}
                                className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-2xl font-bold text-lg shadow hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-2">
                                <RotateCcw className="w-5 h-5" /> Play Again
                            </button>
                        </div>
                    </div>
                )}

                {/* Game Over Screen */}
                {gameOver && !win && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
                        onClick={restart}>
                        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-sm w-full"
                            onClick={e => e.stopPropagation()}>
                            <div className="text-6xl mb-4">💀</div>
                            <h2 style={{ fontFamily: "'Fredoka One',cursive" }}
                                className="text-3xl text-red-600 mb-2">Time's Up!</h2>
                            <p className="text-gray-600 mb-6">You matched {matches} out of {pairs} pairs</p>

                            <div className="flex justify-center gap-6 mb-6 text-sm text-gray-600">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-700">{moves}</div>
                                    <div>Total Moves</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-red-500">{fmt(secs)}</div>
                                    <div>Time Used</div>
                                </div>
                            </div>

                            <button onClick={restart}
                                className="w-full py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-2xl font-bold text-lg shadow hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-2">
                                <RotateCcw className="w-5 h-5" /> Try Again
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

function Chip({ icon, label, val, className = "" }) {
    return (
        <div className={`flex items-center gap-2 bg-white border border-gray-100 shadow-sm rounded-xl px-4 py-2 ${className}`}>
            {icon}
            <span className="text-xs text-gray-400">{label}</span>
            <span className="font-bold text-gray-800 text-sm">{val}</span>
        </div>
    );
}