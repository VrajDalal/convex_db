import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "./ConvexClientProvider";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/app/header/header"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Task manage",
  description: "Generated by create next app",
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <ConvexClientProvider>
        <html lang="en">
          <head>
            <link rel="icon" href="/taskmanagelogo.png" sizes="any" />
          </head>
          <body className={inter.className}>
            <Header />
                <div className="mt-19">{children}</div>
          </body>
        </html>
      </ConvexClientProvider>
    </ClerkProvider>
  );
}
