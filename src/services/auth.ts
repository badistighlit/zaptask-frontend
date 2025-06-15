import api from "@/utils/api";
import { LoginData, RegisterData } from "../types/auth";

export const login = (data: LoginData) => api.post("/me", data);

export const register = (data: RegisterData) => api.post("/register", data);