'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ClientWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const router = useRouter();

    useEffect(() => {
        const handleBeforeUnload = async (event: BeforeUnloadEvent) => {
            await fetch('/api/logout', {
                method: 'POST'
            });
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    return <>{children}</>;
};

export default ClientWrapper;
