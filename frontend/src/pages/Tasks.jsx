import useTasks from "../hooks/useTasks";
import TaskCard from "../components/TaskCard";

export default function Tasks() {
  const { tasks, toggle } = useTasks();

  return (
    <div style={{ padding: 40 }}>
      <h2>Tasks</h2>

      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onToggle={toggle} />
      ))}
    </div>
  );
}