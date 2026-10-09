import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  className = '', 
  ...props 
}) => {
  const baseClasses = 'font-bold rounded-lg transition-transform active:scale-95 flex items-center justify-center';
  
  const sizeClasses = {
    sm: 'py-2 px-3 text-sm min-h-[44px]',
    md: 'py-3 px-4 text-base min-h-[48px]',
    lg: 'py-4 px-6 text-lg min-h-[56px]',
  };
  
  const variantClasses = {
    primary: 'bg-[var(--primary)] text-white disabled:bg-[var(--muted)] disabled:text-[var(--surface)]',
    secondary: 'bg-[var(--surface)] text-[var(--text)] border border-[var(--muted)]/40 disabled:opacity-50',
  };

  return (
    <button 
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? '...' : children}
    </button>
  );
};
