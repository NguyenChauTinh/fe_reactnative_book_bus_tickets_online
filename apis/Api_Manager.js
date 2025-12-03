import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const createApiManager = (baseURL) => {
  const axiosInstance = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
    responseType: "json",
  });

  let isRefreshing = false;
  let failedRequestsQueue = [];

  axiosInstance.interceptors.request.use(
    async (config) => {
      try {
        const token = await AsyncStorage.getItem("userToken");

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Lỗi khi lấy token từ AsyncStorage:", error);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        if (!isRefreshing) {
          isRefreshing = true;
          console.log("Token hết hạn. Bắt đầu làm mới...");

          try {
            const refreshToken = await AsyncStorage.getItem("refreshToken");

            if (!refreshToken) {
              console.error("Không tìm thấy Refresh Token. Buộc đăng xuất.");
              await AsyncStorage.removeItem("userToken");
              await AsyncStorage.removeItem("refreshToken");
              await AsyncStorage.removeItem("userData");
              return Promise.reject(error);
            }

            const refreshEndpoint = `${baseURL}/tai-khoan-khach-hang/refresh-token`;

            const refreshResponse = await axios.post(
              refreshEndpoint,
              {
                refreshToken: refreshToken,
              },
              {
                baseURL: "",
              }
            );

            const {
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
              user: newUser,
            } = refreshResponse.data.data;

            await AsyncStorage.setItem("userToken", newAccessToken);
            await AsyncStorage.setItem("refreshToken", newRefreshToken);

            if (newUser) {
              const updatedUser = {
                ...userData,
                ...newUser,
              };
              await AsyncStorage.setItem(
                "userData",
                JSON.stringify(updatedUser)
              );
            } else {
              const updatedUser = {
                ...userData,
              };
              await AsyncStorage.setItem(
                "userData",
                JSON.stringify(updatedUser)
              );
            }

            isRefreshing = false;

            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;

            axiosInstance(originalRequest);

            failedRequestsQueue.forEach((promise) =>
              promise.resolve(newAccessToken)
            );
            failedRequestsQueue = [];

            return axiosInstance(originalRequest);
          } catch (refreshError) {
            isRefreshing = false;
            failedRequestsQueue.forEach((promise) =>
              promise.reject(refreshError)
            );
            failedRequestsQueue = [];

            console.error(
              "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
              refreshError
            );
            await AsyncStorage.removeItem("userToken");
            await AsyncStorage.removeItem("userData");
            await AsyncStorage.removeItem("refreshToken");
            return Promise.reject(refreshError);
          }
        }

        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({ resolve, reject, originalRequest });
        })
          .then((newAccessToken) => {
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      return Promise.reject(error);
    }
  );

  const request = async (
    method,
    url,
    data = null,
    params = null,
    customHeaders = {}
  ) => {
    try {
      const response = await axiosInstance({
        method,
        url,
        data: data === null ? undefined : data,
        params,
        headers: {
          ...(data instanceof FormData
            ? {}
            : { "Content-Type": "application/json" }),
          ...customHeaders,
        },
      });

      return response.data;
    } catch (error) {
      console.error("API call error:", error);
      throw error;
    }
  };

  return {
    get: (url, { params, headers } = {}) =>
      request("get", url, null, params, headers),
    post: (url, data, headers = {}) =>
      request("post", url, data, null, headers),
    put: (url, data, headers = {}) => request("put", url, data, null, headers),
    delete: (url) => request("delete", url),
    patch: (url, data, headers = {}) =>
      request("patch", url, data, null, headers),
  };
};

export default createApiManager;
