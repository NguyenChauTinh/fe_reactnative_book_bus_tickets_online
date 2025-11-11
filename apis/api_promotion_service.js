import createApiManager from "./Api_Manager.js";

// const API_BASE_URL =
//   'http://192.168.1.37:3002/api/v1';
const API_BASE_URL = "http://192.168.1.37:3004/api/v1";

console.log("API_BASE_URL == ", API_BASE_URL);

const apiPromoClient = createApiManager(API_BASE_URL);

export const api_promotion_service = {
  timKhuyenMaiApDung: async (ngay, gio, soLuongVeChay) => {
    const params = { ngay, gio, soLuongVeChay };
    return apiPromoClient.get("/khuyen-mai/tim-ap-dung", { params });
  },
};
