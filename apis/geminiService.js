// --- PHẦN NÀY RẤT QUAN TRỌNG ---
// Đây là "bộ não" AI. Nó định nghĩa các tool và gọi API của bạn.

import axios from "axios";
import { api_booking_service } from "./api_booking_service";
import { api_trip_schedule_service } from "./api_trip_schedule_service";

// Hàm tiện ích (Giữ nguyên)
const formatMinutesToHHMM = (totalMinutes) => {
  if (isNaN(totalMinutes)) return "00:00";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  return `${formattedHours}:${formattedMinutes}`;
};
const parseHHMMToMinutes = (timeString) => {
  if (!timeString || !timeString.includes(":")) return 0;
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
};

// URL API (Giữ nguyên)
const GIAVE_API_URL = "http://localhost:3001/api/v1/gia-ve/tim-gia-ve-ap-dung";
const TUYEN_DUONG_API_URL =
  "http://localhost:3001/api/v1/tuyen-duong/lay-tuyen-duong";

// (Hàm callYourTripAPI giữ nguyên)
const callYourTripAPI = async (departure, destination, date) => {
  console.log(
    `\n--- [AI DEBUG] BẮT ĐẦU: callYourTripAPI ---
    Input: ${departure}, ${destination}, ${date}`
  );

  try {
    // BƯỚC 1 DEBUG: Kiểm tra Điểm đi
    console.log(`[AI DEBUG] 1. Đang tìm ID cho điểm đi: "${departure}"`);
    const resDi = await api_trip_schedule_service.timDiaDiemTheoTen(departure);

    if (!resDi || !resDi.success) {
      console.error("[AI DEBUG] 1. LỖI: Không tìm thấy điểm đi.", resDi);
      return {
        success: false,
        error: "LOCATION_NOT_FOUND",
        message: `Tôi không tìm thấy địa điểm đi: "${departure}".`,
      };
    }
    const diaDiemDi = resDi.data;
    console.log(`[AI DEBUG] 1. OK. ID Điểm đi: ${diaDiemDi._id}`);

    // BƯỚC 2 DEBUG: Kiểm tra Điểm đến
    console.log(`[AI DEBUG] 2. Đang tìm ID cho điểm đến: "${destination}"`);
    const resDen = await api_trip_schedule_service.timDiaDiemTheoTen(
      destination
    );

    if (!resDen || !resDen.success) {
      console.error("[AI DEBUG] 2. LỖI: Không tìm thấy điểm đến.", resDen);
      return {
        success: false,
        error: "LOCATION_NOT_FOUND",
        message: `Tôi không tìm thấy địa điểm đến: "${destination}".`,
      };
    }
    const diaDiemDen = resDen.data;
    console.log(`[AI DEBUG] 2. OK. ID Điểm đến: ${diaDiemDen._id}`);

    // BƯỚC 3 DEBUG: Kiểm tra Tìm chuyến
    console.log(
      `[AI DEBUG] 3. Đang tìm chuyến xe với: Date=${date}, From=${diaDiemDi._id}, To=${diaDiemDen._id}`
    );
    const tripResponse =
      await api_trip_schedule_service.getChuyenXeTheoNgayVaDiaDiem(
        date,
        diaDiemDi._id,
        diaDiemDen._id
      );

    console.log("[AI DEBUG] 3. OK. Kết quả API chuyến xe:", tripResponse);

    // Kiểm tra xem API chuyến xe có trả về 'success: false' không
    if (!tripResponse || !tripResponse.success) {
      console.error("[AI DEBUG] 3. LỖI: API tìm chuyến báo lỗi.", tripResponse);
      return tripResponse; // Trả về lỗi để AI biết
    }

    console.log("[AI DEBUG] KẾT THÚC: Thành công. Trả dữ liệu về cho AI.");
    return tripResponse;
  } catch (error) {
    // Lỗi nghiêm trọng (ví dụ: server sập, code crash)
    console.error(
      "[AI DEBUG] LỖI NGHIÊM TRỌNG trong callYourTripAPI:",
      error.message
    );
    return {
      success: false,
      error: "API_ERROR",
      message: "Đã xảy ra lỗi hệ thống khi gọi API: " + error.message,
    };
  }
};

