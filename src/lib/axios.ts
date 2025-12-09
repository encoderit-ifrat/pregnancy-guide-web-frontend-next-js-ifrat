import axios from "axios";
import { getSession, signOut } from "next-auth/react";
import https from "https";
import { toast } from "sonner";

const baseURL = process.env.NEXT_PUBLIC_API_URL;
const allowInsecureSSL = process.env.ALLOW_INSECURE_SSL === "true";

const api = axios.create({
  baseURL: `${baseURL}/api`,
  withCredentials: false,
  httpsAgent: allowInsecureSSL
    ? new https.Agent({ rejectUnauthorized: false })
    : undefined,
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    const session = await getSession();

    if (session?.token) {
      config.headers.Authorization = `Bearer ${session.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (!error.response) {
      // Network error or request was cancelled
      toast.error("Network Error", {
        description: "Please check your internet connection and try again.",
      });
      return Promise.reject({
        message: "Network error. Please check your connection.",
        originalError: error,
      });
    }

    const { status, data } = error.response;

    switch (status) {
      case 400:
        // Bad Request — often invalid parameters or malformed data
        toast.error("Bad Request", {
          description:
            data?.message ||
            "Your request could not be processed. Please check your input.",
        });
        return Promise.reject({
          message:
            data?.message ||
            "Your request could not be processed. Please check your input.",
          status: 400,
          data,
        });

      case 401:
        // Unauthorized - token expired or invalid
        toast.error(data?.message || "Session Expired", {
          description: "Your session has expired. Please login again.",
        });
        await signOut({ redirect: false });
        window.location.href = "/login";
        return Promise.reject({
          message: "Your session has expired. Please login again.",
          status: 401,
          data,
        });

      case 403:
        // Forbidden - user doesn't have permission
        toast.error("Access Denied", {
          description:
            data?.message ||
            "You don't have permission to access this resource.",
        });
        return Promise.reject({
          message:
            data?.message ||
            "You don't have permission to access this resource.",
          status: 403,
          data,
        });
      case 422:
        // Unprocessable Entity - validation errors
        // Extract first error message from errors object
        let validationMessage = data?.message || "Validation failed";
        if (data?.errors && typeof data.errors === "object") {
          const firstErrorKey = Object.keys(data.errors)[0];
          const firstError = data.errors[firstErrorKey];
          if (Array.isArray(firstError) && firstError.length > 0) {
            validationMessage = firstError[0];
          }
        }

        toast.error("Validation Error", {
          description: validationMessage,
        });
        return Promise.reject({
          message: validationMessage,
          status: 422,
          data,
          errors: data?.errors, // Pass validation errors for form handling
        });

      case 404:
        // Not found
        toast.error("Not Found", {
          description: data?.message || "The requested resource was not found.",
        });
        return Promise.reject({
          message: data?.message || "The requested resource was not found.",
          status: 404,
          data,
        });

      case 500:
        // Internal server error
        toast.error("Server Error", {
          description:
            data?.message ||
            "An internal server error occurred. Please try again later.",
        });
        return Promise.reject({
          message:
            data?.message ||
            "An internal server error occurred. Please try again later.",
          status: 500,
          data,
        });

      case 503:
        // Service unavailable
        toast.error("Service Unavailable", {
          description:
            "Service is temporarily unavailable. Please try again later.",
        });
        return Promise.reject({
          message:
            "Service is temporarily unavailable. Please try again later.",
          status: 503,
          data,
        });
        
      default:
        // Catch-all for any unhandled errors
        toast.error(`Unexpected Error (${status})`, {
          description:
            data?.message ||
            "An unexpected error occurred. Please try again later.",
        });
        return Promise.reject({
          message:
            data?.message ||
            "An unexpected error occurred. Please try again later.",
          status,
          data,
        });
    }

  }
);

export default api;
