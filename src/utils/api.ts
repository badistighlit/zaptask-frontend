import axios from "axios";


const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    // withCredentials: true,
})

// api.interceptors.response.use(
//     res => res,
//     err => {
//         // Handle auth errors, log out, etc.
//         return Promise.reject(err);
//     }
// );

export default api;