// (Hàm callYourSeatAPI giữ nguyên)
const callYourSeatAPI = async (tripId) => {
  console.log(`[AI DEBUG] 2. Đang lấy GHẾ + ĐIỂM ĐÓN/TRẢ cho: ${tripId}`);

  try {
    // 1. Lấy thông tin chuyến xe
    const seatResponse = await api_trip_schedule_service.getChuyenXeByID(
      tripId
    );

    if (!seatResponse || !seatResponse.success) {
      console.error(
        "[AI DEBUG] 2. LỖI: Không tìm thấy chuyến xe với ID/Mã:",
        tripId
      );
      return {
        success: false,
        error: "TRIP_NOT_FOUND",
        message: "Lỗi: Không tìm thấy chuyến xe.",
      };
    }

    const trip = seatResponse.data;
    let tuyenDuongData = trip.tuyenDuong; // Đây là ID (ví dụ: "68ddf...")

    // --- BƯỚC MỚI: PHẢI LẤY (POPULATE) TUYẾN ĐƯỜNG ---
    if (tuyenDuongData && typeof tuyenDuongData === "string") {
      console.log(
        `[AI DEBUG] 2.1. Tuyến đường là ID ("${tuyenDuongData}"), đang fetch chi tiết...`
      );
      try {
        const tuyenDuongResponse = await axios.get(
          `${TUYEN_DUONG_API_URL}/${tuyenDuongData}`
        );
        if (tuyenDuongResponse.data) {
          tuyenDuongData = tuyenDuongResponse.data; // Bây giờ là object
          console.log("[AI DEBUG] 2.1. OK. Đã lấy chi tiết tuyến đường.");
        } else {
          throw new Error("API tuyến đường trả về rỗng.");
        }
      } catch (tuyenDuongError) {
        console.error(
          "[AI DEBUG] 2.1. LỖI: Không fetch được tuyến đường:",
          tuyenDuongError.message
        );
        return {
          success: false,
          message: "Lỗi: Không thể lấy chi tiết tuyến đường.",
        };
      }
    }
    // --- KẾT THÚC BƯỚC MỚI ---

    const chiTietTuyen = tuyenDuongData?.chiTietTuyen;
    if (!chiTietTuyen || !Array.isArray(chiTietTuyen)) {
      console.error(
        "[AI DEBUG] 2. LỖI: chiTietTuyen không phải là mảng.",
        tuyenDuongData
      );
      return {
        success: false,
        error: "ROUTE_DETAILS_MISSING",
        message: "Lỗi: Không tìm thấy chi tiết tuyến đường (sau khi fetch).",
      };
    }

    // 2. Lấy sơ đồ ghế
    const soDoGhe = trip.loaiXe.soDoGhe;
    // !!! CẢNH BÁO: Vẫn đang thiếu API lấy ghế đã đặt
    const bookedSeats = [];
    const availableSeats = soDoGhe
      .filter((ghe) => ghe.trangThai === true)
      .map((ghe) => ({
        seatId: ghe.maSoGhe,
        available: !bookedSeats.includes(ghe.maSoGhe),
      }));

    // 3. XỬ LÝ ĐIỂM ĐÓN
    const departureTimeInMinutes = trip.gioKhoiHanh || 0;
    const sortedPickupPoints = chiTietTuyen
      .filter((diem) => diem.loaiDiem === "don")
      .sort((a, b) => a.thuTu - b.thuTu);

    let cumulativePickupTime = 0;
    const formattedPickupPoints = sortedPickupPoints.map((item, index) => {
      if (index > 0) {
        cumulativePickupTime +=
          sortedPickupPoints[index - 1].thoiGianDuKien || 0;
      }
      return {
        id: item._id,
        time: formatMinutesToHHMM(
          departureTimeInMinutes + cumulativePickupTime
        ),
        name: item.diaDiem.tenDiaDiem,
      };
    });

    // 4. XỬ LÝ ĐIỂM TRẢ
    const totalDuration = tuyenDuongData.thoiGian || 0;
    const arrivalTimeInMinutes = departureTimeInMinutes + totalDuration;

    const dropoffLocations = chiTietTuyen
      .filter((diem) => diem.loaiDiem === "tra")
      .sort((a, b) => a.thuTu - b.thuTu);

    let cumulativeDropoffTime = 0;
    const formattedDropoffPoints = dropoffLocations.map((item, index) => {
      if (index > 0) {
        cumulativeDropoffTime +=
          dropoffLocations[index - 1].thoiGianDuKien || 0;
      }
      return {
        id: item._id,
        time: formatMinutesToHHMM(arrivalTimeInMinutes + cumulativeDropoffTime),
        name: item.diaDiem.tenDiaDiem,
      };
    });

    console.log("[AI DEBUG] 2. OK. Trả về Ghế, Điểm đón, Điểm trả.");
    return {
      success: true,
      seats: availableSeats,
      pickupPoints: formattedPickupPoints,
      dropoffPoints: formattedDropoffPoints,
    };
  } catch (error) {
    console.error(
      "[AI DEBUG] LỖI NGHIÊM TRỌNG trong callYourSeatAPI:",
      error.message
    );
    return {
      success: false,
      error: "API_ERROR",
      message: "Đã xảy ra lỗi hệ thống khi lấy sơ đồ ghế.",
    };
  }
};

