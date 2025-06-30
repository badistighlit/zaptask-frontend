import {  setCookie } from "./cookies";
import { deleteCookie } from "cookies-next";

export interface PersonalAccessToken {
    token?: string|null,
    tokenable_id?: string|null,
    name?: string|null,
    tokenable_type?: string|null,
    abilities?: string[]|null,
    last_used_at?: Date|null,
    expires_at?: Date|null,
}

function saveUserInfo({ tokenable_id, token }: PersonalAccessToken): void {
      if (!token || !tokenable_id) return;

    localStorage.setItem('user', JSON.stringify({
        id: tokenable_id,
        token: token,
    }));

    setCookie("token", token); 

    
}

function loadUserInfo(): PersonalAccessToken|undefined {

    const user = localStorage.getItem('user');
    if (! user) {
        return;
    }

    const savedUserInfo = JSON.parse(user);
    


    return {
        token : savedUserInfo.token,
        tokenable_id : savedUserInfo.id,
    };
}

function deleteUserInfo(): void {
    localStorage.removeItem('user');
    deleteCookie("token");
}

export { saveUserInfo, loadUserInfo,deleteUserInfo };