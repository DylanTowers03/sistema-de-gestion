// next-auth.d.ts
import NextAuth from "next-auth"
import { User } from "./types"

declare module "next-auth" {
  interface Session {
    accessToken?: string
    refreshToken?: string
    user: User
    accessTokenExpires?: number;
    
  }

  interface User {
    id: number
    nombre: string
    correo: string
    roles: string[]
    accessToken?: string
    refreshToken?: string
    accessTokenExpires?: number;

  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: number
    nombre?: string
    correo?: string
    roles?: string[]
    accessToken?: string
    refreshToken?: string
    accessTokenExpires?: number;
  }
}
