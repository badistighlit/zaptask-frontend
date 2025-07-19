"use client";
import {AxiosError, isAxiosError} from "axios";
import { saveUserInfo } from "@/utils/authentication";
import { useForm } from "react-hook-form";
import { LoginData } from "@/types/auth";
import { login } from "@/services/auth";
import { useNotify } from "@/components/NotificationProvider";





export default function LoginForm() {
    const notify = useNotify();


    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginData>({
        reValidateMode: "onChange"
    });

async function onSubmit(data: LoginData) {
    try {
        const response = await login(data);

        if (response.status === 200) {
            saveUserInfo(response.data);
            notify("Login successful!", "success");
            window.location.href = "/dashboard";
        } else {
            notify("Login failed. Please check your credentials.", "error");
        }
    } catch (e: unknown) {
        if (isAxiosError(e)) {
            const status = e.response?.status;
            if (status && status !== 200) {
                notify("Login failed. Please check your credentials.", "error");
            } else {
                notify("An unexpected error occurred. Please try again later.", "error");
            }
            console.log(e as AxiosError);
        } else {
            console.error(e);
            notify("An unexpected error occurred. Please try again later.", "error");
        }
    }
}


    return (
        <div className="flex items-center justify-center min-h-screen border-solid bg-background">
            <form onSubmit={handleSubmit(onSubmit)}
                  className="relative flex flex-col items-center gap-2 p-6 border border-gray-400 rounded-md bg-white shadow-md w-[400px] h-[450px]">
                <h1
                    className="text-3xl font-bold text-base text-center mb-4 mt-4 text-black"
                >
                    Login
                </h1>
                <br/>
                <input
                    type="email"
                    required
                    {...register('email', { required: 'Email is required' })}
                    className="bg-white text-black border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="example@email.com"
                />
                {errors.email && <p className="text-red-400">{errors.email.message as string}</p>}
                <br/>
                <input
                    type="password"
                    {...register('password', { required: 'Password is required' })}
                     className="bg-white text-black border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="password"
                />
                {errors.password && <p className="text-red-400">{errors.password.message as string}</p>}
                <br/>
                <a
                    className="text-blue-300 block mx-auto mb-4 text-center"
                    href='register'
                >
                    Don&apos;t have an account?
                </a>
                <br/>
                <br/>
                <button
                    type="submit"
                    className="absolute bottom-10 right-10 ml-auto rounded border-solid border-transparent transition-colors flex items-center justify-center  bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] cursor-pointer font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
                >
                    Login
                </button>
            </form>
        </div>
    );
}
