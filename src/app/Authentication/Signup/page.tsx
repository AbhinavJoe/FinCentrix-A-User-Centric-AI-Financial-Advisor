"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MdMailOutline, MdPersonOutline } from "react-icons/md";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup: React.FC = () => {
    const [fullName, setFullName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const router = useRouter();

    const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fullName, email, password })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Signup success:', data);
                toast.success(`Account created successfully!`, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setTimeout(() => router.push('/Authentication'), 1000);
            } else {
                const data = await response.json();
                toast.error(`Error: ${data.message}! Please try again.`, {
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
            setError('Failed to signup, please try again later.');
        }
    };

    return (
        <div className="w-full h-full">
            <ToastContainer />
            <div className="flex flex-col gap-5">
                <h1 className="text-4xl font-bold">Sign Up</h1>
                <div className="text-lg font-semibold">
                    Sign up to start receiving personalized financial advice!
                </div>
            </div>
            <form
                onSubmit={handleSignup}
                className="flex flex-col gap-5 w-full mt-5 h-full text-black text-lg"
            >
                <div className="flex flex-col gap-10">
                    <div className="h-[3.8rem]">
                        <div className="h-full flex items-center gap-2 px-4 rounded-[5px]">
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="h-full grow bg-transparent outline-none border-4 border-black rounded-xl pl-3 placeholder:text-lg placeholder:text-black/60"
                                placeholder="Full Name"
                                required
                            />
                            <MdPersonOutline className="text-4xl text-black" />
                        </div>
                    </div>
                    <div className="h-[3.8rem]">
                        <div className="h-full flex items-center gap-2 px-4 rounded-[5px]">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-full grow bg-transparent outline-none border-4 border-black rounded-xl pl-3 placeholder:text-lg placeholder:text-black/60"
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
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-full grow bg-transparent outline-none border-4 border-black rounded-xl pl-3 placeholder:text-lg placeholder:text-black/60"
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
                <span className="font-semibold whitespace-break-spaces">Have an account already? <span className="hover:cursor-pointer underline" onClick={() => router.push('/Authentication')}>Log In</span></span>
                <div className="text-red-600 text-base font-semibold">{error}</div>
                <div className="flex flex-col gap-1 h-[3.8rem] px-4">
                    <button
                        type="submit"
                        className="h-full w-full items-center justify-center bg-green-600 rounded-xl hover:bg-green-800 border-4 border-black"
                    >
                        <span className="font-bold text-xl">Sign Up</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Signup;
