import React from "react";
import clsx from "clsx";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "destructive";
  icon?: React.ReactNode;
  label?: string;
};

const Button = ({
  className,
  variant = "primary",
  icon,
  label,
  ...props
}: Props) => {
  const baseStyle =
    "flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl font-medium text-sm transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantStyle = clsx({
    "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500":
      variant === "primary",
    "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-400":
      variant === "secondary",
    "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500":
      variant === "destructive",
  });

  return (
    <button {...props} className={clsx(baseStyle, variantStyle, className)}>
      {icon && <span className="text-base">{icon}</span>}
      {label && <span className="hidden sm:inline">{label}</span>}
    </button>
  );
};

export default Button;
