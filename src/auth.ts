import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
    trustHost: true,
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            authorize: async (credentials) => {
                const email = credentials?.email as string
                const password = credentials?.password as string

                // Hardcoded admin credentials
                const ADMIN_EMAIL = "gkozyris@dgsmart.gr"
                const ADMIN_PASSWORD = "1f1femsk"

                if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
                    return {
                        id: "1",
                        name: "Admin",
                        email: ADMIN_EMAIL,
                        role: "admin"
                    }
                }

                return null
            },
        }),
    ],
    pages: {
        signIn: "/admin/login",
    },
    callbacks: {
        jwt: async ({ token, user }) => {
            if (user) {
                token.role = (user as any).role
            }
            return token
        },
        session: async ({ session, token }) => {
            if (session.user) {
                (session.user as any).role = token.role
            }
            return session
        },
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
})
