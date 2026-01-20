import axios from "axios";

const api = axios.create({
  baseURL: "https://hr-ai-backend-644108132565.us-central1.run.app", // point to your FastAPI backend
});

export default api;
