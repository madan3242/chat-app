import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.BASE_URL,
    withCredentials: true,
    timeout: 1200000
})

export const loginUser = () => {
    return apiClient.get("/api/v1/auth/login")
}