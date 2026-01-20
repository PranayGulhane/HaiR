### Create next project
```npx create-next-app@latest frontend```
### Install dependencies
```
cd frontend
npm install axios chart.js react-chartjs-2
```
### frontend/lib/api.js
```
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000", // point to your FastAPI backend
});

export default api;
```