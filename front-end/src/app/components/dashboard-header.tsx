"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building2, User, Settings, LogOut, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ModeToggle } from "./toggleThemeButton";
import { signOut } from "next-auth/react";
import { useUser } from "./UserContext";
import { redirect } from "next/navigation";
export function DashboardHeader() {
  const { session } = useUser();
  const roles = session?.user?.roles ?? [];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Building2 className="h-6 w-6 text-primary" />
          <span
            className="font-bold text-xl text-foreground"
            onClick={() => redirect("/dashboard/home")}
            style={{ cursor: "pointer" }}
          >
            Dashboard
          </span>
          <Badge variant="secondary" className="ml-2">
            v1.0
          </Badge>
          <ModeToggle />
        </div>

        {/* Navigation & User Menu */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src="/placeholder.svg?height=32&width=32"
                    alt="Usuario"
                  />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Usuario {session?.user?.name || "Admin"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {session?.user?.email || "admin@example.com"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configuración</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => redirect("/dashboard/invoices/create/")}
              >
                <Building2 className="mr-2 h-4 w-4" />
                <span>Facturar</span>
              </DropdownMenuItem>

              {roles.includes("Admin") && (
                <DropdownMenuItem
                  onClick={() => redirect("/dashboard/minegocio/edit/")}
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  <span>Mi Negocio</span>
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/auth/login" })}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
