import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type UserData = {
    age: string;
    employmentStatus: string;
    annualIncome: string;
    financialGoals: string;
    riskTolerance: number;
    existingDebts: string;
    monthlyBudget: string;
    insuranceTypes: string;
    retirementAge: string;
}

const SideBar = ({ username }: { username: string }) => {
    const router = useRouter();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    // Logout handler
    const handleLogout = useCallback(async () => {
        const response = await fetch('/api/logout', {
            method: 'POST'
        });
        if (response.ok) {
            router.push('/');
        } else {
            console.error('Failed to log out');
        }
    }, [router]);

    // Fetch user data
    useEffect(() => {
        if (!username) {
            toast.error('No username detected, redirecting to login...');
            setTimeout(() => {
                handleLogout();  // Ensure user is logged out
            }, 2000);
            return;
        }

        const fetchData = async () => {
            try {
                const response = await fetch(`/api/getFormData?username=${username}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) throw new Error('Failed to fetch user data');

                const data = await response.json();
                setUserData(data);
                setLoading(false);  // Update loading state here
            } catch (error) {
                console.error(error);
                toast.error('Failed to fetch user data. Logging out...');
                handleLogout();  // Trigger logout if data fetch fails
            }
        };

        fetchData();
    }, [username, handleLogout]);

    if (loading) return <div className='bg-[#3d3e39] flex flex-col justify-end gap-2 shadow-xl p-4 h-[100vh] border-r-2 border-[#43443f]'>Loading...</div>;

    return (
        <div className="bg-[#3d3e39] flex flex-col justify-between gap-3 shadow-xl px-4 pb-4 h-full border-r-2 border-[#43443f] z-1">
            {/* <ToastContainer /> */}
            <span className="font-bold md:text-2xl text-lg text-[#da7756]/70 hover:cursor-pointer hover:text-[#da7756] pt-4">FinCentrix</span>
            <div className='h-fit'>
                <h3 className="text-xl font-bold mb-4 underline">Your Information</h3>
                <div className='scroll-container overflow-y-auto h-[30vh]'>
                    {userData && (
                        <>
                            <p><strong>Age:</strong> {userData.age}</p>
                            <p><strong>Employment Status:</strong> {userData.employmentStatus}</p>
                            <p><strong>Annual Income:</strong> {userData.annualIncome}</p>
                            <p><strong>Financial Goals:</strong> {userData.financialGoals}</p>
                            <p><strong>Risk Tolerance:</strong> {userData.riskTolerance}</p>
                            <p><strong>Existing Debts:</strong> {userData.existingDebts}</p>
                            <p><strong>Monthly Budget:</strong> {userData.monthlyBudget}</p>
                            <p><strong>Insurance Types:</strong> {userData.insuranceTypes}</p>
                            <p><strong>Retirement Age:</strong> {userData.retirementAge}</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SideBar;