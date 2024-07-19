import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:3000/api/v1/",
});

// Interceptor to add token to headers
instance.interceptors.request.use(
    (config) => {
        const token = JSON.parse(localStorage.getItem('authToken'));
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;
