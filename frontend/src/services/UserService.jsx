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

export async function createUser(
  email,
  name,
  role,
  factoryId,
  gender,
  birthDate,
  password
) {
  try {
    const userId = localStorage.getItem("userId");
    const res = await axios.post(
      `${API_BASE_URL}/user/create`,
      { email, name, role, factoryId, gender, birthDate, password },
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

export async function countingExperimentOfUser() {
  try {
    const userId = localStorage.getItem("userId");
    const res = await axios.get(`${API_BASE_URL}/user/counting/${userId}`, {
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

export async function deleteUser(id) {
  try {
    const userId = localStorage.getItem("userId");
    const res = await axios.delete(`${API_BASE_URL}/user/delete/${id}`, {
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

export async function updateUser(id, updateData) {
  try {
    const userId = localStorage.getItem("userId");
    const { name, role, gender, birthDate } = updateData;
    const res = await axios.put(
      `${API_BASE_URL}/user/update/${id}`,
      { name, role, gender, birthDate },
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
export async function getEmployeeInFactoryOfManager() {
  try {
    const userId = localStorage.getItem("userId");
    const res = await axios.get(`${API_BASE_URL}/user/manager/employee`, {
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

export async function changePassword(oldPassword, newPassword) {
  try {
    const userId = localStorage.getItem("userId");
    const res = await axios.post(
      `${API_BASE_URL}/user/change-password`,
      { userId, oldPassword, newPassword },
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
    console.error("Error changing password:", error);
    throw error.response.data.message || "Failed to change password";
  }
}
