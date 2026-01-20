"use client";

import { useState, useEffect } from "react";
import api from "../lib/api";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [skills, setSkills] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [file, setFile] = useState(null);

  const fetchJobs = async () => {
    const res = await api.get("/jobs");
    setJobs(res.data);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const createJob = async () => {
    if (!title || !desc || !skills) return;
    await api.post("/jobs", { title, description: desc, skills });
    setTitle(""); setDesc(""); setSkills("");
    fetchJobs();
  };

  const deleteJob = async (id) => {
    await api.delete(`/jobs/${id}`);
    fetchJobs();
  };

  const uploadResume = async () => {
    if (!selectedJob || !file) return;
    const formData = new FormData();
    formData.append("file", file);
    await api.post(`/jobs/${selectedJob}/resumes`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    fetchJobs();
  };

  const chartData = {
    labels: jobs.map((j) => j.title),
    datasets: [
      {
        label: "First Resume Score",
        data: jobs.map((j) => j.resumes?.[0]?.match_score || 0),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">HR AI Job Matcher</h1>

      {/* Create Job */}
      <div className="mb-6 border p-4 rounded shadow">
        <h2 className="font-semibold mb-2">Create Job</h2>
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="border p-1 mr-2" />
        <input placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} className="border p-1 mr-2" />
        <input placeholder="Skills" value={skills} onChange={e => setSkills(e.target.value)} className="border p-1 mr-2" />
        <button onClick={createJob} className="bg-blue-500 text-white px-2 py-1 rounded">Create</button>
      </div>

      {/* Job List */}
      <div className="mb-6 border p-4 rounded shadow">
        <h2 className="font-semibold mb-2">Jobs</h2>
        {jobs.map((job) => (
          <div key={job.id} className="mb-2 p-2 border rounded flex justify-between items-center">
            <div>
              <b>{job.title}</b> - {job.skills}
              <div>Score: {job.resumes?.[0]?.match_score || "N/A"}</div>
            </div>
            <div>
              <button onClick={() => setSelectedJob(job.id)} className="mr-2 bg-yellow-400 px-2 py-1 rounded">Select</button>
              <button onClick={() => deleteJob(job.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Resume */}
      {selectedJob && (
        <div className="mb-6 border p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Upload Resume for Job {selectedJob}</h2>
          <input type="file" onChange={e => setFile(e.target.files[0])} className="border p-1 mr-2"/>
          <button onClick={uploadResume} className="bg-green-500 text-white px-2 py-1 rounded">Upload</button>
        </div>
      )}

      {/* Dashboard */}
      <div className="border p-4 rounded shadow">
        <h2 className="font-semibold mb-2">Dashboard (First Resume Score)</h2>
        <Bar data={chartData}/>
      </div>
    </div>
  );
}
