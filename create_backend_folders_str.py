import os

# Define project structure
BASE_DIR = "backend"

files = [
    "main.py",
    "database.py",
    "models.py",
    "schemas.py",
    "groq.py",
    "resume_parser.py",
    "requirements.txt",
    ".env",
    "README.md"
]

def create_backend():
    # Create backend directory
    os.makedirs(BASE_DIR, exist_ok=True)

    # Create files
    for file in files:
        file_path = os.path.join(BASE_DIR, file)
        if not os.path.exists(file_path):
            with open(file_path, "w") as f:
                pass  # create empty file

    print("✅ Backend project structure created successfully!")


if __name__ == "__main__":
    create_backend()
