export default function ProgressCard({ tasks }) {
  const completed = tasks.filter(t => t.is_completed).length;
  const total = tasks.length || 1;

  const percent = Math.round((completed / total) * 100);

  return (
    <div>
      <h3>Progress</h3>
      <p>{completed}/{total} completed</p>
      <p>{percent}%</p>
    </div>
  );
}