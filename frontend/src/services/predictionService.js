import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export const predictYield = async (data) => {

  const token =
    localStorage.getItem("token");

  const response = await axios.post(
    `${API_URL}/prediction/predict`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};