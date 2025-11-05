import createApiManager from "./Api_Manager.js";

// const API_BASE_URL =
//   'http://localhost:3002/api/v1';
const API_BASE_URL = "http://localhost:3002/api/v1";

console.log("API_BASE_URL == ", API_BASE_URL);

const apiClient = createApiManager(API_BASE_URL);

export const Api_Auth_Customer = {
  requestRegisterOtp: async (data) => {
    return apiClient.post("/tai-khoan-khach-hang/register/request-otp", data);
  },

  completeRegistration: async (data) => {
    return apiClient.post("/tai-khoan-khach-hang/register/complete", data);
  },

  requestLoginOtp: async (data) => {
    return apiClient.post("/tai-khoan-khach-hang/login/request-otp", data);
  },

  verifyLoginOtp: async (data) => {
    return apiClient.post("/tai-khoan-khach-hang/login/verify", data);
  },

  logout: async () => {
    return apiClient.post("/tai-khoan-khach-hang/logout");
  },
};

export const Api_KhachHang = {
  getMyProfile: async () => {
    return apiClient.get("/khach-hang/profile/me");
  },

  updateMyProfile: async (data) => {
    return apiClient.put("/khach-hang/profile/me", data);
  },
};
