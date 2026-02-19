import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className = '', variant = 'primary', size = 'md', isLoading, children, disabled, ...props },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-lg font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none outline-none focus:ring-2 focus:ring-adworks-blue/20';

    const variants = {
      primary: 'bg-adworks-blue text-white shadow-lg shadow-blue-500/20 hover:brightness-110',
      secondary: 'bg-adworks-dark text-white hover:opacity-90',
      ghost: 'bg-transparent text-adworks-muted hover:bg-adworks-accent hover:text-adworks-dark',
      danger: 'bg-status-danger text-white hover:brightness-110 shadow-lg shadow-red-500/10',
      outline: 'bg-transparent border border-adworks-border text-adworks-dark hover:bg-adworks-bg',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-[10px] tracking-widest',
      md: 'px-5 py-2.5 text-xs tracking-wider',
      lg: 'px-8 py-4 text-sm tracking-[0.1em]',
    };

    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);
