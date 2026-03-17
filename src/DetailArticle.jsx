// ArticleDetail.jsx - Single article page inspired by Al Jazeera
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Calendar, Clock, User, Eye, Share2, Bookmark,
    ChevronLeft, Facebook, Twitter, Linkedin, Mail,
    MessageCircle, ThumbsUp, BookOpen
} from 'lucide-react';
import articleImage1 from "./images/article1.webp";
import articleImage2 from "./images/logopfe.png";
import articleImage3 from "./images/logopfe.png";

const ArticleDetail = () => {
    const { articleId } = useParams();
    const navigate = useNavigate();
    const [fontSize, setFontSize] = useState("medium");
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [likes, setLikes] = useState(124);
    const [hasLiked, setHasLiked] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);

    // Mock article data - in real app, fetch based on articleId
    const article = {
        id: 1,
        title: "4 تطبيقات خرائط تعمل بلا إنترنت.. الحل الأمثل لتجنب التشويش",
        excerpt: "How 5-minute learning sessions are transforming education in our country, especially during daily commutes.",
        content: `
      <p class="lead">تفرض التحديات الجيوسياسية الراهنة في المنطقة واقعا تقنيا جديدا يتطلب من المستخدمين الانتقال من الملاحة السحابية المعتمدة على الاتصال المستمر، إلى الملاحة المحلية التي تعتمد على تخزين البيانات المكانية داخل الأجهزة.

والاعتماد على تطبيقات الخرائط التي تعمل دون إنترنت ليس مجرد وسيلة لتوفير البيانات، بل هو إجراء احترازي لمواجهة انقطاع الشبكات أو تعمد التشويش على إشارات المواقع، حيث تعتمد كفاءة هذه التطبيقات على قدرتها على معالجة خوارزميات التوجيه داخليا، مما يضمن استمرارية العمل حتى في "المناطق العمياء" رقميا.

ولمواجهة هذا الخلل، تبرز أهمية تطبيقات الملاحة التي تعتمد على تخزين البيانات محليا، فهذه التطبيقات لا تحتاج إلى تدفق مستمر للبيانات، مما يجعلها أكثر استقرارا عند تعثر الشبكات أو حدوث قفزات غير منطقية في الموقع الجغرافي..</p>
      
      <h2>1. تطبيق أورغانيك مابس</h2>
      <p>M1.
يعد تطبيق "أورغانيك مابس" (Organic Maps)، حسب المختصين، بطل المجانية والخصوصية، فهو الوريث الشرعي لمنصة "مابس دوت مي" (Maps.me) الشهيرة، وهو مشروع مفتوح المصدر بالكامل.

فهو مجاني 100%، ولا يحتوي على إعلانات، ولا اشتراكات، ولا يقوم بجمع أي بيانات عن المستخدم، إذ يعتمد على بيانات "أوبن ستريت ماب" (OpenStreetMap) التي يتم تحديثها مرتين شهريا بواسطة مجتمع عالمي من المتطوعين.

كما يتميز باستهلاك ضئيل جدا للبطارية مقارنة بالمنافسين بفضل محرك التصيير (rendering) الخفيف، ويدعم الملاحة الصوتية للسيارات والدراجات والمشاة في وضع عدم الاتصال بالكامل..</p>
      
 
    `,
        author: {
            name: "Dr. Sarah Benali",
            avatar: "/avatars/sarah.jpg",
            title: "Education Researcher",
            bio: "Dr. Benali has spent 15 years researching educational technology and its applications in North Africa. She leads the Micro-Learning Initiative at the University of Algiers.",
            articles: 42,
            followers: 3800
        },
        category: "Education",
        image: articleImage1,
        readTime: "5 min",
        publishDate: "March 14, 2026",
        views: 1240,
        comments: [
            {
                id: 1,
                user: "Ahmed K.",
                avatar: "/avatars/comment1.jpg",
                date: "2 hours ago",
                content: "This is exactly what we need in Algeria! I've been using P-MAP during my commute to Algiers and it's transformed my daily routine.",
                likes: 12
            },
            {
                id: 2,
                user: "Fatima Z.",
                avatar: "/avatars/comment2.jpg",
                date: "5 hours ago",
                content: "Great article! I'd love to see more content about Algerian history on these platforms.",
                likes: 8
            }
        ],
        relatedArticles: [
            {
                id: 2,
                title: "Preserving Algerian Cultural Heritage in the Digital Age",
                image: articleImage2,
                readTime: "8 min"
            },
            {
                id: 4,
                title: "The Rise of Tech Startups in Algiers",
                image: articleImage1,
                readTime: "6 min"
            },
            {
                id: 5,
                title: "Digital Education in Rural Areas",
                image: articleImage2,
                readTime: "7 min"
            }
        ]
    };

    // Handle font size changes
    const getFontSizeClass = () => {
        switch (fontSize) {
            case "small": return "text-sm";
            case "large": return "text-lg";
            default: return "text-base";
        }
    };

    // Handle like
    const handleLike = () => {
        if (hasLiked) {
            setLikes(likes - 1);
        } else {
            setLikes(likes + 1);
        }
        setHasLiked(!hasLiked);
    };

    // Scroll to top on load
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [articleId]);

    return (
        <div className="min-h-screen bg-white">
            {/* Top Navigation Bar - Al Jazeera style */}
            <div className="bg-white shadow-sm sticky top-0 z-20 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-gray-700 hover:text-green-700 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            <span className="sm:inline">Back to Articles</span>
                        </button>

                        <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-green-700">P-MAP</span>
                            <span className="text-sm text-gray-500">| Article</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setFontSize("small")}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${fontSize === "small" ? 'bg-green-700 text-white' : 'bg-gray-100 hover:bg-gray-200'
                                    }`}
                            >
                                A-
                            </button>
                            <button
                                onClick={() => setFontSize("medium")}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${fontSize === "medium" ? 'bg-green-700 text-white' : 'bg-gray-100 hover:bg-gray-200'
                                    }`}
                            >
                                A
                            </button>
                            <button
                                onClick={() => setFontSize("large")}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${fontSize === "large" ? 'bg-green-700 text-white' : 'bg-gray-100 hover:bg-gray-200'
                                    }`}
                            >
                                A+
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Article Header */}
                <div className="mb-8">
                    {/* Category and Date */}
                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                            {article.category}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {article.publishDate}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {article.readTime}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                        {article.title}
                    </h1>

                    {/* Author Info - Al Jazeera style */}
                    <div className="flex items-center justify-between flex-wrap gap-4 py-4 border-y border-gray-200">
                        <div className="flex items-center gap-3">
                            <img
                                src={article.author.avatar}
                                alt={article.author.name}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                                <p className="font-semibold text-gray-900">{article.author.name}</p>
                                <p className="text-sm text-gray-500">{article.author.title}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleLike}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${hasLiked ? 'bg-green-700 text-white' : 'bg-gray-100 hover:bg-gray-200'
                                    }`}
                            >
                                <ThumbsUp className="w-4 h-4" fill={hasLiked ? "currentColor" : "none"} />
                                <span>{likes}</span>
                            </button>

                            <button
                                onClick={() => setIsBookmarked(!isBookmarked)}
                                className={`p-2 rounded-full transition-colors ${isBookmarked ? 'text-green-700' : 'text-gray-500 hover:text-green-700'
                                    }`}
                            >
                            </button>
                        </div>
                    </div>
                </div>

                {/* Featured Image */}
                <div className="mb-8 rounded-lg overflow-hidden">
                    <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-auto object-cover"
                    />
                </div>

                {/* Article Content - Al Jazeera style */}
                <div className={`prose prose-lg max-w-none ${getFontSizeClass()} mb-12`}>
                    <style jsx>{`
            .prose h2 {
              font-size: 1.8rem;
              font-weight: 700;
              color: #1f2937;
              margin: 2rem 0 1rem;
            }
            .prose p {
              line-height: 1.8;
              color: #374151;
              margin-bottom: 1.5rem;
            }
            .prose .lead {
              font-size: 1.25rem;
              font-weight: 400;
              color: #4b5563;
              border-left: 4px solid #16a34a;
              padding-left: 1.5rem;
              margin: 2rem 0;
            }
            .prose .quote {
              font-size: 1.3rem;
              font-style: italic;
              color: #16a34a;
              border-left: 4px solid #16a34a;
              padding-left: 1.5rem;
              margin: 2rem 0;
              font-weight: 500;
            }
          `}</style>
                    <div dangerouslySetInnerHTML={{ __html: article.content }} />
                </div>

                {/* Tags
                <div className="mb-8 flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">#MicroLearning</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">#Education</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">#Algeria</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">#EdTech</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">#CommuteLearning</span>
                </div> */}

                {/* Author Bio - Al Jazeera style */}
                <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
                    <div className="flex items-start gap-4">
                        <img
                            src={article.author.avatar}
                            alt={article.author.name}
                            className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-900 mb-1">
                                {article.author.name}
                            </h3>

                            <p className="text-sm text-green-700 mb-2">
                                {article.author.title}
                            </p>

                            <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                                {article.author.bio}
                            </p>

                            <div className="flex items-center text-sm text-gray-500">
                                 {article.author.articles} Articles in P-MAP
                            </div>
                        </div>
                    </div>
                </div>

                {/* Comments Section - Al Jazeera style */}
                <div className="mb-12">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <MessageCircle className="w-5 h-5" />
                        Comments ({article.comments.length})
                    </h3>

                    {/* Comment Form */}
                    <div className="flex gap-3 mb-6">
                        <img
                            src="/avatars/user.jpg"
                            alt="User"
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                            <textarea
                                placeholder="Share your thoughts..."
                                rows="3"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                            ></textarea>
                            <button className="mt-2 px-4 py-2 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-800 transition-colors">
                                Post Comment
                            </button>
                        </div>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-4">
                        {article.comments.map((comment) => (
                            <div key={comment.id} className="flex gap-3">
                                <img
                                    src={comment.avatar}
                                    alt={comment.user}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div className="flex-1 bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <span className="font-medium text-gray-900">{comment.user}</span>
                                            <span className="text-xs text-gray-500 ml-2">{comment.date}</span>
                                        </div>
                                        <button className="text-xs text-gray-500 hover:text-green-700">
                                            Reply
                                        </button>
                                    </div>
                                    <p className="text-gray-700 text-sm mb-2">{comment.content}</p>
                                    <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-green-700">
                                        <ThumbsUp className="w-3 h-3" />
                                        <span>{comment.likes}</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Related Articles - Al Jazeera style */}
                <div className="border-t border-gray-200 pt-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Related Articles</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {article.relatedArticles.map((related) => (
                            <div
                                key={related.id}
                                className="group cursor-pointer"
                                onClick={() => navigate(`/article/${related.id}`)}
                            >
                                <div className="h-40 overflow-hidden rounded-lg mb-3">
                                    <img
                                        src={related.image}
                                        alt={related.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <h4 className="font-medium text-gray-900 mb-1 group-hover:text-green-700 transition-colors line-clamp-2">
                                    {related.title}
                                </h4>
                                <span className="text-xs text-gray-500">{related.readTime} read</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

           
        </div>
    );
};

export default ArticleDetail;