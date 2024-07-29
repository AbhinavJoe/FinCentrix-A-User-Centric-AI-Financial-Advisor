import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FinancialNews from '@/app/ChatPage/SideBar/FinancialNews/index';

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

type ExchangeRate = {
    rate: string;
    fromCurrency: string;
    toCurrency: string;
}

const SideBar = ({ username }: { username: string }) => {
    const router = useRouter();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null);
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

    // Fetch currency exchange rate
    useEffect(() => {
        const apiKeyCurrency = process.env.ALPHAVANTAGE_API_KEY;
        const fetchCurrencyRate = async () => {
            const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=INR&apikey=${apiKeyCurrency}`;
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error('Failed to fetch exchange rate');
                const data = await response.json();
                const rateInfo = data["Realtime Currency Exchange Rate"];
                setExchangeRate({
                    rate: rateInfo["5. Exchange Rate"],
                    fromCurrency: rateInfo["1. From_Currency Code"],
                    toCurrency: rateInfo["3. To_Currency Code"]
                });
            } catch (error) {
                console.error('Failed to fetch exchange rate:', error);
            }
        };

        fetchCurrencyRate();
    }, []);

    if (loading) return <div className='bg-white flex flex-col gap-2 shadow-xl p-4 h-[100vh] border-4 border-black rounded-xl'>Loading...</div>;

    return (
        <div className="bg-white flex flex-col gap-3 shadow-xl px-4 h-[100vh] border-4 border-black">
            <ToastContainer />
            <div className='h-fit'>
                <h3 className="text-xl font-bold mb-4 underline">Your Information</h3>
                <div className='overflow-y-auto h-[30vh]'>
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
            <div className='h-fit'>
                <h3 className="font-bold text-xl mb-2 underline">Today&apos;s Financial News</h3>
                {exchangeRate && (
                    <div className="mb-2 font-bold">
                        <h3>Exchange Rate ({exchangeRate.fromCurrency} to {exchangeRate.toCurrency}): {exchangeRate.rate}</h3>
                    </div>
                )}
                <FinancialNews />
            </div>
        </div>
    );
}

export default SideBar;