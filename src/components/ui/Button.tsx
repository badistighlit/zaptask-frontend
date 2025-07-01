import React from "react";
import clsx from "clsx";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

const Button = ({ children, className, variant = "primary", ...props }: Props) => {
  const baseStyle = "px-4 py-2 rounded font-medium";
  const variantStyle =
    variant === "primary"
      ? "bg-blue-600 hover:bg-blue-700 text-white"
      : "bg-gray-100 hover:bg-gray-200 text-gray-800";

  return (
    <button {...props} className={clsx(baseStyle, variantStyle, className)}>
      {children}
    </button>
  );
};

export default Button;
