"use client";
import React, { useState, ChangeEvent } from "react";
import { MdMailOutline } from "react-icons/md";
import { useRouter } from "next/navigation";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const router = useRouter();

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(`Logged in Successfully!`, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setTimeout(() => router.push(`/Disclaimer?username=${data.username}`), 1000);
            } else {
                // Handle errors like incorrect credentials
                toast.error(`Error: ${data.message}! Please check your email and password!`, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (err) {
            setError('Failed to login, please try again later.'); // Handle network errors or server being down
        }
    };

    const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    return (
        <div className="w-full h-full">
            <ToastContainer />
            <div className="flex flex-col gap-5">
                <h1 className="text-4xl font-bold">Log In</h1>
                <div className="text-lg font-semibold">
                    Login to start getting personalized financial advice on problems that haunt you!
                </div>
            </div>
            <form
                onSubmit={handleLogin}
                className="flex flex-col gap-5 w-full mt-5 h-full text-black text-lg"
            >
                <div className="flex flex-col gap-10">
                    <div className="h-[3.8rem]">
                        <div className="h-full flex items-center gap-2 px-4 rounded-[5px]">
                            <input
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                                className="h-full grow bg-white outline-none border-4 border-black rounded-xl pl-3 placeholder:text-lg placeholder:text-black/60"
                                placeholder="Enter Email"
                                required
                            />
                            <MdMailOutline className="text-4xl text-black" />
                        </div>
                    </div>
                    <div className="h-[3.8rem]">
                        <div className="h-full flex items-center gap-2 px-4 rounded-[5px]">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={handlePasswordChange}
                                className="h-full grow bg-white outline-none border-4 border-black rounded-xl pl-3 placeholder:text-lg placeholder:text-black/60"
                                placeholder="Enter Password"
                                required
                            />
                            {showPassword ? (
                                <AiOutlineEye
                                    onClick={() => setShowPassword(false)}
                                    className="text-4xl text-black"
                                />
                            ) : (
                                <AiOutlineEyeInvisible
                                    onClick={() => setShowPassword(true)}
                                    className="text-4xl text-black"
                                />
                            )}
                        </div>
                    </div>
                </div>
                <span className="font-semibold whitespace-break-spaces">Don't have an account? <span className="hover:cursor-pointer underline" onClick={() => router.push('/Authentication/Signup')}>Sign Up</span></span>
                <div className="text-red-600 text-base font-semibold">{error}</div>
                <div className="flex flex-col gap-1 h-[3.8rem] px-4">
                    <button
                        type="submit"
                        className="h-full w-full items-center justify-center bg-green-600 rounded-xl hover:bg-green-800 border-4 border-black"
                    >
                        <span className="font-bold text-xl">Login</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;
