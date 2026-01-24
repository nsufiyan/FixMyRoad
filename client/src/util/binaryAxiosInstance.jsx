import axios from "axios";

const binaryAxiosInstance = axios.create({
  headers: { "Content-Type": "multipart/form-data" },
  withCredentials: true,
});

export default binaryAxiosInstance;
