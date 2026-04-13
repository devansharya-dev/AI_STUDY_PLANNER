import API from "./api";

export const fetchTasks = async () => {
  const res = await API.get("/tasks");
  return res.data.data || [];
};

export const toggleTaskStatus = async (id, completed) => {
  const res = await API.patch(`/tasks/${id}`, { is_completed: completed });
  return res.data;
};