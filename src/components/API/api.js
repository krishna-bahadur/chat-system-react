import axios from "axios";
import {BASE_URL} from './domain'

const instance = axios.create({
  baseURL: BASE_URL
});
const token = localStorage.getItem("token");
// Add an interceptor to attach the authorization header
instance.interceptors.request.use(function (config) {
  // Modify the config object to include the authorization header
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default instance;
