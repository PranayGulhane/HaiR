from fastapi import FastAPI
from database import Base, engine
from routers import router

import os

PORT = int(os.environ.get("PORT", 8000))


Base.metadata.create_all(bind=engine)

app = FastAPI(title="HR AI Resume Matcher")

app.include_router(router)


@app.get("/")
def health():
    return {"status": "running"}
