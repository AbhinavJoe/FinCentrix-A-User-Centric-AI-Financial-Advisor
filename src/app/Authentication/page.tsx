"use client";
import React, { useState, ChangeEvent } from "react";
import { MdMailOutline } from "react-icons/md";
import { useRouter } from "next/navigation";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Page: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const route = useRouter();

    const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (email !== "admin@fincentrix.com") setError("Email not found");
        else if (password !== "password") setError("Password is Incorrect");
        else route.push("/Disclaimer");
    };

    const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    return (
        <div className="flex h-[100vh] w-[100vw] text-black">
            <div className="flex flex-col items-center gap-10 max-w-[35%] h-[100vh] border-4 border-black rounded-xl p-6">
                <div className="flex flex-col gap-5">
                    <h1 className="text-4xl gradient-text font-bold">Log In</h1>
                    <div className="text-lg font-semibold">
                        Login to start getting personalized financial advice on problems that haunt you!
                    </div>
                </div>
                <form
                    onSubmit={handleLogin}
                    className="flex flex-col gap-10 w-full mt-5 h-full text-black text-lg"
                >
                    <div className="gradient-border h-[3.8rem]">
                        <div className="h-full flex bg-customPurple items-center gap-2 px-4 rounded-[5px]">
                            <input
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                                className="h-full grow bg-transparent outline-none border-4 border-black rounded-xl pl-3 placeholder:text-lg placeholder:text-black/60"
                                placeholder="Enter Email"
                                required
                            />
                            <MdMailOutline className="text-4xl text-black" />
                        </div>
                    </div>
                    <div className="h-[3.8rem]">
                        <div className="h-full flex bg-customPurple items-center gap-2 px-4 rounded-[5px]">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={handlePasswordChange}
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
                    <div className="text-red-500 text-[0.9rem]">{error}</div>
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
            <div className="flex flex-col justify-center w-fit h-[100vh] p-4">
                <h1 className="text-8xl font-bold">FinCentrix</h1>
                <p className="text-3xl">Your Personalized AI Financial Advisor</p>
            </div>
        </div>
    );
};

export default Page;
