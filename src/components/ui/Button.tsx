import React from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  isLoading?: boolean;
}

export function Button({ 
  children, 
  variant = "primary", 
  isLoading, 
  className = "", 
  disabled,
  ...props 
}: ButtonProps) {
  
  let baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none px-4 py-2";
  
  let variantStyles = "";
  switch(variant) {
    case "primary": variantStyles = "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"; break;
    case "secondary": variantStyles = "bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-500"; break;
    case "danger": variantStyles = "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"; break;
    case "ghost": variantStyles = "bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-500"; break;
  }

  return (
    <button 
      className={`${baseStyles} ${variantStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
