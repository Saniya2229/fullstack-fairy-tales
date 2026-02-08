// services/geminiService.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Generate a professional resume from user profile data
 */
export async function generateResume(profileData) {
    const prompt = `Generate a professional resume in JSON format for the following candidate:

Name: ${profileData.firstName} ${profileData.lastName}
Email: ${profileData.email}
Phone: ${profileData.phone || 'Not provided'}
Location: ${profileData.city || profileData.location || 'Not provided'}
Skills: ${(profileData.skills || []).join(', ') || 'Not provided'}
Education: ${profileData.currentEducation_degree || profileData.education || 'Not provided'}
College: ${profileData.currentEducation_college || 'Not provided'}
Experience: ${JSON.stringify(profileData.experience || profileData.internships || [])}
Bio: ${profileData.bio || profileData.summary || 'Not provided'}

Return ONLY valid JSON with this structure:
{
    "summary": "A compelling 2-3 sentence professional summary",
    "skills": ["skill1", "skill2", ...],
    "experience": [
        {
            "title": "Job Title",
            "company": "Company Name",
            "duration": "Start - End",
            "description": "Brief description of role and achievements"
        }
    ],
    "education": [
        {
            "degree": "Degree Name",
            "institution": "Institution Name",
            "year": "Year"
        }
    ],
    "certifications": ["cert1", "cert2"]
}`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Extract JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        throw new Error("Invalid JSON response");
    } catch (error) {
        console.error("Gemini generateResume error:", error);
        throw error;
    }
}

/**
 * Score and analyze a resume
 */
export async function scoreResume(resumeText, targetRole = "") {
    const prompt = `Analyze this resume and provide a detailed assessment:

Resume Content:
${resumeText}

${targetRole ? `Target Role: ${targetRole}` : ''}

Return ONLY valid JSON with this structure:
{
    "overallScore": 75,
    "sections": {
        "summary": { "score": 80, "feedback": "feedback text" },
        "experience": { "score": 70, "feedback": "feedback text" },
        "skills": { "score": 85, "feedback": "feedback text" },
        "education": { "score": 75, "feedback": "feedback text" },
        "formatting": { "score": 80, "feedback": "feedback text" }
    },
    "strengths": ["strength1", "strength2", "strength3"],
    "improvements": ["improvement1", "improvement2", "improvement3"],
    "tips": ["tip1", "tip2", "tip3"]
}`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        throw new Error("Invalid JSON response");
    } catch (error) {
        console.error("Gemini scoreResume error:", error);
        throw error;
    }
}

/**
 * Match jobs to user profile
 */
export async function matchJobs(userProfile, jobs) {
    const prompt = `Match the following candidate profile to these job listings and rank them by relevance.

Candidate Profile:
- Skills: ${(userProfile.skills || []).join(', ')}
- Experience: ${JSON.stringify(userProfile.experience || userProfile.internships || [])}
- Education: ${userProfile.currentEducation_degree || userProfile.education || 'Not specified'}
- Location: ${userProfile.city || userProfile.location || 'Flexible'}

Available Jobs:
${jobs.map((job, i) => `
${i + 1}. ID: ${job._id}
   Title: ${job.title}
   Company: ${job.company?.name || job.companyName || 'Company'}
   Location: ${job.location}
   Type: ${job.jobType}
   Skills Required: ${(job.skills || []).join(', ')}
   Description: ${(job.description || '').substring(0, 200)}
`).join('\n')}

Return ONLY valid JSON with this structure:
{
    "matches": [
        {
            "jobId": "job_id_string",
            "matchScore": 85,
            "matchReasons": ["reason1", "reason2"],
            "missingSkills": ["skill1"]
        }
    ]
}

Order by matchScore descending. Include top 10 matches.`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        throw new Error("Invalid JSON response");
    } catch (error) {
        console.error("Gemini matchJobs error:", error);
        throw error;
    }
}

/**
 * Generate a job description
 */
export async function generateJobDescription(jobInfo) {
    const prompt = `Generate a professional job description for the following position:

Title: ${jobInfo.title}
Company: ${jobInfo.company || 'Our Company'}
Location: ${jobInfo.location || 'Flexible'}
Job Type: ${jobInfo.jobType || 'Full-time'}
Experience Required: ${jobInfo.experience || 'Not specified'}
Skills Required: ${(jobInfo.skills || []).join(', ') || 'Not specified'}
Salary Range: ${jobInfo.salaryRange || 'Competitive'}
Additional Info: ${jobInfo.additionalInfo || ''}

Return ONLY valid JSON with this structure:
{
    "title": "Job Title",
    "summary": "2-3 sentence overview of the role",
    "responsibilities": ["responsibility1", "responsibility2", "responsibility3", "responsibility4", "responsibility5"],
    "requirements": ["requirement1", "requirement2", "requirement3", "requirement4"],
    "niceToHave": ["nice1", "nice2"],
    "benefits": ["benefit1", "benefit2", "benefit3"],
    "fullDescription": "A complete, professional job description paragraph"
}`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        throw new Error("Invalid JSON response");
    } catch (error) {
        console.error("Gemini generateJobDescription error:", error);
        throw error;
    }
}

