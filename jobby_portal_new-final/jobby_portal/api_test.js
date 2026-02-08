// API Test Script for Jobby Portal
// Tests both Seeker and Employer functionalities

const BASE_URL = 'http://localhost:5000/api';

// Test data
const seekerData = {
    firstName: 'Test',
    lastName: 'Seeker',
    email: `seeker_test_${Date.now()}@example.com`,
    password: 'password123',
    role: 'seeker'
};

const employerData = {
    firstName: 'Test',
    lastName: 'Employer',
    email: `employer_test_${Date.now()}@example.com`,
    password: 'password123',
    role: 'employer',
    companyName: 'Test Company Inc.'
};

let seekerToken = null;
let employerToken = null;
let createdJobId = null;
let applicationId = null;

const results = {
    passed: [],
    failed: []
};

async function testAPI(name, fn) {
    try {
        await fn();
        results.passed.push(name);
        console.log(`✅ PASS: ${name}`);
    } catch (error) {
        results.failed.push({ name, error: error.message });
        console.log(`❌ FAIL: ${name} - ${error.message}`);
    }
}

async function fetchJSON(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
    }
    return data;
}

// ============ AUTHENTICATION TESTS ============

async function testSeekerRegistration() {
    const data = await fetchJSON(`${BASE_URL}/auth/register`, {
        method: 'POST',
        body: JSON.stringify(seekerData)
    });
    if (!data.token) throw new Error('No token returned');
    seekerToken = data.token;
}

async function testEmployerRegistration() {
    const data = await fetchJSON(`${BASE_URL}/auth/register`, {
        method: 'POST',
        body: JSON.stringify(employerData)
    });
    if (!data.token) throw new Error('No token returned');
    employerToken = data.token;
}

async function testSeekerLogin() {
    const data = await fetchJSON(`${BASE_URL}/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ email: seekerData.email, password: seekerData.password })
    });
    if (!data.token) throw new Error('No token returned');
    seekerToken = data.token;
}

async function testEmployerLogin() {
    const data = await fetchJSON(`${BASE_URL}/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ email: employerData.email, password: employerData.password })
    });
    if (!data.token) throw new Error('No token returned');
    employerToken = data.token;
}

async function testGetCurrentUser(token, role) {
    const data = await fetchJSON(`${BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!data || !data.email) throw new Error('No user data returned');
    if (data.role !== role) throw new Error(`Expected role ${role}, got ${data.role}`);
}

// ============ JOB TESTS ============

async function testGetAllJobs() {
    const data = await fetchJSON(`${BASE_URL}/jobs`);
    if (!Array.isArray(data)) throw new Error('Expected array of jobs');
}

async function testGetJobCategories() {
    const data = await fetchJSON(`${BASE_URL}/jobs/categories`);
    if (!data) throw new Error('No categories returned');
}

async function testGetLatestJobs() {
    const data = await fetchJSON(`${BASE_URL}/jobs/latest`);
    if (!Array.isArray(data)) throw new Error('Expected array of jobs');
}

async function testCreateJob() {
    const jobData = {
        title: 'Test Software Engineer',
        company: 'Test Company Inc.',
        location: 'Bangalore, India',
        type: 'Full-time',
        salary: '₹10-15 LPA',
        description: 'This is a test job posting.',
        requirements: ['JavaScript', 'React', 'Node.js'],
        experience: '2-4 years'
    };
    const data = await fetchJSON(`${BASE_URL}/jobs`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${employerToken}` },
        body: JSON.stringify(jobData)
    });
    if (!data._id) throw new Error('No job ID returned');
    createdJobId = data._id;
}

async function testGetSingleJob() {
    if (!createdJobId) throw new Error('No job ID available');
    const data = await fetchJSON(`${BASE_URL}/jobs/${createdJobId}`);
    if (!data.title) throw new Error('No job data returned');
}

async function testGetEmployerJobs() {
    const data = await fetchJSON(`${BASE_URL}/jobs/my-jobs`, {
        headers: { Authorization: `Bearer ${employerToken}` }
    });
    if (!Array.isArray(data)) throw new Error('Expected array of jobs');
}

