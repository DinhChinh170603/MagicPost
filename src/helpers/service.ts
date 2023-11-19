import axios from "axios";
import { toast } from "react-toastify";

const baseURL = "http://127.0.0.1:8080/api";
// const baseURL = "https://magicpost.onrender.com/api";

const service = axios.create({
  baseURL: baseURL,
  // timeout: 10000,
});

service.interceptors.request.use(
  (config) => {
    const jwtToken = localStorage.getItem("jwtToken");
    if (jwtToken) {
      config.headers!.Authorization = jwtToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

service.interceptors.response.use(
  (response) => {
    if (response.data.status === 401) {
      toast.error("Your session has expired");
      setTimeout(() => {
        localStorage.removeItem("jwtToken");

        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return;
      }, 2000);
    }

    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default service;
