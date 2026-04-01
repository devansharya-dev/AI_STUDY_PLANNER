import UploadBox from "../components/UploadBox";
import { uploadSyllabus } from "../services/syllabusService";
import { generateStudyPlan } from "../services/planService";

export default function UploadSyllabus() {
  const handleUpload = async (text, days) => {
    if (!text) return alert("Enter syllabus");

    try {
      const syllabus = await uploadSyllabus(text);

      await generateStudyPlan(syllabus.id, days);

      alert("Plan generated successfully");
    } catch (err) {
      console.error(err);
      alert("Error generating plan");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Upload Syllabus</h2>
      <UploadBox onSubmit={handleUpload} />
    </div>
  );
}