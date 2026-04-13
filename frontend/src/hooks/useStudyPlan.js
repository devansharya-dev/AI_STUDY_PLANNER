import { useState } from "react";
import { generateStudyPlan } from "../services/planService";

export default function useStudyPlan() {
  const [loading, setLoading] = useState(false);

  const createPlan = async (data) => {
    setLoading(true);
    await generateStudyPlan(data);
    setLoading(false);
  };

  return { createPlan, loading };
}