import { ApiManager } from "./ApiManager";

export const api_promotion_service = {
  // khuyenMaiRouter.get('/tim-ap-dung', khuyenMaiController.timKhuyenMaiApDung);
  // http://localhost:3004/api/v1/khuyen-mai/tim-ap-dung?ngay=2025-10-31T17%3A00%3A00.000Z&gio=630
  timKhuyenMaiApDung: async (ngay, gio, soLuongVeChay) => {
    const params = { ngay, gio, soLuongVeChay };
    return ApiManager.get(
      "api_promotion_service",
      "/api/v1/khuyen-mai/tim-ap-dung",
      { params }
    );
  },
};
