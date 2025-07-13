import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { prisma } from "./DB";
import { NextAuthOptions, User } from "next-auth";

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "example@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Add logic here to look up the user from the credentials supplied
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email or Password is missing.");
        }

        try {
          const existUser = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          if (!existUser) {
            throw new Error("User not found.");
          }

          const validPassword = await bcrypt.compare(
            credentials.password,
            existUser.password
          );

          if (!validPassword) {
            throw new Error("Email or Password is wrong.");
          }

          return {
            id: existUser.id.toString(), // ensure string
            email: existUser.email,
            username: existUser.username || null,
            name: existUser.username || "", // required by DefaultUser
            success: true,
          } as User;
        } catch (error) {
          if (error instanceof Error) {
            console.log("Auth error :", error.message);
            return null;
          }
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/signin",
    signOut: "/signout",
    error: "/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await prisma.user.findFirst({
          where: { email: user.email?.toString() },
        });

        if (!dbUser) {
          token.registerRedirect = true;
          return token;
        }

        token.id = dbUser.id.toString();
        token.name = dbUser.username;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.name as string;
      }
      return session;
    },
  },
  secret: process.env.NEXT_AUTH_SECRET,
};

export default authOptions;
