export default function TaskCard({ task, onToggle }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task)}
      />
      {task.title}
    </div>
  );
}   