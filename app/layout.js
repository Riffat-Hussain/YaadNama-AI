import "./globals.css";
import SettingsProvider from "@/components/SettingsProvider";

export const metadata = {
  title: "YaadNama AI — Your Intelligent Memory Companion",
  description:
    "YaadNama AI helps people with memory challenges remember the people, places, medications, and moments that matter — safely, gently, and on their own terms.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased text-ink selection:bg-teal/20 dark:text-[#f1ece0]">
        <SettingsProvider>{children}</SettingsProvider>
      </body>
    </html>
  );
}
