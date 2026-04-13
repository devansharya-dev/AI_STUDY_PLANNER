import API from "./api";

export const generateStudyPlan = async (data) => {
  const res = await API.post("/plan/generate", data);
  return res.data;
};