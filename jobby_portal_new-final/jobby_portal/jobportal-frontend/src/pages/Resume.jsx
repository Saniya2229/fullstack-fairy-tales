import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiFileText, FiDownload, FiCheck, FiLoader } from "react-icons/fi";
import { getProfile } from "../api/user";
import { generateResumePdf, createResume, getMyResume } from "../api/resume";
import Loader from "../components/Loader";

export default function Resume() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [template, setTemplate] = useState("template1");
  const [headline, setHeadline] = useState("");
  const [summary, setSummary] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const profileData = await getProfile();
        setProfile(profileData);

        // Pre-fill from profile if available
        if (profileData.experience) {
          setExperience(profileData.experience);
        }
        if (profileData.education) {
          setEducation(profileData.education);
        }
        if (profileData.skills && Array.isArray(profileData.skills)) {
          setSkills(profileData.skills.join(", "));
        }

        // Try to load existing resume
        try {
          const existing = await getMyResume();
          if (existing) {
            setPdfUrl(existing.pdfUrl);
            setTemplate(existing.templateName || "template1");
          }
        } catch (e) {
          // ignore if no resume
        }
      } catch (err) {
        console.error("Failed to load profile for resume", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  async function handleGeneratePdf() {
    setGenerating(true);
    try {
      console.log("=== GENERATING RESUME ===");
      console.log("Profile data:", profile);

      const html = `
        <html>
          <head>
            <style>
              body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #333; line-height: 1.6; }
              h1 { color: #2d3748; margin-bottom: 5px; font-size: 28px; border-bottom: 2px solid #4c51bf; padding-bottom: 10px; }
              .headline { color: #718096; font-size: 18px; margin-bottom: 20px; }
              h3 { margin-top: 25px; color: #4c51bf; font-size: 18px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; }
              p { margin-bottom: 10px; }
              .section { margin-bottom: 20px; }
            </style>
          </head>
          <body>
            <h1>${profile?.firstName} ${profile?.lastName}</h1>
            <div class="headline">${headline}</div>
            
            <div class="section">
              <h3>Professional Summary</h3>
              <p>${summary || "No summary provided."}</p>
            </div>

            <div class="section">
              <h3>Skills</h3>
              <p>${skills || "No skills listed."}</p>
            </div>

            <div class="section">
              <h3>Experience</h3>
              <p>${experience ? experience.replace(/\n/g, "<br/>") : "No experience listed."}</p>
            </div>

            <div class="section">
              <h3>Education</h3>
              <p>${education ? education.replace(/\n/g, "<br/>") : "No education listed."}</p>
            </div>
            
            <div class="section">
              <h3>Contact</h3>
              <p>${profile?.email} | ${profile?.phone || ""}</p>
            </div>
          </body>
        </html>
      `;

      console.log("Calling generateResumePdf API...");
      const pdf = await generateResumePdf(html);
      console.log("PDF generated:", pdf);

      setPdfUrl(pdf.pdfUrl);

      console.log("Saving resume to database...");
      await createResume({
        template,
        headline,
        summary,
        skills: skills.split(",").map((s) => s.trim()),
        pdfUrl: pdf.pdfUrl,
      });

      alert("Resume generated successfully!");
    } catch (err) {
      console.error("=== RESUME GENERATION ERROR ===", err);
      console.error("Error response:", err.response?.data);
      console.error("Error message:", err.message);
      alert(`Failed to generate resume: ${err.response?.data?.message || err.message}`);
    } finally {
      setGenerating(false);
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Resume Builder</h1>
            <p className="text-gray-600 mt-1">Create a professional resume in seconds.</p>
          </div>
          {pdfUrl && (
            <motion.a
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              href={pdfUrl}
              target="_blank"
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 transition"
            >
              <FiDownload /> Download PDF
            </motion.a>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-2 space-y-6">

            {/* Template Selection */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiFileText className="text-purple-600" /> Select Template
              </h2>
              <div className="flex gap-4">
                <button
                  onClick={() => setTemplate("template1")}
                  className={`flex-1 p-4 border-2 rounded-lg text-center transition ${template === "template1" ? "border-purple-600 bg-purple-50 text-purple-700" : "border-gray-200 hover:border-purple-300"}`}
                >
                  Modern Clean
                </button>
                <button
                  onClick={() => setTemplate("template2")}
                  className={`flex-1 p-4 border-2 rounded-lg text-center transition ${template === "template2" ? "border-purple-600 bg-purple-50 text-purple-700" : "border-gray-200 hover:border-purple-300"}`}
                >
                  Professional
                </button>
              </div>
            </div>

            {/* Details Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-5">
              <h2 className="font-semibold text-gray-800 mb-2">Resume Details</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
                <input
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition"
                  placeholder="e.g. Software Engineer with 5 years experience"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Professional Summary</label>
                <textarea
                  className="w-full p-3 border rounded-lg h-28 focus:ring-2 focus:ring-purple-500 outline-none transition"
                  placeholder="Briefly describe your career goals and achievements..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                <input
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition"
                  placeholder="React, Node.js, Python (comma separated)"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Work Experience</label>
                <textarea
                  className="w-full p-3 border rounded-lg h-32 focus:ring-2 focus:ring-purple-500 outline-none transition"
                  placeholder="List your previous roles and responsibilities..."
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                <textarea
                  className="w-full p-3 border rounded-lg h-24 focus:ring-2 focus:ring-purple-500 outline-none transition"
                  placeholder="Degrees, colleges, and years..."
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                />
              </div>

              <div className="pt-4">
                <button
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold shadow-lg hover:opacity-90 transition flex items-center justify-center gap-2"
                  onClick={handleGeneratePdf}
                  disabled={generating}
                >
                  {generating ? <FiLoader className="animate-spin" /> : <FiCheck />}
                  {generating ? "Generating..." : "Generate Resume"}
                </button>
              </div>
            </div>
          </div>

          {/* Right: Preview / Tips */}
          <div className="space-y-6">
            <div className="bg-indigo-900 text-white p-6 rounded-xl shadow-lg">
              <h3 className="font-bold text-lg mb-2">Pro Tips</h3>
              <ul className="space-y-2 text-sm opacity-90">
                <li>• Keep your summary concise (2-3 sentences).</li>
                <li>• Use bullet points for experience.</li>
                <li>• Highlight quantifiable achievements.</li>
                <li>• Tailor your skills to the job description.</li>
              </ul>
            </div>

            {pdfUrl && (
              <div className="bg-white p-4 rounded-xl shadow border border-gray-200 text-center">
                <div className="text-gray-500 text-sm mb-4">Your resume is ready!</div>
                <iframe src={pdfUrl} className="w-full h-64 border rounded bg-gray-50" title="Resume Preview"></iframe>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
