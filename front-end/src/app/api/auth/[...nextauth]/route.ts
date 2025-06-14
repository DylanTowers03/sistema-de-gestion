import axios from "axios"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"


const handler = NextAuth({
  providers:[
    CredentialsProvider({
        name: "Credentials",
        credentials: {
            correo: { label: "Correo", type: "text", placeholder: "" },
            password: { label: "Password", type: "password" },
        },
        async authorize(credentials){
            try {
            const res = await axios.post('http://localhost:8000/autenticacion/api/login/', {
                correo: credentials?.correo,
                password: credentials?.password
            })

            const user = res.data

            if (user) {
                return {
                    ...user,
                    accessToken: user.access,
                    refreshToken: user.refresh,
                }
            }

            return null

            } catch (error) {
                console.log(error);
                return null
            }
        }
    })
  ],
  session:{
    strategy: "jwt"
  },
  callbacks:{
    async jwt({ token, user }) {
        if (user) {
            token.accessToken = user.accessToken
            token.refreshToken = user.refreshToken
        }

        return token
    },
    async session({ session, token }) {
        if (token) {
            session.accessToken = token.accessToken
            session.refreshToken = token.refreshToken
        }

        return session
    }
  },
  pages:{
    signIn: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST } 