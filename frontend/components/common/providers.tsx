'use client';

import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState, type ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { store } from '@/store';

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const origError = console.error;
      console.error = (...args: any[]) => {
        if (
          typeof args[0] === 'string' &&
          args[0].includes('Support for defaultProps will be removed from function components')
        ) {
          return;
        }
        origError.apply(console, args);
      };
    }
  }, []);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 30 * 1000,
          },
        },
      })
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </Provider>
    </ThemeProvider>
  );
}
