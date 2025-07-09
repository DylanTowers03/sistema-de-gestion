"use client";
import React, { createContext } from "react";

type WhatIsOpen = "productos" | "tipos" | "categorias";

const DashboardWindowContext = createContext({
  whatIsOpen: "productos" as WhatIsOpen,
  setWhatIsOpen: (value: WhatIsOpen) => {},
});

export const useDashboardWindow = () =>
  React.useContext(DashboardWindowContext);

export function DashboardWindowProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [whatIsOpen, setWhatIsOpen] = React.useState<WhatIsOpen>("productos");

  return (
    <DashboardWindowContext.Provider value={{ whatIsOpen, setWhatIsOpen }}>
      {children}
    </DashboardWindowContext.Provider>
  );
}
