import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-terracotta text-cream hover:bg-terracotta-dark disabled:bg-terracotta/50",
  secondary:
    "bg-transparent text-plum border border-plum/30 hover:bg-plum/5 disabled:opacity-50",
  ghost: "bg-transparent text-ink-soft hover:text-ink disabled:opacity-50",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium tracking-wide transition-colors disabled:cursor-not-allowed cursor-pointer ${VARIANT_CLASSES[variant]} ${className}`}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
