import { createContext, useContext, useState } from "react";
import { api_booking_service } from "../apis/api_booking_service.js";

const AnalyticsContext = createContext();

export const AnalyticsProvider = ({ children }) => {
  const [session, setSession] = useState(null);

  // Hàm bắt đầu đo (Gọi khi user bắt đầu nhấn vào 'Đặt vé' hoặc mở Chat)
  const startTracking = (method) => {
    // method: 'MANUAL' hoặc 'AI'
    setSession({
      method: method,
      startTime: new Date(),
      steps: 0,
    });
    console.log(`[Analytics] Started tracking ${method}`);
  };

  // Hàm đếm bước (Gọi mỗi khi user chuyển màn hình hoặc click nút quan trọng)
  const logStep = () => {
    if (session) {
      setSession((prev) => ({ ...prev, steps: prev.steps + 1 }));
    }
  };

  const endTracking = async (isSuccess) => {
    if (!session) return;

    const endTime = new Date();

    // Tạo payload gửi đi
    const logData = {
      userId: "USER_ID_TU_AUTH_CONTEXT", // Bạn có thể lấy từ AuthContext nếu cần
      bookingMethod: session.method,
      startTime: session.startTime,
      endTime: endTime,
      stepCount: session.steps,
      status: isSuccess ? "SUCCESS" : "ABANDONED",
      deviceInfo: "React Native App", // Hoặc dùng thư viện react-native-device-info để lấy tên máy
    };

    try {
      // GỌI HÀM MỚI TẠI ĐÂY
      await api_booking_service.logPerformance(logData);
      console.log("Performance logged successfully");
    } catch (error) {
      console.error("Log failed", error);
    }

    setSession(null);
  };

  return (
    <AnalyticsContext.Provider value={{ startTracking, logStep, endTracking }}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => useContext(AnalyticsContext);
