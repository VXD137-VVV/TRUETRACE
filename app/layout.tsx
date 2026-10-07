import type { Metadata } from 'next';
import '@/styles/globals.css';
import { ThemeProvider } from '@/lib/theme/theme-context';
import { AuthProvider } from '@/lib/auth/auth-context';
import { UserDataProvider } from '@/lib/data/user-data-context';
import { Web3Provider } from '@/lib/web3/web3-context';
import { CursorProvider } from '@/hooks/useCursor';
import { CustomCursor } from '@/components/cursor/CustomCursor';
import { CursorTrailCanvas } from '@/components/cursor/CursorTrailCanvas';
import { FloatingOrbs, BackgroundGrid } from '@/components/effects/FloatingOrbs';

export const metadata: Metadata = {
  title: 'TrueTrace — Advanced Product Verification & Anti-Counterfeit Protocol',
  description:
    'TrueTrace helps businesses and customers verify product authenticity and build transparent, tamper-proof product journeys.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className="min-h-screen bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text antialiased selection:bg-cyan-500/20 selection:text-cyan-400">
        <ThemeProvider>
          <AuthProvider>
            <Web3Provider>
              <UserDataProvider>
                <CursorProvider>
                  {/* Background ambient lighting and grid */}
                  <FloatingOrbs />
                  <BackgroundGrid />

                  {/* 60fps Custom Cursor & Canvas Particle Trail */}
                  <CursorTrailCanvas />
                  <CustomCursor />

                  {/* Application Content */}
                  <div className="relative z-10 flex min-h-screen flex-col">
                    {children}
                  </div>
                </CursorProvider>
              </UserDataProvider>
            </Web3Provider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
