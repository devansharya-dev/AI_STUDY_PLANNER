import { useEffect, useState } from "react";
import { fetchTasks, toggleTaskStatus } from "../services/taskService";

export default function useTasks() {
  const [tasks, setTasks] = useState([]);

  const loadTasks = async () => {
    const data = await fetchTasks();
    setTasks(data);
  };

  const toggle = async (id, status) => {
    // If the caller passes (id, newStatus), use them directly
    if (typeof id === 'string' && typeof status === 'string') {
      await toggleTaskStatus(id, status);
    } else {
      // Fallback for old callers passing the whole task object
      const task = id;
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      await toggleTaskStatus(task.id, newStatus);
    }
    loadTasks();
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return { tasks, toggle };
}