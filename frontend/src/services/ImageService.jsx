import axios from "axios";
import { API_BASE_URL, API_KEY } from "./ApiConfig";

export async function getImagesOfMeasurement(measurementId) {
  try {
    const userId = localStorage.getItem("userId");
    const res = await axios.get(
      `${API_BASE_URL}/measurement/images/${measurementId}`,
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

export async function getImagesById(imageId) {
  try {
    const userId = localStorage.getItem("userId");
    const res = await axios.get(`${API_BASE_URL}/image/image/${imageId}`, {
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
    const res = await axios.get(
      `${API_BASE_URL}/measurement/job-status/${jobId}`,
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

export async function getImagesByUserIdPage(page = 1, limit = 5) {
  try {
    const userId = localStorage.getItem("userId");
    const res = await axios.get(`${API_BASE_URL}/image/user`, {
      params: {
        page: page,
        limit: limit,
      },
      headers: {
        "x-api-key": API_KEY,
        "x-client-id": userId,
        authorization: localStorage.getItem("accessToken"),
        refreshtoken: localStorage.getItem("refreshToken"),
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching images:", error);
    throw error.response?.data?.message || "Failed to fetch images";
  }
}

export async function searchImagesOfUser(
  page = 1,
  limit = 5,
  { name, experimentId, measurementId }
) {
  try {
    const userId = localStorage.getItem("userId");
    const res = await axios.get(`${API_BASE_URL}/image/search`, {
      params: {
        page: page,
        limit: limit,
        name,
        experimentId,
        measurementId,
      },
      headers: {
        "x-api-key": API_KEY,
        "x-client-id": userId,
        authorization: localStorage.getItem("accessToken"),
        refreshtoken: localStorage.getItem("refreshToken"),
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching images:", error);
    throw error.response?.data?.message || "Failed to fetch images";
  }
}

export async function getImagesInFactoryOfManager(page = 1, limit = 5) {
  try {
    const userId = localStorage.getItem("userId");
    const res = await axios.get(`${API_BASE_URL}/image/manager/all`, {
      params: {
        page: page,
        limit: limit,
      },
      headers: {
        "x-api-key": API_KEY,
        "x-client-id": userId,
        authorization: localStorage.getItem("accessToken"),
        refreshtoken: localStorage.getItem("refreshToken"),
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching images:", error);
    throw error.response?.data?.message || "Failed to fetch images";
  }
}

export async function searchImagesInFactoryOfManager(
  page = 1,
  limit = 5,
  { name, experimentId, measurementId, employeeId }
) {
  try {
    const userId = localStorage.getItem("userId");
    const res = await axios.get(`${API_BASE_URL}/image/manager/search`, {
      params: {
        page: page,
        limit: limit,
        name,
        experimentId,
        measurementId,
        employeeId,
      },
      headers: {
        "x-api-key": API_KEY,
        "x-client-id": userId,
        authorization: localStorage.getItem("accessToken"),
        refreshtoken: localStorage.getItem("refreshToken"),
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching images:", error);
    throw error.response?.data?.message || "Failed to fetch images";
  }
}
