"use client";
import Loading from '@/components/Loading';
import React, { ReactNode, useState, useEffect } from 'react';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [isSmallScreen, setIsSmallScreen] = useState<boolean | null>(null);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 768); // md breakpoint is 768px in Tailwind
        };

        // Calling handler right away so state gets updated with initial window size
        handleResize();

        window.addEventListener('resize', handleResize);

        // Cleaning up listener on unmount
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const content = (
        <div className="flex flex-col justify-center w-fit md:h-[100vh] p-4">
            <h1 className="md:text-8xl text-3xl font-bold">FinCentrix</h1>
            <p className="md:text-3xl text-lg">Your Personalized AI Financial Advisor</p>
        </div>
    );

    if (isSmallScreen === null) {
        // If the screen size hasn't been determined, don't render anything
        // return null;
        return (
            <div className="flex justify-center">
                <Loading />
            </div>
        );
    }

    return (
        <div className='flex md:flex-row flex-col h-[100vh] w-[100vw] overflow-hidden'>
            {isSmallScreen && content}
            <div className="flex flex-col bg-[#393937]/60 items-center gap-10 md:w-[35%] h-[100vh] md:border-r-2 border-[#595a57] p-6">
                {children}
            </div>
            <div className='md:bg-[url("../assets/loginBG.png")] md:bg-no-repeat md:bg-right md:bg-fixed md:bg-contain w-[65%]'>
                {!isSmallScreen && content}
            </div>
        </div>
    );
};

export default Layout;
