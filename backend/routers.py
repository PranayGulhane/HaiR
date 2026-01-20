from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func


from database import get_db
from models import Job, Resume
from schemas import JobCreate, JobUpdate
from resume_parser import extract_text
from groq import run_ai

router = APIRouter()


# ---------------- JOB CRUD ----------------

@router.post("/jobs")
def create_job(job: JobCreate, db: Session = Depends(get_db)):
    new_job = Job(**job.dict())
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    return new_job


@router.get("/jobs")
def get_jobs(db: Session = Depends(get_db)):
    return db.query(Job).all()


@router.get("/jobs/{job_id}")
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


@router.put("/jobs/{job_id}")
def update_job(job_id: int, job: JobUpdate, db: Session = Depends(get_db)):
    db_job = db.query(Job).filter(Job.id == job_id).first()
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found")

    for k, v in job.dict(exclude_unset=True).items():
        setattr(db_job, k, v)

    db.commit()
    return db_job


@router.delete("/jobs/{job_id}")
def delete_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    db.delete(job)
    db.commit()
    return {"message": "Job deleted"}


# ---------------- RESUME + AI ----------------

@router.post("/jobs/{job_id}/resumes")
def upload_resume(
    job_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    resume_text = extract_text(file.file)
    ai_result = run_ai(job.description, job.skills, resume_text)

    resume = Resume(
        job_id=job_id,
        resume_name=file.filename,
        match_score=80.0,  # simple static score for demo
        ai_explanation=ai_result
    )

    db.add(resume)
    db.commit()
    db.refresh(resume)
    return resume


@router.get("/jobs/{job_id}/resumes")
def get_resumes_for_job(job_id: int, db: Session = Depends(get_db)):
    return db.query(Resume).filter(Resume.job_id == job_id).all()


@router.get("/resumes/{resume_id}")
def get_resume(resume_id: int, db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume


# ---------------- DASHBOARD ----------------

@router.get("/dashboard")
def get_dashboard_metrics(db: Session = Depends(get_db)):
    jobs_count = db.query(Job).count()
    resumes_count = db.query(Resume).count()
    avg_score = db.query(func.avg(Resume.match_score)).scalar() or 0

    resumes_per_job = (
        db.query(Job.title, func.count(Resume.id))
        .join(Resume, Resume.job_id == Job.id, isouter=True)
        .group_by(Job.id)
        .all()
    )

    return {
        "jobs_count": jobs_count,
        "resumes_count": resumes_count,
        "avg_score": round(avg_score, 2),
        "resumes_per_job": [{"title": r[0], "count": r[1]} for r in resumes_per_job]
    }
