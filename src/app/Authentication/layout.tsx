import React, { ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className='flex h-[100vh] w-[100vw] overflow-hidden'>
            <div className="flex flex-col bg-[#393937]/60 items-center gap-10 w-[35%] h-[100vh] border-r-2 border-[#595a57] p-6">
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