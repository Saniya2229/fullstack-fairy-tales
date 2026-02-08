// seed_india_jobs.js
// Run with: node seed_india_jobs.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import Job from "./models/Job.js";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://LilyPortal:3A79eSIAzjlo4yV8@test-pro-db.k4zb7.mongodb.net/jobportal";

// ============================================
// INDIA-BASED COMPANIES
// ============================================
const INDIA_COMPANIES = [
    { name: "Tata Consultancy Services", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg", email: "careers@tcs.com" },
    { name: "Infosys", logo: "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg", email: "jobs@infosys.com" },
    { name: "Wipro", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg", email: "careers@wipro.com" },
    { name: "HCL Technologies", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5e/HCL_Technologies_logo.svg", email: "jobs@hcl.com" },
    { name: "Tech Mahindra", logo: "https://upload.wikimedia.org/wikipedia/commons/8/84/Tech_Mahindra_Logo.svg", email: "careers@techmahindra.com" },
    { name: "Reliance Industries", logo: "https://upload.wikimedia.org/wikipedia/en/9/99/Reliance_Industries_Logo.svg", email: "jobs@ril.com" },
    { name: "HDFC Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg", email: "careers@hdfcbank.com" },
    { name: "ICICI Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/7/71/ICICI_Bank_Logo.svg", email: "jobs@icicibank.com" },
    { name: "Flipkart", logo: "https://upload.wikimedia.org/wikipedia/commons/4/49/Flipkart-Logo.svg", email: "careers@flipkart.com" },
    { name: "Zomato", logo: "https://upload.wikimedia.org/wikipedia/commons/7/75/Zomato_logo.png", email: "jobs@zomato.com" },
    { name: "Swiggy", logo: "https://upload.wikimedia.org/wikipedia/en/1/12/Swiggy_logo.svg", email: "careers@swiggy.in" },
    { name: "Paytm", logo: "https://upload.wikimedia.org/wikipedia/commons/4/42/Paytm_logo.png", email: "jobs@paytm.com" },
    { name: "PhonePe", logo: "https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg", email: "careers@phonepe.com" },
    { name: "Razorpay", logo: "https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg", email: "jobs@razorpay.com" },
    { name: "Ola", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4d/Ola_Cabs_logo.svg", email: "careers@olacabs.com" },
    { name: "Byju's", logo: "https://upload.wikimedia.org/wikipedia/commons/5/50/Byju%27s_logo.svg", email: "jobs@byjus.com" },
    { name: "Unacademy", logo: "https://upload.wikimedia.org/wikipedia/en/4/4f/Unacademy_logo.svg", email: "careers@unacademy.com" },
    { name: "Freshworks", logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/Freshworks_logo.svg", email: "jobs@freshworks.com" },
    { name: "Zoho", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Zoho_logo.svg", email: "careers@zohocorp.com" },
    { name: "Apollo Hospitals", logo: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Apollo_Hospitals_Logo.svg", email: "jobs@apollohospitals.com" },
];

const INDIA_CITIES = [
    "Bangalore, Karnataka", "Mumbai, Maharashtra", "Delhi NCR", "Hyderabad, Telangana",
    "Chennai, Tamil Nadu", "Pune, Maharashtra", "Kolkata, West Bengal", "Gurgaon, Haryana",
    "Noida, UP", "Ahmedabad, Gujarat", "Jaipur, Rajasthan", "Remote (India)"
];

// ============================================
// EXPANDED JOBS BY CATEGORY (FOR INDIA)
// ============================================
const INDIA_JOBS = {
    Design: [
        { title: "Senior Product Designer", salary: "₹25L - ₹40L/year", type: "Full-time" },
        { title: "UI Designer", salary: "₹12L - ₹20L/year", type: "Full-time" },
        { title: "UX Researcher", salary: "₹15L - ₹25L/year", type: "Full-time" },
        { title: "Visual Designer", salary: "₹10L - ₹18L/year", type: "Full-time" },
        { title: "Design Lead", salary: "₹35L - ₹55L/year", type: "Full-time" },
        { title: "Motion Designer", salary: "₹8L - ₹15L/year", type: "Freelance" },
        { title: "Brand Designer", salary: "₹12L - ₹22L/year", type: "Full-time" },
        { title: "Interaction Designer", salary: "₹18L - ₹30L/year", type: "Full-time" },
        { title: "Junior UI/UX Designer", salary: "₹6L - ₹10L/year", type: "Full-time" },
        { title: "Design System Specialist", salary: "₹20L - ₹35L/year", type: "Full-time" },
        { title: "Creative Director", salary: "₹40L - ₹70L/year", type: "Full-time" },
        { title: "Graphic Designer", salary: "₹5L - ₹10L/year", type: "Part-time" },
        { title: "Product Design Intern", salary: "₹25K - ₹40K/month", type: "Internship" },
        { title: "3D Designer", salary: "₹10L - ₹18L/year", type: "Full-time" },
        { title: "Design Operations Manager", salary: "₹25L - ₹45L/year", type: "Full-time" },
        { title: "Illustration Artist", salary: "₹8L - ₹15L/year", type: "Freelance" },
        { title: "Design Consultant", salary: "₹5K - ₹10K/hr", type: "Freelance" },
    ],
    Development: [
        { title: "Senior Software Engineer", salary: "₹25L - ₹45L/year", type: "Full-time" },
        { title: "Frontend Developer (React)", salary: "₹15L - ₹30L/year", type: "Full-time" },
        { title: "Backend Developer (Node.js)", salary: "₹18L - ₹35L/year", type: "Full-time" },
        { title: "Full Stack Developer", salary: "₹20L - ₹40L/year", type: "Full-time" },
        { title: "Mobile Developer (React Native)", salary: "₹15L - ₹28L/year", type: "Full-time" },
        { title: "iOS Developer (Swift)", salary: "₹18L - ₹35L/year", type: "Full-time" },
        { title: "Android Developer (Kotlin)", salary: "₹16L - ₹32L/year", type: "Full-time" },
        { title: "DevOps Engineer", salary: "₹20L - ₹40L/year", type: "Full-time" },
        { title: "Cloud Architect (AWS)", salary: "₹35L - ₹60L/year", type: "Full-time" },
        { title: "Data Engineer", salary: "₹22L - ₹45L/year", type: "Full-time" },
        { title: "Machine Learning Engineer", salary: "₹30L - ₹55L/year", type: "Full-time" },
        { title: "AI/ML Research Scientist", salary: "₹40L - ₹80L/year", type: "Full-time" },
        { title: "Security Engineer", salary: "₹25L - ₹50L/year", type: "Full-time" },
        { title: "Site Reliability Engineer", salary: "₹28L - ₹55L/year", type: "Full-time" },
        { title: "Junior Developer", salary: "₹6L - ₹12L/year", type: "Full-time" },
        { title: "Software Engineering Intern", salary: "₹30K - ₹60K/month", type: "Internship" },
        { title: "Principal Engineer", salary: "₹50L - ₹90L/year", type: "Full-time" },
        { title: "Tech Lead", salary: "₹35L - ₹60L/year", type: "Full-time" },
        { title: "Flutter Developer", salary: "₹12L - ₹25L/year", type: "Full-time" },
        { title: "Blockchain Developer", salary: "₹25L - ₹50L/year", type: "Full-time" },
        { title: "Python Developer", salary: "₹15L - ₹30L/year", type: "Full-time" },
        { title: "Java Developer", salary: "₹16L - ₹32L/year", type: "Full-time" },
    ],
    Marketing: [
        { title: "Digital Marketing Manager", salary: "₹18L - ₹30L/year", type: "Full-time" },
        { title: "Growth Marketing Lead", salary: "₹25L - ₹45L/year", type: "Full-time" },
        { title: "SEO Specialist", salary: "₹8L - ₹15L/year", type: "Full-time" },
        { title: "Content Marketing Manager", salary: "₹15L - ₹25L/year", type: "Full-time" },
        { title: "Social Media Manager", salary: "₹8L - ₹15L/year", type: "Full-time" },
        { title: "Performance Marketing Lead", salary: "₹20L - ₹35L/year", type: "Full-time" },
        { title: "Brand Manager", salary: "₹18L - ₹32L/year", type: "Full-time" },
        { title: "Product Marketing Manager", salary: "₹22L - ₹40L/year", type: "Full-time" },
        { title: "Marketing Analyst", salary: "₹12L - ₹22L/year", type: "Full-time" },
        { title: "Email Marketing Specialist", salary: "₹6L - ₹12L/year", type: "Full-time" },
        { title: "Influencer Marketing Lead", salary: "₹12L - ₹22L/year", type: "Full-time" },
        { title: "Content Writer", salary: "₹5L - ₹10L/year", type: "Part-time" },
        { title: "Marketing Intern", salary: "₹20K - ₹35K/month", type: "Internship" },
        { title: "Public Relations Manager", salary: "₹15L - ₹28L/year", type: "Full-time" },
        { title: "Creative Copywriter", salary: "₹8L - ₹16L/year", type: "Full-time" },
    ],
    Finance: [
        { title: "Financial Analyst", salary: "₹12L - ₹22L/year", type: "Full-time" },
        { title: "Investment Analyst", salary: "₹18L - ₹35L/year", type: "Full-time" },
        { title: "Senior Accountant", salary: "₹10L - ₹18L/year", type: "Full-time" },
        { title: "FP&A Manager", salary: "₹25L - ₹45L/year", type: "Full-time" },
        { title: "Tax Consultant", salary: "₹15L - ₹28L/year", type: "Full-time" },
        { title: "Risk Analyst", salary: "₹14L - ₹25L/year", type: "Full-time" },
        { title: "Chartered Accountant", salary: "₹12L - ₹25L/year", type: "Full-time" },
        { title: "Treasury Manager", salary: "₹22L - ₹40L/year", type: "Full-time" },
        { title: "Credit Analyst", salary: "₹10L - ₹18L/year", type: "Full-time" },
        { title: "Compliance Officer", salary: "₹15L - ₹28L/year", type: "Full-time" },
        { title: "Finance Manager", salary: "₹25L - ₹45L/year", type: "Full-time" },
        { title: "Accounts Payable Lead", salary: "₹8L - ₹14L/year", type: "Full-time" },
        { title: "Junior Accountant", salary: "₹4L - ₹7L/year", type: "Full-time" },
        { title: "Finance Intern", salary: "₹20K - ₹35K/month", type: "Internship" },
    ],
    Healthcare: [
        { title: "Medical Officer", salary: "₹12L - ₹25L/year", type: "Full-time" },
        { title: "Healthcare Data Analyst", salary: "₹10L - ₹20L/year", type: "Full-time" },
        { title: "Clinical Research Coordinator", salary: "₹8L - ₹15L/year", type: "Full-time" },
        { title: "Pharmacist", salary: "₹6L - ₹12L/year", type: "Full-time" },
        { title: "Healthcare Product Manager", salary: "₹25L - ₹45L/year", type: "Full-time" },
        { title: "Nursing Supervisor", salary: "₹8L - ₹15L/year", type: "Full-time" },
        { title: "Hospital Administrator", salary: "₹18L - ₹35L/year", type: "Full-time" },
        { title: "Medical Coder", salary: "₹4L - ₹8L/year", type: "Part-time" },
        { title: "Health Informatics Specialist", salary: "₹12L - ₹22L/year", type: "Full-time" },
        { title: "Biomedical Engineer", salary: "₹10L - ₹20L/year", type: "Full-time" },
        { title: "Healthcare Consultant", salary: "₹20L - ₹40L/year", type: "Full-time" },
        { title: "Lab Technician", salary: "₹3L - ₹6L/year", type: "Full-time" },
        { title: "Physiotherapist", salary: "₹5L - ₹12L/year", type: "Full-time" },
    ],
    Sales: [
        { title: "Account Executive", salary: "₹10L - ₹20L/year + OTE", type: "Full-time" },
        { title: "Enterprise Sales Manager", salary: "₹30L - ₹55L/year + OTE", type: "Full-time" },
        { title: "Sales Development Rep", salary: "₹6L - ₹12L/year + OTE", type: "Full-time" },
        { title: "Regional Sales Head", salary: "₹40L - ₹70L/year + OTE", type: "Full-time" },
        { title: "Customer Success Manager", salary: "₹15L - ₹28L/year", type: "Full-time" },
        { title: "Business Development Manager", salary: "₹18L - ₹35L/year", type: "Full-time" },
        { title: "Inside Sales Representative", salary: "₹5L - ₹10L/year + OTE", type: "Full-time" },
        { title: "Sales Engineer", salary: "₹18L - ₹35L/year", type: "Full-time" },
        { title: "Key Account Manager", salary: "₹20L - ₹40L/year", type: "Full-time" },
        { title: "Sales Operations Lead", salary: "₹15L - ₹28L/year", type: "Full-time" },
        { title: "Channel Partner Manager", salary: "₹18L - ₹32L/year", type: "Full-time" },
        { title: "Pre-Sales Consultant", salary: "₹14L - ₹26L/year", type: "Full-time" },
        { title: "Territory Sales Manager", salary: "₹12L - ₹25L/year + OTE", type: "Full-time" },
        { title: "Sales Intern", salary: "₹15K - ₹25K/month", type: "Internship" },
        { title: "Retail Sales Associate", salary: "₹3L - ₹5L/year", type: "Part-time" },
        { title: "Telesales Executive", salary: "₹4L - ₹8L/year + OTE", type: "Full-time" },
    ],
    Engineering: [
        { title: "Mechanical Engineer", salary: "₹8L - ₹18L/year", type: "Full-time" },
        { title: "Civil Engineer", salary: "₹7L - ₹15L/year", type: "Full-time" },
        { title: "Electrical Engineer", salary: "₹8L - ₹18L/year", type: "Full-time" },
        { title: "Electronics Engineer", salary: "₹10L - ₹22L/year", type: "Full-time" },
        { title: "Robotics Engineer", salary: "₹18L - ₹35L/year", type: "Full-time" },
        { title: "Automation Engineer", salary: "₹12L - ₹25L/year", type: "Full-time" },
        { title: "Project Engineer", salary: "₹10L - ₹22L/year", type: "Full-time" },
        { title: "Quality Engineer", salary: "₹8L - ₹16L/year", type: "Full-time" },
        { title: "Manufacturing Engineer", salary: "₹9L - ₹18L/year", type: "Full-time" },
        { title: "Design Engineer (CAD)", salary: "₹7L - ₹14L/year", type: "Full-time" },
        { title: "Test Engineer", salary: "₹8L - ₹16L/year", type: "Full-time" },
        { title: "Systems Engineer", salary: "₹12L - ₹25L/year", type: "Full-time" },
        { title: "R&D Engineer", salary: "₹15L - ₹30L/year", type: "Full-time" },
        { title: "Hardware Engineer", salary: "₹12L - ₹25L/year", type: "Full-time" },
        { title: "Graduate Engineer Trainee", salary: "₹4L - ₹7L/year", type: "Full-time" },
    ],
    HR: [
        { title: "HR Business Partner", salary: "₹18L - ₹35L/year", type: "Full-time" },
        { title: "Talent Acquisition Lead", salary: "₹15L - ₹28L/year", type: "Full-time" },
        { title: "Technical Recruiter", salary: "₹10L - ₹20L/year", type: "Full-time" },
        { title: "HR Manager", salary: "₹18L - ₹32L/year", type: "Full-time" },
        { title: "Learning & Development Manager", salary: "₹20L - ₹38L/year", type: "Full-time" },
        { title: "Compensation & Benefits Lead", salary: "₹18L - ₹32L/year", type: "Full-time" },
        { title: "HR Generalist", salary: "₹8L - ₹15L/year", type: "Full-time" },
        { title: "Employee Engagement Lead", salary: "₹12L - ₹22L/year", type: "Full-time" },
        { title: "HRIS Analyst", salary: "₹10L - ₹18L/year", type: "Full-time" },
        { title: "Payroll Specialist", salary: "₹6L - ₹12L/year", type: "Full-time" },
        { title: "HR Coordinator", salary: "₹5L - ₹9L/year", type: "Full-time" },
        { title: "Diversity & Inclusion Lead", salary: "₹18L - ₹35L/year", type: "Full-time" },
        { title: "Campus Recruiter", salary: "₹8L - ₹14L/year", type: "Full-time" },
        { title: "HR Intern", salary: "₹15K - ₹25K/month", type: "Internship" },
    ],
};

// ============================================
// SEED FUNCTION
// ============================================
const seed = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("password123", salt);

        let totalJobsCreated = 0;

        for (const [category, jobs] of Object.entries(INDIA_JOBS)) {
            console.log(`\n📂 Processing category: ${category} (${jobs.length} jobs)`);

            for (let i = 0; i < jobs.length; i++) {
                const jobData = jobs[i];
                const company = INDIA_COMPANIES[i % INDIA_COMPANIES.length];
                const city = INDIA_CITIES[i % INDIA_CITIES.length];

                // Find or create employer
                let employer = await User.findOne({ email: company.email });
                if (!employer) {
                    employer = await User.create({
                        firstName: company.name.split(" ")[0],
                        lastName: "Careers",
                        email: company.email,
                        password: hashedPassword,
                        role: "employer",
                        companyName: company.name,
                        companyLogo: company.logo,
                        companyDescription: `${company.name} is one of India's leading companies, known for innovation and excellence.`,
                    });
                    console.log(`   👔 Created employer: ${company.name}`);
                }

                // Create job
                await Job.create({
                    employer: employer._id,
                    title: jobData.title,
                    description: `Join ${company.name} as a ${jobData.title}. We offer competitive compensation, excellent benefits, and opportunities for growth in a dynamic environment.`,
                    location: city,
                    salaryRange: jobData.salary,
                    jobType: jobData.type,
                    category: category,
                    qualifications: [
                        "Bachelor's degree or equivalent experience",
                        "Excellent communication skills",
                        "Relevant industry experience preferred"
                    ],
                    responsibilities: [
                        "Collaborate with cross-functional teams",
                        "Deliver high-quality work on time",
                        "Contribute to team and company goals"
                    ],
                    status: "open",
                });
                totalJobsCreated++;
            }
        }

        console.log(`\n🎉 Added ${totalJobsCreated} India-based jobs!`);

        // Verify counts
        console.log("\n📊 Updated job counts by category:");
        for (const category of Object.keys(INDIA_JOBS)) {
            const count = await Job.countDocuments({ category });
            console.log(`   ${category}: ${count} jobs`);
        }

        process.exit(0);
    } catch (err) {
        console.error("❌ Error:", err);
        process.exit(1);
    }
};

seed();
