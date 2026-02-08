import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

dotenv.config();

// Helper to get random unsplash image
const getGallery = (indices) => {
    const images = [
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80", // Office 1
        "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80", // Meeting
        "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80", // Lobby
        "https://images.unsplash.com/photo-1577412647305-991150c7d163?auto=format&fit=crop&w=800&q=80", // Tech Park
        "https://images.unsplash.com/photo-1504384308090-c54be3855092?auto=format&fit=crop&w=800&q=80", // Building
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80", // Skyscrapers
    ];
    return indices.map(i => images[i % images.length]);
};

const companies = [
    {
        companyName: "Infosys",
        companyWebsite: "https://www.infosys.com/",
        companyLocation: "Bangalore, India",
        email: "careers@infosys.com",
        companySize: "300,000+ Employees",
        companyEstablishedDate: new Date("1981-07-02"),
        companyLogo: "https://logo.clearbit.com/infosys.com",
        companyGallery: getGallery([0, 1, 3]),
        about: "Infosys is a global leader in next-generation digital services and consulting. We enable clients in more than 50 countries to navigate their digital transformation. With over four decades of experience in managing the systems and workings of global enterprises, we expertly steer our clients through their digital journey. We do it by enabling the enterprise with an AI-powered core that helps prioritize the execution of change. We also empower the business with agile digital at scale to deliver unprecedented levels of performance and customer delight."
    },
    {
        companyName: "Wipro",
        companyWebsite: "https://www.wipro.com/",
        companyLocation: "Bangalore, India",
        email: "careers@wipro.com",
        companySize: "245,000+ Employees",
        companyEstablishedDate: new Date("1945-12-29"),
        companyLogo: "https://logo.clearbit.com/wipro.com",
        companyGallery: getGallery([2, 4, 0]),
        about: "Wipro Limited is a leading technology services and consulting company focused on building innovative solutions that address clients' most complex digital transformation needs. We leverage our holistic portfolio of capabilities in consulting, design, engineering, operations, and emerging technologies to help clients realize their boldest ambitions and build future-ready, sustainable businesses. A company recognized globally for its comprehensive portfolio of services, strong commitment to sustainability and good corporate citizenship."
    },
    {
        companyName: "HCLTech",
        companyWebsite: "https://www.hcltech.com/",
        companyLocation: "Noida, India",
        email: "careers@hcltech.com",
        companySize: "223,000+ Employees",
        companyEstablishedDate: new Date("1976-11-11"),
        companyLogo: "https://logo.clearbit.com/hcltech.com",
        companyGallery: getGallery([5, 1, 3]),
        about: "HCLTech is a global technology company, home to more than 223,438 people across 60 countries, delivering industry-leading capabilities centered around digital, engineering, cloud and AI, powered by a broad portfolio of technology services and products. We work with clients across all major verticals, providing industry solutions for Financial Services, Manufacturing, Life Sciences and Healthcare, Technology and Services, Telecom and Media, Retail and CPG, and Public Services."
    },
    {
        companyName: "L&T Technology Services",
        companyWebsite: "https://www.ltts.com/",
        companyLocation: "Vadodara, India",
        email: "careers@ltts.com",
        companySize: "23,000+ Employees",
        companyEstablishedDate: new Date("2012-06-14"),
        companyLogo: "https://logo.clearbit.com/ltts.com",
        companyGallery: getGallery([3, 2, 5]),
        about: "L&T Technology Services Limited (LTTS) is a listed subsidiary of Larsen & Toubro Limited focused on Engineering and R&D (ER&D) services. We offer consultancy, design, development and testing services across the product and process development life cycle. Our customer base includes 69 Fortune 500 companies and 57 of the world's top ER&D companies, across industrial products, medical devices, transportation, telecom & hi-tech, and the process industries."
    },
    {
        companyName: "Tata Technologies",
        companyWebsite: "https://www.tatatechnologies.com/",
        companyLocation: "Pune, India",
        email: "careers@tatatechnologies.com",
        companySize: "11,000+ Employees",
        companyEstablishedDate: new Date("1989-01-01"),
        companyLogo: "https://logo.clearbit.com/tatatechnologies.com",
        companyGallery: getGallery([1, 0, 4]),
        about: "Tata Technologies is a global product engineering and digital services company dedicated to helping the world's leading manufacturers create better products. We help companies realize better products and drive efficiencies in their businesses, leading to better user experiences. We represent a world of innovators, specialists, and creative minds who are designing the future of mobility, aerospace, and heavy machinery."
    },
    {
        companyName: "Honeywell",
        companyWebsite: "https://www.honeywell.com/in/en",
        companyLocation: "Charlotte, NC (India HQ: Gurgaon)",
        email: "careers@honeywell.com",
        companySize: "100,000+ Employees",
        companyEstablishedDate: new Date("1906-01-01"),
        companyLogo: "https://logo.clearbit.com/honeywell.com",
        companyGallery: getGallery([4, 5, 2]),
        about: "Honeywell International Inc. is an American publicly traded, multinational conglomerate corporation. It primarily operates in four areas of business: aerospace, building technologies, performance materials and technologies, and safety and productivity solutions. In India, Honeywell has a long history and a strong presence, delivering innovative technologies that solve tough challenges in energy, security, safety, and global urbanization."
    },
    {
        companyName: "Larsen & Toubro",
        companyWebsite: "https://www.larsentoubro.com/",
        companyLocation: "Mumbai, India",
        email: "careers@larsentoubro.com",
        companySize: "330,000+ Employees",
        companyEstablishedDate: new Date("1938-02-07"),
        companyLogo: "https://logo.clearbit.com/larsentoubro.com",
        companyGallery: getGallery([0, 3, 5]),
        about: "Larsen & Toubro is an Indian multinational engaged in EPC Projects, Hi-Tech Manufacturing and Services. It operates in over 50 countries worldwide. A strong, customer-focused approach and the constant quest for top-class quality have enabled L&T to attain and sustain leadership in its major lines of business for eight decades. We are engaged in core, high-impact sectors of the economy and our integrated capabilities span the entire spectrum of 'design to deliver'."
    },
    {
        companyName: "Neilsoft",
        companyWebsite: "https://neilsoft.com/",
        companyLocation: "Pune, India",
        email: "careers@neilsoft.com",
        companySize: "1,000+ Employees",
        companyEstablishedDate: new Date("2002-01-01"),
        companyLogo: "https://logo.clearbit.com/neilsoft.com",
        companyGallery: getGallery([2, 1, 4]),
        about: "Neilsoft is a specialist engineering services & solutions company servicing clients across the globe. We help our clients improve their engineering efficiency, support their global footprint and improve their competitiveness. Leveraging our intellectual capital, technology expertise and international presence, we offer a range of services from product design to manufacturing support, and plant engineering to construction support."
    },
    {
        companyName: "KPIT Technologies",
        companyWebsite: "https://www.kpit.com/",
        companyLocation: "Pune, India",
        email: "careers@kpit.com",
        companySize: "10,000+ Employees",
        companyEstablishedDate: new Date("1990-01-01"),
        companyLogo: "https://logo.clearbit.com/kpit.com",
        companyGallery: getGallery([4, 0, 1]),
        about: "KPIT Technologies is a global partner to the automotive and mobility ecosystem for making software-defined vehicles a reality. It is a leading independent software development and integration partner helping mobility leapfrog towards a clean, smart, and safe future. With 10,000+ automobelievers across the globe specializing in embedded software, AI, and digital solutions, KPIT accelerates clients' implementation of next-generation technologies."
    }
];

const seedCompanies = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("password123", salt);

        for (const company of companies) {
            const existingUser = await User.findOne({ email: company.email });
            if (existingUser) {
                // Update existing company details
                await User.updateOne({ email: company.email }, {
                    $set: {
                        firstName: company.companyName,
                        companyName: company.companyName,
                        companyWebsite: company.companyWebsite,
                        companyLocation: company.companyLocation,
                        companySize: company.companySize,
                        companyEstablishedDate: company.companyEstablishedDate,
                        companyLogo: company.companyLogo,
                        companyGallery: company.companyGallery,
                        companyDescription: company.about,
                        role: "employer"
                    }
                });
                console.log(`Updated ${company.companyName}`);
            } else {
                await User.create({
                    ...company,
                    password: hashedPassword,
                    role: "employer",
                    firstName: company.companyName,
                    lastName: "(Company)",
                    companyDescription: company.about
                });
                console.log(`Created ${company.companyName}`);
            }
        }

        console.log("Seeding completed");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding companies:", error);
        process.exit(1);
    }
};

seedCompanies();
