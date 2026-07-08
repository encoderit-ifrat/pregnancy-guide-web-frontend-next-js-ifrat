import { useEffect, useState } from "react";

const generateUUID = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "guest-" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const useGuestId = () => {
  const KEY = "familj_guest_id";
  const [guestId, setGuestId] = useState<string | null>(null);

  useEffect(() => {
    let id: string | null = null;
    try {
      id = localStorage.getItem(KEY);

      if (!id) {
        id = generateUUID();
        localStorage.setItem(KEY, id);
      }
    } catch (error) {
      console.warn("localStorage access blocked or failed. Using transient fallback UUID.", error);
      id = generateUUID();
    }

    setGuestId(id);
  }, []);

  return guestId;
};

