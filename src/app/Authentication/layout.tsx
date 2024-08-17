// import React, { ReactNode } from 'react';

// interface LayoutProps {
//     children: ReactNode;
// }

// const Layout: React.FC<LayoutProps> = ({ children }) => {
//     return (
//         <div className='flex h-[100vh] w-[100vw] overflow-hidden'>
//             <div className="flex flex-col bg-[#393937]/60 items-center gap-10 w-[35%] h-[100vh] border-r-2 border-[#595a57] p-6">
//                 {children}
//             </div>
//             <div className='md:bg-[url("../assets/loginBG.png")] md:bg-no-repeat md:bg-right md:bg-fixed md:bg-contain w-[65%]'>
//                 <div className="flex flex-col justify-center w-fit h-[100vh] p-4">
//                     <h1 className="text-8xl font-bold">FinCentrix</h1>
//                     <p className="text-3xl">Your Personalized AI Financial Advisor</p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Layout;

"use client";
import React, { ReactNode, useState, useEffect } from 'react';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 768); // md breakpoint is 768px in Tailwind
        };

        window.addEventListener('resize', handleResize);

        // Calling handler right away so state gets updated with initial window size
        handleResize();

        // Cleaning up listener on unmount
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const content = (
        <div className="flex flex-col justify-center w-fit md:h-[100vh] p-4">
            <h1 className="md:text-8xl text-3xl font-bold">FinCentrix</h1>
            <p className="md:text-3xl text-lg">Your Personalized AI Financial Advisor</p>
        </div>
    );

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
