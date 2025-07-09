"use client";
import React, { createContext } from "react";
import { Session } from "next-auth";

type UserContextType = {
  session: Session | null;
};

const UserContext = createContext<UserContextType | null>(null);

export const useUser = () => {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export default function UserProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session;
}) {
  return (
    <UserContext.Provider value={{ session }}>{children}</UserContext.Provider>
  );
}
