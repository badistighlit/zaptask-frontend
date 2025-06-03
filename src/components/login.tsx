import { FormEvent, useState } from "react";
import api from "@/utils/api";

export default function LoginForm() {
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
    };

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        const form = event.currentTarget;
        const email = form.children.namedItem('email') as HTMLInputElement;
        const password = form.children.namedItem('password') as HTMLInputElement;

        console.log(email.value);
        console.log(password.value);
        try {
            const response = await api.post('/me', {
                "email": email.value,
                "password": password.value,
            });
        } catch (e) {
            console.log(e.status);
        }

    }

    return (
        <div className="flex items-center justify-center min-h-screen border-solid bg-foreground">
            <form onSubmit={handleSubmit}
                  className="p-6 border border-gray-400 rounded-md bg-white shadow-md">
                <h1
                    className="text-3xl font-bold text-base text-center mb-4 text-black"
                >
                    Login
                </h1>
                <br/>
                <input
                    type="email"
                    name="email"
                    required
                    className="rounded border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
                    placeholder="example@email.com"
                    onChange={handleChange}
                    value={formData.email}
                />
                <br/>
                <input
                    type="password"
                    name="password"
                    required
                    className="rounded border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
                    placeholder="password"
                    onChange={handleChange}
                    value={formData.password}
                />
                <br/>
                <a
                    className="text-blue-300"
                    href='register'
                >
                    Don't have an account?
                </a>
                <br/>
                <br/>
                <button
                    type="submit"
                    className="ml-auto rounded border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}
