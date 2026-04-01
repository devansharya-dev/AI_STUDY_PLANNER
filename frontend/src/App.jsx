import { BrowserRouter, Routes, Route } from "react-router-dom";
import UploadSyllabus from "./pages/UploadSyllabus";
import Tasks from "./pages/Tasks";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UploadSyllabus />} />
        <Route path="/tasks" element={<Tasks />} />
      </Routes>
    </BrowserRouter>
  );
}