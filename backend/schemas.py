from pydantic import BaseModel
from typing import Optional


class JobCreate(BaseModel):
    title: str
    description: str
    skills: str


class JobUpdate(BaseModel):
    title: Optional[str]
    description: Optional[str]
    skills: Optional[str]