// ✅ SỬA 1: HÀM `callYourBookingAPI` (Xử lý email = null)
const callYourBookingAPI = async (
  tripId,
  seatIds,
  passengerInfo,
  pickupPointName,
  dropoffPointName,
  paymentMethod
) => {
  console.log(
    `[AI DEBUG] 4. BẮT ĐẦU: callYourBookingAPI (Đặt vé thật)
    Chuyến: ${tripId},
    Ghế: ${seatIds.join(", ")},
    Khách: ${passengerInfo.name},
    Đón: ${pickupPointName},
    Trả: ${dropoffPointName},
    Thanh toán: ${paymentMethod}`
  );

  try {
    // BƯỚC 1: LẤY THÔNG TIN CHUYẾN XE (ĐỂ LẤY ID VÀ THÔNG TIN TÍNH GIÁ)
    const tripDetails = await api_trip_schedule_service.getChuyenXeByID(tripId);
    if (!tripDetails || !tripDetails.success) {
      return { success: false, message: "Lỗi: Không tìm thấy chuyến xe." };
    }

    const tripData = tripDetails.data;
    const chuyenXeId = tripData._id; // _id (ví dụ: 6908b973...)

    // BƯỚC 2: GỌI API TÍNH GIÁ VÉ THẬT (THAY THẾ MOCK)
    let giaVeCoBan = 0; // Giá mặc định nếu lỗi
    try {
      const priceParams = {
        tuyenDuongId: tripData.tuyenDuong, // ID tuyến đường
        loaiXeId: tripData.loaiXe._id, // ID loại xe
        ngayHienTai: tripData.ngayKhoiHanh, // Ngày khởi hành
      };

      console.log("[AI DEBUG] 4.1. Đang gọi API tính giá vé với:", priceParams);
      const priceResponse = await axios.get(GIAVE_API_URL, {
        params: priceParams,
      });

      if (priceResponse.data.success) {
        giaVeCoBan = priceResponse.data.soTienThanhToan;
        console.log("[AI DEBUG] 4.1. OK. Giá vé cơ bản là:", giaVeCoBan);
      } else {
        throw new Error(priceResponse.data.message || "Không tìm thấy giá");
      }
    } catch (priceError) {
      console.error(
        "[AI DEBUG] 4.1. LỖI: Không lấy được giá vé:",
        priceError.message
      );
      // Có thể dùng giá MOCK ở đây nếu muốn, hoặc báo lỗi
      return {
        success: false,
        message: `Lỗi: Không thể lấy được giá vé cho chuyến đi (${priceError.message})`,
      };
    }

    // BƯỚC 3: CHUẨN BỊ PAYLOAD VÉ
    const chiTietVe = seatIds.map((seatMa) => {
      return {
        chuyenXe: chuyenXeId,
        tenKhachHang: passengerInfo.name,
        soDienThoai: passengerInfo.phone,
        // --- SỬA Ở ĐÂY ---
        email: passengerInfo.email || "", // Gửi chuỗi rỗng nếu không có email
        maChoNgoi: seatMa,
        diemDon: pickupPointName,
        diemTra: dropoffPointName,
        giaVeCoBan: giaVeCoBan, // <-- SỬ DỤNG GIÁ VÉ THẬT
        phuThu: 0,
        giamGia: 0,
        trangThaiChiTiet:
          paymentMethod === "TAI_XE" ? "DAT_CHO" : "DA_THANH_TOAN",
        vnpTransactionNo: null,
      };
    });

    const ticketPayload = {
      chiTiet: chiTietVe,
      maGiamGia: null,
      hinhThucThanhToan: null,
      nhanVienTao: "690471e2292bcd0f56f104e8",
      userId: "userId",
    };

    // BƯỚC 4: GỌI API ĐẶT VÉ
    console.log("[AI DEBUG] 4.2. Đang gọi api_booking_service.createTicket...");
    const response = await api_booking_service.createTicket(ticketPayload);

    console.log("[AI DEBUG] 4.2. OK. Kết quả đặt vé:", response);
    return response;
  } catch (error) {
    console.error(
      "[AI DEBUG] LỖI NGHIÊM TRỌNG trong callYourBookingAPI:",
      error.message
    );
    return {
      success: false,
      error: "API_ERROR",
      message: "Đã xảy ra lỗi hệ thống khi gọi API đặt vé.",
    };
  }
};

