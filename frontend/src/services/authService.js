import api from "./api";

export const registerUser = async (data) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const loginUser = async (data) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const googleLoginBackend = async (idToken) => {

  const response = await api.post("/auth/google", {
    idToken,
  });

  return response.data;
};