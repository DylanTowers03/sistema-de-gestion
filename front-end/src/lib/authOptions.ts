import axios from "axios";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";
import { User } from "@/types/types";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        correo: { label: "Correo", type: "text", placeholder: "" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await axios.post(
            "http://localhost:8000/autenticacion/api/login/",
            {
              correo: credentials?.correo,
              password: credentials?.password,
            }
          );

          const user = res.data;

          if (user) {
            const jwt = jwtDecode<User>(user.access);
            return {
              id: jwt.id,
              correo: jwt.correo,
              nombre: jwt.nombre,
              negocio: jwt.negocio,
              roles: jwt.roles,
              accessToken: user.access,
              refreshToken: user.refresh,
              accessTokenExpires: jwt.exp * 1000,
            };
          }

          return null;
        } catch (error) {
          console.log(error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as number;
        token.correo = user.correo;
        token.nombre = user.nombre;
        token.roles = user.roles;
        token.negocio = user.negocio;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpires = user.accessTokenExpires;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
        session.accessTokenExpires = token.accessTokenExpires;
        session.user = {
          id: token.id as number,
          correo: token.correo as string,
          nombre: token.nombre as string,
          roles: token.roles as string[],
          negocio: token.negocio as number,
        };
      }

      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
