import axios, {InternalAxiosRequestConfig} from "axios";
import { loadUserInfo, PersonalAccessToken } from "./authentication";
import {useEffect, useState} from "react";

type Headers = {
    'Content-Type': string;
    Pat?: string;
};


const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    // withCredentials: true,
});

// api.interceptors.request.use(config => {
//     const [configState, setConfigState] = useState<InternalAxiosRequestConfig>(config);
//
//     useEffect(() => {
//         const userInfo: PersonalAccessToken|undefined = loadUserInfo();
//
//         if (userInfo && userInfo.token) {
//             config.headers['Pat'] = userInfo['token'] as string;
//         }
//
//         setConfigState(config);
//     });
//
//     return configState;
// }, error => {
//     return Promise.reject(error);
// })
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
