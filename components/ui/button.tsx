import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-cyan-400 to-sky-500 text-white hover:from-cyan-500 hover:to-sky-600 hover:shadow-lg hover:shadow-cyan-500/40',
        destructive:
          'bg-gradient-to-r from-rose-500 to-red-600 text-white hover:from-rose-600 hover:to-red-700 hover:shadow-lg hover:shadow-red-400/40',
        outline:
          'border border-cyan-400 text-cyan-600 hover:bg-cyan-50 hover:shadow-lg hover:shadow-cyan-400/30',
        secondary:
          'bg-gradient-to-r from-sky-300 to-cyan-400 text-white hover:from-sky-400 hover:to-cyan-500 hover:shadow-lg hover:shadow-sky-400/40',
        ghost:
          'text-cyan-600 hover:bg-cyan-50 hover:shadow-md hover:shadow-cyan-300/30',
        link: 'text-cyan-600 underline-offset-4 hover:underline hover:shadow-sm hover:shadow-cyan-400/40',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
