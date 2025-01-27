"use client";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logout from '@/components/Logout';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { ChangeEvent, FormEvent, Suspense, useEffect, useState } from 'react';

const Page = () => {
    const searchParams = useSearchParams();
    const username = searchParams?.get('username');

    useEffect(() => {
        if (username) {
            console.log("Logged in as:", username);
        }
    }, [username]);

    const router = useRouter()
    // State for each input
    const [age, setAge] = useState<string>('');
    const [employmentStatus, setEmploymentStatus] = useState<string>('');
    const [annualIncome, setAnnualIncome] = useState<string>('');
    const [financialGoals, setFinancialGoals] = useState<string>('');
    const [riskTolerance, setRiskTolerance] = useState<number>(5);
    const [existingDebts, setExistingDebts] = useState<string>('');
    const [monthlyBudget, setMonthlyBudget] = useState<string>('');
    const [insuranceTypes, setInsuranceTypes] = useState<string>('');
    const [retirementAge, setRetirementAge] = useState<string>('');

    // Handlers for each input
    const handleAgeChange = (event: ChangeEvent<HTMLInputElement>) => {
        setAge(event.target.value);
    };

    const handleEmploymentStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setEmploymentStatus(event.target.value);
    };

    const handleAnnualIncomeChange = (event: ChangeEvent<HTMLInputElement>) => {
        setAnnualIncome(event.target.value);
    };

    const handleFinancialGoalsChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setFinancialGoals(event.target.value);
    };

    const handleRiskToleranceChange = (event: ChangeEvent<HTMLInputElement>) => {
        setRiskTolerance(Number(event.target.value));
    };

    const handleExistingDebtsChange = (event: ChangeEvent<HTMLInputElement>) => {
        setExistingDebts(event.target.value);
    };

    const handleMonthlyBudgetChange = (event: ChangeEvent<HTMLInputElement>) => {
        setMonthlyBudget(event.target.value);
    };

    const handleInsuranceTypesChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInsuranceTypes(event.target.value);
    };

    const handleRetirementAgeChange = (event: ChangeEvent<HTMLInputElement>) => {
        setRetirementAge(event.target.value);
    };

    // Fetch form data on component mount
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`/api/getFormData?username=${username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const data = await response.json();
                setAge(data.age);
                setEmploymentStatus(data.employmentStatus);
                setAnnualIncome(data.annualIncome);
                setFinancialGoals(data.financialGoals);
                setRiskTolerance(data.riskTolerance);
                setExistingDebts(data.existingDebts);
                setMonthlyBudget(data.monthlyBudget);
                setInsuranceTypes(data.insuranceTypes);
                setRetirementAge(data.retirementAge);
            } else {
                toast.error('Failed to load form data.', {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        };
        fetchData();
    }, [username]);

    // Handlers remain unchanged

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = {
            username, // Include the username in the formData
            age,
            employmentStatus,
            annualIncome,
            financialGoals,
            riskTolerance,
            existingDebts,
            monthlyBudget,
            insuranceTypes,
            retirementAge
        };

        const response = await fetch('/api/submitForm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            toast.success('Data updated successfully!', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            router.push(`/ChatPage?username=${username}`);
        } else {
            toast.error('Failed to submit form. Please check your data and try again.', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center p-10">
            <ToastContainer />
            <Logout page='Dashboard' />
            <form className="flex flex-col gap-4 w-full max-w-[750px] md:pt-0 pt-10" onSubmit={handleSubmit}>
                <h1 className="md:text-4xl text-2xl font-bold text-[#e4e4e0]">Financial Questionnaire</h1>
                <p className='md:text-xl text-lg font-semibold mb-4'>Answer a few questions first, to get financial advice tailored just for you!</p>

                {/* Age */}
                <label htmlFor="age" className="font-semibold md:text-lg text-base">What is your age?</label>
                <input
                    type="number"
                    id="age"
                    name="age"
                    value={age}
                    onChange={handleAgeChange}
                    className="form-styles"
                    required
                />

                {/* Employment Status */}
                <label htmlFor="employmentStatus" className="font-semibold md:text-lg text-base">What is your employment status?</label>
                <select
                    id="employmentStatus"
                    name="employmentStatus"
                    value={employmentStatus}
                    onChange={handleEmploymentStatusChange}
                    className="form-styles"
                    required
                >
                    <option value="">Select...</option>
                    <option value="employed">Employed</option>
                    <option value="self-employed">Self-employed</option>
                    <option value="unemployed">Unemployed</option>
                    <option value="retired">Retired</option>
                </select>

                {/* Annual Income */}
                <label htmlFor="annualIncome" className="font-semibold md:text-lg text-base">What is your annual income? (in INR)</label>
                <input
                    type="number"
                    id="annualIncome"
                    name="annualIncome"
                    value={annualIncome}
                    onChange={handleAnnualIncomeChange}
                    className="form-styles"
                    required
                />
                {/* Financial Goals */}
                <label htmlFor="finGoals" className="font-semibold md:text-lg text-base">What are your primary financial goals? (long-term or short-term)</label>
                <textarea
                    id="finGoals"
                    name="finGoals"
                    value={financialGoals}
                    onChange={handleFinancialGoalsChange}
                    className="h-18 px-4 py-2 border-2 border-[#43443f] rounded-xl bg-[#393937]/60"
                    placeholder="e.g., saving for retirement, buying a home, funding education"
                />

                {/* Risk Tolerance */}
                <label htmlFor="riskTolerance" className="font-semibold md:text-lg text-base">What is your risk tolerance?</label>
                <input
                    type="range"
                    id="riskTolerance"
                    name="riskTolerance"
                    value={riskTolerance}
                    onChange={handleRiskToleranceChange}
                    min="0"
                    max="10"
                    className="w-full"
                />

                {/* Financial Health */}
                <label htmlFor="existingDebts" className="font-semibold md:text-lg text-base">Do you have any existing debts?</label>
                <input
                    type="text"
                    id="existingDebts"
                    name="existingDebts"
                    value={existingDebts}
                    onChange={handleExistingDebtsChange}
                    className="form-styles"
                    placeholder="e.g., mortgage, student loan, credit card"
                />

                <label htmlFor="monthlyBudget" className="font-semibold md:text-lg text-base">What is your monthly budget? (in Rs)</label>
                <input
                    type="number"
                    id="monthlyBudget"
                    name="monthlyBudget"
                    value={monthlyBudget}
                    onChange={handleMonthlyBudgetChange}
                    className="form-styles"
                />

                {/* Insurance Needs */}
                <label htmlFor="insuranceTypes" className="font-semibold md:text-lg text-base">What types of insurance do you have?</label>
                <input
                    type="text"
                    id="insuranceTypes"
                    name="insuranceTypes"
                    value={insuranceTypes}
                    onChange={handleInsuranceTypesChange}
                    className="form-styles"
                    placeholder="e.g., life, health, property"
                />

                {/* Retirement Planning */}
                <label htmlFor="retirementAge" className="font-semibold md:text-lg text-base">At what age do you plan to retire?</label>
                <input
                    type="number"
                    id="retirementAge"
                    name="retirementAge"
                    value={retirementAge}
                    onChange={handleRetirementAgeChange}
                    className="form-styles"
                />
                <button
                    type="submit"
                    className="mt-4 py-2 bg-[#da7756]/70 hover:bg-[#da7756] text-black font-bold text-xl rounded-xl"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}

const Dashboard = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Page />
        </Suspense>
    );
};

export default Dashboard;