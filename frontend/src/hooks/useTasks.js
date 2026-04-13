import { useEffect, useState } from "react";
import { fetchTasks, toggleTaskStatus } from "../services/taskService";

export default function useTasks() {
  const [tasks, setTasks] = useState([]);

  const loadTasks = async () => {
    const data = await fetchTasks();
    setTasks(data);
  };

  const toggle = async (task) => {
    await toggleTaskStatus(task.id, !task.is_completed);
    loadTasks();
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return { tasks, toggle };
}