"use client";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logout from '@/components/Logout';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';

const Dashboard = () => {
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
                    autoClose: 3000,
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
                autoClose: 3000,
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
                autoClose: 3000,
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
            <form className="flex flex-col gap-4 w-full max-w-[750px] on-scrollbar" onSubmit={handleSubmit}>
                <h1 className="text-4xl font-bold text-black">Financial Questionnaire</h1>
                <p className='text-xl font-semibold mb-4'>Answer a few questions first, to get financial advice tailored just for you!</p>

                {/* Age */}
                <label htmlFor="age" className="font-semibold text-lg">What is your age?</label>
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
                <label htmlFor="employmentStatus" className="font-semibold text-lg">What is your employment status?</label>
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
                <label htmlFor="annualIncome" className="font-semibold text-lg">What is your annual income? (in INR)</label>
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
                <label htmlFor="finGoals" className="font-semibold text-lg">What are your primary financial goals?</label>
                <textarea
                    id="finGoals"
                    name="finGoals"
                    value={financialGoals}
                    onChange={handleFinancialGoalsChange}
                    className="h-24 px-4 py-2 border-4 border-black rounded-xl"
                    placeholder="e.g., saving for retirement, buying a home, funding education"
                />

                {/* Risk Tolerance */}
                <label htmlFor="riskTolerance" className="font-semibold text-lg">What is your risk tolerance?</label>
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
                <label htmlFor="existingDebts" className="font-semibold text-lg">Do you have any existing debts?</label>
                <input
                    type="text"
                    id="existingDebts"
                    name="existingDebts"
                    value={existingDebts}
                    onChange={handleExistingDebtsChange}
                    className="form-styles"
                    placeholder="e.g., mortgage, student loan, credit card"
                />

                <label htmlFor="monthlyBudget" className="font-semibold text-lg">What is your monthly budget? (in Rs)</label>
                <input
                    type="number"
                    id="monthlyBudget"
                    name="monthlyBudget"
                    value={monthlyBudget}
                    onChange={handleMonthlyBudgetChange}
                    className="form-styles"
                />

                {/* Insurance Needs */}
                <label htmlFor="insuranceTypes" className="font-semibold text-lg">What types of insurance do you have?</label>
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
                <label htmlFor="retirementAge" className="font-semibold text-lg">At what age do you plan to retire?</label>
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
                    className="mt-4 py-2 bg-black text-white font-bold text-xl rounded-xl"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}

export default Dashboard;