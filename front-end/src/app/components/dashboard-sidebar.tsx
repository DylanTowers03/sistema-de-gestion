"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { useDashboardWindow } from "./DashboardWindowProvider";
import { sidebarItems } from "@/lib/constants";
import { ChevronRight } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "./UserContext";
interface DashboardSidebarProps {
  className?: string;
}

export function DashboardSidebar({ className }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { session } = useUser();
  const active = pathname.split("/").pop() || "";
  console.log("Active Path:", active);

  const [activeItem, setActiveItem] = useState<string | null>(
    active != "home" ? active.toLowerCase() : "productos"
  );

  const { setWhatIsOpen } = useDashboardWindow();
  const router = useRouter();
  const handleItemClick = (title: string) => {
    setActiveItem(title);
    if (
      title === "Productos" ||
      title === "Tipos de Productos" ||
      title === "Categorias de Productos"
    ) {
      // Set the state to open the corresponding section
      if (title === "Productos") {
        setWhatIsOpen("productos");
      } else if (title === "Tipos de Productos") {
        setWhatIsOpen("tipos");
        setActiveItem("tipos de productos");
      } else if (title === "Categorias de Productos") {
        setWhatIsOpen("categorias");
        setActiveItem("categorias de productos");
      }

      router.push("/dashboard/home");
    }

    if (title === "Clientes") {
      //navidate to Clientes page
      setWhatIsOpen("clientes");
      router.push("/dashboard/clientes");
    }

    if (title === "Proveedores") {
      //navigate to Proveedores page
      setWhatIsOpen("proveedores");
      router.push("/dashboard/proveedores");
    }

    if (title === "Negocios") {
      //navigate to Negocios page
      setWhatIsOpen("negocios");
      router.push("/dashboard/negocios");
    }
  };

  const isAllowed = session?.user.roles.includes("SuperAdmin");

  return (
    <div className={cn("pb-12 w-64", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <ScrollArea className="h-[calc(100vh-8rem)]">
              <div className="space-y-2 p-2">
                {sidebarItems.map((item) => {
                  if (item.title === "Negocios" && !isAllowed) {
                    return null;
                  }

                  return (
                    <Button
                      key={item.title}
                      variant={
                        activeItem === item.title.toLowerCase()
                          ? "secondary"
                          : "ghost"
                      }
                      onClick={() => handleItemClick(item.title)}
                      className={cn(
                        "w-full justify-start h-10 px-3 cursor-pointer",
                        `${
                          activeItem === item.title.toLowerCase()
                            ? "bg-secondary text-secondary-foreground"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        }`
                      )}
                    >
                      <item.icon className="mr-3 h-4 w-4" />
                      <span className="flex-1 text-left">{item.title}</span>
                      {activeItem === item.title.toLowerCase() && (
                        <ChevronRight className="ml-auto h-4 w-4" />
                      )}
                    </Button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
