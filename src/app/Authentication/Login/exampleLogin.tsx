"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from 'react-hot-toast';
import { setCookie } from 'cookies-next';


const LoginPage: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<string>("login");
    // const [email, setEmail] = useState<string>("");
    const [user, setUser] = useState({
        email: "",
        password: ""
    })

    const handleForgotPassword = () => {
        setCurrentPage("forgotPassword");
    };

    const handleNextStep = (email: string) => {
        setCurrentPage("otpVerification");
    };

    const handleBackToForgotPassword = () => {
        setCurrentPage("forgotPassword");
    };

    const handleVerifyOtp = (otp: string) => {
        console.log("OTP entered:", otp);
        setCurrentPage("newPassword");
    };

    const handleBackToOtp = () => {
        setCurrentPage("otpVerification");
    };

    const handleDone = (newPassword: string) => {
        console.log("New password set:", newPassword);
        setCurrentPage("login");
    };

    const handleBackToLogin = () => {
        setCurrentPage("login");
    };

    const router = useRouter();



    const onLogin = async () => {
        try {
            const response = await axios.post("/api/users/login", user);
            // const accessToken = response.data.access_token;
            // setCookie("access_token", accessToken);

            if (response.status === 200) {
                toast.success('Successfully Logged in');

                // Use setTimeout to delay the navigation
                setTimeout(() => {
                    router.push("/");
                }, 1000); // 2000 milliseconds (2 seconds) delay
            }
        } catch (error: any) {
            toast.error('Login Failed');
            console.log("Login Failed", error.message);
        }
    };


    return (
        <>
            <div className="text-2xl font-semibold text-start text-gray-500 mb-6">
                Log-in
            </div>
            <div className="mb-4">
                <input
                    className="appearance-none border-2 border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-xs"
                    id="email"
                    type="email"
                    placeholder="Enter Email"
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
            </div>
            <div className="mb-1">
                <input
                    className="appearance-none border-2 border-gray-400 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-xs"
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                />
            </div>
            <div className="flex justify-end mb-6">
                <Link
                    className="font-bold text-xs text-blue-500 hover:text-blue-800"
                    href="/login/forgotPassword"
                >
                    Forgot Password?
                </Link>
            </div>
            <div className="flex text-center mb-4">
                <button
                    onClick={onLogin}
                    className="bg-blue-900 hover:bg-blue-700 text-white font-semibold text-xs py-2 px-4 rounded w-full focus:outline-none focus:shadow-outline"
                >
                    Log-in
                </button>
            </div>
            <div className="bg-[#BADAF7] hover:bg-blue-300 text-center text-blue-900 text-xs font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline border-blue-900 border-2">
                <Link
                    href="/login/requestAccess"
                >
                    Request Access
                </Link>
            </div>
        </>
    );
};

export default LoginPage;