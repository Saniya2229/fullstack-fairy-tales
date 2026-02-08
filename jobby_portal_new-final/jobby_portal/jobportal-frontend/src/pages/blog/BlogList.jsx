// src/pages/blog/BlogList.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiClock, FiUser, FiBookOpen, FiTrendingUp, FiBookmark, FiShare2, FiMessageCircle, FiHeart, FiEye } from "react-icons/fi";
import { getAllBlogs } from "../../api/blogs";
import Loader from "../../components/Loader";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PageTransition from "../../components/PageTransition";

const springTransition = { type: "spring", stiffness: 400, damping: 25 };

// Comprehensive blog content for job seekers
const STATIC_BLOGS = [
    {
        _id: "1",
        title: "10 Tips to Nail Your Next Interview",
        excerpt: "Master the art of interviewing with these proven strategies from hiring managers. Learn how to prepare, present yourself, and leave a lasting impression.",
        image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800",
        author: "Sarah Chen",
        authorRole: "HR Director",
        timeAgo: "2 days ago",
        category: "Interview Tips",
        readTime: "5 min",
        views: "12.5K",
        likes: 342,
        comments: 28,
        featured: true,
        size: "large",
        tags: ["Interview", "Career", "Tips"]
    },
    {
        _id: "2",
        title: "Remote Work: The Complete Guide for 2024",
        excerpt: "Everything you need to know about finding and thriving in remote positions. From setting up your home office to maintaining work-life balance.",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
        author: "Mike Johnson",
        authorRole: "Remote Work Expert",
        timeAgo: "5 days ago",
        category: "Remote Work",
        readTime: "8 min",
        views: "18.2K",
        likes: 567,
        comments: 45,
        featured: true,
        size: "large",
        tags: ["Remote", "WFH", "Productivity"]
    },
    {
        _id: "3",
        title: "How to Write a Resume That Gets Noticed",
        excerpt: "Stand out from hundreds of applicants with a compelling resume. Learn the secrets recruiters look for and common mistakes to avoid.",
        image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800",
        author: "Emily Davis",
        authorRole: "Career Coach",
        timeAgo: "1 week ago",
        category: "Career Tips",
        readTime: "6 min",
        views: "25.1K",
        likes: 789,
        comments: 62,
        size: "medium",
        tags: ["Resume", "CV", "Application"]
    },
    {
        _id: "4",
        title: "Salary Negotiation: How to Get Paid What You Deserve",
        excerpt: "Learn the psychology behind successful salary negotiations. Know your worth and confidently ask for the compensation you deserve.",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800",
        author: "Alex Rivera",
        authorRole: "Compensation Analyst",
        timeAgo: "3 days ago",
        category: "Salary",
        readTime: "7 min",
        views: "15.8K",
        likes: 423,
        comments: 38,
        size: "medium",
        tags: ["Salary", "Negotiation", "Money"]
    },
    {
        _id: "5",
        title: "Top 10 Skills Employers Want in 2024",
        excerpt: "The most in-demand skills that can boost your career prospects. From AI literacy to soft skills, discover what employers are really looking for.",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
        author: "Jordan Lee",
        authorRole: "Tech Recruiter",
        timeAgo: "1 day ago",
        category: "Skills",
        readTime: "7 min",
        views: "32.4K",
        likes: 891,
        comments: 74,
        featured: true,
        size: "large",
        tags: ["Skills", "AI", "Learning"]
    },
    {
        _id: "6",
        title: "Switching Careers? Here's Your Complete Roadmap",
        excerpt: "A step-by-step guide to successfully changing your career path. Learn how to leverage your existing skills and build new ones.",
        image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800",
        author: "Pat Williams",
        authorRole: "Career Transition Coach",
        timeAgo: "4 days ago",
        category: "Career Change",
        readTime: "10 min",
        views: "9.7K",
        likes: 256,
        comments: 31,
        size: "medium",
        tags: ["Career Change", "Transition", "Growth"]
    },
    {
        _id: "7",
        title: "LinkedIn Profile Optimization: The Ultimate Guide",
        excerpt: "Make recruiters come to you with an irresistible LinkedIn presence. From headlines to endorsements, optimize every section.",
        image: "https://images.unsplash.com/photo-1611944212129-29977ae1398c?w=800",
        author: "Chris Morgan",
        authorRole: "LinkedIn Expert",
        timeAgo: "6 days ago",
        category: "Personal Branding",
        readTime: "5 min",
        views: "21.3K",
        likes: 534,
        comments: 42,
        size: "small",
        tags: ["LinkedIn", "Branding", "Profile"]
    },
    {
        _id: "8",
        title: "The Power of Networking: Building Meaningful Connections",
        excerpt: "Build meaningful professional connections that open doors to hidden job opportunities and career advancement.",
        image: "https://images.unsplash.com/photo-1515169067868-5387ec356754?w=800",
        author: "Taylor Smith",
        authorRole: "Networking Coach",
        timeAgo: "2 weeks ago",
        category: "Networking",
        readTime: "6 min",
        views: "8.4K",
        likes: 198,
        comments: 24,
        size: "small",
        tags: ["Networking", "Connections", "Events"]
    },
    {
        _id: "9",
        title: "Work-Life Balance: Finding Harmony in a Busy Career",
        excerpt: "Strategies to maintain your mental health and personal life while climbing the corporate ladder. Don't let your job consume you.",
        image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800",
        author: "Dr. Lisa Park",
        authorRole: "Wellness Expert",
        timeAgo: "1 week ago",
        category: "Wellness",
        readTime: "8 min",
        views: "14.6K",
        likes: 412,
        comments: 35,
        size: "medium",
        tags: ["Balance", "Health", "Wellness"]
    },
    {
        _id: "10",
        title: "Ace Your Virtual Interview: Tips for Success",
        excerpt: "Video interviews are here to stay. Learn how to set up your space, manage technology, and make a great impression through the screen.",
        image: "https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=800",
        author: "David Kim",
        authorRole: "Interview Coach",
        timeAgo: "3 days ago",
        category: "Interview Tips",
        readTime: "5 min",
        views: "11.2K",
        likes: 289,
        comments: 22,
        size: "small",
        tags: ["Virtual", "Video", "Interview"]
    },
    {
        _id: "11",
        title: "Building Your Personal Brand as a Developer",
        excerpt: "Stand out in the tech industry by creating a unique personal brand. From GitHub to Twitter, build your online presence strategically.",
        image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800",
        author: "Priya Sharma",
        authorRole: "Tech Evangelist",
        timeAgo: "5 days ago",
        category: "Personal Branding",
        readTime: "7 min",
        views: "16.8K",
        likes: 445,
        comments: 38,
        size: "medium",
        tags: ["Branding", "Developer", "Tech"]
    },
    {
        _id: "12",
        title: "The Art of Following Up After an Interview",
        excerpt: "The interview doesn't end when you leave the room. Learn the perfect follow-up strategy that keeps you top of mind.",
        image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800",
        author: "Rebecca Johnson",
        authorRole: "Hiring Manager",
        timeAgo: "4 days ago",
        category: "Interview Tips",
        readTime: "4 min",
        views: "7.9K",
        likes: 167,
        comments: 19,
        size: "small",
        tags: ["Follow-up", "Email", "Interview"]
    },
    {
        _id: "13",
        title: "Freelancing vs Full-Time: Which Path is Right for You?",
        excerpt: "Compare the pros and cons of freelancing versus traditional employment. Make an informed decision about your career path.",
        image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800",
        author: "Marcus Brown",
        authorRole: "Freelance Consultant",
        timeAgo: "1 week ago",
        category: "Career Tips",
        readTime: "9 min",
        views: "13.5K",
        likes: 378,
        comments: 52,
        size: "medium",
        tags: ["Freelance", "Career", "Decision"]
    },
    {
        _id: "14",
        title: "Dealing with Job Rejection: Turning Setbacks into Comebacks",
        excerpt: "Rejection is part of the job search. Learn how to handle it gracefully, learn from it, and come back stronger.",
        image: "https://images.unsplash.com/photo-1494178270175-e96de2971df9?w=800",
        author: "Jennifer Wu",
        authorRole: "Career Counselor",
        timeAgo: "6 days ago",
        category: "Career Tips",
        readTime: "6 min",
        views: "10.2K",
        likes: 298,
        comments: 41,
        size: "small",
        tags: ["Rejection", "Resilience", "Growth"]
    }
];

