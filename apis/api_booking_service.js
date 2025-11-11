import createApiManager from "./Api_Manager.js";

// const API_BASE_URL =
<<<<<<< HEAD
//   'http://localhost:3002/api/v1';
const API_BASE_URL = "http://192.168.1.25:3005/api/v1";
=======
//   'http://192.168.1.37:3002/api/v1';
const API_BASE_URL = "http://192.168.1.37:3005/api/v1";
>>>>>>> origin/tinh_0311

console.log("API_BASE_URL == ", API_BASE_URL);

const apibooking = createApiManager(API_BASE_URL);

export const api_booking_service = {
  getTicketsByChuyenXeId: async (chuyenXeId) => {
    return apibooking.get(`/ve-xe/chuyen-xe/${chuyenXeId}`);
  },
  createTicket: async (ticketPayload) => {
    return apibooking.post("/ve-xe", ticketPayload);
  },
  getTicketsByUserId: async (userId) => {
    return apibooking.get(`/ve-xe/user/${userId}`);
  },
  getVeXeById: async (ticketId) => {
    return apibooking.get(`/ve-xe/${ticketId}`);
  },
  cancelMultipleTicketDetails: async (
    ticketId,
    chiTietIdsToCancel,
    cancelReason
  ) => {
    return apibooking.post(`/ve-xe/${ticketId}/details/batch-cancel`, {
      chiTietIdsToCancel: chiTietIdsToCancel,
      reason: cancelReason,
    });
  },
};
