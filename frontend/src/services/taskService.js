import API from "./api";

export const fetchTasks = async () => {
  const res = await API.get("/tasks");
  return res.data;
};

export const toggleTaskStatus = async (id, completed) => {
  const res = await API.patch(`/tasks/${id}`, { completed });
  return res.data;
};