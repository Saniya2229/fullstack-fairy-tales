// controllers/aiController.js
import * as geminiService from "../services/geminiService.js";
import User from "../models/User.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";

/**
 * Generate AI Resume
 * POST /api/ai/resume/generate
 */
export async function generateResume(req, res) {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        try {
            const resumeData = await geminiService.generateResume(user);
            res.json({
                success: true,
                resume: resumeData,
                message: "Resume generated successfully"
            });
        } catch (aiError) {
            console.error("Gemini AI error (generateResume):", aiError);

            // Fallback: Generate basic resume from profile data
            const fallbackResume = {
                summary: `Motivated ${user.currentEducation_degree || 'professional'} with skills in ${(user.skills || []).slice(0, 3).join(', ') || 'various areas'}. Seeking opportunities to apply my expertise and grow professionally.`,
                skills: user.skills || [],
                experience: (user.experience || user.internships || []).map(exp => ({
                    title: exp.title || exp.role || "Role",
                    company: exp.company || exp.organization || "Company",
                    duration: exp.duration || "Duration",
                    description: exp.description || "Professional experience"
                })),
                education: [{
                    degree: user.currentEducation_degree || "Degree",
                    institution: user.currentEducation_college || "Institution",
                    year: user.currentEducation_year || "Year"
                }],
                certifications: user.certifications || []
            };

            res.json({
                success: true,
                resume: fallbackResume,
                message: "Resume generated (basic mode)",
                fallback: true
            });
        }
    } catch (error) {
        console.error("Generate resume error:", error);
        res.status(500).json({ message: "Failed to generate resume", error: error.message });
    }
}

/**
 * Score Resume
 * POST /api/ai/resume/score
 */
export async function scoreResume(req, res) {
    try {
        const { resumeText, targetRole } = req.body;

        if (!resumeText) {
            return res.status(400).json({ message: "Resume text is required" });
        }

        try {
            const scoreData = await geminiService.scoreResume(resumeText, targetRole);
            res.json({
                success: true,
                analysis: scoreData,
                message: "Resume analyzed successfully"
            });
        } catch (aiError) {
            console.error("Gemini AI error (scoreResume):", aiError);

            // Fallback: Basic analysis
            const wordCount = resumeText.split(/\s+/).length;
            const hasEmail = /\S+@\S+\.\S+/.test(resumeText);
            const hasPhone = /\d{10}|\(\d{3}\)\s*\d{3}-\d{4}/.test(resumeText);
            const hasSections = /experience|education|skills/i.test(resumeText);

            let score = 50;
            if (wordCount > 200) score += 10;
            if (wordCount > 400) score += 10;
            if (hasEmail) score += 10;
            if (hasPhone) score += 5;
            if (hasSections) score += 15;

            const fallbackAnalysis = {
                overallScore: Math.min(score, 100),
                sections: {
                    summary: { score: hasSections ? 70 : 50, feedback: "Consider adding a professional summary" },
                    experience: { score: wordCount > 300 ? 75 : 60, feedback: "Add more details about your achievements" },
                    skills: { score: 70, feedback: "List relevant technical and soft skills" },
                    education: { score: 70, feedback: "Include your educational background" },
                    formatting: { score: 65, feedback: "Ensure consistent formatting throughout" }
                },
                strengths: [
                    hasEmail ? "Contact information included" : "Resume submitted",
                    wordCount > 200 ? "Good content length" : "Content provided",
                    "Shows initiative by using AI analysis"
                ],
                improvements: [
                    "Add quantifiable achievements",
                    "Tailor content to target role",
                    "Use action verbs to describe experience"
                ],
                tips: [
                    "Keep resume to 1-2 pages",
                    "Use bullet points for readability",
                    "Proofread for errors"
                ]
            };

            res.json({
                success: true,
                analysis: fallbackAnalysis,
                message: "Resume analyzed (basic mode)",
                fallback: true
            });
        }
    } catch (error) {
        console.error("Score resume error:", error);
        res.status(500).json({ message: "Failed to analyze resume", error: error.message });
    }
}

/**
 * Match Jobs to User
 * POST /api/ai/jobs/match
 */
