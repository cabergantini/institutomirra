export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width="30"
        height="30"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="20" cy="20" r="18.5" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M20 10L23.5 18.5L32 20L23.5 21.5L20 30L16.5 21.5L8 20L16.5 18.5L20 10Z"
          fill="currentColor"
        />
      </svg>
      <span className="font-display text-lg leading-tight tracking-tight">
        Instituto Mirra
      </span>
    </div>
  );
}
