import createApiManager from "./Api_Manager.js";

const API_BASE_URL = "http://192.168.1.9:3000/api/v1";

console.log("API_BASE_URL == ", API_BASE_URL);

const apiPromoClient = createApiManager(API_BASE_URL);

export const api_promotion_service = {
  timKhuyenMaiApDung: async (ngay, gio, soLuongVe, tongTien, datLanDau) => {
    const params = { ngay, gio, soLuongVe, tongTien, datLanDau };
    return apiPromoClient.get("/khuyen-mai/tim-ap-dung", { params });
  },
};
