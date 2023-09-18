import type { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/db/dbUtils";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const record = await prisma.user.findUnique({
            where: {
              email: user.email as string,
            },
          });
          if (!record) {
            const newUser = await prisma.user.create({
              data: {
                email: user.email as string,
                username: user.id as string,
                name: user.name as string,
                profilePicture: user.image,
              },
            });
            console.log(newUser);
            return true;
          }
        } catch (err) {
          console.log(err);
          return false;
        }
      }
      return true;
    },
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET as string,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