export async function matchJobs(req, res) {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Fetch available jobs
        let jobs = await Job.find({ status: "open" })
            .populate("employer", "companyName companyLogo")
            .limit(50)
            .lean();

        if (jobs.length === 0) {
            jobs = await Job.find({})
                .populate("employer", "companyName companyLogo")
                .limit(50)
                .lean();
        }

        if (jobs.length === 0) {
            return res.json({
                success: true,
                matches: [],
                message: "No jobs available for matching"
            });
        }

        try {
            const matchResult = await geminiService.matchJobs(user, jobs);

            // Enrich matches with full job data
            const enrichedMatches = (matchResult.matches || []).map(match => {
                const job = jobs.find(j => j._id.toString() === match.jobId);
                return {
                    ...match,
                    job: job || null
                };
            }).filter(m => m.job);

            res.json({
                success: true,
                matches: enrichedMatches,
                message: "Jobs matched successfully"
            });
        } catch (aiError) {
            console.error("Gemini AI error (matchJobs):", aiError);

            // Fallback: Return jobs sorted by recency with basic scoring
            const userSkills = (user.skills || []).map(s => s.toLowerCase());

            const fallbackMatches = jobs.slice(0, 10).map((job, index) => {
                // Use qualifications instead of skills
                const jobQualifications = (job.qualifications || []).map(s => s.toLowerCase());
                const matchingSkills = userSkills.filter(s =>
                    jobQualifications.some(jq => jq.includes(s) || s.includes(jq))
                );
                const score = Math.min(60 + matchingSkills.length * 10, 95);

                return {
                    jobId: job._id.toString(),
                    matchScore: score,
                    matchReasons: matchingSkills.length > 0
                        ? [`Skills match: ${matchingSkills.join(', ')}`]
                        : ["Recent job posting"],
                    missingSkills: jobQualifications.filter(q => !userSkills.some(s => q.includes(s))).slice(0, 3),
                    job
                };
            }).sort((a, b) => b.matchScore - a.matchScore);

            res.json({
                success: true,
                matches: fallbackMatches,
                message: "Jobs matched (basic mode)",
                fallback: true
            });
        }
    } catch (error) {
        console.error("Match jobs error:", error);
        res.status(500).json({ message: "Failed to match jobs", error: error.message });
    }
}

/**
 * Generate Job Description
 * POST /api/ai/job/description
 */
export async function generateJobDescription(req, res) {
    try {
        const jobInfo = req.body;

        if (!jobInfo.title) {
            return res.status(400).json({ message: "Job title is required" });
        }

        try {
            const description = await geminiService.generateJobDescription(jobInfo);
            res.json({
                success: true,
                description,
                message: "Job description generated successfully"
            });
        } catch (aiError) {
            console.error("Gemini AI error (generateJobDescription):", aiError);

            // Fallback: Template-based description
            const fallbackDescription = {
                title: jobInfo.title,
                summary: `We are looking for a talented ${jobInfo.title} to join our team${jobInfo.location ? ` in ${jobInfo.location}` : ''}. This is an exciting opportunity to work on impactful projects.`,
                responsibilities: [
                    `Perform core ${jobInfo.title} duties`,
                    "Collaborate with cross-functional teams",
                    "Contribute to project planning and execution",
                    "Maintain high quality standards",
                    "Continuously learn and improve skills"
                ],
                requirements: [
                    jobInfo.experience ? `${jobInfo.experience} of relevant experience` : "Relevant experience required",
                    (jobInfo.skills || []).length > 0 ? `Proficiency in ${jobInfo.skills.join(', ')}` : "Strong technical skills",
                    "Excellent communication skills",
                    "Problem-solving abilities"
                ],
                niceToHave: [
                    "Experience with agile methodologies",
                    "Leadership experience"
                ],
                benefits: [
                    "Competitive salary",
                    "Professional development opportunities",
                    "Collaborative work environment"
                ],
                fullDescription: `Join us as a ${jobInfo.title}! We are seeking a motivated professional to contribute to our growing team. You will have the opportunity to work on exciting projects and grow your career.`
            };

            res.json({
                success: true,
                description: fallbackDescription,
                message: "Job description generated (basic mode)",
                fallback: true
            });
        }
    } catch (error) {
        console.error("Generate job description error:", error);
        res.status(500).json({ message: "Failed to generate description", error: error.message });
    }
}

