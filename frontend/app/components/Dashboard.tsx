"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [data, setData] = useState<any>({
    jobs_count: 0,
    resumes_count: 0,
    avg_score: 0,
    resumes_per_job: [],
  });

  // Fetch dashboard data from backend
  const fetchDashboard = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/dashboard`);
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="space-y-6 mb-10">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow text-center">
          <p className="text-gray-500">Jobs Created</p>
          <h2 className="text-3xl font-bold">{data.jobs_count}</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow text-center">
          <p className="text-gray-500">Resumes Analyzed</p>
          <h2 className="text-3xl font-bold">{data.resumes_count}</h2>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="text-xl font-semibold mb-4">Resumes per Job</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.resumes_per_job}>
            <XAxis dataKey="title" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
