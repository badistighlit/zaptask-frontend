"use client";
import Login from "./components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
      {/* Logo */}
      <img src="/logo-transparent.png" alt="Zaptask Logo" className="mb-6 h-12 w-auto" />

      <Login />
    </div>
  );
}
