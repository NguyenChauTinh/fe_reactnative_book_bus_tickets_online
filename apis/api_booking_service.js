import createApiManager from "./Api_Manager.js";

// const API_BASE_URL =
//   'http://localhost:3002/api/v1';
const API_BASE_URL = "http://192.168.1.10:3005/api/v1";

console.log("API_BASE_URL == ", API_BASE_URL);

const apibooking = createApiManager(API_BASE_URL);

export const api_booking_service = {
  getTicketsByChuyenXeId: async (chuyenXeId) => {
    return apibooking.get(
     
      `/ve-xe/chuyen-xe/${chuyenXeId}`
    );
  },
  createTicket: async (ticketPayload) => {
    return apibooking.post("/ve-xe", ticketPayload);
  },
};