/**
 * Rank Candidates
 * POST /api/ai/candidates/rank
 */
export async function rankCandidates(req, res) {
    try {
        const { jobId } = req.body;
        const employerId = req.user.id;

        if (!jobId) {
            return res.status(400).json({ message: "Job ID is required" });
        }

        // Get job details
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        // Verify employer owns this job
        if (job.employer.toString() !== employerId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Get applications for this job
        const applications = await Application.find({ job: jobId })
            .populate("applicant", "firstName lastName email skills experience education currentEducation_degree")
            .lean();

        if (applications.length === 0) {
            return res.json({
                success: true,
                rankings: [],
                message: "No applications to rank"
            });
        }

        try {
            const rankResult = await geminiService.rankCandidates(job, applications);

            // Enrich rankings with application data
            const enrichedRankings = (rankResult.rankings || []).map(ranking => {
                const app = applications.find(a =>
                    a._id.toString() === ranking.candidateId ||
                    a.applicant?._id?.toString() === ranking.candidateId
                );
                return {
                    ...ranking,
                    application: app || null
                };
            }).filter(r => r.application);

            res.json({
                success: true,
                rankings: enrichedRankings,
                message: "Candidates ranked successfully"
            });
        } catch (aiError) {
            console.error("Gemini AI error (rankCandidates):", aiError);

            // Fallback: Rank by application date and basic skill matching
            const jobQualifications = (job.qualifications || []).map(s => s.toLowerCase());

            const fallbackRankings = applications.map((app, index) => {
                const applicantSkills = (app.applicant?.skills || []).map(s => s.toLowerCase());
                const matchingSkills = applicantSkills.filter(s =>
                    jobQualifications.some(jq => jq.includes(s) || s.includes(jq))
                );
                const score = Math.min(50 + matchingSkills.length * 15, 100);

                return {
                    candidateId: app._id.toString(),
                    rank: 0,
                    score,
                    strengths: matchingSkills.length > 0
                        ? [`Skills match: ${matchingSkills.join(', ')}`]
                        : ["Submitted application"],
                    concerns: [],
                    recommendation: score >= 70 ? "Good candidate for review" : "Consider reviewing application",
                    application: app
                };
            })
                .sort((a, b) => b.score - a.score)
                .map((r, i) => ({ ...r, rank: i + 1 }));

            res.json({
                success: true,
                rankings: fallbackRankings,
                message: "Candidates ranked (basic mode)",
                fallback: true
            });
        }
    } catch (error) {
        console.error("Rank candidates error:", error);
        res.status(500).json({ message: "Failed to rank candidates", error: error.message });
    }
}

/**
 * AI Chat
 * POST /api/ai/chat
 */
export async function chat(req, res) {
    try {
        const { message } = req.body;
        const userId = req.user.id;

        if (!message || !message.trim()) {
            return res.status(400).json({ message: "Message is required" });
        }

        // Get full user profile
        const user = await User.findById(userId).select("-password");

        // Get available jobs for job-related queries
        let availableJobs = [];
        const lowerMessage = message.toLowerCase();
        const isJobQuery = lowerMessage.includes("job") || lowerMessage.includes("match") ||
            lowerMessage.includes("apply") || lowerMessage.includes("recommend");

        if (isJobQuery) {
            availableJobs = await Job.find({ status: "open" })
                .select("title location jobType category salaryRange")
                .limit(15)
                .lean();
        }

        // Build context
        const context = {
            role: user?.role || 'user',
            userName: user?.firstName || 'User',
            userProfile: {
                skills: user?.skills || [],
                experience: user?.experience || user?.internships || [],
                education: user?.currentEducation_degree || '',
                location: user?.city || ''
            },
            availableJobs: availableJobs.map(j => ({
                title: j.title,
                location: j.location,
                type: j.jobType
            }))
        };

        try {
            const response = await geminiService.chatWithAI(message, context);
            res.json({
                success: true,
                response,
                message: "Chat response generated"
            });
        } catch (aiError) {
            console.error("Gemini AI error (chat):", aiError);

            // Enhanced smart fallback responses for ANY question
            let fallbackResponse = "";
            const skills = context.userProfile.skills;
            const skillsText = skills.length > 0 ? skills.slice(0, 5).join(", ") : "your skills";

            // Detect intent from message
            const isGreeting = /^(hi|hello|hey|good morning|good evening|good afternoon|howdy|sup|what's up)/i.test(lowerMessage);
            const isJobQuery = lowerMessage.includes("job") || lowerMessage.includes("match") ||
                lowerMessage.includes("apply") || lowerMessage.includes("recommend") || lowerMessage.includes("career");
            const isResumeQuery = lowerMessage.includes("resume") || lowerMessage.includes("cv");
            const isInterviewQuery = lowerMessage.includes("interview");
            const isPlatformQuery = lowerMessage.includes("how") && (lowerMessage.includes("use") || lowerMessage.includes("navigate") ||
                lowerMessage.includes("find") || lowerMessage.includes("website") || lowerMessage.includes("platform"));
            const isThankYou = /thank|thanks|appreciate/i.test(lowerMessage);
            const isGoodbye = /bye|goodbye|see you|later/i.test(lowerMessage);
            const isHowAreYou = /how are you|how're you|how r u|how do you do/i.test(lowerMessage);
            const isWhatCanYouDo = /what can you do|help me|what are you|who are you|your capabilities/i.test(lowerMessage);

            if (isGreeting) {
                fallbackResponse = `Hello ${context.userName}! 👋\n\nGreat to see you! I'm JobBot, your AI assistant on Jobbe.\n\nI can help you with:\n• **Job Search** - Finding jobs that match your skills\n• **Resume Tips** - Improve your resume\n• **Interview Prep** - Get ready for interviews\n• **Platform Help** - Navigate the website\n• **General Questions** - Ask me anything!\n\nWhat would you like help with today?`;
            } else if (isThankYou) {
                fallbackResponse = `You're welcome, ${context.userName}! 😊\n\nI'm always here to help. Feel free to ask me anything else about your job search, career advice, or just chat!`;
            } else if (isGoodbye) {
                fallbackResponse = `Goodbye ${context.userName}! 👋\n\nBest of luck with your job search! Remember, I'm here 24/7 if you need any help. Take care!`;
            } else if (isHowAreYou) {
                fallbackResponse = `I'm doing great, thank you for asking! 😊\n\nI'm here and ready to help you with your career journey. How can I assist you today, ${context.userName}?`;
            } else if (isWhatCanYouDo) {
                fallbackResponse = `I'm JobBot, your intelligent AI career assistant! 🤖✨\n\n**Here's what I can help you with:**\n\n📝 **Career & Jobs**\n• Find jobs matching your skills\n• Career advice and guidance\n• Salary expectations\n\n📄 **Resume & Profile**\n• Resume writing tips\n• Profile optimization\n• Skills highlighting\n\n🎤 **Interview Prep**\n• Common interview questions\n• Industry-specific tips\n• Confidence building\n\n🌐 **Platform Navigation**\n• How to apply for jobs\n• Managing applications\n• Using features\n\n💬 **General Questions**\n• I can answer almost any question!\n\nJust type your question and I'll do my best to help!`;
            } else if (isJobQuery) {
                if (availableJobs.length > 0) {
                    fallbackResponse = `Great question about jobs, ${context.userName}! 🎯\n\n`;
                    if (skills.length > 0) {
                        fallbackResponse += `Based on your skills in **${skillsText}**, here are some opportunities:\n\n`;
                    } else {
                        fallbackResponse += `Here are some current openings:\n\n`;
                    }
                    availableJobs.slice(0, 5).forEach((job, i) => {
                        fallbackResponse += `${i + 1}. **${job.title}** - ${job.location || 'Flexible'}\n`;
                    });
                    fallbackResponse += `\n🔍 **Tip:** Use the "Find Jobs" feature on your dashboard for AI-powered matching!\n\nWant tips on how to apply or prepare for these roles?`;
                } else {
                    fallbackResponse = `I'd love to help you find jobs! 🎯\n\n`;
                    if (skills.length > 0) {
                        fallbackResponse += `With your skills in **${skillsText}**, you have great potential!\n\n`;
                    }
                    fallbackResponse += `**Here's what I recommend:**\n• Check out our Jobs page for current listings\n• Use the AI Job Matching feature on your dashboard\n• Set up job alerts for new opportunities\n\nWould you like resume tips or interview advice?`;
                }
            } else if (isResumeQuery) {
                fallbackResponse = `Resume tips coming right up! 📄✨\n\n`;
                if (skills.length > 0) {
                    fallbackResponse += `**Highlight your skills:** ${skillsText}\n\n`;
                }
                fallbackResponse += `**Essential Resume Tips:**\n\n✅ **Do's:**\n• Start with a compelling summary statement\n• Quantify achievements (numbers & percentages)\n• Tailor your resume for each job application\n• Use action verbs (Led, Developed, Implemented)\n• Keep it to 1-2 pages\n\n❌ **Don'ts:**\n• Don't use generic objectives\n• Avoid spelling/grammar errors\n• Don't include irrelevant experience\n\n💡 **Pro Tip:** Use our AI Resume Builder in your Profile section for personalized suggestions!\n\nWould you like more specific advice?`;
            } else if (isInterviewQuery) {
                fallbackResponse = `Let's get you interview-ready! 🎤💪\n\n`;
                if (skills.length > 0) {
                    fallbackResponse += `**For your skills (${skillsText}), prepare for:**\n`;
                    skills.slice(0, 3).forEach(s => {
                        fallbackResponse += `• Technical questions about ${s}\n`;
                    });
                    fallbackResponse += `\n`;
                }
                fallbackResponse += `**General Interview Tips:**\n\n📋 **Before the Interview:**\n• Research the company thoroughly\n• Prepare STAR stories (Situation, Task, Action, Result)\n• Practice common questions out loud\n• Prepare thoughtful questions to ask\n\n🎯 **During the Interview:**\n• Arrive 10-15 minutes early\n• Maintain eye contact and positive body language\n• Listen carefully before answering\n• Be specific with examples\n\n**Common Questions to Prepare:**\n• "Tell me about yourself"\n• "Why do you want this role?"\n• "What's your greatest strength/weakness?"\n\nWant tips on any specific type of interview?`;
            } else if (isPlatformQuery) {
                fallbackResponse = `I'll help you navigate Jobbe! 🧭\n\n**Quick Navigation Guide:**\n\n🏠 **Dashboard** (/dashboard/seeker)\n• View your profile, applications, saved jobs\n\n🔍 **Find Jobs** (/jobs)\n• Browse and search job listings\n• Filter by location, type, category\n\n📝 **Profile** (/profile/steps)\n• Complete your profile step by step\n• Add skills, experience, education\n• Use AI Resume Builder\n\n📋 **My Applications** (/my-applications)\n• Track all your job applications\n• See application status\n\n**Tips:**\n• Complete your profile for better job matches\n• Save interesting jobs to apply later\n• Enable notifications for updates\n\nWhat specific feature would you like help with?`;
            } else {
                // Generic helpful response for any other question
                fallbackResponse = `Great question, ${context.userName}! 💭\n\nI'm currently in a simplified mode, but I can still help you with:\n\n🎯 **Career & Jobs**\n• "What jobs match my skills?"\n• "How do I apply for jobs?"\n\n📄 **Resume Help**\n• "Give me resume tips"\n• "How to improve my resume?"\n\n🎤 **Interview Prep**\n• "Interview preparation tips"\n• "Common interview questions"\n\n🌐 **Platform Help**\n• "How do I use this website?"\n• "Where can I see my applications?"\n\nCould you try rephrasing your question, or pick one of these topics? I want to give you the best answer possible! 😊`;
            }

            res.json({
                success: true,
                response: fallbackResponse,
                message: "Chat response (smart fallback)"
            });
        }
    } catch (error) {
        console.error("AI Chat error:", error);
        res.status(500).json({ message: "Failed to process message", error: error.message });
    }
}
