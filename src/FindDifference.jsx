// FindDifference.jsx
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import img from "./images/Logoth.png";

const differences = [
    { id: 1, x: 120, y: 80, radius: 25 },
    { id: 2, x: 250, y: 150, radius: 25 },
    { id: 3, x: 80, y: 220, radius: 25 },
];

const FindDifference = () => {
    const navigate = useNavigate();
    const [found, setFound] = useState([]);

    const handleClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();

        // Convert click to image coordinates
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        differences.forEach((diff) => {
            const dx = x - diff.x;
            const dy = y - diff.y;

            if (Math.sqrt(dx * dx + dy * dy) < diff.radius) {
                if (!found.includes(diff.id)) {
                    setFound((prev) => [...prev, diff.id]);
                }
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">

            {/* BACK BUTTON */}
            <button
                onClick={() => navigate(-1)}
                className="mb-4 flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg"
            >
                <ArrowLeft className="w-4 h-4" />
                Back
            </button>

            {/* TITLE */}
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-green-800">
                    Find the Differences 🧠
                </h1>
                <p className="text-gray-600">
                    Found {found.length} / {differences.length}
                </p>
            </div>

            {/* IMAGES */}
            <div className="flex justify-center gap-8 flex-wrap">

                {/* ORIGINAL IMAGE */}
                <img
                    src={img}
                    alt="original"
                    className="w-80 h-80 object-cover rounded-lg shadow"
                />
                {/* GAME IMAGE */}
                <div
                    className="relative w-80 h-80"
                    onClick={handleClick}
                >
                    <img
                        src={img}
                        alt="modified"
                        className="w-80 h-80 object-cover rounded-lg shadow cursor-crosshair"
                    />

                    {/* FOUND CIRCLES */}
                    {found.map((id) => {
                        const diff = differences.find((d) => d.id === id);

                        return (
                            <div
                                key={id}
                                className="absolute border-4 border-red-500 rounded-full pointer-events-none"
                                style={{
                                    left: diff.x - diff.radius,
                                    top: diff.y - diff.radius,
                                    width: diff.radius * 2,
                                    height: diff.radius * 2,
                                }}
                            />
                        );
                    })}
                </div>
            </div>

            {/* WIN MESSAGE */}
            {found.length === differences.length && (
                <div className="text-center mt-8 text-green-700 font-bold text-xl">
                    🎉 You found all differences!
                </div>
            )}
        </div>
    );
};

export default FindDifference;