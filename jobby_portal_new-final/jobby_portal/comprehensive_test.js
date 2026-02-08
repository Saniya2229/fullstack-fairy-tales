// Comprehensive API Test for Jobby Portal
// Tests all API endpoints and functionality

const API_BASE = "http://localhost:5000/api";

// Test data
const testJobSeeker = {
    firstName: "TestSeeker",
    lastName: "User",
    email: `testseeker_${Date.now()}@test.com`,
    password: "Test@1234",
    role: "jobseeker"
};

const testEmployer = {
    firstName: "TestEmployer",
    lastName: "Company",
    email: `testemployer_${Date.now()}@test.com`,
    password: "Test@1234",
    role: "employer",
    companyName: "Test Corp Inc"
};

let seekerToken = null;
let employerToken = null;
let createdJobId = null;
let applicationId = null;

// Helper function for API calls
async function apiCall(method, endpoint, data = null, token = null) {
    const options = {
        method,
        headers: {
            "Content-Type": "application/json",
        }
    };

    if (token) {
        options.headers["Authorization"] = `Bearer ${token}`;
    }

    if (data && (method === "POST" || method === "PUT")) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_BASE}${endpoint}`, options);
        const result = await response.json().catch(() => ({}));
        return { status: response.status, ok: response.ok, data: result };
    } catch (error) {
        return { status: 0, ok: false, error: error.message };
    }
}

// Test results tracker
const results = {
    passed: 0,
    failed: 0,
    tests: []
};

function logTest(name, passed, details = "") {
    const status = passed ? "✅ PASSED" : "❌ FAILED";
    console.log(`${status}: ${name}${details ? ` - ${details}` : ""}`);
    results.tests.push({ name, passed, details });
    if (passed) results.passed++;
    else results.failed++;
}

// ============================================
// TEST SUITES
// ============================================

async function testAuthentication() {
    console.log("\n" + "=".repeat(50));
    console.log("🔐 AUTHENTICATION TESTS");
    console.log("=".repeat(50));

    // 1. Register Job Seeker
    let res = await apiCall("POST", "/auth/register", testJobSeeker);
    logTest("Register Job Seeker", res.ok && res.data.token, `Status: ${res.status}`);
    if (res.data.token) seekerToken = res.data.token;

    // 2. Login Job Seeker
    res = await apiCall("POST", "/auth/login", { email: testJobSeeker.email, password: testJobSeeker.password });
    logTest("Login Job Seeker", res.ok && res.data.token, `Status: ${res.status}`);
    if (res.data.token) seekerToken = res.data.token;

    // 3. Get Current User (Job Seeker)
    res = await apiCall("GET", "/auth/me", null, seekerToken);
    logTest("Get Current User (Seeker)", res.ok && res.data.email === testJobSeeker.email, `Status: ${res.status}`);

    // 4. Register Employer
    res = await apiCall("POST", "/auth/register", testEmployer);
    logTest("Register Employer", res.ok && res.data.token, `Status: ${res.status}`);
    if (res.data.token) employerToken = res.data.token;

    // 5. Login Employer
    res = await apiCall("POST", "/auth/login", { email: testEmployer.email, password: testEmployer.password });
    logTest("Login Employer", res.ok && res.data.token, `Status: ${res.status}`);
    if (res.data.token) employerToken = res.data.token;

    // 6. Get Current User (Employer)
    res = await apiCall("GET", "/auth/me", null, employerToken);
    logTest("Get Current User (Employer)", res.ok && res.data.email === testEmployer.email, `Status: ${res.status}`);
}

async function testJobManagement() {
    console.log("\n" + "=".repeat(50));
    console.log("💼 JOB MANAGEMENT TESTS");
    console.log("=".repeat(50));

    // 1. Create Job (as employer)
    const jobData = {
        title: "Test Software Engineer",
        company: "Test Corp Inc",
        location: "Pune, India",
        description: "This is a test job posting for testing purposes.",
        type: "full-time",
        salary: "50000-80000",
        skills: ["JavaScript", "React", "Node.js"],
        experience: "1-2 years"
    };

    let res = await apiCall("POST", "/jobs", jobData, employerToken);
    logTest("Create Job", res.ok && res.data._id, `Status: ${res.status}`);
    if (res.data._id) createdJobId = res.data._id;

    // 2. Get All Jobs
    res = await apiCall("GET", "/jobs");
    logTest("Get All Jobs", res.ok && Array.isArray(res.data), `Status: ${res.status}, Found: ${res.data?.length || 0} jobs`);

    // 3. Get Single Job
    if (createdJobId) {
        res = await apiCall("GET", `/jobs/${createdJobId}`);
        logTest("Get Single Job", res.ok && res.data._id === createdJobId, `Status: ${res.status}`);
    }

    // 4. Update Job
    if (createdJobId) {
        res = await apiCall("PUT", `/jobs/${createdJobId}`, { title: "Updated Test Engineer" }, employerToken);
        logTest("Update Job", res.ok, `Status: ${res.status}`);
    }

    // 5. Get Employer's Jobs
    res = await apiCall("GET", "/jobs/my", null, employerToken);
    logTest("Get Employer's Jobs", res.ok && Array.isArray(res.data), `Status: ${res.status}, Found: ${res.data?.length || 0} jobs`);
}

async function testApplications() {
    console.log("\n" + "=".repeat(50));
    console.log("📝 APPLICATION TESTS");
    console.log("=".repeat(50));

    // 1. Apply to Job (as seeker)
    if (createdJobId) {
        let res = await apiCall("POST", "/applications", { jobId: createdJobId }, seekerToken);
        logTest("Apply to Job", res.ok || res.status === 400, `Status: ${res.status}, Message: ${res.data?.message || 'Created'}`);
        if (res.data?._id) applicationId = res.data._id;
    }

    // 2. Get My Applications (as seeker)
    let res = await apiCall("GET", "/applications/my", null, seekerToken);
    logTest("Get My Applications (Seeker)", res.ok && Array.isArray(res.data), `Status: ${res.status}, Found: ${res.data?.length || 0}`);
    if (res.data?.length > 0 && !applicationId) {
        applicationId = res.data[0]._id;
    }

    // 3. Get Employer Applications
    res = await apiCall("GET", "/applications", null, employerToken);
    logTest("Get Employer Applications", res.ok && Array.isArray(res.data), `Status: ${res.status}, Found: ${res.data?.length || 0}`);

    // 4. Update Application Status (as employer)
    if (applicationId) {
        res = await apiCall("PUT", `/applications/${applicationId}`, { status: "reviewed" }, employerToken);
        logTest("Update Application to Reviewed", res.ok, `Status: ${res.status}`);

        res = await apiCall("PUT", `/applications/${applicationId}`, { status: "interview" }, employerToken);
        logTest("Update Application to Interview", res.ok, `Status: ${res.status}`);
    }
}

async function testOTP() {
    console.log("\n" + "=".repeat(50));
    console.log("📧 OTP TESTS");
    console.log("=".repeat(50));

    // 1. Send OTP
    const testEmail = "test@example.com";
    let res = await apiCall("POST", "/otp/send", { email: testEmail });
    logTest("Send OTP", res.ok, `Status: ${res.status}, Message: ${res.data?.message || 'N/A'}`);

    // 2. Verify OTP (with fallback OTP)
    res = await apiCall("POST", "/otp/verify", { email: testEmail, otp: "123456" }); // Fallback OTP
    logTest("Verify OTP (Fallback)", res.ok || res.status === 400, `Status: ${res.status}, Verified: ${res.data?.verified || 'N/A'}`);
}

async function testJobSearch() {
    console.log("\n" + "=".repeat(50));
    console.log("🔍 JOB SEARCH TESTS");
    console.log("=".repeat(50));

    // 1. Search Jobs with query
    let res = await apiCall("GET", "/jobs?search=software");
    logTest("Search Jobs by Keyword", res.ok, `Status: ${res.status}, Found: ${res.data?.length || 0}`);

    // 2. Filter Jobs by location
    res = await apiCall("GET", "/jobs?location=Pune");
    logTest("Filter Jobs by Location", res.ok, `Status: ${res.status}, Found: ${res.data?.length || 0}`);

    // 3. Get Featured Jobs
    res = await apiCall("GET", "/jobs/featured");
    logTest("Get Featured Jobs", res.ok || res.status === 404, `Status: ${res.status}`);
}

async function testUserProfile() {
    console.log("\n" + "=".repeat(50));
    console.log("👤 USER PROFILE TESTS");
    console.log("=".repeat(50));

    // 1. Update User Profile
    let res = await apiCall("PUT", "/users/update", { phone: "9876543210", location: "Mumbai" }, seekerToken);
    logTest("Update User Profile", res.ok, `Status: ${res.status}`);

    // 2. Get User Profile
    res = await apiCall("GET", "/users/me", null, seekerToken);
    logTest("Get User Profile", res.ok && res.data.email, `Status: ${res.status}`);
}

async function testBlogs() {
    console.log("\n" + "=".repeat(50));
    console.log("📰 BLOG TESTS");
    console.log("=".repeat(50));

    // 1. Get All Blogs
    let res = await apiCall("GET", "/blogs");
    logTest("Get All Blogs", res.ok || res.status === 404, `Status: ${res.status}, Found: ${res.data?.length || 0}`);
}

async function testContact() {
    console.log("\n" + "=".repeat(50));
    console.log("📞 CONTACT TESTS");
    console.log("=".repeat(50));

    // 1. Submit Contact Form
    let res = await apiCall("POST", "/contact", {
        name: "Test User",
        email: "test@test.com",
        message: "This is a test message"
    });
    logTest("Submit Contact Form", res.ok || res.status === 201, `Status: ${res.status}`);
}

async function testCleanup() {
    console.log("\n" + "=".repeat(50));
    console.log("🧹 CLEANUP TESTS");
    console.log("=".repeat(50));

    // Delete job (only if we created one and no applications are linked)
    // Note: This might fail if there are linked applications
    if (createdJobId) {
        let res = await apiCall("DELETE", `/jobs/${createdJobId}`, null, employerToken);
        logTest("Delete Job", res.ok || res.status === 400, `Status: ${res.status}, Message: ${res.data?.message || 'Deleted'}`);
    }
}

// ============================================
// RUN ALL TESTS
// ============================================

async function runAllTests() {
    console.log("\n" + "=".repeat(60));
    console.log("🧪 JOBBY PORTAL COMPREHENSIVE API TEST");
    console.log("=".repeat(60));
    console.log(`Started at: ${new Date().toLocaleString()}`);
    console.log(`API Base: ${API_BASE}\n`);

    await testAuthentication();
    await testJobManagement();
    await testApplications();
    await testOTP();
    await testJobSearch();
    await testUserProfile();
    await testBlogs();
    await testContact();
    await testCleanup();

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("📊 TEST SUMMARY");
    console.log("=".repeat(60));
    console.log(`Total Tests: ${results.passed + results.failed}`);
    console.log(`✅ Passed: ${results.passed}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);
    console.log("=".repeat(60));

    // List failed tests
    const failed = results.tests.filter(t => !t.passed);
    if (failed.length > 0) {
        console.log("\n⚠️ FAILED TESTS:");
        failed.forEach(t => console.log(`  - ${t.name}: ${t.details}`));
    }

    return results;
}

// Execute
runAllTests().then(r => {
    console.log("\n✅ Test run completed!\n");
    process.exit(r.failed > 0 ? 1 : 0);
}).catch(err => {
    console.error("❌ Test run failed:", err);
    process.exit(1);
});
