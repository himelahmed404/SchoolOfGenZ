import { Baloo_Da_2, Hind_Siliguri } from "next/font/google";
import "./globals.css";

const baloo = Baloo_Da_2({
  variable: "--font-baloo",
  subsets: ["bengali", "latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const hind = Hind_Siliguri({
  variable: "--font-hind",
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "School of GenZ — স্কুল অব জেনজি",
  description:
    "বাংলায় শেখার প্ল্যাটফর্ম — ডিপ্লোমা সেমিস্টার ব্যাচ ও স্কিল কোর্স, তোমার ভাষায়।",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn" className={`${baloo.variable} ${hind.variable} h-full`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
