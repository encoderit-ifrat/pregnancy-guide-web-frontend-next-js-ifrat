"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import Loading from "@/app/loading";

export default function Page() {
  const router = useRouter();
  const { user, isLoading } = useCurrentUser();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        const week = user?.details?.current_pregnancy_data?.week ?? 3;
        const day = user?.details?.current_pregnancy_data?.day ?? 0;
        const currentWeek = day > 0 ? week + 1 : week;
        router.replace(`/gravid/vecka/${currentWeek}`);
      } else {
        router.replace("/logga-in");
      }
    }
  }, [user, isLoading, router]);

  return <Loading />;
}
