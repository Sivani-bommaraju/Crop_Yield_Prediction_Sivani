import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

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