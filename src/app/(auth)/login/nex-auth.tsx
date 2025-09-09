// src/auth.ts
import { BASE_URL } from "@/lib/redux/api/baseApi"
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

// Extend the default JWT with our API token
declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null
      email?: string | null
      image?: string | null
    }
    apiToken?: string
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    apiToken?: string
  }
}

export const {
  handlers, // route handlers
  auth, // server helper
  signIn, // server action
  signOut, // server action
} = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // If you need extra scopes:
      // authorization: { params: { scope: "openid email profile" } },
    }),
  ],
  callbacks: {
    // Attach an API token from your backend after Google sign-in
    async jwt({ token, account }) {
      // Only fetch once, at first sign-in
      if (
        !token.apiToken &&
        account?.provider === "google" &&
        account.id_token
      ) {
        try {
          // TODO: Change path to your real Google auth endpoint
          const res = await fetch(`${BASE_URL}/auth/oauth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_token: account.id_token }),
          })
          if (res.ok) {
            const data = await res.json()
            // Expecting { token: "..." } from your API. Adjust as needed.
            token.apiToken = data?.token
          }
        } catch {
          // swallow; user can still be logged in with Google session
        }
      }
      return token
    },
    async session({ session, token }) {
      // Expose apiToken to client
      session.apiToken = token.apiToken
      return session
    },
  },
})
