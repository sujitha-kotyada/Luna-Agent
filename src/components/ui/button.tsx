import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e9c88f]/60 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        luna:
          'border border-[#e9c88f]/45 bg-[#0d1019]/55 text-[#fff7e7] shadow-[0_0_36px_rgba(233,200,143,0.12)] hover:border-[#f4dba6]/80 hover:bg-[#171723]/70 hover:shadow-[0_0_46px_rgba(233,200,143,0.24)]',
        ghost:
          'border border-white/10 bg-white/[0.03] text-white/74 hover:border-[#e9c88f]/35 hover:bg-white/[0.07] hover:text-white',
        icon:
          'border border-white/10 bg-white/[0.04] text-white/72 hover:border-[#e9c88f]/40 hover:bg-white/[0.08] hover:text-white',
      },
      size: {
        default: 'h-12 px-5',
        lg: 'h-16 px-10 text-base',
        icon: 'h-11 w-11 rounded-full p-0',
      },
    },
    defaultVariants: {
      variant: 'luna',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button }
