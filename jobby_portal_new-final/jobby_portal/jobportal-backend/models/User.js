// models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    middleName: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: "seeker" },
    profilePhoto: String,
    profileCompleted: { type: Boolean, default: false },

    // Seeker profile fields
    dob: String,
    gender: String,
    phone: String,
    alternatePhone: String,
    permanentAddress: String,
    currentAddress: String,
    city: String,
    state: String,

    // Education fields (flat structure)
    currentEducation_degree: String,
    currentEducation_college: String,
    currentEducation_cgpa: String,
    currentEducation_year: String,
    previousEducation_10_school: String,
    previousEducation_10_marks: String,
    previousEducation_12_school: String,
    previousEducation_12_marks: String,
    isDiploma: Boolean,

    // Experience and documents
    internships: [{ type: mongoose.Schema.Types.Mixed }],
    documents: [{ type: mongoose.Schema.Types.Mixed }],

    // Employer specific fields
    companyName: String,
    companyLogo: String,
    companyWebsite: String,
    companyLinkedIn: String,
    companyLocation: String,
    companySize: String,
    companyEstablishedDate: Date,
    companyDescription: String,
    companyGallery: [String], // Array of image URLs

    // Seeker specific fields
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  },
  { timestamps: true, strict: false }
);

// optional instance method to compare password
userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
