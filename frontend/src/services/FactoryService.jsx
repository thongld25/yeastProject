import axios from "axios";
import { API_BASE_URL, API_KEY } from "./ApiConfig";

export async function createFactory(name, location) {
  try {
    const userId = localStorage.getItem("userId");
    const res = await axios.post(
      `${API_BASE_URL}/factory/add`,
      { name, location },
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

export async function getFactories() {
  try {
    const userId = localStorage.getItem("userId");
    const res = await axios.get(`${API_BASE_URL}/factory/all`, {
      headers: {
        "x-api-key": API_KEY,
        "x-client-id": userId,
        authorization: localStorage.getItem("accessToken"),
        refreshtoken: localStorage.getItem("refreshToken"),
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching factories:", error);
    throw error.response.data.message || "Failed to fetch factories";
  }
}

export async function getFactoryById(factoryId) {
  try {
    const userId = localStorage.getItem("userId");
    const res = await axios.get(`${API_BASE_URL}/factory/${factoryId}`, {
      headers: {
        "x-api-key": API_KEY,
        "x-client-id": userId,
        authorization: localStorage.getItem("accessToken"),
        refreshtoken: localStorage.getItem("refreshToken"),
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching factory:", error);
    throw error.response.data.message || "Failed to fetch factory";
  }
}
