import createApiManager from "./Api_Manager.js";

const API_BASE_URL = "http://192.168.1.4:3000/api/v1";

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

  requestOtp: async (data) => {
    return apiClient.post("/tai-khoan-khach-hang/check/request-otp", data);
  },

  verifyOtp: async (data) => {
    return apiClient.post("/tai-khoan-khach-hang/check/verify", data);
  },
  getRecentSearches: async () => {
    return apiClient.get("/tai-khoan-khach-hang/recent-searches");
  },
  clearSearchHistory: async () => {
    return apiClient.post("/tai-khoan-khach-hang/xoa-lich-su");
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
