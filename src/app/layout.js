import "./globals.css";
import AppShell from "@/components/AppShell";

export const metadata = {
  title: "Kishori Travel",
  description: "Explore Incredible India with curated journeys by Kishori Travel.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full" suppressHydrationWarning>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
