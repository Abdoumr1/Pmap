// ArticleDetail.jsx - Single article page inspired by Al Jazeera
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Calendar, Clock, User, Eye, Share2, Bookmark,
    ChevronLeft, Facebook, Twitter, Linkedin, Mail,
    MessageCircle, ThumbsUp, BookOpen, Search
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
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);

    // Complete articles database
    const articles = [
        {
            id: 1,
            title: "Map",
            excerpt: "A map is a symbolic representation of selected characteristics of a place, usually drawn on a flat surface.",
            content: `
     A map is a symbolic representation of selected characteristics of a place, usually drawn on a flat surface. Maps present information about the world in a simple, visual way. They teach about the world by showing sizes and shapes of countries, locations of features and distances between places. Maps can show distributions of things over Earth, such as settlement patterns. They can show exact locations of houses and streets in a city neighborhood.

Mapmakers, called cartographers, create maps for many different purposes. Vacationers use road maps to plot routes for their trips. Meteorologists—scientists who study weather—use weather maps to prepare forecasts. City planners decide where to put hospitals and parks with the help of maps that show land features and how the land is currently being used.

Some common features of maps include scale, symbols and grids.

Scale

All maps are scale models of reality. A map’s scale indicates the relationship between the distances on the map and the actual distances on Earth. This relationship can be expressed by a graphic scale, a verbal scale, or a representative fraction.

The most common type of graphic scale looks like a ruler. Also called a bar scale, it is simply a horizontal line marked off in miles, kilometers, or some other unit measuring distance.

The verbal scale is a sentence that relates distance on the map to distance on Earth. For example, a verbal scale might say, “one centimeter represents one kilometer” or “one inch represents eight miles.”

The representative fraction does not have specific units. It is shown as a fraction or ratio—for example, 1/1,000,000 or 1:1,000,000. This means that any given unit of measure on the map is equal to one million of that unit on Earth. So, 1 centimeter on the map represents 1,000,000 centimeters on Earth, or 10 kilometers. One inch on the map represents 1,000,000 inches on Earth, or a little less than 16 miles.

The size of the area covered helps determine the scale of a map. A map that shows an area in great detail, such as a street map of a neighborhood, is called a large-scale map because objects on the map are relatively large. A map of a larger area, such as a continent or the world, is called a small-scale map because objects on the map are relatively small.

Today, maps are often computerized. Many computerized maps allow the viewer to zoom in and out, changing the scale of the map. A person may begin by looking at the map of an entire city that only shows major roads and then zoom in so that every street in a neighborhood is visible.

Symbols

Cartographers use symbols to represent geographic features. For example, black dots represent cities, circled stars represent capital cities and different sorts of lines represent boundaries, roads, highways and rivers. Colors are often used as symbols. Green is often used for forests, tan for deserts and blue for water. A map usually has a legend, or key, that gives the scale of the map and explains what the various symbols represent.

Some maps show relief, or changes in elevation. A common way to show relief is contour lines, also called topographic lines. These are lines that connect points that have equal elevation. If a map shows a large enough area, contour lines form circles.

A group of contour line circles inside one another indicates a change in elevation. As elevation increases, these contour line circles indicate a hill. As elevation decreases, contour line circles indicate a depression in the earth, such as a basin.

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
            relatedArticles: [2, 4, 5]
        },
        {
            id: 2,
            title: "Preserving Algerian Cultural Heritage in the Digital Age",
            excerpt: "How digital platforms are helping preserve and promote Algeria's rich cultural heritage for future generations.",
            content: `
        Algeria's cultural heritage is among the richest in North Africa, spanning thousands of years of history from ancient Numidian civilizations to Islamic art and French colonial influences. In the digital age, new technologies are offering unprecedented opportunities to preserve, document, and share this heritage.

Digital preservation has become crucial as many historical sites face threats from urbanization, climate change, and conflict. The Casbah of Algiers, a UNESCO World Heritage site, is now being documented using 3D scanning technology to create detailed digital models that can be used for restoration and education.

Traditional crafts, music, and oral histories are also being digitized. The Berber culture, with its unique language Tamazight and traditions, has found new life on social media platforms where young Algerians share traditional songs, recipes, and stories.

Museums across the country are creating virtual tours, allowing Algerians in the diaspora and international audiences to explore collections that were previously difficult to access. The National Museum of Fine Arts in Algiers now offers high-resolution images of its collections online.

However, challenges remain. Digital infrastructure in rural areas needs improvement, and there are concerns about cultural appropriation and the need to involve local communities in digitization efforts. The future of Algerian cultural heritage lies in balancing technological innovation with traditional preservation methods.
            `,
            author: {
                name: "Prof. Karim Mansouri",
                avatar: "/avatars/karim.jpg",
                title: "Cultural Heritage Specialist",
                bio: "Professor Mansouri has worked with UNESCO on cultural preservation projects across North Africa and leads the Algerian Digital Heritage Initiative.",
                articles: 28,
                followers: 2100
            },
            category: "Culture",
            image: articleImage2,
            readTime: "8 min",
            publishDate: "March 12, 2026",
            views: 890,
            comments: [
                {
                    id: 3,
                    user: "Yasmine B.",
                    avatar: "/avatars/comment3.jpg",
                    date: "1 day ago",
                    content: "So important to preserve our heritage. My grandmother tells stories about the Casbah that I never want to forget.",
                    likes: 15
                }
            ],
            relatedArticles: [1, 3, 5]
        },
        {
            id: 3,
            title: "The Rise of Tech Startups in Algiers",
            excerpt: "Algiers is emerging as a tech hub in North Africa with innovative startups solving local and global challenges.",
            content: `
        In recent years, Algiers has seen a surge in tech entrepreneurship, with young Algerians launching startups that address everything from e-commerce to fintech and edtech. This article explores the ecosystem that's making it possible.

The Algerian startup scene has been growing steadily since 2020, with incubators and accelerators popping up across the capital. Programs like Algeria Venture and startup act have provided funding and mentorship to hundreds of young entrepreneurs.

One success story is Yassir, a super-app that started in Algiers and has expanded to multiple countries, offering ride-hailing, delivery, and payment services. Other startups like Temtem, an online learning platform, are addressing educational needs in the region.

Challenges remain, including bureaucracy, access to international payment systems, and the need for more venture capital. However, the Algerian diaspora is increasingly investing in local startups, bringing expertise and connections from Silicon Valley and Europe.

The government has also taken notice, with new laws making it easier to register businesses and access funding. Tech parks in Sidi Abdellah and other areas provide office space and networking opportunities.

As internet penetration increases and more young people gain digital skills, Algiers is poised to become a major player in the African tech ecosystem. The future looks bright for Algerian innovation.
            `,
            author: {
                name: "Amira Chenouf",
                avatar: "/avatars/amira.jpg",
                title: "Tech Journalist",
                bio: "Amira covers the North African tech scene for multiple publications and has interviewed founders across the region.",
                articles: 56,
                followers: 4500
            },
            category: "Technology",
            image: articleImage1,
            readTime: "6 min",
            publishDate: "March 10, 2026",
            views: 2100,
            comments: [
                {
                    id: 4,
                    user: "Rafik M.",
                    avatar: "/avatars/comment4.jpg",
                    date: "3 days ago",
                    content: "I'm a founder in Algiers and can confirm the ecosystem is growing fast. Great to see this coverage!",
                    likes: 24
                }
            ],
            relatedArticles: [1, 2, 4]
        },
        {
            id: 4,
            title: "Digital Education in Rural Areas",
            excerpt: "Bridging the digital divide: How technology is bringing quality education to rural Algeria.",
            content: `
        Access to quality education has long been a challenge in rural Algeria, but digital technologies are helping bridge the gap. This article examines initiatives that are making a difference.

In the mountainous regions of Kabylie and the vast Sahara desert, distance and limited resources have traditionally limited educational opportunities. Children often had to travel long distances to reach schools, and qualified teachers were scarce.

Digital education initiatives are changing this landscape. Satellite internet connections, solar-powered tablets, and mobile learning apps are bringing classrooms to remote communities. Organizations like the Algerian Education Initiative have distributed thousands of devices to students in rural areas.

Teachers are also benefiting from online training programs that help them develop new skills without leaving their communities. Video conferencing allows students in different villages to learn together, sharing experiences and building connections.

Challenges persist, including reliable electricity, internet connectivity, and the need for content in local languages like Tamazight. However, pilot programs have shown promising results, with improved test scores and increased student engagement.

The COVID-19 pandemic accelerated many of these efforts, as school closures made remote learning essential. Now, with lessons learned, Algeria has an opportunity to build a more equitable education system that serves all its citizens, regardless of where they live.
            `,
            author: {
                name: "Dr. Sarah Benali",
                avatar: "/avatars/sarah.jpg",
                title: "Education Researcher",
                bio: "Dr. Benali has spent 15 years researching educational technology and its applications in North Africa.",
                articles: 42,
                followers: 3800
            },
            category: "Education",
            image: articleImage2,
            readTime: "7 min",
            publishDate: "March 8, 2026",
            views: 1560,
            comments: [
                {
                    id: 5,
                    user: "Lamine O.",
                    avatar: "/avatars/comment5.jpg",
                    date: "4 days ago",
                    content: "I teach in a rural school in Tizi Ouzou. Digital tools have transformed how we reach students, but we need more support.",
                    likes: 18
                }
            ],
            relatedArticles: [1, 3, 5]
        },
        {
            id: 5,
            title: "Algerian Cinema: A New Wave of Storytelling",
            excerpt: "Young Algerian filmmakers are gaining international recognition with fresh perspectives on identity, history, and society.",
            content: `
        Algerian cinema has a rich history, from the revolutionary films of the 1960s to the social dramas of the 1990s. Today, a new generation of filmmakers is bringing Algerian stories to global audiences with innovative approaches and fresh perspectives.

Directors like Mounia Meddour, whose film "Papicha" gained international acclaim, are exploring themes of identity, gender, and resistance. Her portrayal of young women in 1990s Algiers resonated with audiences worldwide and put Algerian cinema back on the map.

The digital revolution has made filmmaking more accessible. Young directors can now shoot on smartphones, edit on laptops, and distribute through streaming platforms. This democratization has led to a diversity of voices and stories that might not have found an audience before.

Film festivals in Algiers, Oran, and Constantine are nurturing local talent and bringing international cinema to Algerian audiences. The government has also increased funding for film production, recognizing cinema's potential for cultural diplomacy and economic development.

Challenges remain, including distribution within Algeria, where cinema attendance has declined, and the need for more training programs. However, the energy and creativity of young Algerian filmmakers suggest a bright future for the industry.

As these new voices gain recognition, they're not just entertaining audiences—they're shaping how Algerians see themselves and how the world sees Algeria.
            `,
            author: {
                name: "Yasmine Hamidi",
                avatar: "/avatars/yasmine.jpg",
                title: "Film Critic",
                bio: "Yasmine writes about North African cinema for international publications and has served on jury panels at film festivals across the region.",
                articles: 34,
                followers: 2900
            },
            category: "Arts & Culture",
            image: articleImage3,
            readTime: "9 min",
            publishDate: "March 5, 2026",
            views: 1870,
            comments: [
                {
                    id: 6,
                    user: "Sofia L.",
                    avatar: "/avatars/comment6.jpg",
                    date: "5 days ago",
                    content: "So proud of our filmmakers! 'Papicha' was incredible. Can't wait to see what comes next.",
                    likes: 32
                }
            ],
            relatedArticles: [2, 3, 4]
        }
    ];

    // Find function to get article by ID
    const findArticleById = (id) => {
        const numericId = parseInt(id);
        return articles.find(article => article.id === numericId) || null;
    };

    // Load article based on articleId
    useEffect(() => {
        setLoading(true);
        
        // Find the article using our find function
        const foundArticle = findArticleById(articleId);
        
        if (foundArticle) {
            setArticle(foundArticle);
            setLikes(Math.floor(Math.random() * 200) + 50); // Random likes for demo
        } else {
            // Handle article not found
            setArticle(null);
        }
        
        setLoading(false);
        window.scrollTo(0, 0);
    }, [articleId]);

    // Get full related article objects
    const getRelatedArticles = () => {
        if (!article || !article.relatedArticles) return [];
        return article.relatedArticles
            .map(id => articles.find(a => a.id === id))
            .filter(a => a !== undefined);
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

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading article...</p>
                </div>
            </div>
        );
    }

    // Article not found
    if (!article) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h2>
                    <p className="text-gray-600 mb-6">
                        Sorry, we couldn't find an article with ID: {articleId}
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
                    >
                        Return to Home
                    </button>
                </div>
            </div>
        );
    }

    const relatedArticles = getRelatedArticles();

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
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                                ID: {article.id}
                            </span>
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
                        <span>•</span>
                        <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {article.views}
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
                                <Bookmark className="w-5 h-5" fill={isBookmarked ? "currentColor" : "none"} />
                            </button>

                            <div className="relative">
                                <button
                                    onClick={() => setShowShareMenu(!showShareMenu)}
                                    className="p-2 rounded-full text-gray-500 hover:text-green-700 transition-colors"
                                >
                                    <Share2 className="w-5 h-5" />
                                </button>
                                {showShareMenu && (
                                    <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-10">
                                        <div className="flex gap-2">
                                            <button className="p-2 hover:bg-gray-100 rounded-full text-blue-600">
                                                <Facebook className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 hover:bg-gray-100 rounded-full text-blue-400">
                                                <Twitter className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 hover:bg-gray-100 rounded-full text-blue-700">
                                                <Linkedin className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
                                                <Mail className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
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
                    `}</style>
                    <div className="whitespace-pre-line">{article.content}</div>
                </div>

                {/* Excerpt highlight */}
                <div className="bg-green-50 border-l-4 border-green-700 p-4 mb-8">
                    <p className="text-green-800 italic">{article.excerpt}</p>
                </div>

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
                                <BookOpen className="w-4 h-4 mr-1" />
                                {article.author.articles} Articles in P-MAP • {article.author.followers} Followers
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
                {relatedArticles.length > 0 && (
                    <div className="border-t border-gray-200 pt-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Related Articles</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedArticles.map((related) => (
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
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-500">{related.readTime} read</span>
                                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                                            ID: {related.id}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArticleDetail;