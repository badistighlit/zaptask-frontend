import { FormEvent, useState } from "react";
import api from "@/utils/api";
import {AxiosError, isAxiosError} from "axios";
import { saveUserInfo } from "@/utils/authentication";

export default function LoginForm() {
    const [errorMsg, setErrorMsgState] = useState<string>("");
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({
            ...prev,
            [name]: value,
        }));
        setErrorMsgState("");
    };

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        const form = event.currentTarget;
        const email = form.children.namedItem('email') as HTMLInputElement;
        const password = form.children.namedItem('password') as HTMLInputElement;

        try {
            const response = await api.post('/me', {
                "email": email.value,
                "password": password.value,
            });

            saveUserInfo(response.data);

        } catch (e: unknown) {
            if (isAxiosError(e)) {
                console.log(e as AxiosError);
                setErrorMsgState(e.response?.data.message);
            }
            console.error(e);
        }

    }

    return (
        <div className="flex items-center justify-center min-h-screen border-solid bg-foreground">
            <form onSubmit={handleSubmit}
                  className="relative flex flex-col items-center gap-2 p-6 border border-gray-400 rounded-md bg-white shadow-md w-[400px] h-[450px]">
                <h1
                    className="text-3xl font-bold text-base text-center mb-4 mt-4 text-black"
                >
                    Login
                </h1>
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
                {
                    errorMsg &&
                    <text className="text-base text-center text-red-400">
                        {errorMsg}
                    </text>
                }
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
                    className="absolute bottom-10 right-10 ml-auto rounded border-solid border-transparent transition-colors flex items-center justify-center  bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
                >
                    Login
                </button>
            </form>
        </div>
    );
}
