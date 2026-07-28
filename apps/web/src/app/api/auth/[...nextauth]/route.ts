// apps/web/src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/db";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "candidate@career-agents.com" },
        name: { label: "Name", type: "text", placeholder: "Enterprise Candidate" }
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        
        let user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });
        
        if (!user) {
          user = await prisma.user.create({
            data: {
              email: credentials.email,
              name: credentials.name || "Enterprise Candidate",
              targetRole: "Senior Software Engineer",
              settings: {
                create: {}
              },
              metrics: {
                create: {}
              }
            }
          });
        }
        
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image
        };
      }
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "mock-github-client-id",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "mock-github-client-secret",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "mock-google-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock-google-client-secret",
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as any).id = token.sub;
        
        const userDb = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { targetRole: true, targetCompany: true }
        });
        if (userDb) {
          (session.user as any).targetRole = userDb.targetRole;
          (session.user as any).targetCompany = userDb.targetCompany;
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async signIn({ user, account }) {
      if (account?.provider === "github" || account?.provider === "google") {
        if (!user.email) return false;
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email }
        });
        if (!dbUser) {
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name || "OAuth Candidate",
              image: user.image,
              settings: { create: {} },
              metrics: { create: {} }
            }
          });
        }
      }
      return true;
    }
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET || "super-secret-agent-key-2026",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
