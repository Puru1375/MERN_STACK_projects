import axios from "axios";

const BaseURL = import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api";

const api = axios.create({
    baseURL: BaseURL,
});

export default api;