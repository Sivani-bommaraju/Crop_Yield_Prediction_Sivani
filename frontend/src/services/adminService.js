import api from "./api";

export const getDashboard = async () => {

    const res = await api.get("/admin/dashboard");

    return res.data;
};

export const getUsers = async () => {

    const res = await api.get("/admin/users");

    return res.data;
};

export const deleteUser = async (id) => {

    return await api.delete(`/admin/users/${id}`);
};

export const updateRole = async (id, role) => {

    return await api.patch(

        `/admin/users/${id}`,

        {
            role
        }

    );

};