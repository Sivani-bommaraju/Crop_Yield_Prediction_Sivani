import axios from "axios";

const API = "http://127.0.0.1:8000";

export const predictYield = async (data) => {
    const response = await axios.post(
        `${API}/prediction/predict`,
        data
    );

    return response.data;
};