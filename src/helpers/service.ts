import axios from "axios";
import { toast } from "react-toastify";

const service = axios.create({
  baseURL: "http://127.0.0.1:8080/api",
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
      }, 1500);
    }

    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default service;
