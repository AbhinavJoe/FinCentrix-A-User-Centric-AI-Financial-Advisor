"use client";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { RiSendPlaneFill } from "react-icons/ri";

interface InputBoxProps {
    addUserMessage: Function;
}

const InputBox: React.FC<InputBoxProps> = ({ addUserMessage }) => {
    const route = useRouter();
    const [inputValue, setInputValue] = useState("");
    const changeInput = async (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        addUserMessage(inputValue);
        setInputValue("");
    };

    return (
        <form onSubmit={handleSubmit} className="flex grow bg-[#F7F7F7] items-center md:px-4 px-2 border-4 border-black rounded-xl">
            <input required type="text" onChange={changeInput} value={inputValue} className="grow bg-transparent outline-none text-lg" placeholder="Type here..." />
            <button type="submit">
                <span className="text-xl"><RiSendPlaneFill /></span>
            </button>
        </form >
    );
};


export default InputBox;
