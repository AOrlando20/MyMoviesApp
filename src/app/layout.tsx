import { GuestSessionProvider } from "@/providers/GuestSessionContext";
import "./globals.css";
import Header from "@/components/Header/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <GuestSessionProvider>
          <Header/>
          <main className="p-6 mt-16">{children}</main>
        </GuestSessionProvider>
      </body>
    </html>
  );
}