const CATEGORIES = ["All", "Interview Tips", "Remote Work", "Career Tips", "Salary", "Skills", "Networking", "Personal Branding", "Wellness"];

export default function BlogList() {
    const [loading, setLoading] = useState(true);
    const [blogPosts, setBlogPosts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {
        async function loadBlogs() {
            try {
                setLoading(true);
                const data = await getAllBlogs();
                const apiBlogs = data.blogs || [];
                setBlogPosts([...STATIC_BLOGS, ...apiBlogs]);
            } catch (err) {
                console.error("Error loading blogs:", err);
                setBlogPosts(STATIC_BLOGS);
            } finally {
                setLoading(false);
            }
        }
        loadBlogs();
    }, []);

    const filteredPosts = selectedCategory === "All"
        ? blogPosts
        : blogPosts.filter(p => p.category === selectedCategory);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-sans">
            <Navbar />
            <PageTransition>
                {/* Hero Section */}
                <section className="relative pt-32 pb-12 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-pink-50" />
                    <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200/30 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-200/20 rounded-full blur-[100px]" />

                    <div className="relative max-w-7xl mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={springTransition}
                        >
                            <Link to="/" className="inline-flex items-center gap-2 text-purple-600 font-medium mb-6 hover:gap-3 transition-all">
                                <FiArrowLeft /> Back to Home
                            </Link>

                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-orange-200">
                                            <FiBookOpen />
                                        </div>
                                        <div>
                                            <div className="text-3xl font-bold text-slate-900">{blogPosts.length}</div>
                                            <div className="text-sm text-slate-500">Career Articles</div>
                                        </div>
                                    </div>
                                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3">
                                        Career Insights & Tips
                                    </h1>
                                    <p className="text-lg text-slate-500 max-w-xl">
                                        Expert advice, interview strategies, and career wisdom to help you land your dream job.
                                    </p>
                                </div>

                                {/* Stats */}
                                <div className="flex gap-6">
                                    {[
                                        { value: "50K+", label: "Readers" },
                                        { value: "200+", label: "Articles" },
                                        { value: "4.9", label: "Rating" },
                                    ].map(stat => (
                                        <div key={stat.label} className="text-center">
                                            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                                            <div className="text-sm text-slate-500">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Category Tabs */}
                            <div className="flex flex-wrap gap-2">
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat
                                                ? "bg-slate-900 text-white"
                                                : "bg-white border border-slate-200 text-slate-600 hover:border-orange-300 hover:text-orange-600"
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Pinterest Masonry Grid */}
                <section className="py-12 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                            {filteredPosts.map((post, i) => (
                                <BlogCard key={post._id} post={post} index={i} />
                            ))}
                        </div>

                        {filteredPosts.length === 0 && (
                            <div className="text-center py-20">
                                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FiBookOpen className="text-3xl text-slate-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">No articles found</h3>
                                <p className="text-slate-500">Try selecting a different category.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Newsletter CTA */}
                <section className="py-16 px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl p-10 text-white"
                        >
                            <h2 className="text-3xl font-bold mb-4">Get Career Tips in Your Inbox</h2>
                            <p className="text-white/80 mb-6">
                                Join 10,000+ job seekers receiving weekly advice on landing their dream jobs.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-white/40"
                                />
                                <button className="px-6 py-3 bg-white text-purple-600 font-semibold rounded-xl hover:bg-white/90 transition-colors">
                                    Subscribe
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </section>

                <Footer />
            </PageTransition>
        </div>
    );
}

