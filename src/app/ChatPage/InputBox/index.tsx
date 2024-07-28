"use client";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { RiSendPlaneFill } from "react-icons/ri";

interface InputBoxProps {
    addUserMessage: Function;
    isDisabled: boolean;
}

const InputBox: React.FC<InputBoxProps> = ({ addUserMessage, isDisabled }) => {
    const route = useRouter();
    const [inputValue, setInputValue] = useState("");
    const [isInputEmpty, setIsInputEmpty] = useState<boolean>(true);

    const changeInput = async (event: ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setInputValue(newValue);
        setIsInputEmpty(newValue.trim() === "");
    };
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (inputValue.trim() && !isDisabled) {
            addUserMessage(inputValue);
            setInputValue("");
            setIsInputEmpty(true);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex grow bg-[#F7F7F7] items-center md:px-4 px-2 border-4 border-black rounded-xl">
            <input required type="text" onChange={changeInput} value={inputValue} className="grow bg-transparent outline-none text-lg" placeholder="Type here..." />
            <button type={`${isDisabled ? "submit" : "button"}`}>
                <span className={`text-xl ${isDisabled ? "opacity-50" : null}`}><RiSendPlaneFill /></span>
            </button>
        </form >
    );
};


export default InputBox;
