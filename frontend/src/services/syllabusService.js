import API from "./api";

export const uploadSyllabus = async (payload) => {
  // payload can be a string (text) or a File object
  if (payload instanceof File) {
    const formData = new FormData();
    formData.append("file", payload);
    const res = await API.post("/syllabus", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } else {
    // Treat as text
    const res = await API.post("/syllabus", { title: "Raw Syllabus", description: payload });
    return res.data;
  }
};