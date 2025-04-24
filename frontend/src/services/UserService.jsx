import axios from "axios";
import { API_BASE_URL, API_KEY } from "./ApiConfig";


export async function getUserOfFactory(factoryId) {
  try {
    const userId = localStorage.getItem("userId");
    const res = await axios.get(`${API_BASE_URL}/user/factory/${factoryId}`, {
      headers: {
        "x-api-key": API_KEY,
        "x-client-id": userId,
        authorization: localStorage.getItem("accessToken"),
        refreshtoken: localStorage.getItem("refreshToken"),
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error.response.data.message || "Failed to fetch users";
  }
}

export async function createUser(email, name, role, factoryId, gender, birthDate) {
  try {
    const userId = localStorage.getItem("userId");
    const res = await axios.post(
      `${API_BASE_URL}/user/add`,
      { email, name, role, factoryId, gender, birthDate },
      {
        headers: {
          "x-api-key": API_KEY,
          "x-client-id": userId,
          authorization: localStorage.getItem("accessToken"),
          refreshtoken: localStorage.getItem("refreshToken"),
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error.response.data.message || "Failed to fetch user profile";
  }
}
