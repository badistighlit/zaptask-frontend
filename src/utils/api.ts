import axios from "axios";
import { loadUserInfo, PersonalAccessToken } from "./authentication";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    // withCredentials: true,
});

api.interceptors.request.use(config => {
    if (typeof window === 'undefined') {
        return config;
    }

    const userInfo: PersonalAccessToken|undefined = loadUserInfo();

    if (userInfo && userInfo.token) {
        config.headers['Pat'] = userInfo['token'] as string;
    }

    return config;
}, error => {
    return Promise.reject(error);
})

// api.interceptors.response.use(
//     res => res,
//     err => {
//         // Handle auth errors, log out, etc.
//         return Promise.reject(err);
//     }
// );

export default api;
