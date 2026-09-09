// ==========================================
// K-Mart AI — Root Layout
// ==========================================
import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'K-Mart AI — Farm-to-Consumer Marketplace',
  description: 'AI-powered farm-to-consumer decision intelligence platform that helps farmers sell smarter and consumers buy smarter.',
  keywords: ['K-Mart', 'AI', 'farming', 'agriculture', 'marketplace', 'farm-to-consumer', 'India'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <AuthProvider>
          <CartProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  fontFamily: 'var(--font-sans)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border-light)',
                  boxShadow: 'var(--shadow-lg)',
                },
              }}
            />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
