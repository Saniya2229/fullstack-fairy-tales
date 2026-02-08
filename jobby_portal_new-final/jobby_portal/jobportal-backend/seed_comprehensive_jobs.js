// seed_comprehensive_jobs.js
// Run with: node seed_comprehensive_jobs.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import Job from "./models/Job.js";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://LilyPortal:3A79eSIAzjlo4yV8@test-pro-db.k4zb7.mongodb.net/jobportal";

// ============================================
// REAL COMPANIES DATA
// ============================================
const COMPANIES = [
    // Tech Giants
    { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg", email: "careers@google.com", website: "https://careers.google.com", linkedin: "https://www.linkedin.com/company/google" },
    { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg", email: "jobs@microsoft.com", website: "https://careers.microsoft.com", linkedin: "https://www.linkedin.com/company/microsoft" },
    { name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg", email: "careers@apple.com", website: "https://www.apple.com/careers", linkedin: "https://www.linkedin.com/company/apple" },
    { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", email: "jobs@amazon.com", website: "https://www.amazon.jobs", linkedin: "https://www.linkedin.com/company/amazon" },
    { name: "Meta", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg", email: "careers@meta.com", website: "https://www.metacareers.com", linkedin: "https://www.linkedin.com/company/meta" },
    // Startups & Tech
    { name: "Stripe", logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg", email: "jobs@stripe.com", website: "https://stripe.com/jobs", linkedin: "https://www.linkedin.com/company/stripe" },
    { name: "Airbnb", logo: "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg", email: "careers@airbnb.com", website: "https://careers.airbnb.com", linkedin: "https://www.linkedin.com/company/airbnb" },
    { name: "Spotify", logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg", email: "jobs@spotify.com", website: "https://www.lifeatspotify.com", linkedin: "https://www.linkedin.com/company/spotify" },
    { name: "Netflix", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg", email: "careers@netflix.com", website: "https://jobs.netflix.com", linkedin: "https://www.linkedin.com/company/netflix" },
    { name: "Uber", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.svg", email: "jobs@uber.com", website: "https://www.uber.com/careers", linkedin: "https://www.linkedin.com/company/uber-com" },
    // Design Companies
    { name: "Figma", logo: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg", email: "careers@figma.com", website: "https://www.figma.com/careers", linkedin: "https://www.linkedin.com/company/figma" },
    { name: "Adobe", logo: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Adobe_Corporate_logo.svg", email: "jobs@adobe.com", website: "https://www.adobe.com/careers", linkedin: "https://www.linkedin.com/company/adobe" },
    { name: "Canva", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg", email: "careers@canva.com", website: "https://www.canva.com/careers", linkedin: "https://www.linkedin.com/company/canva" },
    // Finance
    { name: "Goldman Sachs", logo: "https://upload.wikimedia.org/wikipedia/commons/6/61/Goldman_Sachs.svg", email: "careers@gs.com", website: "https://www.goldmansachs.com/careers", linkedin: "https://www.linkedin.com/company/goldman-sachs" },
    { name: "JPMorgan Chase", logo: "https://upload.wikimedia.org/wikipedia/commons/a/af/J_P_Morgan_Logo_2008_1.svg", email: "jobs@jpmorgan.com", website: "https://careers.jpmorgan.com", linkedin: "https://www.linkedin.com/company/jpmorgan" },
    // Healthcare
    { name: "Johnson & Johnson", logo: "https://upload.wikimedia.org/wikipedia/commons/2/22/Johnson_and_Johnson_Logo.svg", email: "jobs@jnj.com", website: "https://www.careers.jnj.com", linkedin: "https://www.linkedin.com/company/johnson-&-johnson" },
    { name: "Pfizer", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Pfizer_%282021%29.svg", email: "careers@pfizer.com", website: "https://www.pfizer.com/about/careers", linkedin: "https://www.linkedin.com/company/pfizer" },
    // Sales
    { name: "Salesforce", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg", email: "jobs@salesforce.com", website: "https://www.salesforce.com/company/careers", linkedin: "https://www.linkedin.com/company/salesforce" },
    { name: "HubSpot", logo: "https://upload.wikimedia.org/wikipedia/commons/3/3f/HubSpot_Logo.svg", email: "careers@hubspot.com", website: "https://www.hubspot.com/careers", linkedin: "https://www.linkedin.com/company/hubspot" },
];

// ============================================
// COMPREHENSIVE JOB LISTINGS BY CATEGORY
// ============================================
const JOBS_BY_CATEGORY = {
    Design: [
        { title: "Senior UI Designer", type: "Full-time", location: "San Francisco, CA", salary: "$120k - $160k", desc: "Lead UI design for our flagship products. Create beautiful, intuitive interfaces that delight millions of users." },
        { title: "UX Researcher", type: "Full-time", location: "New York, NY", salary: "$100k - $130k", desc: "Conduct user research and usability testing. Transform insights into actionable design recommendations." },
        { title: "Product Designer", type: "Full-time", location: "Remote", salary: "$110k - $150k", desc: "End-to-end product design from concept to launch. Work with cross-functional teams to ship world-class products." },
        { title: "Visual Designer", type: "Full-time", location: "Los Angeles, CA", salary: "$90k - $120k", desc: "Create stunning visual designs for marketing campaigns and brand materials." },
        { title: "Motion Graphics Designer", type: "Freelance", location: "Remote", salary: "$75/hr", desc: "Design engaging animations and motion graphics for digital products and marketing." },
        { title: "Design Systems Lead", type: "Full-time", location: "Seattle, WA", salary: "$140k - $180k", desc: "Build and maintain scalable design systems. Ensure consistency across all product touchpoints." },
        { title: "Brand Designer", type: "Full-time", location: "Austin, TX", salary: "$85k - $110k", desc: "Shape and evolve brand identity. Create guidelines and assets that tell our story." },
        { title: "Interaction Designer", type: "Full-time", location: "Boston, MA", salary: "$105k - $135k", desc: "Design micro-interactions and user flows that make products intuitive and delightful." },
        { title: "Design Director", type: "Full-time", location: "San Francisco, CA", salary: "$180k - $250k", desc: "Lead design strategy and vision. Mentor designers and shape the future of our products." },
        { title: "Junior UI/UX Designer", type: "Full-time", location: "Chicago, IL", salary: "$65k - $85k", desc: "Entry-level position for passionate designers. Learn from senior designers while contributing to real projects." },
        { title: "Graphic Designer", type: "Part-time", location: "Remote", salary: "$35/hr", desc: "Create graphics for social media, presentations, and marketing materials." },
        { title: "3D Designer", type: "Freelance", location: "Remote", salary: "$80/hr", desc: "Design 3D assets and environments for immersive digital experiences." },
    ],
    Development: [
        { title: "Senior Frontend Engineer", type: "Full-time", location: "San Francisco, CA", salary: "$150k - $200k", desc: "Build performant React applications at scale. Lead frontend architecture decisions." },
        { title: "Backend Engineer (Node.js)", type: "Full-time", location: "Remote", salary: "$140k - $180k", desc: "Design and implement scalable APIs and microservices. Work with MongoDB, Redis, and AWS." },
        { title: "Full Stack Developer", type: "Full-time", location: "New York, NY", salary: "$130k - $170k", desc: "End-to-end development from database to UI. React, Node.js, and PostgreSQL experience required." },
        { title: "iOS Developer", type: "Full-time", location: "Cupertino, CA", salary: "$145k - $190k", desc: "Build beautiful iOS apps using Swift and SwiftUI. Work on apps used by millions." },
        { title: "Android Developer", type: "Full-time", location: "Mountain View, CA", salary: "$140k - $185k", desc: "Develop Android applications using Kotlin and Jetpack Compose." },
        { title: "DevOps Engineer", type: "Full-time", location: "Seattle, WA", salary: "$135k - $175k", desc: "Build and maintain CI/CD pipelines. Kubernetes, Docker, and Terraform expertise." },
        { title: "Machine Learning Engineer", type: "Full-time", location: "Boston, MA", salary: "$160k - $220k", desc: "Develop ML models and deploy them to production. Python, TensorFlow, and PyTorch." },
        { title: "Data Engineer", type: "Full-time", location: "Austin, TX", salary: "$130k - $170k", desc: "Build data pipelines and infrastructure. Spark, Airflow, and data warehouse experience." },
        { title: "Security Engineer", type: "Full-time", location: "Washington, DC", salary: "$145k - $190k", desc: "Ensure application and infrastructure security. Conduct security audits and penetration testing." },
        { title: "React Native Developer", type: "Freelance", location: "Remote", salary: "$90/hr", desc: "Build cross-platform mobile apps with React Native. Experience with Expo preferred." },
        { title: "Junior Software Developer", type: "Full-time", location: "Denver, CO", salary: "$70k - $90k", desc: "Entry-level role for passionate developers. Mentorship and growth opportunities." },
        { title: "Cloud Architect", type: "Full-time", location: "Remote", salary: "$170k - $230k", desc: "Design cloud-native architectures on AWS/GCP. Lead cloud migration initiatives." },
    ],
    Marketing: [
        { title: "Growth Marketing Manager", type: "Full-time", location: "San Francisco, CA", salary: "$120k - $160k", desc: "Drive user acquisition and retention strategies. A/B testing and data-driven marketing." },
        { title: "Content Marketing Specialist", type: "Full-time", location: "New York, NY", salary: "$75k - $95k", desc: "Create compelling content that drives engagement. Blog posts, whitepapers, and social media." },
        { title: "SEO Manager", type: "Full-time", location: "Remote", salary: "$90k - $120k", desc: "Develop and execute SEO strategies. Technical SEO, content optimization, and link building." },
        { title: "Social Media Manager", type: "Full-time", location: "Los Angeles, CA", salary: "$70k - $90k", desc: "Manage social media presence across platforms. Create engaging content and grow community." },
        { title: "Email Marketing Specialist", type: "Full-time", location: "Chicago, IL", salary: "$65k - $85k", desc: "Design and execute email campaigns. Marketing automation and lifecycle marketing." },
        { title: "Product Marketing Manager", type: "Full-time", location: "Seattle, WA", salary: "$130k - $170k", desc: "Lead go-to-market strategies for new products. Competitive analysis and positioning." },
        { title: "Brand Marketing Manager", type: "Full-time", location: "Austin, TX", salary: "$100k - $130k", desc: "Shape brand strategy and storytelling. Campaign development and brand partnerships." },
        { title: "Performance Marketing Lead", type: "Full-time", location: "Remote", salary: "$110k - $145k", desc: "Manage paid acquisition channels. Google Ads, Facebook Ads, and programmatic advertising." },
        { title: "Marketing Analyst", type: "Full-time", location: "Boston, MA", salary: "$80k - $105k", desc: "Analyze marketing performance and ROI. Build dashboards and provide insights." },
        { title: "Content Writer", type: "Part-time", location: "Remote", salary: "$40/hr", desc: "Write engaging blog posts, articles, and marketing copy." },
        { title: "Influencer Marketing Coordinator", type: "Full-time", location: "Miami, FL", salary: "$55k - $75k", desc: "Manage influencer partnerships and campaigns. Build relationships with creators." },
    ],
    Finance: [
        { title: "Financial Analyst", type: "Full-time", location: "New York, NY", salary: "$90k - $120k", desc: "Financial modeling and analysis. Support strategic decision-making with data-driven insights." },
        { title: "Investment Banking Associate", type: "Full-time", location: "New York, NY", salary: "$150k - $200k", desc: "M&A and capital markets transactions. Financial analysis and client presentations." },
        { title: "Senior Accountant", type: "Full-time", location: "Chicago, IL", salary: "$80k - $100k", desc: "Manage financial reporting and audits. GAAP compliance and month-end close." },
        { title: "FP&A Manager", type: "Full-time", location: "San Francisco, CA", salary: "$130k - $170k", desc: "Lead financial planning and analysis. Budgeting, forecasting, and strategic planning." },
        { title: "Tax Manager", type: "Full-time", location: "Dallas, TX", salary: "$110k - $140k", desc: "Manage tax compliance and planning. Federal, state, and international tax matters." },
        { title: "Risk Analyst", type: "Full-time", location: "Boston, MA", salary: "$85k - $115k", desc: "Assess and monitor financial risks. Develop risk models and mitigation strategies." },
        { title: "Portfolio Manager", type: "Full-time", location: "New York, NY", salary: "$180k - $300k", desc: "Manage investment portfolios. Equity research and asset allocation strategies." },
        { title: "Corporate Finance Manager", type: "Full-time", location: "Seattle, WA", salary: "$120k - $160k", desc: "Capital allocation and treasury management. Support M&A and financing activities." },
        { title: "Credit Analyst", type: "Full-time", location: "Charlotte, NC", salary: "$70k - $95k", desc: "Analyze creditworthiness of borrowers. Prepare credit reports and recommendations." },
        { title: "Junior Financial Analyst", type: "Full-time", location: "Atlanta, GA", salary: "$60k - $75k", desc: "Entry-level finance role. Learn financial modeling and analysis from senior analysts." },
        { title: "Compliance Officer", type: "Full-time", location: "Washington, DC", salary: "$100k - $130k", desc: "Ensure regulatory compliance. Monitor policies and conduct compliance reviews." },
    ],
    Healthcare: [
        { title: "Clinical Research Coordinator", type: "Full-time", location: "Boston, MA", salary: "$65k - $85k", desc: "Coordinate clinical trials. Patient recruitment, data collection, and regulatory compliance." },
        { title: "Healthcare Data Analyst", type: "Full-time", location: "Remote", salary: "$80k - $110k", desc: "Analyze healthcare data to improve patient outcomes. SQL, Python, and healthcare informatics." },
        { title: "Registered Nurse (RN)", type: "Full-time", location: "Los Angeles, CA", salary: "$85k - $120k", desc: "Provide direct patient care. Assessment, medication administration, and patient education." },
        { title: "Medical Science Liaison", type: "Full-time", location: "San Francisco, CA", salary: "$150k - $200k", desc: "Bridge between medical affairs and healthcare providers. Present scientific data and research." },
        { title: "Healthcare Product Manager", type: "Full-time", location: "New York, NY", salary: "$130k - $170k", desc: "Lead healthcare product development. Understanding of healthcare regulations required." },
        { title: "Pharmacy Manager", type: "Full-time", location: "Chicago, IL", salary: "$130k - $160k", desc: "Manage pharmacy operations. Staff supervision, inventory management, and patient counseling." },
        { title: "Health Informatics Specialist", type: "Full-time", location: "Seattle, WA", salary: "$90k - $120k", desc: "Implement and optimize health IT systems. EHR management and data interoperability." },
        { title: "Biomedical Engineer", type: "Full-time", location: "Boston, MA", salary: "$95k - $130k", desc: "Design medical devices and equipment. R&D and regulatory submissions." },
        { title: "Healthcare Consultant", type: "Full-time", location: "Remote", salary: "$110k - $150k", desc: "Advise healthcare organizations on strategy, operations, and technology." },
        { title: "Mental Health Counselor", type: "Full-time", location: "Denver, CO", salary: "$55k - $75k", desc: "Provide mental health services. Individual and group therapy sessions." },
        { title: "Medical Coder", type: "Part-time", location: "Remote", salary: "$30/hr", desc: "Assign medical codes for diagnoses and procedures. ICD-10 and CPT coding." },
    ],
    Sales: [
        { title: "Account Executive", type: "Full-time", location: "San Francisco, CA", salary: "$80k - $120k + OTE", desc: "Manage full sales cycle. Prospect, demo, negotiate, and close enterprise deals." },
        { title: "Sales Development Rep (SDR)", type: "Full-time", location: "New York, NY", salary: "$55k - $75k + OTE", desc: "Generate qualified leads through outbound prospecting. Cold calling and email outreach." },
        { title: "Enterprise Sales Manager", type: "Full-time", location: "Chicago, IL", salary: "$150k - $200k + OTE", desc: "Lead enterprise sales team. Strategic account management and quota attainment." },
        { title: "Customer Success Manager", type: "Full-time", location: "Remote", salary: "$90k - $120k", desc: "Ensure customer satisfaction and retention. Onboarding, training, and upselling." },
        { title: "Sales Engineer", type: "Full-time", location: "Seattle, WA", salary: "$120k - $160k", desc: "Technical pre-sales support. Product demos and proof-of-concept implementations." },
        { title: "Business Development Manager", type: "Full-time", location: "Austin, TX", salary: "$100k - $140k", desc: "Identify and pursue new business opportunities. Partnership development." },
        { title: "Regional Sales Director", type: "Full-time", location: "Dallas, TX", salary: "$180k - $250k + OTE", desc: "Lead regional sales team. Revenue forecasting and territory planning." },
        { title: "Inside Sales Representative", type: "Full-time", location: "Boston, MA", salary: "$50k - $70k + OTE", desc: "Close deals remotely via phone and video. SMB and mid-market focus." },
        { title: "Channel Partner Manager", type: "Full-time", location: "Remote", salary: "$110k - $145k", desc: "Manage partner relationships. Enable partners to sell and implement our solutions." },
        { title: "Sales Operations Analyst", type: "Full-time", location: "San Francisco, CA", salary: "$85k - $110k", desc: "Optimize sales processes and reporting. Salesforce administration and analytics." },
        { title: "Retail Sales Associate", type: "Part-time", location: "Multiple Locations", salary: "$18/hr + Commission", desc: "Customer-facing retail sales. Product knowledge and customer service." },
    ],
    Engineering: [
        { title: "Mechanical Engineer", type: "Full-time", location: "Detroit, MI", salary: "$90k - $120k", desc: "Design mechanical systems and components. CAD modeling and prototyping." },
        { title: "Electrical Engineer", type: "Full-time", location: "San Jose, CA", salary: "$100k - $140k", desc: "Design electrical systems and circuits. PCB design and power electronics." },
        { title: "Civil Engineer", type: "Full-time", location: "Houston, TX", salary: "$85k - $115k", desc: "Design and oversee construction projects. Structural analysis and site planning." },
        { title: "Aerospace Engineer", type: "Full-time", location: "Seattle, WA", salary: "$110k - $150k", desc: "Design aircraft and spacecraft systems. Aerodynamics and propulsion systems." },
        { title: "Chemical Engineer", type: "Full-time", location: "Philadelphia, PA", salary: "$95k - $130k", desc: "Design chemical processes and equipment. Process optimization and safety." },
        { title: "Environmental Engineer", type: "Full-time", location: "Denver, CO", salary: "$80k - $110k", desc: "Develop solutions for environmental challenges. Sustainability and compliance." },
        { title: "Robotics Engineer", type: "Full-time", location: "Boston, MA", salary: "$120k - $160k", desc: "Design and program robotic systems. ROS, computer vision, and motion planning." },
        { title: "Systems Engineer", type: "Full-time", location: "Washington, DC", salary: "$115k - $155k", desc: "Design complex systems. Requirements analysis and system integration." },
        { title: "Quality Engineer", type: "Full-time", location: "Austin, TX", salary: "$85k - $115k", desc: "Ensure product quality. Testing, inspection, and quality management systems." },
        { title: "Manufacturing Engineer", type: "Full-time", location: "Cleveland, OH", salary: "$80k - $105k", desc: "Optimize manufacturing processes. Lean manufacturing and process improvement." },
        { title: "Hardware Engineer", type: "Full-time", location: "San Francisco, CA", salary: "$130k - $175k", desc: "Design hardware for consumer electronics. Embedded systems and firmware." },
    ],
    HR: [
        { title: "HR Business Partner", type: "Full-time", location: "San Francisco, CA", salary: "$110k - $145k", desc: "Strategic HR support for business units. Employee relations and talent strategy." },
        { title: "Talent Acquisition Specialist", type: "Full-time", location: "New York, NY", salary: "$75k - $100k", desc: "Full-cycle recruiting. Source, screen, and hire top talent." },
        { title: "HR Manager", type: "Full-time", location: "Chicago, IL", salary: "$95k - $125k", desc: "Lead HR operations. Policies, compliance, and employee programs." },
        { title: "Compensation & Benefits Analyst", type: "Full-time", location: "Remote", salary: "$80k - $105k", desc: "Administer compensation and benefits programs. Market analysis and benchmarking." },
        { title: "Learning & Development Manager", type: "Full-time", location: "Seattle, WA", salary: "$100k - $135k", desc: "Design and deliver training programs. Leadership development and onboarding." },
        { title: "HR Coordinator", type: "Full-time", location: "Austin, TX", salary: "$50k - $65k", desc: "Support HR operations. Onboarding, HRIS administration, and employee inquiries." },
        { title: "Diversity & Inclusion Manager", type: "Full-time", location: "Los Angeles, CA", salary: "$110k - $145k", desc: "Lead D&I initiatives. Build inclusive workplace culture and programs." },
        { title: "Employee Experience Manager", type: "Full-time", location: "Remote", salary: "$90k - $120k", desc: "Design programs to improve employee engagement. Surveys, events, and culture." },
        { title: "Technical Recruiter", type: "Full-time", location: "San Francisco, CA", salary: "$90k - $130k", desc: "Recruit software engineers and technical talent. Strong tech industry knowledge." },
        { title: "Payroll Specialist", type: "Full-time", location: "Dallas, TX", salary: "$55k - $70k", desc: "Process payroll and maintain records. Tax compliance and benefits administration." },
        { title: "HR Analytics Specialist", type: "Full-time", location: "Boston, MA", salary: "$85k - $115k", desc: "Analyze HR data to drive insights. Dashboards, reporting, and predictive analytics." },
    ],
};

// ============================================
// SEED FUNCTION
// ============================================
const seed = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB");

        // Clear existing jobs (optional - comment out if you want to keep existing data)
        await Job.deleteMany({});
        console.log("🗑️  Cleared existing jobs");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("password123", salt);

        let totalJobsCreated = 0;

        // For each category, assign jobs to companies
        for (const [category, jobs] of Object.entries(JOBS_BY_CATEGORY)) {
            console.log(`\n📂 Processing category: ${category}`);

            for (let i = 0; i < jobs.length; i++) {
                const jobData = jobs[i];
                // Round-robin assign companies
                const company = COMPANIES[i % COMPANIES.length];

                // Find or create/update employer
                let employer = await User.findOne({ email: company.email });
                if (!employer) {
                    employer = await User.create({
                        firstName: company.name,
                        lastName: "Careers",
                        email: company.email,
                        password: hashedPassword,
                        role: "employer",
                        companyName: company.name,
                        companyLogo: company.logo,
                        companyWebsite: company.website,
                        companyLinkedIn: company.linkedin,
                        companyDescription: `${company.name} is a leading company in the industry, committed to innovation and excellence.`,
                    });
                    console.log(`   👔 Created employer: ${company.name}`);
                } else {
                    // Update existing employer with website data if missing
                    if (!employer.companyWebsite || !employer.companyLinkedIn) {
                        employer.companyWebsite = company.website;
                        employer.companyLinkedIn = company.linkedin;
                        employer.companyLogo = employer.companyLogo || company.logo;
                        employer.companyDescription = employer.companyDescription || `${company.name} is a leading company in the industry, committed to innovation and excellence.`;
                        await employer.save();
                        console.log(`   📝 Updated employer: ${company.name} with website data`);
                    }
                }

                // Create job
                await Job.create({
                    employer: employer._id,
                    title: jobData.title,
                    description: jobData.desc,
                    location: jobData.location,
                    salaryRange: jobData.salary,
                    jobType: jobData.type,
                    category: category,
                    qualifications: [
                        "Bachelor's degree or equivalent experience",
                        "Strong communication skills",
                        "Team player with positive attitude",
                    ],
                    responsibilities: [
                        "Collaborate with cross-functional teams",
                        "Meet deadlines and deliver high-quality work",
                        "Contribute to team goals and company success",
                    ],
                    status: "open",
                });
                totalJobsCreated++;
                console.log(`   ✅ Created: ${jobData.title}`);
            }
        }

        console.log(`\n🎉 Seeding complete! Created ${totalJobsCreated} jobs across ${Object.keys(JOBS_BY_CATEGORY).length} categories.`);

        // Summary
        console.log("\n📊 Summary by category:");
        for (const category of Object.keys(JOBS_BY_CATEGORY)) {
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
