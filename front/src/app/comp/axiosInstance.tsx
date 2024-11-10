import axios from "axios";
const axiosInstance = axios.create({
  baseURL: "http://localhost:8088/",
});
axiosInstance.interceptors.request.use(
  (config) => {
    let token = window.localStorage.getItem("token");
    config.headers.Authorization = token ? token : "";
    return config;
  },
  (error) => {
    return console.log(error);
  }
);
export default axiosInstance;