// (Cấu hình API_KEY và API_URL giữ nguyên)
const API_KEY = "AIzaSyAaKOXhDKTGKFDH0GvfzEkwR5tabN7Vs14"; // Thay bằng API key của bạn
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`;

// ✅ SỬA 2: `systemPrompt` (Câu hỏi 2.4)
const systemPrompt = `
  Bạn là trợ lý AI chính thức của Nhà xe An Vui.
  Nhiệm vụ của bạn là giúp hành khách tìm kiếm chuyến xe,
  kiểm tra ghế trống, và đặt vé CHỈ cho Nhà xe An Vui.
  
  - Luôn sử dụng tên "Nhà xe An Vui" khi giới thiệu hoặc xác nhận.
  - Bạn không cần hỏi người dùng muốn đi nhà xe nào.
  - Ngày hôm nay là: ${new Date().toLocaleDateString("vi-VN")}

  --- QUAN TRỌNG: HƯỚNG DẪN XỬ LÝ DỮ LIỆU API ---
  
  **1. Khi bạn gọi tool \`find_trips\` (TÌM CHUYẾN):**
     - Dữ liệu chuyến xe nằm trong mảng \`functionResult.data\`.
     - Nếu \`data\` rỗng, báo không tìm thấy chuyến.
     - Với MỖI CHUYẾN XE, hãy đọc: \`maChuyenXe\`, \`departureTime\`, \`arrivalTime\`, \`price\`, \`seatsLeft\`, \`busType\`.
     - ===> BẠN PHẢI GHI NHỚ \`maChuyenXe\` (Rất quan trọng) <===
     - ===> BẠN KHÔNG ĐƯỢC HIỂN THỊ \`maChuyenXe\` CHO KHÁCH HÀNG <===
     - **Cách trả lời mẫu (KHÔNG HIỂN THỊ MÃ):**
       "Tôi tìm thấy 2 chuyến đi phù hợp:
       1. Chuyến 19:30 (Loại xe: Limousine 24 phòng đôi), đến lúc 23:55, giá 500.000 ₫.
       2. Chuyến 22:00 (Loại xe: Limousine 34 phòng đơn), đến lúc 02:25, giá 350.000 ₫.
       
       Bạn muốn chọn chuyến nào (ví dụ: 'chuyến 19:30') để tôi kiểm tra ghế không?"

  **2. Khi bạn gọi tool \`get_available_seats\` (LẤY GHẾ):**
     - Bạn phải gửi \`maChuyenXe\` (mà bạn đã nhớ ở bước 1) làm tham số \`tripId\`.
     - Bạn sẽ nhận lại một object chứa 3 mảng: \`seats\`, \`pickupPoints\`, \`dropoffPoints\`.
     
     **QUY TRÌNH HỎI KHÁCH (BẮT BUỘC THEO THỨ TỰ):**
     
     - **BƯỚC 2.1 (HỎI GHẾ):**
       - Liệt kê các ghế CÒN TRỐNG (ví dụ: A1, B1, C2) từ mảng \`functionResult.seats\`.
       - **Cách hỏi mẫu:** "Chuyến này còn các ghế trống sau: A1, B1, C2, D4. Bạn muốn chọn ghế nào? (Bạn có thể chọn một hoặc nhiều ghế)"
     
     - **BƯỚC 2.2 (HỎI ĐIỂM ĐÓN):**
       - SAU KHI khách chọn ghế, bạn liệt kê các điểm đón từ mảng \`functionResult.pickupPoints\`.
       - **Cách hỏi mẫu:** "OK, tôi giữ ghế [ghế khách chọn]. Bạn muốn đón tại điểm nào sau đây?
         1. [07:00] Bến xe An Sương
         2. [07:15] Ngã 4 Ga
         (Vui lòng chọn 1 điểm đón)"

     - **BƯỚC 2.3 (HỎI ĐIỂM TRẢ):**
       - SAU KHI khách chọn điểm đón, bạn liệt kê các điểm trả từ mảng \`functionResult.dropoffPoints\`.
       - **Cách hỏi mẫu:** "OK, bạn sẽ lên xe tại [điểm đón khách chọn]. Bạn muốn trả tại điểm nào sau đây?
         1. [14:00] Bến xe Ninh Sơn
         2. [14:15] Chợ Ninh Sơn
         (Vui lòng chọn 1 điểm trả)"

     - **BƯỚC 2.4 (HỎI THÔNG TIN):**
       - SAU KHI khách chọn điểm trả, bạn hỏi thông tin cuối cùng.
       - **Cách hỏi mẫu:** "Tuyệt vời! Vui lòng cho tôi biết **Tên** và **Số điện thoại** của bạn. (Nếu có Email, bạn cũng có thể cung cấp để nhận vé điện tử)"

  **3. Khi bạn gọi tool \`book_ticket\` (ĐẶT VÉ):**
     - (Giữ nguyên logic)
     - Bạn phải gọi tool này SAU KHI đã thu thập ĐỦ 5 thông tin: \`tripId\`, \`seatIds\` (mảng), \`passengerInfo\`, \`pickupPointName\`, \`dropoffPointName\`.
     - Bạn phải tự động gán \`paymentMethod: "TAI_XE"\`.
     - **Cách trả lời mẫu (thành công):** "Cảm ơn bạn! Tôi đã đặt vé thành công (thanh toán khi lên xe). Chúc bạn có một chuyến đi vui vẻ với Nhà xe An Vui."

  **4. CÁCH XỬ LÝ KHI TOOL THẤT BẠI (Rất quan trọng):**
     - Nếu bạn gọi 1 tool (như \`get_available_seats\`) và nhận được kết quả là \`{ success: false, message: "..." }\`,
     - BẠN PHẢI báo lỗi đó cho người dùng.
     - BẠN KHÔNG ĐƯỢC tự ý liệt kê lại các chuyến xe khác (như trong hình).
     - **Cách trả lời mẫu (lỗi):**
       "Xin lỗi, đã có lỗi khi kiểm tra chuyến [tên chuyến]: [Nội dung message lỗi ở đây]. Bạn có muốn tôi thử lại, hay kiểm tra một chuyến khác không?"
`;

