import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";

const FIELD_CLASSES =
  "w-full rounded-xl border border-line bg-white px-4 py-2.5 text-ink placeholder:text-ink-soft/50 outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/15 transition-colors";

export function Label({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-sm font-medium text-ink"
    >
      {children}
    </label>
  );
}

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className = "", ...props }, ref) => (
  <input ref={ref} className={`${FIELD_CLASSES} ${className}`} {...props} />
));
Input.displayName = "Input";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className = "", ...props }, ref) => (
  <textarea ref={ref} className={`${FIELD_CLASSES} ${className}`} {...props} />
));
Textarea.displayName = "Textarea";
