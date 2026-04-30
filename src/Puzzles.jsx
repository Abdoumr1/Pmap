import { useState, useEffect, useCallback, useRef } from "react";
import { RotateCcw, Lightbulb, Trophy, Clock, Move } from "lucide-react";
import Metro from "./images/Metro-Alger.webp";
import Monimon from "./images/Monimon.jpg";
import Mosque from "./images/MosqueAlg.webp";
import Safari from "./images/Safari.jpg";

/*
  ┌─────────────────────────────────────────┐
  │  HOW IT WORKS (step by step)            │
  │                                         │
  │  1. Load an image onto a hidden canvas  │
  │  2. Slice it into N×N tiles             │
  │  3. Each tile = { id, bgPos, solved }   │
  │  4. Shuffle tiles (keep one empty)      │
  │  5. Click a tile → if next to empty     │
  │     → swap → re-render                  │
  │  6. Check if all tiles in order → WIN   │
  └─────────────────────────────────────────┘
*/

const LEVELS = {
    easy: { n: 3, label: "Easy" },
    medium: { n: 4, label: "Medium" },
    hard: { n: 5, label: "Hard" },
};

// ── Put your own image URLs here ──────────────────────────────────
const IMAGES = [
    { id: "Metro", label: "Metro", url: Metro },
    { id: "Maquam-Chahid", label: "Maquam-Chahid", url: Monimon },
    { id: "Mosque", label: "Mosque", url: Mosque },
    { id: "Safari", label: "Safari", url: Safari },
];

const BOARD_SIZE = 450; // px

// ── Helpers ───────────────────────────────────────────────────────
const isSolved = (tiles) => tiles.every((t, i) => t.id === i);
const getPos = (idx, n) => ({ r: Math.floor(idx / n), c: idx % n });
const EMPTY_ID = (n) => n * n - 1;

