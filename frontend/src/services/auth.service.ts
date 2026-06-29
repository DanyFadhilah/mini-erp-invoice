import { api } from "@/lib/axios";

export interface LoginPayload {
  email: string;
  password: string;
}

export const login = async (payload: LoginPayload) => {
  await api.post("/auth/login", payload);
};

export const getProfile = async () => {
  const response = await api.get("/auth/profile");

  return response.data;
};

export const logout = async () => {
  await api.post("/auth/logout");
};
