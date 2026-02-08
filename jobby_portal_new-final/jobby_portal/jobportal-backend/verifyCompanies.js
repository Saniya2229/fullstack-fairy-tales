import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const verifyCompanies = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const employers = await User.find({ role: "employer" });
        console.log(`Found ${employers.length} employers:`);

        const unnamed = employers.filter(e => !e.companyName);
        console.log(`Found ${unnamed.length} unnamed employers:`);
        unnamed.forEach(e => {
            console.log(`- ID: ${e._id}, Name: ${e.firstName} ${e.lastName}`);
        });
        /*
        employers.forEach(emp => {
            console.log(`- ${emp.companyName} (ID: ${emp._id}, Role: ${emp.role})`);
        });
        */

        process.exit(0);
    } catch (error) {
        console.error("Error verifying companies:", error);
        process.exit(1);
    }
};

verifyCompanies();
