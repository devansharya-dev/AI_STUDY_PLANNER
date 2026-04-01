import API from "./api";

export const uploadSyllabus = async (content) => {
  const res = await API.post("/syllabus", { content });
  return res.data;
};