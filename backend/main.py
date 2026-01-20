from fastapi import FastAPI
from database import Base, engine
from routers import router
from fastapi.middleware.cors import CORSMiddleware


import os

PORT = int(os.environ.get("PORT", 8000))


Base.metadata.create_all(bind=engine)

app = FastAPI(title="HR AI Resume Matcher")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for demo only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(router)


@app.get("/")
def health():
    return {"status": "running"}
