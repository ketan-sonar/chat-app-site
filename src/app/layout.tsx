import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import UserSessionProvider from "./context/UserSessionProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chat App",
  description: "A real time chat application",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={inter.className}>
        <UserSessionProvider session={session}>{children}</UserSessionProvider>
      </body>
    </html>
  );
}
