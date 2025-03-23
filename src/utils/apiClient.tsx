import axios from "redaxios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Authorization":
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IkVtZXJzb24gRmVybmFuZGVzIiwiZW1haWwiOiJlZmZAaXEudWZyai5iciIsIm5iZiI6MTc0MjYwMjYwNCwiZXhwIjoxNzQyNjAzNTA0LCJpYXQiOjE3NDI2MDI2MDR9.UYuAFegCWpaobiSRQFCLrhzV-30WzGQmkUKHieAMyhQ",
  },
});
