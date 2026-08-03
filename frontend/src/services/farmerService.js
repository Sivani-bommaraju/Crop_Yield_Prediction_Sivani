import api from "./api";

// export const getFarmerProfile = async () => {

//   const token = localStorage.getItem("token");

//   const response = await api.get("/farmer/profile", {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   return response.data;
// };

export const createFarmerProfile = async (profile) => {

  const token = localStorage.getItem("token");

  const response = await api.put(
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

export const updateFarmerProfile = async (profile) => {

    const token = localStorage.getItem("token");

    const response = await api.put(
        "/farmer/profile",
        profile,
        {
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    );

    return response.data;

};



// export const saveFarmerProfile = async (data) => {

//     const token = localStorage.getItem("token");

//     const response = await api.put(
//         "/farmer/profile",
//         data,
//         {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         }
//     );

//     return response.data;
// };



const token = () => localStorage.getItem("token");

export const getFarmerProfile = async () => {
  const res = await api.get("/farmer/profile", {
    headers: {
      Authorization: `Bearer ${token()}`
    }
  });

  return res.data;
};

export const saveFarmerProfile = async (data) => {
  const res = await api.put("/farmer/profile", data, {
    headers: {
      Authorization: `Bearer ${token()}`
    }
  });

  return res.data;
};



export const getFarmerAdvisories = async () => {

    const token = localStorage.getItem("token");

    const res = await api.get(
        "/farmer/advisories",
        {
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    );

    return res.data;
};