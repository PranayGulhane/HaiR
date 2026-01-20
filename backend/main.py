from fastapi import FastAPI
from database import Base, engine
from routers import router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="HR AI Resume Matcher")

app.include_router(router)


@app.get("/")
def health():
    return {"status": "running"}
