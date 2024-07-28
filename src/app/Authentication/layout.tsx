import React, { ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className='flex h-[100vh] w-[100vw] text-black overflow-hidden'>
            <div className="flex flex-col items-center gap-10 w-[35%] h-[100vh] border-4 border-black p-6">
                {children}
            </div>
            <div className='loginBG w-[65%]'>
                <div className="flex flex-col justify-center w-fit h-[100vh] p-4">
                    <h1 className="text-8xl font-bold">FinCentrix</h1>
                    <p className="text-3xl">Your Personalized AI Financial Advisor</p>
                </div>
            </div>
        </div>
    );
};

export default Layout;