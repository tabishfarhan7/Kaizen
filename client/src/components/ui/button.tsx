import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline'
  size?: 'sm' | 'default' | 'lg'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none select-none'
    
    let variantStyles = ''
    if (variant === 'default') {
      variantStyles = 'bg-zinc-950 hover:bg-zinc-900 text-white border border-zinc-950 shadow-sm hover:scale-[1.01]'
    } else if (variant === 'secondary') {
      variantStyles = 'bg-zinc-100 border border-zinc-200/80 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/60 shadow-sm'
    } else if (variant === 'outline') {
      variantStyles = 'border border-zinc-200 hover:border-zinc-300 bg-white/50 backdrop-blur-sm text-zinc-500 hover:text-zinc-800 shadow-xs'
    }

    let sizeStyles = ''
    if (size === 'sm') {
      sizeStyles = 'px-3.5 py-1.5 text-xs gap-2'
    } else if (size === 'default') {
      sizeStyles = 'px-5 py-2.5 text-sm gap-2'
    } else if (size === 'lg') {
      sizeStyles = 'px-7 py-3.5 text-base gap-2.5'
    }

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'
