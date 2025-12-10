import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import TelegramProvider from "@/components/TelegramProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Elemonica Calendar",
    description: "Training schedule with leave overlay",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <script
                    src="https://telegram.org/js/telegram-web-app.js"
                    async
                />
            </head>
            <body className={inter.className}>
                <TelegramProvider>{children}</TelegramProvider>
            </body>
        </html>
    );
}