// Enhanced Blog Card Component
function BlogCard({ post, index }) {
    const isLarge = post.size === "large" || post.featured;
    const isMedium = post.size === "medium";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: index * 0.03 }}
            className="break-inside-avoid"
        >
            <Link to={`/blog/${post._id}`} className="group block">
                <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-orange-200 hover:shadow-xl transition-all">
                    {/* Image */}
                    <div className={`relative overflow-hidden ${isLarge ? 'h-72' : isMedium ? 'h-56' : 'h-44'}`}>
                        <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                        {/* Category Badge */}
                        <div className="absolute top-4 left-4">
                            <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm text-slate-700 text-xs font-bold rounded-full shadow-sm">
                                {post.category}
                            </span>
                        </div>

                        {/* Featured Badge */}
                        {post.featured && (
                            <div className="absolute top-4 right-4">
                                <span className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-lg">
                                    <FiTrendingUp className="text-xs" /> Featured
                                </span>
                            </div>
                        )}

                        {/* Bottom Stats */}
                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                            <span className="px-3 py-1.5 bg-black/50 backdrop-blur-sm text-white text-xs rounded-lg flex items-center gap-1.5">
                                <FiClock className="text-xs" /> {post.readTime}
                            </span>
                            <span className="px-3 py-1.5 bg-black/50 backdrop-blur-sm text-white text-xs rounded-lg flex items-center gap-1.5">
                                <FiEye className="text-xs" /> {post.views}
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                        {/* Tags */}
                        {post.tags && (
                            <div className="flex flex-wrap gap-1.5 mb-3">
                                {post.tags.map(tag => (
                                    <span key={tag} className="px-2 py-0.5 bg-orange-50 text-orange-600 text-xs rounded font-medium">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <h3 className={`font-bold text-slate-900 group-hover:text-orange-600 transition-colors mb-2 leading-snug ${isLarge ? 'text-xl' : 'text-base'}`}>
                            {post.title}
                        </h3>

                        <p className={`text-slate-500 mb-4 leading-relaxed ${isLarge ? 'text-sm line-clamp-3' : 'text-sm line-clamp-2'}`}>
                            {post.excerpt}
                        </p>

                        {/* Author & Stats */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm">
                                    {post.author?.charAt(0)}
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-slate-700">{post.author}</div>
                                    <div className="text-xs text-slate-400">{post.authorRole || post.timeAgo}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-slate-400">
                                <span className="flex items-center gap-1 text-xs">
                                    <FiHeart className="text-pink-400" /> {post.likes}
                                </span>
                                <span className="flex items-center gap-1 text-xs">
                                    <FiMessageCircle /> {post.comments}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