// ✅ SỬA 3: `tools` (Xóa email khỏi 'required')
const tools = [
  {
    functionDeclarations: [
      // Tool 1: find_trips (Giữ nguyên)
      {
        name: "find_trips",
        description:
          "Tìm kiếm các chuyến xe dựa trên điểm đi, điểm đến và ngày đi.",
        parameters: {
          type: "OBJECT",
          properties: {
            departure: {
              type: "STRING",
              description: 'Địa điểm xuất phát, ví dụ: "Hà Nội"',
            },
            destination: {
              type: "STRING",
              description: 'Địa điểm đến, ví dụ: "Đà Nẵng"',
            },
            date: {
              type: "STRING",
              description:
                'Ngày đi, theo định dạng YYYY-MM-DD. Nếu người dùng nói "ngày mai", hãy tự tính ngày.',
            },
          },
          required: ["departure", "destination", "date"],
        },
      },
      // Tool 2: get_available_seats (Giữ nguyên)
      {
        name: "get_available_seats",
        description:
          "Lấy danh sách ghế trống, ĐIỂM ĐÓN, và ĐIỂM TRẢ cho một chuyến xe cụ thể.",
        parameters: {
          type: "OBJECT",
          properties: {
            tripId: {
              type: "STRING",
              description: "Mã của chuyến xe (maChuyenXe)",
            },
          },
          required: ["tripId"],
        },
      },
      // Tool 3: book_ticket (NÂNG CẤP)
      {
        name: "book_ticket",
        description: "Chốt và đặt vé cho khách hàng.",
        parameters: {
          type: "OBJECT",
          properties: {
            tripId: {
              type: "STRING",
              description: "Mã của chuyến xe (maChuyenXe)",
            },
            seatIds: {
              type: "ARRAY",
              description:
                "MỘT MẢNG các mã ghế khách chọn (ví dụ: ['A1', 'B2'])",
              items: { type: "STRING" },
            },
            passengerInfo: {
              type: "OBJECT",
              description: "Thông tin hành khách",
              properties: {
                name: { type: "STRING", description: "Họ và tên" },
                phone: { type: "STRING", description: "Số điện thoại" },
                email: {
                  type: "STRING",
                  description: "Email của khách (TÙY CHỌN, có thể là null)",
                },
              },
              // --- SỬA Ở ĐÂY ---
              required: ["name", "phone"], // Xóa "email"
            },
            // --- THÊM 2 TRƯỜNG MỚI ---
            pickupPointName: {
              type: "STRING",
              description:
                "Tên điểm đón mà khách đã chọn (ví dụ: 'Bến xe An Sương')",
            },
            dropoffPointName: {
              type: "STRING",
              description:
                "Tên điểm trả mà khách đã chọn (ví dụ: 'Bến xe Ninh Sơn')",
            },
            paymentMethod: {
              type: "STRING",
              description: "Phương thức thanh toán. Chỉ chấp nhận 'TAI_XE'.",
              enum: ["TAI_XE"],
            },
          },
          required: [
            "tripId",
            "seatIds",
            "passengerInfo",
            "pickupPointName",
            "dropoffPointName",
            "paymentMethod",
          ],
        },
      },
    ],
  },
];

