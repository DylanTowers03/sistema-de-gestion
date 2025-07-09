"use client";

import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useUser } from "./UserContext";
export default function SessionGuard() {
  const { session } = useUser();

  useEffect(() => {
    if (session) {
      const expires = session?.accessTokenExpires;
      if (expires && Date.now() > expires) {
        signOut({ callbackUrl: "/auth/login" });
      }
    }
  }, [session]);

  return null;
}
