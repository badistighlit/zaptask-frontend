import {FormEvent, useState} from "react";
import api from "@/utils/api";
import {AxiosError, isAxiosError} from "axios";
import { saveUserInfo } from "@/utils/authentication";


export default function RegisterForm() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirm_password: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({
            ...prev,
            [name]: value,
        }));
    };

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        const form = event.currentTarget;
        const fullName = form.children.namedItem('fullName') as HTMLInputElement;
        const email = form.children.namedItem('email') as HTMLInputElement;
        const password = form.children.namedItem('password') as HTMLInputElement;
        const passwordConfirmation = form.children.namedItem('confirm_password') as HTMLInputElement;

        try {
            const response = await api.post('/register', {
                "name": fullName.value,
                "email": email.value,
                "password": password.value,
                "password_confirmation": passwordConfirmation.value,
            });

            saveUserInfo(response.data)

        } catch (e: unknown) {
            console.log(isAxiosError(e) && e as AxiosError);
        }

    }

    return (
        <div className="flex items-center justify-center min-h-screen border-solid bg-foreground">
            <form onSubmit={handleSubmit}
                  className="relative flex flex-col items-center gap-2 p-6 border border-gray-400 rounded-md bg-white shadow-md w-[400px] h-[650px]">
                <h1
                    className="text-3xl font-bold text-base text-center mb-4 mt-4 text-black"
                >
                    Login
                </h1>
                <br/>
                <input
                    type="text"
                    name="fullName"
                    required
                    className="rounded border-transparent transition-colors block w-64 mb-2 bg-foreground text-background text-center hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                    placeholder="Abdelkrim Brahmi"
                    onChange={handleChange}
                    value={formData.fullName}
                />
                <br/>
                <input
                    type="email"
                    name="email"
                    required
                    className="rounded border-transparent transition-colors block w-64 mb-2 bg-foreground text-background text-center hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                    placeholder="example@email.com"
                    onChange={handleChange}
                    value={formData.email}
                />
                <br/>
                <input
                    type="password"
                    name="password"
                    required
                    className="rounded border-transparent transition-colors block w-64 mb-2 bg-foreground text-background text-center hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                    placeholder="password"
                    onChange={handleChange}
                    value={formData.password}
                />
                <br/>
                <input
                    type="password"
                    name="confirm_password"
                    required
                    className="rounded border-transparent transition-colors block w-64 mb-2 bg-foreground text-background text-center hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                    placeholder="confirm password"
                    onChange={handleChange}
                    value={formData.confirm_password}
                />
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