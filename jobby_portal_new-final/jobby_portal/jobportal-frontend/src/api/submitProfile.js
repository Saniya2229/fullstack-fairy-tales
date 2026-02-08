import api from "./api";

export const submitFullProfile = async (profile) => {
  const res = await api.post("/users/profile/submit", profile);
  return res.data;
};
