# HR AI Resume Matcher

A simple web application for HR teams to create job postings, upload resumes, and get AI-powered match scores with explanations. Built with **Next.js** frontend, **FastAPI** backend, and **PostgreSQL (Supabase)** as the database.  

---

## Live link access

## Features

- **Full CRUD** operations on job postings (Create, Read, Update, Delete)
- Upload resumes for specific jobs
- **AI match score and explanation** using Groq AI API
- Dynamic dashboard reflecting live database data
- Responsive and modern UI with TailwindCSS
- Cloud deployment:
  - Backend on **GCP Cloud Run**
  - Frontend on **Vercel**
  
---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js, React, TailwindCSS |
| Backend | FastAPI |
| Database | PostgreSQL (Supabase) |
| AI Integration | Groq API for resume matching |
| Deployment | Cloud Run (backend), Vercel (frontend) |
| CI/CD | GitHub Actions |

---

## Architecture

1. **Frontend (Next.js)**  
   - Single-page app  
   - Job creation, update, deletion  
   - Resume upload and display of AI match score & explanation  
   - Calls REST API endpoints of backend

2. **Backend (FastAPI)**  
   - REST API for jobs and resumes:
     - `POST /jobs` → Create job  
     - `GET /jobs` → List all jobs  
     - `PUT /jobs/{job_id}` → Update job  
     - `DELETE /jobs/{job_id}` → Delete job  
     - `POST /jobs/{job_id}/resumes` → Upload resume + AI inference  
     - `GET /jobs/{job_id}/resumes` → List resumes for a job  
   - Connects to PostgreSQL database (Supabase)
   - Integrates with **Groq AI API** for resume matching

3. **Database (PostgreSQL/Supabase)**  
   - Stores jobs and resumes
   - Resume table includes `resume_name`, `match_score`, and `ai_explanation`

4. **Deployment**  
   - Backend deployed on **GCP Cloud Run**  
   - Frontend deployed on **Vercel**, environment variable `NEXT_PUBLIC_API_BASE` points to Cloud Run URL  

---

## Installation & Local Setup

### Backend

1. Clone the repository:

```bash
git clone <repo-url>
cd <repo-folder>/backend
