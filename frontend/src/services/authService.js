import API from "./api";

// LOGIN
export const login = async (data) => {
  const res = await API.post("/auth/login", data);
  localStorage.setItem("user", JSON.stringify(res.data.user));
  localStorage.setItem("token", res.data.token);
  return res.data;
};

// REGISTER
export const register = async (data) => {
  const res = await API.post("/auth/register", data);
  return res.data;
};

// GET USER
export const getUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

// LOGOUT
export const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};