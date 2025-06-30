export function setCookie(name: string, value: string, days = 7) {
  const expires = new Date(Date.now() + days * 86400000).toUTCString();
  document.cookie = `${name}=${value}; path=/; expires=${expires}; SameSite=Lax; Secure`;
}

export function getCookie(name: string): string | null {
  const value = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
  return value ? value.pop() || null : null;
}
export function deleteCookie(name: string) {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure`;
}
