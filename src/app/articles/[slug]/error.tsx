"use client";

import { useEffect } from "react";

export default function ArticleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Article page crashed:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-article-bg">
      <h1 className="text-2xl font-semibold mb-3">Something went wrong</h1>

      <p className="text-gray-600 mb-6 max-w-md">
        We could not load this article correctly. Please try again.
      </p>

      <button
        type="button"
        onClick={reset}
        className="rounded-md bg-black px-5 py-2 text-white"
      >
        Try again
      </button>
    </div>
  );
}
