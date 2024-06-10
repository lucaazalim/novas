import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/Navbar";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "novas",
    description: "",
};

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
        <body className={`{inter.className} bg-gray-100 text-gray-800`}>
        <Navbar/>
        <div className="max-w-[1200px] px-10 mx-auto container">
            {children}
        </div>
        </body>
        </html>
    );
}