import axios from "axios";

const API_URL = "http://localhost:8000";

export const getAnalyticsDashboard = async (period = "6 Months") => {
    const token = localStorage.getItem("token");

    const response = await axios.get(
        `${API_URL}/analytics/dashboard`,
        {
            params: {
                period,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};