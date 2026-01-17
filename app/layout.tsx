import "./globals.css";
import { AccessProvider } from "@/context/UserAccessContext";

export const metadata = {
  title: "Crypto AI",
  description: "Automated crypto trading engine",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AccessProvider>
          {children}
        </AccessProvider>
      </body>
    </html>
  );
}
