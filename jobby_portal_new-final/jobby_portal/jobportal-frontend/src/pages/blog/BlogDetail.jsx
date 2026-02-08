// src/pages/blog/BlogDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiClock, FiUser, FiShare2, FiFacebook, FiTwitter, FiLinkedin } from "react-icons/fi";
import { getBlogById, getAllBlogs } from "../../api/blogs";
import ReactMarkdown from 'react-markdown';
import Loader from "../../components/Loader";

export default function BlogDetail() {
    const { id } = useParams();
    const nav = useNavigate();
    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState(null);
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadBlog() {
            try {
                setLoading(true);
                const blogData = await getBlogById(id);
                setPost(blogData);

                // Load related posts
                const allBlogs = await getAllBlogs({ limit: 4 });
                setRelatedPosts(allBlogs.blogs.filter(b => b._id !== id).slice(0, 3));
            } catch (err) {
                console.error("Error loading blog:", err);
                setError("Failed to load blog post");
            } finally {
                setLoading(false);
            }
        }
        loadBlog();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader />
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <h2 className="text-2xl font-bold text-gray-900">Blog post not found</h2>
                <Link to="/blog" className="mt-4 text-purple-600 font-bold hover:underline">Back to Blog</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans">

            {/* Hero Image */}
            <div className="relative h-96 bg-gray-900">
                <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10 pb-12">

                {/* Back Button */}
                <button
                    onClick={() => nav(-1)}
                    className="text-white/90 hover:text-white flex items-center gap-2 mb-6 transition-colors font-medium"
                >
                    <FiArrowLeft /> Back
                </button>

                {/* Article Card */}
                <article className="bg-white rounded-2xl shadow-xl p-8 md:p-12">

                    {/* Title & Meta */}
                    <header className="mb-8 pb-8 border-b border-gray-100">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                            {post.title}
                        </h1>
                        <div className="flex items-center gap-6 text-gray-600">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                                    {post.author.charAt(0)}
                                </div>
                                <span className="font-medium">{post.author}</span>
                            </div>
                            <span className="flex items-center gap-1">
                                <FiClock className="text-sm" /> {post.timeAgo}
                            </span>
                        </div>
                    </header>

                    {/* Content */}
                    <div className="prose prose-lg prose-purple max-w-none mb-8">
                        <ReactMarkdown>{post.content}</ReactMarkdown>
                    </div>

                    {/* Share Section */}
                    <div className="pt-8 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-gray-700 flex items-center gap-2">
                                <FiShare2 /> Share this article:
                            </span>
                            <div className="flex items-center gap-3">
                                <button className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:opacity-90 transition">
                                    <FiFacebook />
                                </button>
                                <button className="w-10 h-10 rounded-full bg-blue-400 text-white flex items-center justify-center hover:opacity-90 transition">
                                    <FiTwitter />
                                </button>
                                <button className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center hover:opacity-90 transition">
                                    <FiLinkedin />
                                </button>
                            </div>
                        </div>
                    </div>

                </article>

                {/* Related Posts */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {relatedPosts.map(related => (
                            <Link to={`/blog/${related._id}`} key={related._id} className="group">
                                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all">
                                    <div className="h-40 overflow-hidden">
                                        <img
                                            src={related.image}
                                            alt={related.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                                            {related.title}
                                        </h3>
                                        <p className="text-sm text-gray-500">{related.author}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
