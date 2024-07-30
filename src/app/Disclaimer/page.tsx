"use client";
import Logout from '@/components/Logout/index';
import { useRouter, useSearchParams } from 'next/navigation'
import React, { Suspense, useState } from 'react'
import { ImCheckboxChecked, ImCheckboxUnchecked } from 'react-icons/im'

const Page = () => {
    const [checkbox, setCheckbox] = useState<boolean>(false);
    const router = useRouter()
    const searchParams = useSearchParams();
    const username = searchParams?.get('username');

    const handleCheckBox = () => {
        setCheckbox(!checkbox)
        setTimeout(() => {
            router.push(`/Dashboard?username=${username}`)
        }, 350);
    }

    return (
        <main className='text-[#e4e4e0] h-screen flex justify-center w-full pt-20 px-10' >
            <Logout page='Disclaimer' />
            <div className='flex flex-col gap-4'>
                <div className='text-4xl font-semibold text-[#da7756]/70'>
                    Welcome, {username?.toUpperCase()}!
                </div>
                <div className='flex flex-col gap-8 border-2 border-[#43443f] rounded-lg px-4 py-4 h-fit md:w-[700px] bg-[#393937]/60'>
                    <div className='flex flex-col gap-4'>
                        <h1 className='font-bold text-2xl'>Disclaimer</h1>
                        <div className='font-semibold text-base'>
                            Before using the FinCentrix platform, please read this disclaimer carefully. The content provided is for informational purposes only and is not intended as comprehensive financial advice. Generated responses come from a language model and may not reflect the most reliable information. We make no warranties regarding the accuracy or completeness of the information and will not be liable for any damages arising from your use of the platform.
                        </div>
                        <div className='font-semibold text-base'>
                            By using FinCentrix, you acknowledge that the information provided, while advisory in nature, is not a substitute for professional financial advice. Always consult a qualified professional for financial decisions. Use of this platform is at your own risk and subject to the terms of this disclaimer.
                        </div>
                    </div>
                    <div onClick={handleCheckBox} className='flex gap-2 items-center hover:cursor-pointer'>
                        {
                            checkbox ? <ImCheckboxChecked className='text-[#da7756]' /> : <ImCheckboxUnchecked className='' />
                        }
                        <div className={`${checkbox ? "text-[#da7756]" : null} font-semibold text-base`} >I Agree to the Terms and Conditions of FinCentrix</div>
                    </div>
                </div>
            </div>
        </main>
    )
}

const Disclaimer = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Page />
        </Suspense>
    );
};

export default Disclaimer;