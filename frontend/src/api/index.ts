import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.BASE_URL,
    withCredentials: true,
    timeout: 1200000
});

apiClient.interceptors.request.use(
  function (config) {
    const token = localStorage.get("token");
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

type loginData = {
    username?: string,
    password?: string
}

export const loginUser = (data: loginData) => {
    return apiClient.get("/api/v1/auth/login", data)
};