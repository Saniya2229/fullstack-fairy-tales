import api from "./api";

export const createResume = async (payload) => {
  const res = await api.post("/resumes/create", payload);
  return res.data;
};

export const generateResumePdf = async (html) => {
  const res = await api.post("/resumes/pdf", { html });
  return res.data;
};

export const getMyResumes = async () => {
  const res = await api.get("/resumes/my");
  return res.data;
};

// alias (singular) kept for backward-compatibility
export async function getMyResume() {
  const res = await api.get("/resumes/my");
  return res.data;
}

export const deleteResume = async () => {
  const res = await api.delete("/resumes/my");
  return res.data;
};
