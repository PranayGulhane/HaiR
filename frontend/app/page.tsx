"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

export default function Home() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<number | null>(null);
  const [resumes, setResumes] = useState<any[]>([]);
  const [editingJob, setEditingJob] = useState<any | null>(null);

  const [newJob, setNewJob] = useState({
    title: "",
    description: "",
    skills: "",
  });

  // ---------------- FETCH ----------------

  const fetchJobs = async () => {
    const res = await fetch(`${API_BASE}/jobs`);
    const data = await res.json();
    setJobs(data);
  };

  const fetchResumes = async (jobId: number) => {
    const res = await fetch(`${API_BASE}/jobs/${jobId}/resumes`);
    const data = await res.json();
    setResumes(data);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // ---------------- JOB CRUD ----------------

  const createJob = async () => {
    await fetch(`${API_BASE}/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newJob),
    });

    setNewJob({ title: "", description: "", skills: "" });
    fetchJobs();
  };

  const updateJob = async () => {
    if (!editingJob) return;

    await fetch(`${API_BASE}/jobs/${editingJob.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: editingJob.title,
        description: editingJob.description,
        skills: editingJob.skills,
      }),
    });

    setEditingJob(null);
    fetchJobs();
  };

  const deleteJob = async (id: number) => {
    await fetch(`${API_BASE}/jobs/${id}`, { method: "DELETE" });
    fetchJobs();
  };

  // ---------------- RESUME ----------------

  const uploadResume = async (jobId: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    await fetch(`${API_BASE}/jobs/${jobId}/resumes`, {
      method: "POST",
      body: formData,
    });

    fetchResumes(jobId);
  };

  // ---------------- UI ----------------

  return (
    <main className="min-h-screen bg-gray-100 p-8 space-y-10">
      <h1 className="text-3xl font-bold text-center">HR AI Resume Matcher</h1>

      {/* CREATE JOB */}
      <section className="bg-white p-6 rounded-xl shadow space-y-4 max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold">Create Job</h2>

        <input
          className="w-full border p-2 rounded"
          placeholder="Job Title"
          value={newJob.title}
          onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
        />

        <textarea
          className="w-full border p-2 rounded"
          placeholder="Job Description"
          value={newJob.description}
          onChange={(e) =>
            setNewJob({ ...newJob, description: e.target.value })
          }
        />

        <textarea
          className="w-full border p-2 rounded"
          placeholder="Required Skills"
          value={newJob.skills}
          onChange={(e) => setNewJob({ ...newJob, skills: e.target.value })}
        />

        <button
          onClick={createJob}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Create Job
        </button>
      </section>

      {/* UPDATE JOB */}
      {editingJob && (
        <section className="bg-white p-6 rounded-xl shadow space-y-4 max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold">Update Job</h2>

          <input
            className="w-full border p-2 rounded"
            value={editingJob.title}
            onChange={(e) =>
              setEditingJob({ ...editingJob, title: e.target.value })
            }
          />

          <textarea
            className="w-full border p-2 rounded"
            value={editingJob.description}
            onChange={(e) =>
              setEditingJob({
                ...editingJob,
                description: e.target.value,
              })
            }
          />

          <textarea
            className="w-full border p-2 rounded"
            value={editingJob.skills}
            onChange={(e) =>
              setEditingJob({ ...editingJob, skills: e.target.value })
            }
          />

          <button
            onClick={updateJob}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Update Job
          </button>
        </section>
      )}

      {/* JOB LIST */}
      <section className="max-w-5xl mx-auto space-y-4">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white p-6 rounded-xl shadow space-y-3"
          >
            <h3 className="text-xl font-semibold">{job.title}</h3>
            <p className="text-gray-600">{job.description}</p>
            <p className="text-sm text-gray-500">
              <b>Skills:</b> {job.skills}
            </p>

            <div className="flex gap-2 flex-wrap">
              <label className="bg-yellow-400 px-3 py-1 rounded cursor-pointer">
                Upload Resume
                <input
                  type="file"
                  hidden
                  onChange={(e) =>
                    e.target.files &&
                    uploadResume(job.id, e.target.files[0])
                  }
                />
              </label>

              <button
                onClick={() => {
                  setSelectedJob(job.id);
                  fetchResumes(job.id);
                }}
                className="bg-gray-300 px-3 py-1 rounded"
              >
                View Resumes
              </button>

              <button
                onClick={() => setEditingJob(job)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => deleteJob(job.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>

            {/* RESUMES */}
            {selectedJob === job.id && (
              <div className="mt-4 space-y-2">
                <h4 className="font-semibold">Resumes</h4>

                {resumes.map((r) => (
                  <div
                    key={r.id}
                    className="border p-3 rounded bg-gray-50"
                  >
                    <p>
                      <b>{r.resume_name}</b> — Match Score: {r.match_score}
                    </p>
                    <p className="text-sm text-gray-600">
                      {r.ai_explanation}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </section>
    </main>
  );
}
