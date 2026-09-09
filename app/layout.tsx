import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <div className="site-wrapper">

          <Header />

          <main className="site-main">
            {children}
          </main>

          <Footer />

        </div>
      </body>
    </html>
  );
}