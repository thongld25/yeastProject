import axios from "axios";
import { API_BASE_URL, API_KEY } from "./ApiConfig";

export async function getImagesOfMeasurement(measurementId) {
    try {
      const userId = localStorage.getItem("userId");
      const res = await axios.get(`${API_BASE_URL}/measurement/images/${measurementId}`, {
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

export async function getImagesById(imageId) {
    try {
      const userId = localStorage.getItem("userId");
      const res = await axios.get(`${API_BASE_URL}/image/${imageId}`, {
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

export async function deleteImage(imageId) {
    try {
      const userId = localStorage.getItem("userId");
      const res = await axios.delete(`${API_BASE_URL}/image/delete/${imageId}`, {
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

export async function getJobStatus(jobId) {
    try {
      const userId = localStorage.getItem("userId");
      const res = await axios.get(`${API_BASE_URL}/measurement/job-status/${jobId}`, {
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

export async function addMethyleneImage(measurementId, images) {
  try {
    const userId = localStorage.getItem("userId");
    const formData = new FormData();
    images.forEach((image) => {
      formData.append("image", image);
    });
    const res = await axios.post(
      `${API_BASE_URL}/image/add/methylene/${measurementId}`,
      formData,
      {
        headers: {
          "x-api-key": API_KEY,
          "x-client-id": userId,
          authorization: localStorage.getItem("accessToken"),
          refreshtoken: localStorage.getItem("refreshToken"),
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error.response.data.message || "Failed to fetch users";
  }
}

export async function addCountingImage(measurementId, images) {
  try {
    const userId = localStorage.getItem("userId");
    const formData = new FormData();
    images.forEach((image) => {
      formData.append("image", image);
    });
    const res = await axios.post(
      `${API_BASE_URL}/image/add/counting/${measurementId}`,
      formData,
      {
        headers: {
          "x-api-key": API_KEY,
          "x-client-id": userId,
          authorization: localStorage.getItem("accessToken"),
          refreshtoken: localStorage.getItem("refreshToken"),
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error.response.data.message || "Failed to fetch users";
  }
}




