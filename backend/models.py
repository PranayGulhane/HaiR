from sqlalchemy import Column, Integer, String, Text, Float, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    skills = Column(String, nullable=False)

    resumes = relationship("Resume", back_populates="job", cascade="all, delete")


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)

    resume_name = Column(String, nullable=False)
    match_score = Column(Float, nullable=True)
    ai_explanation = Column(Text, nullable=True)

    job = relationship("Job", back_populates="resumes")
