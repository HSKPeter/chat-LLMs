/**
 * Official source code example from https://github.com/nextauthjs/next-auth-example/blob/main/pages/api/auth/%5B...nextauth%5D.ts
 */

import { USER_ROLE } from "@/types/userRole"
import { sign } from "crypto";
import NextAuth, { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const ADMIN_EMAILS: string[] = JSON.parse(process.env.ADMIN_EMAILS || "[]");

const MEMBER_EMAILS: string[] = JSON.parse(process.env.MEMBER_EMAILS || "[]");

const providers = [];

if (GITHUB_CLIENT_ID && GITHUB_CLIENT_SECRET) {
  providers.push(
    GithubProvider({
      clientId: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
    })
  )
}

if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    })
  );
}

export const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers/oauth
  providers,
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token }) {
      if (token === undefined) { 
        return token
      }
      const {email} = token;
      if (email && ADMIN_EMAILS.includes(email)) {
        token.userRole = USER_ROLE.ADMIN
      } else if (email && MEMBER_EMAILS.includes(email)) {
        token.userRole = USER_ROLE.MEMBER
      } else if (email) {
        token.userRole = USER_ROLE.USER
      } else {
        token.userRole = USER_ROLE.GUEST
      }
      return token
    },
  },
}

const nextAuthHandler = NextAuth(authOptions)
  
export default nextAuthHandler;

