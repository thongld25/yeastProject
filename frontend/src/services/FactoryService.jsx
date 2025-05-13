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
export async function deleteFactory(factoryId) {
  try {
    const userId = localStorage.getItem("userId");
    const res = await axios.delete(
      `${API_BASE_URL}/factory/delete/${factoryId}`,
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
    console.error("Error deleting factory:", error);
    throw error.response.data.message || "Failed to delete factory";
  }
}

export async function updateFactory(factoryId, factory) {
  try {
    const userId = localStorage.getItem("userId");
    const { name, location, status } = factory;
    const res = await axios.put(
      `${API_BASE_URL}/factory/update/${factoryId}`,
      { name, location, status },
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
    console.error("Error updating factory:", error);
    throw error.response.data.message || "Failed to update factory";
  }
}
