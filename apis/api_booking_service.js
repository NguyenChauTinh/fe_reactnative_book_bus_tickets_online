import createApiManager from "./Api_Manager.js";

// const API_BASE_URL =
//   'http://localhost:3002/api/v1';
const API_BASE_URL = "http://192.168.1.12:3005/api/v1";

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

  getNotificationsByUserId: async (userId) => {
    return apibooking.get(`/notifications/user/${userId}`);
  },

  markNotificationAsRead: async (notificationId) => {
    return apibooking.put(`/notifications/${notificationId}/read`);
  },
  checkBillStatus: async (maHoaDon) => {
    return apibooking.get(`/payment/check-status`, {
        params: { maHoaDon: maHoaDon }
    });
  },
  createVnpayPayment: async (paymentData) => {
    return apibooking.post("/payment/create_payment_url", paymentData);
  },
  createBookingAndPaymentVNPAY: async (bookingData) => {
    // bookingData gồm: { chiTiet, nhanVienTao, amount, ... }
    return apibooking.post("/payment/create-booking-and-payment", bookingData);
  },
 
};
