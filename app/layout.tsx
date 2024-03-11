import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'react-toastify/dist/ReactToastify.css';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ApolloClientProider from "@/helpers/ApolloClientProider";
import ContextProvider from "@/context/ContextProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Creative Studio",
  description: "Welcome to the world of creative designs and art.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ApolloClientProider>
          <ContextProvider>{children}</ContextProvider>
        </ApolloClientProider>
      </body>
    </html>
  );
}
