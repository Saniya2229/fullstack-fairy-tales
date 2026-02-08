// utils/seedBlogs.js
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Blog from "../models/Blog.js";
import connectDB from "../config/db.js";

const sampleBlogs = [
    {
        title: "How to get creative in your work ?",
        author: "Rebecca Swartz",
        timeAgo: "5 mins ago",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
        featured: true,
        excerpt: "Discover innovative ways to boost creativity and productivity in your daily work routine.",
        content: `
# How to Get Creative in Your Work

Creativity is not just for artists and designers. In today's fast-paced work environment, creative thinking is essential for problem-solving, innovation, and staying ahead of the competition.

## Why Creativity Matters

Creative thinking helps you:
- Solve complex problems with innovative solutions
- Stand out in your field
- Increase job satisfaction and engagement
- Drive business growth and innovation

## Practical Tips to Boost Creativity

### 1. Change Your Environment
Sometimes a simple change of scenery can spark new ideas. Try working from a different location, rearranging your workspace, or taking your brainstorming session outdoors.

### 2. Practice Mindfulness
Taking time to clear your mind through meditation or mindfulness exercises can help you think more clearly and creatively.

### 3. Collaborate with Others
Diverse perspectives lead to innovative solutions. Don't be afraid to bounce ideas off colleagues from different departments or backgrounds.

### 4. Embrace Constraints
Limitations can actually fuel creativity by forcing you to think outside the box and find unconventional solutions.

### 5. Keep Learning
Continuous learning exposes you to new ideas and perspectives. Read widely, take courses, and stay curious about the world around you.

## Conclusion

Creativity is a skill that can be developed and strengthened over time. By implementing these strategies, you can unlock your creative potential and bring fresh perspectives to your work.
    `,
        tags: ["Productivity", "Creativity", "Career Development"]
    },
    {
        title: "Smartest Applications for Business",
        author: "Olivia Murphy",
        timeAgo: "30 mins ago",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
        featured: true,
        excerpt: "Explore the top business applications that are transforming how companies operate in 2024.",
        content: `
# Smartest Applications for Business

In the digital age, the right applications can make or break your business efficiency. Here are the smartest applications that modern businesses are using to stay competitive.

## Project Management Tools

### Asana & Monday.com
These platforms help teams organize, track, and manage their work with intuitive interfaces and powerful automation features.

## Communication Platforms

### Slack & Microsoft Teams
Real-time communication tools that keep teams connected, whether they're in the office or working remotely.

## Customer Relationship Management

### Salesforce & HubSpot
CRM platforms that help businesses manage customer interactions, track sales, and improve customer satisfaction.

## Financial Management

### QuickBooks & Xero
Cloud-based accounting software that simplifies financial management for businesses of all sizes.

## Conclusion

Investing in the right business applications can significantly improve productivity, collaboration, and overall business performance.
    `,
        tags: ["Business", "Technology", "Productivity"]
    },
    {
        title: "How apps is changing the IT world",
        author: "Adam Gibson",
        timeAgo: "3 mins ago",
        image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80",
        excerpt: "The mobile-first revolution is reshaping how IT professionals approach software development.",
        content: `
# How Apps Are Changing the IT World

The rise of mobile and web applications has fundamentally transformed the IT landscape. Here's how this shift is impacting the industry.

## The Mobile-First Revolution

Mobile apps have become the primary way people interact with technology. This shift has forced IT professionals to rethink their approach to software development.

## Cloud Computing Integration

Modern apps rely heavily on cloud infrastructure, changing how IT teams manage resources and scale applications.

## DevOps and Continuous Deployment

The demand for rapid app updates has accelerated the adoption of DevOps practices and CI/CD pipelines.

## Security Challenges

With more apps handling sensitive data, security has become a top priority for IT teams.

## Conclusion

The app revolution continues to drive innovation in IT, creating new opportunities and challenges for professionals in the field.
    `,
        tags: ["Technology", "IT", "Mobile Development"]
    },
    {
        title: "Design your apps in your own way",
        author: "Sienna Rogers",
        timeAgo: "1 hrs ago",
        image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=800&q=80",
        excerpt: "Learn the principles of great app design and how to create user experiences that delight.",
        content: `
# Design Your Apps in Your Own Way

Great app design is about more than just aesthetics. It's about creating intuitive, enjoyable experiences that solve real problems for users.

## Understanding User Needs

Start by deeply understanding your users' needs, pain points, and goals. User research is the foundation of great design.

## Design Principles

- **Simplicity**: Keep interfaces clean and focused
- **Consistency**: Use familiar patterns and maintain visual consistency
- **Feedback**: Provide clear feedback for user actions
- **Accessibility**: Design for all users, including those with disabilities

## Prototyping and Testing

Don't skip the prototyping phase. Test your designs with real users early and often.

## Conclusion

By following these principles and staying user-focused, you can create apps that stand out in a crowded marketplace.
    `,
        tags: ["Design", "UX/UI", "App Development"]
    },
    {
        title: "The future of remote work",
        author: "James Wilson",
        timeAgo: "2 hrs ago",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
        excerpt: "Remote work is here to stay. Discover what the future holds for distributed teams.",
        content: `
# The Future of Remote Work

The COVID-19 pandemic accelerated the shift to remote work, but this trend is here to stay. Here's what the future holds.

## Hybrid Work Models

Many companies are adopting hybrid models that combine remote and in-office work, offering flexibility while maintaining team cohesion.

## Technology Enablement

Advanced collaboration tools, virtual reality meetings, and AI assistants are making remote work more effective than ever.

## Global Talent Pools

Remote work allows companies to hire the best talent regardless of location, creating truly global teams.

## Challenges to Address

- Maintaining company culture
- Preventing burnout
- Ensuring effective communication
- Managing across time zones

## Conclusion

The future of work is flexible, distributed, and technology-enabled. Companies that embrace this shift will have a competitive advantage in attracting and retaining top talent.
    `,
        tags: ["Remote Work", "Future of Work", "Career"]
    },
    {
        title: "Building better teams",
        author: "Sarah Chen",
        timeAgo: "4 hrs ago",
        image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80",
        excerpt: "Effective teamwork is the cornerstone of successful organizations. Learn how to build high-performing teams.",
        content: `
# Building Better Teams

Great teams don't happen by accident. They're built through intentional practices and strong leadership.

## Key Elements of High-Performing Teams

### Clear Goals and Roles
Everyone should understand the team's objectives and their individual responsibilities.

### Psychological Safety
Team members need to feel safe taking risks and being vulnerable without fear of judgment.

### Effective Communication
Open, honest communication is essential for collaboration and problem-solving.

### Diversity and Inclusion
Diverse teams bring different perspectives and lead to better decision-making.

## Leadership's Role

Leaders must:
- Set clear expectations
- Provide resources and support
- Recognize and celebrate achievements
- Address conflicts promptly

## Conclusion

Building a great team takes time and effort, but the results are worth it. Invest in your team, and they'll invest in your success.
    `,
        tags: ["Leadership", "Team Building", "Management"]
    },
    {
        title: "Productivity hacks for developers",
        author: "Michael Brown",
        timeAgo: "5 hrs ago",
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
        excerpt: "Maximize your coding efficiency with these proven productivity techniques for developers.",
        content: `
# Productivity Hacks for Developers

As a developer, your time is valuable. Here are proven techniques to boost your productivity and write better code faster.

## Time Management

### The Pomodoro Technique
Work in focused 25-minute intervals with short breaks in between. This helps maintain concentration and prevents burnout.

### Time Blocking
Schedule specific blocks of time for different types of work: coding, meetings, code reviews, and learning.

## Code Efficiency

### Use Code Snippets
Create reusable code snippets for common patterns to save time and reduce errors.

### Master Your IDE
Learn keyboard shortcuts and advanced features of your development environment.

### Automate Repetitive Tasks
Write scripts to automate testing, deployment, and other routine tasks.

## Continuous Learning

- Stay updated with new technologies
- Read code written by experienced developers
- Contribute to open-source projects
- Attend conferences and meetups

## Work-Life Balance

Remember that productivity isn't just about working more hours. Take breaks, exercise, and maintain a healthy work-life balance.

## Conclusion

By implementing these productivity hacks, you can accomplish more in less time while maintaining code quality and your well-being.
    `,
        tags: ["Programming", "Productivity", "Developer Tips"]
    }
];

async function seedBlogs() {
    try {
        // Connect to MongoDB
        await connectDB(process.env.MONGO_URI);
        console.log("MongoDB connected");

        // Clear existing blogs
        await Blog.deleteMany({});
        console.log("Cleared existing blogs");

        // Insert sample blogs
        const blogs = await Blog.insertMany(sampleBlogs);
        console.log(`✅ Successfully seeded ${blogs.length} blog posts`);

        // Display summary
        console.log("\nSeeded blogs:");
        blogs.forEach((blog, index) => {
            console.log(`${index + 1}. ${blog.title} by ${blog.author} ${blog.featured ? '⭐' : ''}`);
        });

        process.exit(0);
    } catch (err) {
        console.error("Error seeding blogs:", err);
        process.exit(1);
    }
}

seedBlogs();
