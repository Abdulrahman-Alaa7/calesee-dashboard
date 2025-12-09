import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "../components/ui/sonner";
import { Provider } from "./utils/Provider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <Provider>
          {children}
          <Toaster position="top-center" richColors />
        </Provider>
      </body>
    </html>
  );
}
