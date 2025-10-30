import { ApiManager } from "./ApiManager";

export const api_trip_schedule_service = {
  getAllDiaDiem: async () => {
    return ApiManager.get(
      "trip_schedule_service",
      "/api/v1/dia-diem/lay-tat-ca-dia-diem"
    );
  },
  getDiaDiemById: async (id) => {
    return ApiManager.get(
      "trip_schedule_service",
      `/api/v1/dia-diem/lay-dia-diem/${id}`
    );
  },
  getActiveDiaDiem: async () => {
    return ApiManager.get(
      "trip_schedule_service",
      "/api/v1/dia-diem/lay-dia-diem-active"
    );
  },
  getChuyenXeTheoNgayVaDiaDiem: async (ngayKhoiHanh, diemDiId, diemDenId) => {
    return ApiManager.get(
      "trip_schedule_service",
      `/api/v1/chuyen-xe/theo-ngay-va-dia-diem?ngayKhoiHanh=${ngayKhoiHanh}&diemDiId=${diemDiId}&diemDenId=${diemDenId}`
    );
  },
};
