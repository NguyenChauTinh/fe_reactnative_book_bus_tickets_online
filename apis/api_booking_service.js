import { ApiManager } from "./ApiManager";

export const api_booking_service = {
  // veXeRouter.get('/chuyen-xe/:chuyenXeId', getTicketsByChuyenXeId);
  getTicketsByChuyenXeId: async (chuyenXeId) => {
    return ApiManager.get(
      "booking_service",
      `/api/v1/ve-xe/chuyen-xe/${chuyenXeId}`
    );
  },
};
