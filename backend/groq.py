import os
import requests
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
URL = "https://api.groq.com/openai/v1/chat/completions"


def run_ai(job_desc: str, skills: str, resume_text: str):
    prompt = f"""
Match the resume to the job.

Job Description:
{job_desc}

Required Skills:
{skills}

Resume:
{resume_text}

Return:
Match Score (0-100)
Explanation in 3 bullet points
"""

    payload = {
        "model": "llama-3.1-8b-instant",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7
    }

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    response = requests.post(URL, json=payload, headers=headers)
    print(response.text)
    return response.json()["choices"][0]["message"]["content"]
