import api from "@/utils/api";
import {AxiosError, isAxiosError} from "axios";
import { saveUserInfo } from "@/utils/authentication";
import {useForm} from "react-hook-form";

interface RegisterFormData {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export default function RegisterForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>();

    async function onSubmit({ fullName, email, password, confirmPassword }: RegisterFormData) {
        try {
            const response = await api.post('/register', {
                "name": fullName,
                "email": email,
                "password": password,
                "password_confirmation": confirmPassword,
            });

            saveUserInfo(response.data)

        } catch (e: unknown) {
            console.log(isAxiosError(e) && e as AxiosError);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen border-solid bg-foreground">
            <form onSubmit={handleSubmit(onSubmit)}
                  className="relative flex flex-col items-center gap-2 p-6 border border-gray-400 rounded-md bg-white shadow-md w-[400px] h-[650px]">
                <h1
                    className="text-3xl font-bold text-base text-center mb-4 mt-4 text-black"
                >
                    Login
                </h1>
                <br/>
                <input
                    type="text"
                    {...register('fullName', { required: 'Name is required' })}
                    className="rounded border-transparent transition-colors block w-64 mb-2 bg-foreground text-background text-center hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                    placeholder="Abdelkrim Brahmi"
                />
                {errors.fullName && <p className="text-red-400">{errors.fullName.message as string}</p>}
                <br/>
                <input
                    type="email"
                    className="rounded border-transparent transition-colors block w-64 mb-2 bg-foreground text-background text-center hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                    placeholder="example@email.com"
                    {...register('email', { required: 'Email is required' })}
                />
                {errors.email && <p className="text-red-400">{errors.email.message as string}</p>}
                <br/>
                <input
                    type="password"
                    className="rounded border-transparent transition-colors block w-64 mb-2 bg-foreground text-background text-center hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                    placeholder="password"
                    {...register('password', { required: 'Password is required' })}
                />
                {errors.password && <p className="text-red-400">{errors.password.message as string}</p>}
                <br/>
                <input
                    type="password"
                    className="rounded border-transparent transition-colors block w-64 mb-2 bg-foreground text-background text-center hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                    placeholder="confirm password"
                    {...register('confirmPassword', { required: 'Password confirmation is required' })}
                />
                {errors.confirmPassword && <p className="text-red-400">{errors.confirmPassword.message as string}</p>}
                <button
                    type="submit"
                    className="absolute bottom-10 right-10 ml-auto rounded border-solid border-transparent transition-colors flex items-center justify-center  bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
                >
                    Register
                </button>
            </form>
        </div>
    );
}