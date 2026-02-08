// components/AIChatbot.jsx
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageCircle, FiX, FiSend, FiMinimize2, FiMaximize2 } from "react-icons/fi";
import { sendChatMessage } from "../api/ai";

const AIChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([
        { role: "bot", content: "Hi! 👋 I'm JobBot, your AI career assistant. How can I help you today?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: "user", content: userMessage }]);
        setIsLoading(true);

        try {
            const result = await sendChatMessage(userMessage);
            if (result.success) {
                setMessages(prev => [...prev, { role: "bot", content: result.response }]);
            } else {
                setMessages(prev => [...prev, { role: "bot", content: "Sorry, I couldn't process that. Please try again." }]);
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: "bot", content: "Sorry, something went wrong. Please try again later." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const quickActions = [
        "What jobs match my skills?",
        "Resume tips",
        "Interview preparation"
    ];

    const handleQuickAction = (action) => {
        setInput(action);
    };

    return (
        <>
            {/* Floating Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full shadow-lg flex items-center justify-center text-white z-[9999] hover:shadow-xl transition-shadow"
                    >
                        <FiMessageCircle className="text-2xl" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.8 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            height: isMinimized ? "auto" : "500px"
                        }}
                        exit={{ opacity: 0, y: 100, scale: 0.8 }}
                        className="fixed bottom-6 right-6 w-96 bg-white rounded-2xl shadow-2xl z-[9999] overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                        <FiMessageCircle className="text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">JobBot</h3>
                                        <span className="text-xs text-purple-200">AI Career Assistant</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => setIsMinimized(!isMinimized)}
                                        className="p-2 hover:bg-white/20 rounded-lg transition"
                                    >
                                        {isMinimized ? <FiMaximize2 /> : <FiMinimize2 />}
                                    </button>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 hover:bg-white/20 rounded-lg transition"
                                    >
                                        <FiX />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        {!isMinimized && (
                            <>
                                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                                    {messages.map((msg, index) => (
                                        <div
                                            key={index}
                                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                        >
                                            <div
                                                className={`max-w-[80%] p-3 rounded-2xl ${msg.role === "user"
                                                    ? "bg-purple-600 text-white rounded-br-md"
                                                    : "bg-white text-gray-800 shadow-sm rounded-bl-md"
                                                    }`}
                                            >
                                                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                            </div>
                                        </div>
                                    ))}

                                    {isLoading && (
                                        <div className="flex justify-start">
                                            <div className="bg-white p-3 rounded-2xl shadow-sm rounded-bl-md">
                                                <div className="flex gap-1">
                                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Quick Actions */}
                                {messages.length <= 2 && (
                                    <div className="px-4 py-2 bg-gray-50 border-t flex gap-2 overflow-x-auto">
                                        {quickActions.map((action, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleQuickAction(action)}
                                                className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium whitespace-nowrap hover:bg-purple-200 transition"
                                            >
                                                {action}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Input */}
                                <div className="p-4 bg-white border-t">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            placeholder="Ask me anything..."
                                            className="flex-1 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                                        />
                                        <button
                                            onClick={handleSend}
                                            disabled={!input.trim() || isLoading}
                                            className="p-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <FiSend />
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AIChatbot;
