// apps/web/src/lib/auth.ts
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";
import AzureADProvider from "next-auth/providers/azure-ad";
import { prisma } from "./db";

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
        
        let user = null;
        try {
          if (process.env.DATABASE_URL) {
            user = await prisma.user.findUnique({
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
          }
        } catch (err) {
          console.warn("Prisma authorize database failure. Falling back to guest credentials:", err);
        }
        
        if (!user) {
          user = {
            id: `usr-guest-${Date.now()}`,
            name: credentials.name || "Enterprise Candidate",
            email: credentials.email,
            image: null
          };
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
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID || "mock-linkedin-client-id",
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET || "mock-linkedin-client-secret",
    }),
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID || "mock-azure-ad-client-id",
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET || "mock-azure-ad-client-secret",
      tenantId: process.env.AZURE_AD_TENANT_ID || "mock-azure-ad-tenant-id",
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as any).id = token.sub;
        
        let targetRole = "Senior Software Engineer";
        let targetCompany = "FAANG";
        let userRole = "USER";
        try {
          if (process.env.DATABASE_URL) {
            const userDb = await prisma.user.findUnique({
              where: { id: token.sub },
              select: { targetRole: true, targetCompany: true, role: true }
            });
            if (userDb) {
              targetRole = userDb.targetRole || targetRole;
              targetCompany = userDb.targetCompany || targetCompany;
              userRole = userDb.role || userRole;
            }
          }
        } catch (err) {
          console.warn("Prisma session database lookup failed. Serving defaults:", err);
        }
        (session.user as any).targetRole = targetRole;
        (session.user as any).targetCompany = targetCompany;
        (session.user as any).role = userRole;
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
      if (account?.provider === "github" || account?.provider === "google" || account?.provider === "linkedin" || account?.provider === "azure-ad") {
        if (!user.email) return false;
        try {
          if (process.env.DATABASE_URL) {
            const dbUser = await prisma.user.findUnique({
              where: { email: user.email }
            });
            if (!dbUser) {
              let assignedRole = "USER";
              if (user.email.endsWith("@careeragents.ai")) {
                assignedRole = "ADMIN";
              } else if (user.email.endsWith(".edu")) {
                assignedRole = "UNIVERSITY_ADMIN";
              }

              await prisma.user.create({
                data: {
                  email: user.email,
                  name: user.name || "OAuth Candidate",
                  image: user.image,
                  role: assignedRole,
                  settings: { create: {} },
                  metrics: { create: {} }
                }
              });
            }
          }
        } catch (err) {
          console.warn("Prisma oauth signIn failed. Overriding check for demo:", err);
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
