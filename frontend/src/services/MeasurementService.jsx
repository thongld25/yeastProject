import axios from "axios";
import { API_BASE_URL, API_KEY } from "./ApiConfig";

export async function getMeasurementByExperimentId(experimentId) {
    try {
      const userId = localStorage.getItem("userId");
      const res = await axios.get(`${API_BASE_URL}/measurement/${experimentId}`, {
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

export async function createMeasurement(name, experimentId, images, time, imageType, lensType) {
  try {
    const userId = localStorage.getItem("userId");
    const formData = new FormData();
    formData.append("name", name);
    formData.append("experimentId", experimentId);
    formData.append("time", time);
    formData.append("lensType", lensType);
    images.forEach((image) => {
      formData.append("images", image);
    });
    formData.append("imageType", imageType);
    const res = await axios.post(`${API_BASE_URL}/measurement/add`, formData, {
      headers: {
        "x-api-key": API_KEY,
        "x-client-id": userId,
        authorization: localStorage.getItem("accessToken"),
        refreshtoken: localStorage.getItem("refreshToken"),
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error.response.data.message || "Failed to fetch users";
  }
}

export async function addImage(measurementId, images, imageType, lensType) {
    try {
      const userId = localStorage.getItem("userId");
      const formData = new FormData();
      formData.append("measurementId", measurementId);
      images.forEach((image) => {
        formData.append("images", image);
      });
      formData.append("imageType", imageType);
      formData.append("lensType", lensType);
      const res = await axios.post(`${API_BASE_URL}/measurement/add/images`, formData, {
        headers: {
          "x-api-key": API_KEY,
          "x-client-id": userId,
          authorization: localStorage.getItem("accessToken"),
          refreshtoken: localStorage.getItem("refreshToken"),
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error.response.data.message || "Failed to fetch users";
    }
  }
