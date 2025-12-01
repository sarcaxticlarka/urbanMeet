'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, ReactNode } from 'react';
import { NotificationProvider } from '@/context/NotificationContext';

export default function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <NotificationProvider>
                {children}
            </NotificationProvider>
        </QueryClientProvider>
    );
}
