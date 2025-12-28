import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}

