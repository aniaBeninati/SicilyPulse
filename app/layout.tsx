import Header from "@/src/components/Header";
import "./globals.css";
import { ReactNode } from "react";
import Footer from "@/src/components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head"; 

interface LayoutProps {
  children: ReactNode;
}

export const metadata = {
  title: "SicilyPulse"
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
       <Head>
        <link rel="icon" href="./favicon.ico" />
        <title>SicilyPulse</title>
      </Head>
      <body>
        <Header />
        <main className="min-h-[calc(100vh-330px)]">{children}</main>
        <Footer />
        {/* Configurazione di ToastContainer per le notifiche */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </body>
    </html>
  );
}
