import API from "./api";

export const fetchDashboardStats = async () => {
  const res = await API.get("/dashboard/stats");
  return res.data.data || {};
};