// (Lịch sử chat và hàm runConversation giữ nguyên)
let chatHistory = [];

export const runConversation = async (userInput) => {
  // Thêm tin nhắn của người dùng vào lịch sử
  chatHistory.push({ role: "user", parts: [{ text: userInput }] });

  try {
    const payload = {
      contents: chatHistory,
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      tools: tools,
    };

    // --- Gọi Gemini API ---
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Lỗi API Gemini:", response.status, errorBody);
      throw new Error(
        `API call failed with status: ${response.status}. Body: ${errorBody}`
      );
    }

    const result = await response.json();

    // Log toàn bộ kết quả trả về từ Gemini
    // console.log("[AI DEBUG] Full Gemini Response:", JSON.stringify(result, null, 2));

    const candidate = result.candidates?.[0];

    if (!candidate || !candidate.content || !candidate.content.parts) {
      console.error("[AI DEBUG] LỖI: Cấu trúc response không hợp lệ", result);
      return "Xin lỗi, tôi không thể xử lý yêu cầu của bạn lúc này (lỗi cấu trúc).";
    }

    // Lấy phần nội dung trả về
    const modelResponsePart = candidate.content.parts[0];

    // --- XỬ LÝ TOOL CALLING ---
    if (modelResponsePart.functionCall) {
      const functionCall = modelResponsePart.functionCall;
      const functionName = functionCall.name;
      const args = functionCall.args;

      console.log(`[AI DEBUG] AI Yêu cầu gọi Tool: ${functionName}`);
      // console.log("[AI DEBUG] Tham số:", args);

      // Thêm "cái gật đầu" của model vào lịch sử
      chatHistory.push(candidate.content);

      let functionResult;

      // Quyết định gọi hàm API nào dựa trên tên
      if (functionName === "find_trips") {
        functionResult = await callYourTripAPI(
          args.departure,
          args.destination,
          args.date
        );
      } else if (functionName === "get_available_seats") {
        functionResult = await callYourSeatAPI(args.tripId);
      } else if (functionName === "book_ticket") {
        functionResult = await callYourBookingAPI(
          args.tripId,
          args.seatIds,
          args.passengerInfo,
          args.pickupPointName, // <-- Thêm tham số mới
          args.dropoffPointName, // <-- Thêm tham số mới
          args.paymentMethod
        );
      } else {
        console.warn(`[AI DEBUG] Tool không xác định: ${functionName}`);
        functionResult = { success: false, error: "Tool không xác định" };
      }

      // console.log(`[AI DEBUG] Kết quả Tool ${functionName}:`, functionResult);

      // Gửi kết quả từ tool của bạn trở lại cho AI
      // Lưu ý: Kết quả của functionResult phải là một JSON object
      return runConversation(
        JSON.stringify({
          functionResponse: {
            name: functionName,
            response: functionResult,
          },
        })
      );
    }
    // --- XỬ LÝ TIN NHẮN TEXT BÌNH THƯỜNG ---
    else if (modelResponsePart.text) {
      const botReply = modelResponsePart.text;
      // Thêm tin nhắn của bot vào lịch sử
      chatHistory.push({ role: "model", parts: [{ text: botReply }] });
      return botReply;
    }

    console.error(
      "[AI DEBUG] LỖI: Không phải text hay function call",
      modelResponsePart
    );
    return "Tôi không chắc mình hiểu ý bạn (lỗi response).";
  } catch (error) {
    console.error("Lỗi nghiêm trọng trong runConversation:", error);
    // Xóa tin nhắn cuối của user nếu thất bại để họ thử lại
    chatHistory.pop();
    return "Đã xảy ra lỗi hệ thống. Vui lòng thử lại. " + error.message;
  }
};
