import api from "@/utils/api";
import { LoginData, RegisterData } from "../types/auth";

export const login = async (data: LoginData) => await api.post("/me", data);

export const register = async (data: RegisterData) => { 
    console.log(data)
    const req = {
        "name":data.fullName,
        "email":data.email,
        "password":data.password,
        "password_confirmation":data.confirmPassword
    }
   const response =  await api.post("/register", req )
   return response.data;

};