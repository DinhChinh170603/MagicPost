import axios from "axios";
import { toast } from "react-toastify";
import { roleValueMap } from "./helpers";

// const baseURL = "http://127.0.0.1:8080/api";
const baseURL = "https://magicpost.onrender.com/api";

const service = axios.create({
  baseURL: baseURL,
  // timeout: 10000,
});

//define a function to change request base URL dynamically with a postfix
export const getRolePrefixURL = (role: string) => {
  const postfix = roleValueMap[role];
  service.defaults.baseURL = `${baseURL}/${postfix}`;
};

service.interceptors.request.use(
  (config) => {
    const jwtToken = localStorage.getItem("jwtToken");
    if (jwtToken) {
      config.headers!.Authorization = jwtToken;
    }
    return config;
  }
);

service.interceptors.response.use(
  (response) => {
    if (response.data.status === 401 && response.data.message !== "Unauthorized") {
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
  }
);


export default service;
