import { Inter } from 'next/font/google';
import './globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from '@/lib/auth';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'LearnMore - Interactive Coding Education Platform',
  description: 'Learn to code with interactive lessons, hands-on practice, and expert guidance.',
  keywords: 'coding, programming, education, online learning, web development',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
          <ToastContainer position="bottom-right" />
        </AuthProvider>
      </body>
    </html>
  );
}