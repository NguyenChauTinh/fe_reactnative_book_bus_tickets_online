import axios from "axios";

const SERVICES = {
  trip_schedule_service: "http://172.20.10.4:3001",
  booking_service: "http://172.20.10.4:3005",
  api_promotion_service: "http://172.20.10.4:3004",
};

const createAxiosInstance = (service) => {
  if (!SERVICES[service]) {
    throw new Error(`Service ${service} not found`);
  }

  const instance = axios.create({
    baseURL: SERVICES[service],
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
    responseType: "json",
  });


  return instance;
};

const request = async (service, method, url, data = null, params = null) => {
  try {
    const axiosInstance = createAxiosInstance(service);

    console.log(
      `${method.toUpperCase()} request -> ${SERVICES[service]}${url}`
    );
    if (data) console.log("Data:", data);
    if (params) console.log("Params:", params);

    const response = await axiosInstance({
      method,
      url,
      data,
      params,
    });

    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("API call error:", error);
    throw error;
  }
};

export const ApiManager = {
  get: async (service, url, { params } = {}) =>
    request(service, "get", url, null, params),
  post: async (service, url, data) => request(service, "post", url, data),
  put: async (service, url, data) => request(service, "put", url, data),
  delete: async (service, url, data) => request(service, "delete", url, data),
};
