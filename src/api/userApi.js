import axiosClient from "./axiosClient";

export async function getUsers() {
  const response = await axiosClient.get("/api/users");
  // Backend Users mengembalikan object: { data: [...] }
  return response.data.data || [];
}

export async function createUser(data) {
  const response = await axiosClient.post("/api/users/add", data);
  return response.data;
}