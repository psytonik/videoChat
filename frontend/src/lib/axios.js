import axios from "axios";

const BASE_URL = import.meta.env.MODE === "dev" ? "http://localhost:4001/api" : "/api";
export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
})