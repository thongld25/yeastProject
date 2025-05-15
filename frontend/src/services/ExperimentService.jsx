import axios from "axios";
import { API_BASE_URL, API_KEY } from "./ApiConfig";

export async function createExperiment(title, description, time) {
  try {
    const userId = localStorage.getItem("userId");
    const res = await axios.post(
      `${API_BASE_URL}/experiment/add`,
      { title, description, time },
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

export async function getExperimentsOfEmployee() {
  try {
    const userId = localStorage.getItem("userId");
    const res = await axios.get(`${API_BASE_URL}/experiment/employee`, {
      headers: {
        "x-api-key": API_KEY,
        "x-client-id": userId,
        authorization: localStorage.getItem("accessToken"),
        refreshtoken: localStorage.getItem("refreshToken"),
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error.response.data.message || "Failed to fetch user profile";
  }
}

export async function deleteExperiment(experimentId) {
  try {
    const res = await axios.delete(
      `${API_BASE_URL}/experiment/delete/${experimentId}`,
      {
        headers: {
          "x-api-key": API_KEY,
          "x-client-id": localStorage.getItem("userId"),
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

export async function updateExperiment(experimentId, data) {
  try {
    const { title, description, time } = data;
    const res = await axios.put(
      `${API_BASE_URL}/experiment/update/${experimentId}`,
      { title, description, time },
      {
        headers: {
          "x-api-key": API_KEY,
          "x-client-id": localStorage.getItem("userId"),
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

export async function getExperimentById(experimentId) {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/experiment/${experimentId}`,
      {
        headers: {
          "x-api-key": API_KEY,
          "x-client-id": localStorage.getItem("userId"),
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
