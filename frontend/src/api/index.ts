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

type signupData = {
    username?: string,
    email?: string,
    password?:string
}

export const loginUser = (data: loginData) => {
    return apiClient.post("/api/v1/login", data)
};

export const signupUser = (data: signupData) => {
    return apiClient.post("/api/v1/signup", data)
};

export const logoutUser = () => {
    return apiClient.get("/api/v1/logout")
};