async function testUpdateJob() {
    if (!createdJobId) throw new Error('No job ID available');
    const data = await fetchJSON(`${BASE_URL}/jobs/${createdJobId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${employerToken}` },
        body: JSON.stringify({ title: 'Updated Test Software Engineer' })
    });
    if (!data._id) throw new Error('Update failed');
}

// ============ APPLICATION TESTS ============

async function testCreateApplication() {
    if (!createdJobId) throw new Error('No job ID available');
    const data = await fetchJSON(`${BASE_URL}/applications`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${seekerToken}` },
        body: JSON.stringify({ jobId: createdJobId })
    });
    if (!data._id) throw new Error('No application ID returned');
    applicationId = data._id;
}

async function testGetSeekerApplications() {
    const data = await fetchJSON(`${BASE_URL}/applications/my`, {
        headers: { Authorization: `Bearer ${seekerToken}` }
    });
    if (!Array.isArray(data)) throw new Error('Expected array of applications');
}

async function testGetEmployerApplications() {
    const data = await fetchJSON(`${BASE_URL}/applications`, {
        headers: { Authorization: `Bearer ${employerToken}` }
    });
    if (!Array.isArray(data)) throw new Error('Expected array of applications');
}

async function testUpdateApplicationStatus() {
    if (!applicationId) throw new Error('No application ID available');
    const data = await fetchJSON(`${BASE_URL}/applications/${applicationId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${employerToken}` },
        body: JSON.stringify({ status: 'reviewed' })
    });
    if (!data._id) throw new Error('Update failed');
}

// ============ CLEANUP TESTS ============

async function testDeleteJob() {
    if (!createdJobId) throw new Error('No job ID available');
    await fetchJSON(`${BASE_URL}/jobs/${createdJobId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${employerToken}` }
    });
}

// ============ RUN ALL TESTS ============

async function runAllTests() {
    console.log('\n========================================');
    console.log('  JOBBY PORTAL API TEST SUITE');
    console.log('========================================\n');

    console.log('--- AUTHENTICATION TESTS ---');
    await testAPI('Seeker Registration', testSeekerRegistration);
    await testAPI('Employer Registration', testEmployerRegistration);
    await testAPI('Seeker Login', testSeekerLogin);
    await testAPI('Employer Login', testEmployerLogin);
    await testAPI('Get Current Seeker', () => testGetCurrentUser(seekerToken, 'seeker'));
    await testAPI('Get Current Employer', () => testGetCurrentUser(employerToken, 'employer'));

    console.log('\n--- JOB TESTS ---');
    await testAPI('Get All Jobs', testGetAllJobs);
    await testAPI('Get Job Categories', testGetJobCategories);
    await testAPI('Get Latest Jobs', testGetLatestJobs);
    await testAPI('Create Job (Employer)', testCreateJob);
    await testAPI('Get Single Job', testGetSingleJob);
    await testAPI('Get Employer Jobs', testGetEmployerJobs);
    await testAPI('Update Job (Employer)', testUpdateJob);

    console.log('\n--- APPLICATION TESTS ---');
    await testAPI('Create Application (Seeker)', testCreateApplication);
    await testAPI('Get Seeker Applications', testGetSeekerApplications);
    await testAPI('Get Employer Applications', testGetEmployerApplications);
    await testAPI('Update Application Status (Employer)', testUpdateApplicationStatus);

    console.log('\n--- CLEANUP ---');
    await testAPI('Delete Job (Employer)', testDeleteJob);

    // Summary
    console.log('\n========================================');
    console.log('  TEST SUMMARY');
    console.log('========================================');
    console.log(`✅ Passed: ${results.passed.length}`);
    console.log(`❌ Failed: ${results.failed.length}`);

    if (results.failed.length > 0) {
        console.log('\n--- FAILED TESTS ---');
        results.failed.forEach(f => console.log(`  - ${f.name}: ${f.error}`));
    }

    console.log('\n========================================\n');
}

runAllTests().catch(console.error);
