import axios from "axios";
import { API_BASE_URL, API_KEY } from "./ApiConfig";

export async function getMeasurementByExperimentId(experimentId) {
  try {
    const userId = localStorage.getItem("userId");
    const res = await axios.get(
      `${API_BASE_URL}/measurement/experiment/${experimentId}`,
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
    console.error("Error fetching users:", error);
    throw error.response.data.message || "Failed to fetch users";
  }
}

export async function createMeasurement(
  name,
  experimentId,
  time,
  imageType,
  lensType
) {
  try {
    const userId = localStorage.getItem("userId");
    const res = await axios.post(
      `${API_BASE_URL}/measurement/add`,
      { name, experimentId, time, imageType, lensType },
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
    console.error("Error fetching users:", error);
    throw error.response.data.message || "Failed to fetch users";
  }
}

export async function addImage(measurementId, image, name) {
  try {
    const userId = localStorage.getItem("userId");
    const formData = new FormData();
    formData.append("image", image);
    formData.append("name", name);
    const res = await axios.post(
      `${API_BASE_URL}/image/add/${measurementId}`,
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

export async function deleteMeasurement(measurementId) {
  try {
    const userId = localStorage.getItem("userId");
    const res = await axios.delete(
      `${API_BASE_URL}/measurement/delete/${measurementId}`,
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
    console.error("Error fetching users:", error);
    throw error.response.data.message || "Failed to fetch users";
  }
}

export async function updateMeasurement(measurementId, data) {
  try {
    const userId = localStorage.getItem("userId");
    const { name, time } = data;

    const res = await axios.put(
      `${API_BASE_URL}/measurement/update/${measurementId}`,
      { name, time },
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
    console.error("Error updating measurement:", error);
    throw error.response?.data?.message || "Failed to update measurement";
  }
}

export async function getMeasurementById(measurementId) {
  try {
    const userId = localStorage.getItem("userId");
    const res = await axios.get(
      `${API_BASE_URL}/measurement/${measurementId}`,
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
    console.error("Error fetching users:", error);
    throw error.response.data.message || "Failed to fetch users";
  }
}

export async function getMeasurementOfUser(page = 1, limit = 5) {
  try {
    const userId = localStorage.getItem("userId");
    const res = await axios.get(`${API_BASE_URL}/measurement/employee`, {
      params: { page, limit },
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

export async function searchMeasurementOfEmployee(
  name,
  startTime,
  endTime,
  page = 1,
  limit = 5
) {
  try {
    const userId = localStorage.getItem("userId");
    const res = await axios.get(`${API_BASE_URL}/measurement/employee/search`, {
      params: { name, startTime, endTime, page, limit },
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
