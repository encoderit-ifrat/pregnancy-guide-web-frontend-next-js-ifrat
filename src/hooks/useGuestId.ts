import { useEffect, useState } from "react";

export const useGuestId = () => {
  const KEY = "familj_guest_id";
  const [guestId, setGuestId] = useState<string | null>(null);

  useEffect(() => {
    let id = localStorage.getItem(KEY);

    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(KEY, id);
    }

    setGuestId(id);
  }, []);

  return guestId;
};
