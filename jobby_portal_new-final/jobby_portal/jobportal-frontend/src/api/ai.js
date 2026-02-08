// api/ai.js
import api from "./api";

/**
 * Generate AI Resume
 */
export const generateAIResume = async () => {
    const response = await api.post("/ai/resume/generate");
    return response.data;
};

/**
 * Score/Analyze Resume
 */
export const scoreResume = async (resumeText, targetRole = "") => {
    const response = await api.post("/ai/resume/score", { resumeText, targetRole });
    return response.data;
};

/**
 * Get AI Job Matches
 */
export const getAIJobMatches = async () => {
    const response = await api.post("/ai/jobs/match");
    return response.data;
};

/**
 * Generate Job Description
 */
export const generateJobDescription = async (jobInfo) => {
    const response = await api.post("/ai/job/description", jobInfo);
    return response.data;
};

/**
 * Rank Candidates for a Job
 */
export const rankCandidates = async (jobId) => {
    const response = await api.post("/ai/candidates/rank", { jobId });
    return response.data;
};

/**
 * Send Chat Message to AI
 */
export const sendChatMessage = async (message) => {
    const response = await api.post("/ai/chat", { message });
    return response.data;
};

export default {
    generateAIResume,
    scoreResume,
    getAIJobMatches,
    generateJobDescription,
    rankCandidates,
    sendChatMessage
};
