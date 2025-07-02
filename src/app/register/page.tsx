"use client";
import RegisterForm from "./components/RegisterForm";
export default function RegisterPage() {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
          {/* Logo */}
          <img src="/logo-transparent.png" alt="Zaptask Logo" className="mb-6 h-12 w-auto" />
    
          <RegisterForm />
        </div>
      );
}