import api from "./api";

export const saveProfile = async (profile) => {

    const token = localStorage.getItem("token");

    const response = await api.post(
        "/farmer/profile",
        profile,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};


export const getProfile = async () => {

    const token = localStorage.getItem("token");

    const response = await api.get(
        "/farmer/profile",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};