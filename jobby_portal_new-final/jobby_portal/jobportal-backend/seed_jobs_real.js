import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import Job from "./models/Job.js";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://LilyPortal:3A79eSIAzjlo4yV8@test-pro-db.k4zb7.mongodb.net/jobportal";

const COMPANIES = [
    {
        firstName: "Netflix",
        lastName: "Recruiter",
        email: "jobs@netflix.com",
        companyName: "Netflix",
        companyLogo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
        jobs: [
            { title: "Senior DevOps Engineer", type: "Full-time", location: "Remote", salary: "$140k - $180k", category: "Development" },
            { title: "UI/UX Designer", type: "Part-time", location: "Los Gatos, CA", salary: "$80k - $120k", category: "Design" }
        ]
    },
    {
        firstName: "Spotify",
        lastName: "HR",
        email: "careers@spotify.com",
        companyName: "Spotify",
        companyLogo: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg",
        jobs: [
            { title: "Product Designer", type: "Freelance", location: "New York, NY", salary: "$90/hr", category: "Design" },
            { title: "Backend Engineer (Go)", type: "Full-time", location: "Stockholm, SE", salary: "$110k - $150k", category: "Development" }
        ]
    },
    {
        firstName: "Slack",
        lastName: "Team",
        email: "hiring@slack.com",
        companyName: "Slack",
        companyLogo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg",
        jobs: [
            { title: "Frontend Developer", type: "Contract", location: "San Francisco, CA", salary: "$130k - $160k", category: "Development" },
            { title: "Marketing Manager", type: "Full-time", location: "Denver, CO", salary: "$90k - $110k", category: "Marketing" }
        ]
    },
    {
        firstName: "Adobe",
        lastName: "Corp",
        email: "talent@adobe.com",
        companyName: "Adobe",
        companyLogo: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Adobe_Corporate_logo.svg",
        jobs: [
            { title: "Creative Director", type: "Full-time", location: "San Jose, CA", salary: "$160k - $220k", category: "Design" },
            { title: "Technical Writer", type: "Part-time", location: "Remote", salary: "$40/hr", category: "Marketing" }
        ]
    },
    {
        firstName: "Microsoft",
        lastName: "Jobs",
        email: "jobs@microsoft.com",
        companyName: "Microsoft",
        companyLogo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
        jobs: [
            { title: "Software Engineer II", type: "Full-time", location: "Redmond, WA", salary: "$150k - $190k", category: "Development" },
            { title: "Cloud Architect", type: "Full-time", location: "Austin, TX", salary: "$170k - $210k", category: "Engineering" }
        ]
    },
    {
        firstName: "Canva",
        lastName: "Talent",
        email: "jobs@canva.com",
        companyName: "Canva",
        companyLogo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg",
        jobs: [
            { title: "Graphic Designer", type: "Full-time", location: "Sydney, AU", salary: "$80k - $100k", category: "Design" },
            { title: "Brand Strategist", type: "Part-time", location: "Remote", salary: "$60/hr", category: "Marketing" }
        ]
    },
    {
        firstName: "Airbnb",
        lastName: "Hiring",
        email: "careers@airbnb.com",
        companyName: "Airbnb",
        companyLogo: "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg",
        jobs: [
            { title: "Experience Manager", type: "Full-time", location: "San Francisco, CA", salary: "$100k - $140k", category: "Sales" },
            { title: "iOS Developer", type: "Contract", location: "Remote", salary: "$120/hr", category: "Development" }
        ]
    }
];

const seed = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to DB");

        // Optional: Clear existing data (Be careful in prod!)
        // await User.deleteMany({ role: "employer" });
        // await Job.deleteMany({});
        // console.log("Cleared existing data");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("password123", salt);

        for (const company of COMPANIES) {
            // Check if user exists
            let user = await User.findOne({ email: company.email });
            if (!user) {
                user = await User.create({
                    firstName: company.firstName,
                    lastName: company.lastName,
                    email: company.email,
                    password: hashedPassword,
                    role: "employer",
                    companyName: company.companyName,
                    companyLogo: company.companyLogo,
                    companyDescription: `We are ${company.companyName}, a leading tech company.`
                });
                console.log(`Created user: ${company.companyName}`);
            } else {
                // Update logo just in case
                user.companyLogo = company.companyLogo;
                user.companyName = company.companyName;
                await user.save();
                console.log(`Updated user: ${company.companyName}`);
            }

            // Create Jobs
            for (const jobData of company.jobs) {
                // Check if job exists to avoid duplicates on re-run
                const exists = await Job.findOne({ title: jobData.title, employer: user._id });
                if (!exists) {
                    await Job.create({
                        employer: user._id,
                        title: jobData.title,
                        description: `Join ${company.companyName} as a ${jobData.title}. Great benefits and team.`,
                        location: jobData.location,
                        salaryRange: jobData.salary,
                        jobType: jobData.type === "Contract" ? "Freelance" : jobData.type,
                        category: jobData.category || "Technology",
                        status: "open"
                    });
                    console.log(`Created job: ${jobData.title}`);
                }
            }
        }

        console.log("Seeding complete!");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
