import getToken from "@/functions/getToken";
import axios from "axios";

const Axios = axios.create({
  baseURL: "https://server-cyoy.codecapsules.co.za/api/",//"http://localhost:3001/api/",
  timeout: 50000,
});

if (typeof window !== "undefined") {
  Axios.interceptors.request.use(function (config) {
    const token = getToken();

    if (token !== "") {
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
  });
}

export default Axios;
