import api from "@/utils/api";
import { LoginData, RegisterData } from "../types/auth";

export const login = (data: LoginData) => api.post("/me", data);

export const register = (data: RegisterData) => { 
    console.log(data)
    const req = {
        "name":data.fullName,
        "email":data.email,
        "password":data.password,
        "password_confirmation":data.confirmPassword
    }
    api.post("/register", req )

};