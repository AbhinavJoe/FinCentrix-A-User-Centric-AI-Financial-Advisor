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
        <form onSubmit={handleSubmit} className="fixed h-[3.125rem] w-[55%] bottom-0 bg-[#3d3e39] md:px-4 px-2 border-2 border-[#43443f] rounded-xl">
            <div className="flex h-full justify-center">
                <input required type="text" onChange={changeInput} value={inputValue} className="grow bg-transparent outline-none text-lg" placeholder="Type here..." />
                <button type='submit' disabled={isDisabled}>
                    <RiSendPlaneFill className={`text-xl ${isDisabled ? "opacity-50" : null}`} />
                </button>
            </div>
        </form >
    );
};


export default InputBox;
