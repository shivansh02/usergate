import NextAuth from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/server"
import Google from "next-auth/providers/google"
import Github from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import { saltAndHashPassword } from "@/utils/password"
import { getUserFromDb } from "@/utils/db"
 
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  session: {
    strategy: "jwt",
  },
  providers: [
    Google({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    Github({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),
    Credentials({
        // You can specify which fields should be submitted, by adding keys to the `credentials` object.
        // e.g. domain, username, password, 2FA token, etc.
        credentials: {
            email: {},
            password: {},
        },
        authorize: async (credentials) => {
            let user = null
    
            // logic to salt and hash password
            const pwHash = saltAndHashPassword(credentials.password as string)
    
            // logic to verify if user exists
            user = await getUserFromDb(credentials.email as string, pwHash)
    
            if (!user) {
            // No user found, so this is their first attempt to login
            // meaning this is also the place you could do registration
            throw new Error("User not found.")
            }
    
            // return user object with the their profile data
            return user
        },
        }),
  ],
})