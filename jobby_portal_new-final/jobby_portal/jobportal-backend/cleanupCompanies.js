import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const cleanupCompanies = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const result = await User.deleteMany({
            role: "employer",
            companyName: { $exists: false }
        });

        console.log(`Deleted ${result.deletedCount} invalid employers`);

        // Also delete Amdox if it lacks companyName (it had name but not companyName)
        const result2 = await User.deleteMany({
            role: "employer",
            companyName: null
        });
        console.log(`Deleted ${result2.deletedCount} null companyName employers`);

        process.exit(0);
    } catch (error) {
        console.error("Error cleaning up companies:", error);
        process.exit(1);
    }
};

cleanupCompanies();
