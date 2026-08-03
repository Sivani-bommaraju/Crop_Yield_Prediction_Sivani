import api from "./api";


export const getOfficerDashboard = async () => {

    const res = await api.get(
        "/officer/dashboard"
    );

    return res.data;

};



export const getFarmers = async () => {

    const res = await api.get(
        "/officer/farmers"
    );

    return res.data;

};



export const sendAdvisory = async(data)=>{

    const res = await api.post(
        "/officer/advisory",
        data
    );

    return res.data;

};