export function FormMessage({
  error,
  message,
}: {
  error?: string;
  message?: string;
}) {
  if (!error && !message) return null;
  return (
    <p
      className={`mb-4 rounded-lg px-3 py-2 text-sm ${
        error
          ? "bg-terracotta/10 text-terracotta-dark"
          : "bg-sage/10 text-sage"
      }`}
    >
      {error ?? message}
    </p>
  );
}
