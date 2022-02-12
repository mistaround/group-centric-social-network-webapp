import axios from "axios";
import { getToken } from "./auth";

const instance = axios.create({
  baseURL: process.env.REACT_APP_DOMAIN,
  timeout: 7000,
});

// Before sending each request
instance.interceptors.request.use(
  (data) => {
    const config = data;
    config.headers["auth-token"] = getToken();
    return config;
  },
  (error) => Promise.reject(error)
);

// After receiving each response
instance.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

export default instance;
