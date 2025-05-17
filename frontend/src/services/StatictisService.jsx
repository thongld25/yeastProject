import axios from "axios";
import { API_BASE_URL, API_KEY } from "./ApiConfig";

export async function getStatictisOfMeasurement(measurementId) {
  try {
    const userId = localStorage.getItem("userId");
    const res = await axios.get(
      `${API_BASE_URL}/statictis/measurement/${measurementId}`,
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
    console.error("Error fetching statictis:", error);
    throw error.response.data.message || "Failed to fetch statictis";
  }
}

export async function getStatictisOfExperiment(experimentId) {
  try {
    const userId = localStorage.getItem("userId");
    const res = await axios.get(
      `${API_BASE_URL}/statictis/experiment/${experimentId}`,
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
    console.error("Error fetching statictis:", error);
    throw error.response.data.message || "Failed to fetch statictis";
  }
}