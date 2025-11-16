import createApiManager from "./Api_Manager.js";

// const API_BASE_URL =
//   'http://192.168.1.22:3002/api/v1';
const API_BASE_URL = "http://192.168.1.22:3001/api/v1";

console.log("API_BASE_URL == ", API_BASE_URL);

const tripApiClient = createApiManager(API_BASE_URL);

export const api_trip_schedule_service = {
  getAllDiaDiem: async () => {
    return tripApiClient.get("/dia-diem/lay-tat-ca-dia-diem");
  },
  getDiaDiemById: async (id) => {
    return tripApiClient.get(`/dia-diem/lay-dia-diem/${id}`);
  },
  getActiveDiaDiem: async () => {
    return tripApiClient.get("/dia-diem/lay-dia-diem-active");
  },
  getChuyenXeTheoNgayVaDiaDiem: async (ngayKhoiHanh, diemDiId, diemDenId) => {
    return tripApiClient.get(
      `/chuyen-xe/theo-ngay-va-dia-diem?ngayKhoiHanh=${ngayKhoiHanh}&diemDiId=${diemDiId}&diemDenId=${diemDenId}`
    );
  },

  getDiaDiemKetNoi: async (params) => {
    const apiParams = {
      type: params?.findType,
      selectedId: params?.relatedId,
    };
    // Bây giờ chỉ cần truyền URL và params object
    return tripApiClient.get("/tuyen-duong/lay-dia-diem-ket-noi", {
      params: apiParams,
    });
  },

  timDiaDiemTheoTen: async (tenDiaDiem) => {
    return tripApiClient.get(
      `/dia-diem/tim-dia-diem-theo-ten?ten=${tenDiaDiem}`
    );
  },

  getChuyenXeByID: async (id) => {
    return tripApiClient.get(`/chuyen-xe/${id}`);
  },

  getChuyenXeByObjId: async (id) => {
    return tripApiClient.get(`/chuyen-xe/by-obj-id/${id}`);
  },

  getMultipleChuyenXeByIds: async (chuyenXeIds) => {
    // Gọi đến endpoint mới bạn vừa tạo ở Bước 1
    return tripApiClient.post("/chuyen-xe/get-by-ids", { ids: chuyenXeIds });
  },

  // router.get("/lay-tuyen-duong/:id", getTuyenDuong);
  getTuyenDuong: async (id) => {
    return tripApiClient.get(`/tuyen-duong/lay-tuyen-duong/${id}`);
  },

  getTuyenDuongData: async (id) => {
    return tripApiClient.get(`/tuyen-duong/lay-tuyen-duong-data/${id}`);
  },
};
