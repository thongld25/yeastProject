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

export async function getExperimentsOfEmployee(page = 1, limit = 10) {
  try {
    const userId = localStorage.getItem("userId");
    const res = await axios.get(`${API_BASE_URL}/experiment/employee`, {
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
    console.error("Error fetching user profile:", error);
    throw error.response.data.message || "Failed to fetch user profile";
  }
}

export async function getExperimentByUserId() {
  try {
    const userId = localStorage.getItem("userId");
    const res = await axios.get(`${API_BASE_URL}/experiment/user/all`, {
      headers: {
        "x-api-key": API_KEY,
        "x-client-id": userId,
        authorization: localStorage.getItem("accessToken"),
        refreshtoken: localStorage.getItem("refreshToken"),
      },
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy tất cả thí nghiệm");
    throw error.response.data.message || "Lỗi khi lấy tất cả thí nghiệm";
  }
}

export async function getExperimentByUserIdOfManager(userId1) {
  try {
    const userId = localStorage.getItem("userId");
    const res = await axios.get(`${API_BASE_URL}/experiment/manager/user/${userId1}`, {
      headers: {
        "x-api-key": API_KEY,
        "x-client-id": userId,
        authorization: localStorage.getItem("accessToken"),
        refreshtoken: localStorage.getItem("refreshToken"),
      },
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy tất cả thí nghiệm");
    throw error.response.data.message || "Lỗi khi lấy tất cả thí nghiệm";
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
    const res = await axios.get(`${API_BASE_URL}/experiment/experiment/${experimentId}`, {
      headers: {
        "x-api-key": API_KEY,
        "x-client-id": localStorage.getItem("userId"),
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

export async function searchExperimentsOfEmployee(
  title,
  startTime,
  endTime,
  page = 1,
  limit = 5
) {
  try {
    const userId = localStorage.getItem("userId");
    const res = await axios.get(`${API_BASE_URL}/experiment/search`, {
      params: { title, startTime, endTime, page, limit },
      headers: {
        "x-api-key": API_KEY,
        "x-client-id": userId,
        authorization: localStorage.getItem("accessToken"),
        refreshtoken: localStorage.getItem("refreshToken"),
      },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || "Lỗi tìm kiếm";
  }
}

export async function getExperimentInFactoryOfManager(
  page = 1,
  limit = 10
) {
  try {
    const userId = localStorage.getItem("userId");
    const res = await axios.get(`${API_BASE_URL}/experiment/manager`, {
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
    console.error("Error fetching experiment:", error);
    throw error.response.data.message || "Failed to fetch experiment";
  }
}

export async function searchExperimentsInFactoryOfManager(
  title,
  creatorName,
  startTime,
  endTime,
  page = 1,
  limit = 10
) {
  try {
    const userId = localStorage.getItem("userId");
    const res = await axios.get(`${API_BASE_URL}/experiment/manager/search`, {
      params: { title, creatorName, startTime, endTime, page, limit },
      headers: {
        "x-api-key": API_KEY,
        "x-client-id": userId,
        authorization: localStorage.getItem("accessToken"),
        refreshtoken: localStorage.getItem("refreshToken"),
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching experiment:", error);
    throw error.response.data.message || "Failed to fetch experiment";
  }
}
