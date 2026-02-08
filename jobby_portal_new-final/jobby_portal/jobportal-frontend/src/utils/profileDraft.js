// src/utils/profileDraft.js
const LOCAL_KEY = "profile_draft_v1";

/* ------------------------------------------------------
    LOCAL STORAGE SAVE / LOAD
------------------------------------------------------ */
export function saveDraftToLocal(draft) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(draft));
  } catch (err) {
    console.warn("Failed to save draft:", err);
  }
}

export function loadDraftFromLocal() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.warn("Failed to load draft:", err);
    return null;
  }
}

/* ------------------------------------------------------
    UTILITY
------------------------------------------------------ */
function safeString(v) {
  return v !== null && v !== undefined && String(v).trim().length > 0;
}

/* ------------------------------------------------------
    WEIGHT SYSTEM (YOUR UPDATED VERSION)
------------------------------------------------------ */

const weights = {
  // ----------------- BASIC DETAILS (TOTAL = 35)
  firstName: 5,
  middleName: 2,
  lastName: 5,
  dob: 5,
  gender: 5,
  phone: 5,
  permanentAddress: 4,
  currentAddress: 4,

  // ----------------- CONTACT DETAILS (TOTAL = 20)
  email: 5,
  alternatePhone: 3,
  city: 6,
  state: 6,

  // ----------------- CURRENT EDUCATION (TOTAL = 20)
  currentEducation_degree: 5,
  currentEducation_college: 5,
  currentEducation_cgpa: 5,
  currentEducation_year: 5,

  // ----------------- PREVIOUS EDUCATION (TOTAL = 10)
  previousEducation_10_school: 2.5,
  previousEducation_10_marks: 2.5,
  previousEducation_12_school: 2.5,
  previousEducation_12_marks: 2.5,

  // ----------------- INTERNSHIPS (TOTAL = 10)
  internships: 10, // distributed across up to 3 internships

  // ----------------- DOCUMENTS (TOTAL = 10)
  documents: 10, // distributed across up to 2 docs
};

/* ------------------------------------------------------
    FIELD GROUPS
------------------------------------------------------ */

// Basic
const basicFields = [
  "firstName",
  "middleName",
  "lastName",
  "dob",
  "gender",
  "phone",
  "permanentAddress",
  "currentAddress",
];

// Contact
const contactFields = ["email", "alternatePhone", "city", "state"];

// Current education
const currFields = [
  "currentEducation_degree",
  "currentEducation_college",
  "currentEducation_cgpa",
  "currentEducation_year",
];

// Previous education
const prevFields = [
  "previousEducation_10_school",
  "previousEducation_10_marks",
  "previousEducation_12_school",
  "previousEducation_12_marks",
];

/* ------------------------------------------------------
    COMPUTE COMPLETION
------------------------------------------------------ */
export function computeCompletion(draft = {}) {
  let total = 0;

  // Helper to check value in draft (flat) or nested section
  const getValue = (section, key) => {
    // 1. Try flat key
    if (safeString(draft[key])) return true;
    // 2. Try nested section (generic)
    if (draft[section] && safeString(draft[section][key])) return true;
    return false;
  };

  /* ---------------- BASIC ---------------- */
  let basicScore = 0;
  basicFields.forEach((k) => {
    if (getValue("basic", k)) {
      basicScore += weights[k] || 0;
    }
  });

  /* ---------------- CONTACT ---------------- */
  let contactScore = 0;
  contactFields.forEach((k) => {
    if (getValue("contact", k)) {
      contactScore += weights[k] || 0;
    }
  });

  /* ---------------- CURRENT EDUCATION ---------------- */
  let currScore = 0;
  currFields.forEach((k) => {
    // Check flat key OR nested in 'currentEdu' with same key
    // Also support old nested keys if necessary (e.g. 'degree' for 'currentEducation_degree')
    const simpleKey = k.replace("currentEducation_", "");

    if (
      safeString(draft[k]) ||
      (draft.currentEdu && safeString(draft.currentEdu[k])) ||
      (draft.currentEdu && safeString(draft.currentEdu[simpleKey]))
    ) {
      currScore += weights[k] || 0;
    }
  });

  /* ---------------- PREVIOUS EDUCATION ---------------- */
  let prevScore = 0;
  prevFields.forEach((k) => {
    // Check flat key OR nested in 'previousEdu' with same key
    if (
      safeString(draft[k]) ||
      (draft.previousEdu && safeString(draft.previousEdu[k]))
    ) {
      prevScore += weights[k] || 0;
    } else {
      // Fallback for old nested keys
      if (k === "previousEducation_10_school" && draft.previousEdu?.school10) prevScore += weights[k];
      else if (k === "previousEducation_10_marks" && draft.previousEdu?.percent10) prevScore += weights[k];
      else if (k === "previousEducation_12_school" && draft.previousEdu?.school12) prevScore += weights[k];
      else if (k === "previousEducation_12_marks" && draft.previousEdu?.percent12) prevScore += weights[k];
    }
  });

  /* ---------------- INTERNSHIPS ---------------- */
  const internships = Array.isArray(draft.internships) ? draft.internships : [];
  let filledInternships = 0;
  internships.forEach((it) => {
    if (it && (safeString(it.company) || safeString(it.role))) {
      filledInternships++;
    }
  });
  const internshipScore = (Math.min(filledInternships, 3) / 3) * weights.internships;

  /* ---------------- DOCUMENTS ---------------- */
  const docs = Array.isArray(draft.documents?.list) ? draft.documents.list : (Array.isArray(draft.documents) ? draft.documents : []);
  const docsScore = (Math.min(docs.length, 2) / 2) * weights.documents;

  /* ---------------- TOTAL SCORE ---------------- */
  total =
    basicScore +
    contactScore +
    currScore +
    prevScore +
    internshipScore +
    docsScore;

  // Convert to clean percentage (0–100)
  return Math.max(0, Math.min(100, Math.round(total)));
}