/**
 * Rank candidates for a job
 */
export async function rankCandidates(jobDetails, candidates) {
    const prompt = `Rank these candidates for the following job position:

Job Details:
- Title: ${jobDetails.title}
- Required Skills: ${(jobDetails.skills || []).join(', ')}
- Experience Required: ${jobDetails.experience || 'Not specified'}
- Description: ${(jobDetails.description || '').substring(0, 300)}

Candidates:
${candidates.map((c, i) => `
${i + 1}. ID: ${c._id || c.id}
   Name: ${c.applicant?.firstName || c.firstName || 'Candidate'} ${c.applicant?.lastName || c.lastName || ''}
   Skills: ${(c.applicant?.skills || c.skills || []).join(', ')}
   Experience: ${JSON.stringify(c.applicant?.experience || c.experience || [])}
   Education: ${c.applicant?.currentEducation_degree || c.education || 'Not specified'}
`).join('\n')}

Return ONLY valid JSON with this structure:
{
    "rankings": [
        {
            "candidateId": "candidate_id_string",
            "rank": 1,
            "score": 92,
            "strengths": ["strength1", "strength2"],
            "concerns": ["concern1"],
            "recommendation": "Strong match - highly recommended for interview"
        }
    ]
}

Order by rank ascending (1 = best fit).`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        throw new Error("Invalid JSON response");
    } catch (error) {
        console.error("Gemini rankCandidates error:", error);
        throw error;
    }
}

/**
 * AI Chatbot for career assistance - Enhanced to handle ANY question
 */
export async function chatWithAI(message, context = {}) {
    const userProfile = context.userProfile || {};
    const availableJobs = context.availableJobs || [];

    const skillsList = Array.isArray(userProfile.skills) && userProfile.skills.length > 0
        ? userProfile.skills.join(", ")
        : "Not specified";

    let experienceText = "Not specified";
    if (Array.isArray(userProfile.experience) && userProfile.experience.length > 0) {
        experienceText = userProfile.experience.map(exp =>
            `${exp.title || exp.role || 'Role'} at ${exp.company || exp.organization || 'Company'}`
        ).join("; ");
    }

    let jobsContext = "";
    if (availableJobs.length > 0) {
        jobsContext = `\n\nCurrently Available Jobs on Platform:\n${availableJobs.slice(0, 10).map((job, i) =>
            `${i + 1}. ${job.title} - ${job.location || 'Flexible'} (${job.type || 'Full-time'})`
        ).join('\n')}`;
    }

    const systemPrompt = `You are JobBot, a helpful and intelligent AI assistant on a job portal called "Jobbe". You can answer ANY question the user asks - just like ChatGPT, Gemini, or Claude.

## Your Capabilities:
1. **General Knowledge**: Answer any general questions about technology, science, history, current events, etc.
2. **Career Guidance**: Provide personalized career advice, resume tips, interview preparation, salary negotiation
3. **Job Search Help**: Help users find jobs, explain job requirements, compare roles
4. **Website Navigation**: Guide users on how to use the Jobbe platform features
5. **Casual Conversation**: Respond to greetings, small talk, and casual questions naturally
6. **Problem Solving**: Help with coding questions, professional challenges, work-life balance

## About Jobbe Platform:
- Users can search and apply for jobs
- Job seekers can create profiles, upload resumes, track applications
- Employers can post jobs and manage applicants
- Features: AI Resume Builder, Job Matching, Application Tracking
- Navigation: Dashboard (/dashboard/seeker), Jobs (/jobs), Profile (/profile/steps), My Applications (/my-applications)

## Current User Context:
- Name: ${context.userName || 'User'}
- Role: ${context.role || 'job seeker'}
- Skills: ${skillsList}
- Experience: ${experienceText}
- Education: ${userProfile.education || 'Not specified'}
- Location: ${userProfile.location || 'Not specified'}
${jobsContext}

## Response Guidelines:
- Be warm, friendly, and conversational - like talking to a helpful friend
- Answer ANY question the user asks, not just job-related ones
- For career questions, give SPECIFIC advice based on their profile
- For general questions, provide accurate and helpful information
- Use the user's name occasionally to personalize
- Use markdown formatting for better readability (bold, bullets, etc.)
- Use emojis sparingly to add warmth 😊
- Keep responses concise but comprehensive
- If you genuinely don't know something, say so honestly
- For platform help, provide specific navigation paths

User Question: "${message}"

Provide a helpful, natural response:`;

    try {
        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini chatWithAI error:", error);
        throw error;
    }
}

export default {
    generateResume,
    scoreResume,
    matchJobs,
    generateJobDescription,
    rankCandidates,
    chatWithAI
};
