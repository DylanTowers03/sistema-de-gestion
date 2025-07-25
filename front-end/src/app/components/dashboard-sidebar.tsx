"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { useDashboardWindow } from "./DashboardWindowProvider";
import { sidebarItems } from "@/lib/constants";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
interface DashboardSidebarProps {
  className?: string;
}

export function DashboardSidebar({ className }: DashboardSidebarProps) {
  const [activeItem, setActiveItem] = useState<string | null>("Productos");
  const { setWhatIsOpen } = useDashboardWindow();
  const router = useRouter();
  const handleItemClick = (title: string) => {
    setActiveItem(title);
    if (title === "Productos" || title === "Tipos" || title === "Categorias") {
      setWhatIsOpen(
        title.toLowerCase() as "productos" | "tipos" | "categorias"
      );

      router.push("/dashboard/home");
    }

    if (title === "Clientes") {
      //navidate to Clientes page
      router.push("/dashboard/clientes");
    }
  };

  return (
    <div className={cn("pb-12 w-64", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <ScrollArea className="h-[calc(100vh-8rem)]">
              <div className="space-y-2 p-2">
                {sidebarItems.map((item) => (
                  <Button
                    key={item.title}
                    variant={activeItem === item.title ? "secondary" : "ghost"}
                    onClick={() => handleItemClick(item.title)}
                    className={cn(
                      "w-full justify-start h-10 px-3 cursor-pointer",
                      `${
                        activeItem === item.title
                          ? "bg-secondary text-secondary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      }`
                    )}
                  >
                    <item.icon className="mr-3 h-4 w-4" />
                    <span className="flex-1 text-left">{item.title}</span>
                    {activeItem === item.title && (
                      <ChevronRight className="ml-auto h-4 w-4" />
                    )}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