function shuffle(n) {
    const arr = Array.from({ length: n * n }, (_, i) => i);
    // Fisher-Yates
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function isSolvable(tiles, n) {
    const flat = tiles.filter((t) => t !== EMPTY_ID(n));
    let inversions = 0;
    for (let i = 0; i < flat.length; i++)
        for (let j = i + 1; j < flat.length; j++)
            if (flat[i] > flat[j]) inversions++;
    const blankRow = Math.floor(tiles.indexOf(EMPTY_ID(n)) / n);
    if (n % 2 === 1) return inversions % 2 === 0;
    return (inversions + blankRow) % 2 === 1;
}

function makeSolvableShuffled(n) {
    let arr;
    do { arr = shuffle(n); } while (!isSolvable(arr, n) || isSolved(arr.map((id, i) => ({ id }))));
    return arr;
}

// ── Main component ────────────────────────────────────────────────
export default function PuzzleGame() {
    const [level, setLevel] = useState("medium");
    const [imgIdx, setImgIdx] = useState(0);
    const [tiles, setTiles] = useState([]);   // array of tile IDs in current positions
    const [moves, setMoves] = useState(0);
    const [won, setWon] = useState(false);
    const [secs, setSecs] = useState(0);
    const [running, setRunning] = useState(false);
    const [hintIdx, setHintIdx] = useState(null);
    const [bestScores, setBestScores] = useState({});
    const [imgLoaded, setImgLoaded] = useState(false);

    const timerRef = useRef(null);
    const hintRef = useRef(null);
    const imgRef = useRef(null);

    const n = LEVELS[level].n;
    const tileSize = Math.floor(BOARD_SIZE / n);
    const emptyId = EMPTY_ID(n);
    const image = IMAGES[imgIdx];
    const bestKey = `${level}-${image.id}`;

    // ── Preload image ────────────────────────────────────────────────
    useEffect(() => {
        setImgLoaded(false);
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => { imgRef.current = img; setImgLoaded(true); };
        img.onerror = () => setImgLoaded(true); // still play even if image fails
        img.src = image.url;
    }, [image.url]);

    // ── Init / restart ───────────────────────────────────────────────
    const init = useCallback(() => {
        setTiles(makeSolvableShuffled(n));
        setMoves(0); setWon(false); setSecs(0); setRunning(false);
        setHintIdx(null);
        clearInterval(timerRef.current);
        clearTimeout(hintRef.current);
    }, [n]);

    useEffect(() => { init(); }, [init]);

    // ── Timer ────────────────────────────────────────────────────────
    useEffect(() => {
        if (running && !won) {
            timerRef.current = setInterval(() => setSecs((s) => s + 1), 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [running, won]);

    // ── Click tile ───────────────────────────────────────────────────
    const handleTileClick = (idx) => {
        if (won) return;
        const blankIdx = tiles.indexOf(emptyId);
        const { r: tr, c: tc } = getPos(idx, n);
        const { r: br, c: bc } = getPos(blankIdx, n);
        const adjacent =
            (Math.abs(tr - br) === 1 && tc === bc) ||
            (Math.abs(tc - bc) === 1 && tr === br);
        if (!adjacent) return;

        if (!running) setRunning(true);

        const next = [...tiles];
        [next[idx], next[blankIdx]] = [next[blankIdx], next[idx]];
        setTiles(next);
        setMoves((m) => m + 1);

        if (isSolved(next.map((id) => ({ id })))) {
            setWon(true);
            setRunning(false);
            clearInterval(timerRef.current);
            setBestScores((prev) => ({
                ...prev,
                [bestKey]: prev[bestKey] == null || moves + 1 < prev[bestKey]
                    ? moves + 1 : prev[bestKey],
            }));
        }
    };

    // ── Hint ─────────────────────────────────────────────────────────
    const giveHint = () => {
        clearTimeout(hintRef.current);
        const wrongTiles = tiles
            .map((id, pos) => ({ id, pos }))
            .filter(({ id, pos }) => id !== pos && id !== emptyId);
        if (!wrongTiles.length) return;
        const pick = wrongTiles[Math.floor(Math.random() * wrongTiles.length)];
        setHintIdx(pick.pos);
        hintRef.current = setTimeout(() => setHintIdx(null), 1200);
    };

    const fmt = (s) =>
        `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

    // ── Tile background (shows slice of the image) ───────────────────
    const getTileStyle = (tileId) => {
        // Position of this tile in the solved grid
        const solvedR = Math.floor(tileId / n);
        const solvedC = tileId % n;
        return {
            backgroundImage: imgLoaded && imgRef.current ? `url(${image.url})` : "none",
            backgroundSize: `${n * tileSize}px ${n * tileSize}px`,
            backgroundPosition: `-${solvedC * tileSize}px -${solvedR * tileSize}px`,
            backgroundRepeat: "no-repeat",
        };
    };

    // ── Stars ────────────────────────────────────────────────────────
    const stars = moves <= n * n ? 3 : moves <= n * n * 2 ? 2 : 1;

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800&display=swap');
        .puzzle-wrap { font-family: 'Nunito', sans-serif; }
        .tile-btn {
          position: absolute;
          border: 2px solid rgba(255,255,255,0.4);
          border-radius: 8px;
          cursor: pointer;
          overflow: hidden;
          transition: border-color .15s, transform .15s, box-shadow .15s;
          display: flex; align-items: center; justify-content: center;
        }
        .tile-btn:hover { border-color: rgba(255,255,255,0.9); z-index: 2; transform: scale(1.02); }
        .tile-btn.hint-glow { box-shadow: 0 0 0 3px #facc15, 0 0 12px #facc1566; border-color: #facc15; }
        .tile-btn.tile-solved { border-color: rgba(100,230,140,0.7); }
        .tile-btn.tile-empty { border: 2px dashed #ddd; cursor: default; background: #f3f4f6 !important; }
        .tile-btn.tile-empty:hover { transform: none; border-color: #ddd; }
        .tile-num {
          position: absolute; bottom: 3px; right: 5px;
          font-size: 10px; font-weight: 700;
          color: rgba(255,255,255,0.7);
          text-shadow: 0 1px 3px rgba(0,0,0,0.5);
        }
        .pg-board {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          border: 2px solid #e5e7eb;
          background: #f9fafb;
          flex-shrink: 0;
        }
        .level-btn, .img-btn {
          padding: 6px 14px; border-radius: 999px; font-size: 13px;
          font-weight: 600; border: 1.5px solid #d1d5db;
          background: #fff; color: #374151; cursor: pointer;
          transition: all .15s; font-family: 'Nunito',sans-serif;
        }
        .level-btn.active, .img-btn.active {
          background: #166534; color: #fff; border-color: #166534;
        }
        @keyframes popIn {
          0%  { opacity:0; transform:scale(0.85); }
          100%{ opacity:1; transform:scale(1); }
        }
        .win-card { animation: popIn .3s ease; }
        @keyframes tileMove { 0%{transform:scale(.96)} 50%{transform:scale(1.03)} 100%{transform:scale(1)} }
      `}</style>

            <div className="puzzle-wrap min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex flex-col items-center py-8 px-4">

                {/* Title */}
                <div className="text-center mb-6">
                    <h1 style={{ fontFamily: "'Fredoka One', cursive" }}
                        className="text-4xl text-green-800 mb-1">
                        Image Puzzle 🧩
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Slide tiles to reconstruct the original image
                    </p>
                </div>

                {/* Level selector */}
                <div className="flex gap-2 mb-3 flex-wrap justify-center">
                    {Object.entries(LEVELS).map(([key, val]) => (
                        <button key={key} className={`level-btn ${level === key ? "active" : ""}`}
                            onClick={() => setLevel(key)}>
                            {val.label} ({val.n}×{val.n})
                        </button>
                    ))}
                </div>

                {/* Image selector */}
                <div className="flex gap-2 mb-5 flex-wrap justify-center">
                    {IMAGES.map((img, i) => (
                        <button key={img.id} className={`img-btn ${imgIdx === i ? "active" : ""}`}
                            onClick={() => setImgIdx(i)}>
                            {img.label}
                        </button>
                    ))}
                </div>

                {/* Stats */}
                <div className="flex gap-4 mb-5 flex-wrap justify-center">
                    <StatChip icon={<Move className="w-4 h-4 text-blue-500" />} label="Moves" val={moves} />
                    <StatChip icon={<Clock className="w-4 h-4 text-purple-500" />} label="Time" val={fmt(secs)} />
                    {bestScores[bestKey] && (
                        <StatChip icon={<Trophy className="w-4 h-4 text-yellow-500" />} label="Best" val={`${bestScores[bestKey]} moves`} />
                    )}
                    <button onClick={giveHint}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-xl text-sm font-semibold hover:bg-yellow-100 transition-colors">
                        <Lightbulb className="w-4 h-4" /> Hint
                    </button>
                    <button onClick={init}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-700 text-white rounded-xl text-sm font-semibold hover:bg-green-800 transition-colors">
                        <RotateCcw className="w-4 h-4" /> Restart
                    </button>
                </div>

                {/* Main area: preview + board */}
                <div className="flex gap-6 flex-wrap justify-center items-start">

                    {/* Preview */}
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Target</span>
                        <div style={{ width: 120, height: 120, borderRadius: 10, overflow: "hidden", border: "2px solid #e5e7eb" }}>
                            {imgLoaded && (
                                <img src={image.url} alt={image.label}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            )}
                        </div>
                        <span className="text-xs text-gray-400">{image.label}</span>
                    </div>

                    {/* Board */}
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Puzzle</span>
                        <div className="pg-board"
                            style={{ width: BOARD_SIZE, height: BOARD_SIZE }}>
                            {tiles.map((tileId, idx) => {
                                const { r, c } = getPos(idx, n);
                                const isEmpty = tileId === emptyId;
                                const isSolvedTile = tileId === idx && !isEmpty;
                                const isHinted = idx === hintIdx;
                                return (
                                    <button
                                        key={`${idx}-${tileId}`}
                                        className={[
                                            "tile-btn",
                                            isEmpty ? "tile-empty" : "",
                                            isSolvedTile ? "tile-solved" : "",
                                            isHinted ? "hint-glow" : "",
                                        ].join(" ")}
                                        style={{
                                            width: tileSize - 3,
                                            height: tileSize - 3,
                                            left: c * tileSize + 1.5,
                                            top: r * tileSize + 1.5,
                                            ...(!isEmpty ? getTileStyle(tileId) : {}),
                                        }}
                                        onClick={() => handleTileClick(idx)}
                                        disabled={isEmpty}
                                        title={isEmpty ? "Empty" : `Tile ${tileId + 1}`}
                                    >
                                        {!isEmpty && (
                                            <span className="tile-num">{tileId + 1}</span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Progress bar */}
                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-300"
                                style={{ width: `${(tiles.filter((id, i) => id === i).length / (n * n)) * 100}%` }} />
                        </div>
                        <p className="text-xs text-gray-400">
                            {tiles.filter((id, i) => id === i && id !== emptyId).length} / {n * n - 1} tiles in place
                        </p>
                    </div>
                </div>

                {/* Win modal */}
                {won && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
                        onClick={init}>
                        <div className="win-card bg-white rounded-3xl shadow-2xl p-8 text-center max-w-sm w-full"
                            onClick={(e) => e.stopPropagation()}>
                            <div className="text-6xl mb-3" style={{ animation: "popIn .5s ease" }}>🏆</div>
                            <h2 style={{ fontFamily: "'Fredoka One',cursive" }}
                                className="text-3xl text-green-800 mb-1">Puzzle Solved!</h2>
                            <p className="text-gray-500 text-sm mb-4">{image.label} · {n}×{n}</p>

                            {/* Stars */}
                            <div className="flex justify-center gap-1 mb-5">
                                {[1, 2, 3].map((i) => (
                                    <span key={i} style={{ fontSize: 28, filter: i <= stars ? "none" : "grayscale(1) opacity(.3)" }}>⭐</span>
                                ))}
                            </div>

                            <div className="flex justify-center gap-8 mb-6 text-sm text-gray-600">
                                <div><div className="text-2xl font-bold text-green-700">{moves}</div><div>Moves</div></div>
                                <div><div className="text-2xl font-bold text-blue-600">{fmt(secs)}</div><div>Time</div></div>
                                <div><div className="text-2xl font-bold text-yellow-500">{stars}/3</div><div>Stars</div></div>
                            </div>

                            <button onClick={init}
                                className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all">
                                <RotateCcw className="w-5 h-5" /> Play Again
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

function StatChip({ icon, label, val }) {
    return (
        <div className="flex items-center gap-2 bg-white border border-gray-100 shadow-sm rounded-xl px-3 py-1.5">
            {icon}
            <span className="text-xs text-gray-400">{label}</span>
            <span className="font-bold text-gray-800 text-sm">{val}</span>
        </div>
    );
}