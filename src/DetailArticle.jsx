// ArticleDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Calendar, Clock, Eye, ChevronLeft,
    ThumbsUp, Bookmark, Share2
} from "lucide-react";
import axios from "axios";
import { IoMdArrowRoundBack } from "react-icons/io";


const ArticleDetail = () => {
    const { articleId } = useParams();
    const navigate = useNavigate();

    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);

    const [fontSize, setFontSize] = useState("medium");
    const [likes, setLikes] = useState(120);
    const [hasLiked, setHasLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);

    useEffect(() => {
        setLoading(true);

        axios
            .get(`http://127.0.0.1:8000/api/articles/${articleId}/`)
            .then((res) => {
                const a = res.data;

                setArticle({
                    id: a.id,
                    title: a.title,
                    excerpt: a.excerpt,
                    content: a.content,
                    category: a.category,
                    image: a.image
                        ? `http://127.0.0.1:8000${a.image}`
                        : "/default.jpg",
                    readTime: a.read_time ? `${a.read_time} min` : "5 min",
                    publishDate: a.publish_date
                        ? new Date(a.publish_date).toLocaleDateString()
                        : "N/A",
                    author: {
                        name: a.name_author || "Unknown",
                        title: a.job_author || "",
                        bio: a.bio || ""
                    }
                });
            })
            .catch(() => {
                setArticle(null);
            })
            .finally(() => setLoading(false));

        window.scrollTo(0, 0);
    }, [articleId]);

    const getFontSize = () => {
        if (fontSize === "small") return "text-sm";
        if (fontSize === "large") return "text-lg";
        return "text-base";
    };

    const handleLike = () => {
        setHasLiked(!hasLiked);
        setLikes(hasLiked ? likes - 1 : likes + 1);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Loading article...</p>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
                <button
                    onClick={() => navigate("/articles")}
                    className="px-5 py-2 bg-green-700 text-white rounded-lg"
                >
                    Back
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">

            {/* TOP BAR */}
            <div className="sticky top-0 bg-white shadow-sm z-20 border-b">
                <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">

                    <button
                        onClick={() => navigate("/articles")}
                        className="px-5 py-2 bg-green-700 text-white rounded-lg"
                    >
                        <span><IoMdArrowRoundBack />Back</span>
                    </button>

                    {/* Font size */}
                    <div className="flex gap-2  rounded text-xl">
                        <button
                            onClick={() => setFontSize("small")}
                            className={`px-2 py-1 rounded ${fontSize === "small" ? "bg-green-700 text-white" : "bg-gray-100"}`}
                        >
                            A-
                        </button>
                        <button
                            onClick={() => setFontSize("medium")}
                            className={`px-2 py-1 rounded ${fontSize === "medium" ? "bg-green-700 text-white" : "bg-gray-100"}`}
                        >
                            A
                        </button>
                        <button
                            onClick={() => setFontSize("large")}
                            className={`px-2 py-1 rounded ${fontSize === "large" ? "bg-green-700 text-white" : "bg-gray-100"}`}
                        >
                            A+
                        </button>
                    </div>

                </div>
            </div>

            {/* ARTICLE */}
            <div className="max-w-3xl mx-auto px-4 py-10">

                {/* CATEGORY + INFO */}
                <div className="flex flex-wrap gap-3 text-lg font-bold text-gray-700 mb-4">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                        {article.category}
                    </span>

                    <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {article.publishDate}
                    </span>

                    <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {article.readTime}
                    </span>
                </div>

                {/* TITLE */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                    {article.title}
                </h1>

                {/* IMAGE */}
                <div className="mb-8 rounded-xl overflow-hidden shadow">
                    <img
                        src={article.image}
                        alt={article.title}
                        className="w-full max-h-[420px] object-cover"
                    />
                </div>


                {/* CONTENT */}
                <div className={`${getFontSize()} leading-8 text-gray-800 whitespace-pre-line`}>
                    {article.content}
                </div>

                {/* EXCERPT */}
                <div className="mt-8 bg-green-50 border-l-4 border-green-700 p-4">
                    <p className="italic text-green-800">
                        {article.excerpt}
                    </p>
                </div>

                {/* AUTHOR */}
                <div className="mt-10 bg-white border-gray-800 rounded-2xl p-5 shadow-sm flex gap-4 items-start">

                    {/* AVATAR (FIRST LETTER) */}
                    <div className="w-14 h-14 rounded-full bg-green-600 flex items-center justify-center text-white text-xl font-bold shadow">
                        {article.author?.name?.charAt(0)?.toUpperCase()}
                    </div>

                    {/* INFO */}
                    <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900">
                            {article.author.name}
                        </h3>

                        <p className="text-sm text-green-700 font-medium">
                            {article.author.title}
                        </p>

                        <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                            {article.author.bio}
                        </p>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default ArticleDetail;