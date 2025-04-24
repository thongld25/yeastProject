import axios from "axios";
import { API_BASE_URL, API_KEY } from "./ApiConfig";

export async function login(email, password) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/login`,
      {
        email,
        password,
      },
      {
        headers: {
          "x-api-key": API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error.response.data.message || "Login failed";
  }
}

export async function getUserProfile() {
  try {
    const userId = localStorage.getItem("userId");
    const res = await axios.get(`${API_BASE_URL}/user/${userId}`, {
      headers: {
        "x-api-key": API_KEY,
        "x-client-id": userId,
        "authorization": localStorage.getItem("accessToken"),
        "refreshtoken": localStorage.getItem("refreshToken"),
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error.response.data.message || "Failed to fetch user profile";
  }
}
