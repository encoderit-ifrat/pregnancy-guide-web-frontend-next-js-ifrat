// app/global-error.tsx
"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-2xl font-semibold mb-3">Something went wrong</h1>

          <p className="text-gray-600 mb-6">
            Please refresh the page or try again.
          </p>

          <button
            type="button"
            onClick={reset}
            className="rounded-md bg-black px-5 py-2 text-white"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
