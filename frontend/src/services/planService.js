import API from "./api";

export const generateStudyPlan = async (syllabusId, days) => {
  const res = await API.post("/plan/generate", {
    syllabusId,
    days,
  });
  return res.data;
};