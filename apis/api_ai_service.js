import createApiManager from "./Api_Manager.js";

const API_BASE_URL = "http://192.168.1.22:3000/api/v1";
const apiAI = createApiManager(API_BASE_URL);

export const api_ai_service = {
  sendMessageToAI: async (userInput, userId, sessionId) => {
    return apiAI.post("/chat", {
      userInput: userInput,
      userId: userId,
      sessionId: sessionId,
    });
  },
};
