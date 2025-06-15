"use client";


import {AxiosError, isAxiosError} from "axios";
import { saveUserInfo } from "@/utils/authentication";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import {register as registerUser} from "@/services/auth";
import { RegisterData } from "@/types/auth";


const validationSchema = Yup.object().shape({
    fullName: Yup.string().required('Name is required'),
    email: Yup.string().email().required('Email is required'),
    password: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters long'),
    confirmPassword: Yup.string()
        .required('Confirm Password is required')
        .min(8, 'Password must be at least 8 characters long')
        .oneOf([Yup.ref('password')], 'Passwords do not match'),
});

export default function RegisterForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        clearErrors,
    } = useForm<RegisterData>({
        reValidateMode: "onSubmit",
        resolver: yupResolver(validationSchema),
    });

    async function onSubmit(data : RegisterData) {
        try {
            const response = await registerUser(data);

            saveUserInfo(response.data)

        } catch (e: unknown) {
            console.log(isAxiosError(e) && e as AxiosError);
        }
    }

    const handleErrors = (e: React.ChangeEvent<HTMLInputElement>) => {
        clearErrors(e.target.name as keyof RegisterData);
    }

    return (
        <div className="flex items-center justify-center min-h-screen border-solid bg-foreground">
            <form onSubmit={handleSubmit(onSubmit)}
                  className="relative flex flex-col items-center gap-2 p-6 border border-gray-400 rounded-md bg-white shadow-md w-[400px] h-[650px]">
                <h1
                    className="text-3xl font-bold text-base text-center mb-4 mt-4 text-black"
                >
                    Register
                </h1>
                <br/>
                <input
                    type="text"
                    {...register('fullName')}
                    className="rounded border-transparent transition-colors block w-64 mb-0 bg-foreground text-background text-center hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                    placeholder="Abdelkrim Brahmi"
                    onChange={handleErrors}
                />
                {errors.fullName && <p className="text-red-400">{errors.fullName.message as string}</p>}
                <br/>
                <input
                    type="email"
                    className="rounded border-transparent transition-colors block w-64 mb-0 bg-foreground text-background text-center hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                    placeholder="example@email.com"
                    {...register('email')}
                    onChange={handleErrors}
                />
                {errors.email && <p className="text-red-400">{errors.email.message as string}</p>}
                <br/>
                <input
                    type="password"
                    className="rounded border-transparent transition-colors block w-64 mb-0 bg-foreground text-background text-center hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                    placeholder="Password"
                    {...register('password')}
                    onChange={handleErrors}
                />
                {errors.password && <p className="text-red-400">{errors.password.message as string}</p>}
                <br/>
                <input
                    type="password"
                    className="rounded border-transparent transition-colors block w-64 mb-0 bg-foreground text-background text-center hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                    placeholder="Confirm Password"
                    {...register('confirmPassword')}
                    onChange={handleErrors}
                />
                {errors.confirmPassword && <p className="text-red-400">{errors.confirmPassword.message as string}</p>}
                <br/>
                <a
                    className="text-blue-300 block mx-auto mb-4 text-center"
                    href='login'
                >
                    Already have an account? Login
                </a>
                <button
                    type="submit"
                    className="absolute bottom-10 right-10 ml-auto rounded border-solid border-transparent transition-colors flex items-center justify-center  bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] cursor-pointer font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
                >
                    Register
                </button>
            </form>
        </div>
    );
}