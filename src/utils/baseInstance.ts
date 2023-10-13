import axios from "axios";
let loggedInUser = localStorage.getItem("loggedInUser")
  ? JSON.parse(localStorage.getItem("loggedInUser")!)
  : null;
const baseInstance = () => {
  let axiosInstance = axios.create({
    baseURL: "http://localhost:9000/",
  });
  axiosInstance.interceptors.request.use(
    function (config: any) {
      config = {
        ...config,
        headers: {
          ...config.headers,
          Authorization: loggedInUser?.token,
        },
      };
      return config;
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );
  return axiosInstance;
};
export default baseInstance();
