import API from "./api";

export const fetchTasks = async () => {
  const res = await API.get("/tasks");
  return res.data.data || [];
};

export const toggleTaskStatus = async (id, status) => {
  const res = await API.patch(`/tasks/${id}`, { status });
  return res.data;
};