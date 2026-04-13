import { useState } from "react";

export default function UploadBox({ onSubmit }) {
  const [text, setText] = useState("");
  const [days, setDays] = useState(7);

  return (
    <div>
      <textarea
        rows="8"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <input
        type="number"
        value={days}
        onChange={(e) => setDays(e.target.value)}
      />

      <button onClick={() => onSubmit(text, days)}>
        Generate Plan
      </button>
    </div>
  );
}