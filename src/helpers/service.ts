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

// Get cities
export const getCities = async () => {
  try {
    const response = await axios.get('/location.json');
    return response.data;
  } catch (error) {
    console.error("Error fetching cities:", error);
    throw error;
  }
};

// Get districtsList base on cityName
export const getDistrictsByCityName = async (cityName: string) => {
  try {
    const cities = await getCities();
    const city = cities.find((c) => c.name === cityName);

    if (city) {
      return city.districts;
    } else {
      throw new Error(`City with name ${cityName} not found`);
    }
  } catch (error) {
    console.error("Error fetching districts:", error);
    throw error;
  }
};

// Get wardsList base on cityName and districtName
export const getWardsByCityAndDistrictName = async (cityName: string, districtName: string) => {
  try {
    const districts = await getDistrictsByCityName(cityName);
    const district = districts.find((d) => d.name === districtName);

    if (district) {
      return district.wards;
    } else {
      throw new Error(`District with name ${districtName} not found`);
    }
  } catch (error) {
    console.error("Error fetching wards:", error);
    throw error;
  }
};

export default service;
