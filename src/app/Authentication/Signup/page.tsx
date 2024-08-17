"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MdMailOutline } from "react-icons/md";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup: React.FC = () => {
    const [fullName, setFullName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [username, setUsername] = useState<string>("");
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
                body: JSON.stringify({ fullName, email, password, username })
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Signup success:', data);
                toast.success(`Account created successfully!`, {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setTimeout(() => router.push('/Authentication'), 1000);
            } else {
                setError(data.message);
                toast.error(`Error: ${data.message}`, {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (err) {
            console.error(err);
            setError('Failed to signup, please try again later.');
            toast.error('Failed to signup, please try again later.', {
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
        <div className="w-full h-full">
            <ToastContainer />
            <div className="flex flex-col gap-5">
                <h1 className="md:text-4xl text-2xl font-bold">Sign Up</h1>
                <div className="md:text-lg text-base font-semibold">
                    Sign up to start receiving personalized financial advice!
                </div>
            </div>
            <form
                onSubmit={handleSignup}
                className="flex flex-col gap-5 w-full mt-5 h-full text-black text-lg"
            >
                <div className="flex flex-col md:gap-10 gap-5">
                    <div className="flex md:flex-row flex-col md:h-[3.8rem] h-fit md:gap-0 gap-5">
                        <div className="md:h-full h-[3rem] md:w-1/2 flex items-center gap-2 px-4 rounded-[5px]">
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="h-full grow bg-white outline-none border-2 border-[#43443f] rounded-xl pl-3 placeholder:text-lg placeholder:text-black/70"
                                placeholder="Full Name"
                                required
                            />
                        </div>
                        <div className="md:h-full h-[3rem] md:w-1/2 flex items-center gap-2 px-4 rounded-[5px]">
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="h-full grow bg-white outline-none border-2 border-[#43443f] rounded-xl pl-3 placeholder:text-lg placeholder:text-black/70"
                                placeholder="Username"
                                required
                            />
                        </div>
                    </div>

                    <div className="md:h-[3.8rem] h-[3rem]">
                        <div className="h-full flex items-center gap-2 px-4 rounded-[5px]">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-full grow bg-white outline-none border-2 border-[#43443f] rounded-xl pl-3 placeholder:text-lg placeholder:text-black/70"
                                placeholder="Enter Email"
                                required
                            />
                            <MdMailOutline className="md:text-4xl text-4xl text-[#e4e4e0]" />
                        </div>
                    </div>
                    <div className="md:h-[3.8rem] h-[3rem]">
                        <div className="h-full flex items-center gap-2 px-4 rounded-[5px]">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-full grow bg-white outline-none border-2 border-[#43443f] rounded-xl pl-3 placeholder:text-lg placeholder:text-black/70"
                                placeholder="Enter Password"
                                required
                            />
                            {showPassword ? (
                                <AiOutlineEye
                                    onClick={() => setShowPassword(false)}
                                    className="md:text-4xl text-4xl text-[#e4e4e0] hover:cursor-pointer"
                                />
                            ) : (
                                <AiOutlineEyeInvisible
                                    onClick={() => setShowPassword(true)}
                                    className="md:text-4xl text-4xl text-[#e4e4e0] hover:cursor-pointer"
                                />
                            )}
                        </div>
                    </div>
                </div>
                <span className="font-semibold whitespace-break-spaces md:text-lg text-base text-[#e4e4e0]">Have an account already? <span className="hover:cursor-pointer hover:text-[#da7756] underline" onClick={() => router.push('/Authentication')}>Log In</span></span>
                <div className="text-red-600 text-base font-semibold">{error}</div>
                <div className="flex flex-col gap-1 h-[3.8rem] px-4">
                    <button
                        type="submit"
                        className="h-full w-full items-center justify-center bg-[#da7756]/70 rounded-xl hover:bg-[#da7756] border-2 border-[#43443f]"
                    >
                        <span className="font-bold text-xl">Sign Up</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Signup;
