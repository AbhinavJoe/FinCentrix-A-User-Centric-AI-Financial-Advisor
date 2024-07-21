"use client";
import UserMessage from "@/app/ChatPage/UserMessage/index";
import InputBox from "@/app/ChatPage/InputBox/index"
import AiMessage from "@/app/ChatPage/AIMessage/index";
import { useRef, useState } from "react";
import Logout from "@/components/Logout";

const Page = () => {
    const [elements, setElements] = useState<JSX.Element[]>([]);
    const [isThinking, setIsThinking] = useState<boolean>(false)

    const bottomOfChat = useRef<HTMLDivElement>(null);
    // function to scroll to bottomfeedbackid
    const scrollToBottom: () => void = () => {
        bottomOfChat.current?.scrollIntoView({ behavior: "smooth" });
    };

    const addUserMessage = async (userPrompt: string) => {
        setElements((prevElements) => [...prevElements, <UserMessage text={userPrompt} />]);
        scrollToBottom();
        setIsThinking(true)

        try {
            const res = await fetch('http://127.0.0.1:5000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: userPrompt }),
            });

            if (!res.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await res.json();
            const aiResponse = data.message.content;  // Ensure the response format aligns with how your API sends it

            setElements((prevElements) => [...prevElements, <AiMessage text={aiResponse} />]);
            scrollToBottom();
            setIsThinking(false)

        } catch (error) {
            console.error('Error:', error);
        }
    }


    return (
        <div className="min-h-screen flex flex-col justify-between gap-1 px-5 pb-3 pt-5">
            <Logout />
            <div className="flex flex-col gap-3 overflow-y-auto text-base md:max-h-[87vh] max-h-[82vh] scroll-container">
                {elements}
                <div className="pl-2">
                    {isThinking ? <span className="text-lg font-semibold">Analyzing...</span> : null}
                </div>
                <div ref={bottomOfChat}></div>
            </div>
            {/* Input box fixed below */}
            <div className='fixed bottom-2 left-3 right-3 md:static md:bottom-auto md:left-auto md:right-auto gradient-border h-[3.125rem]' >
                <div className="h-full flex justify-between overflow-hidden">
                    <InputBox addUserMessage={addUserMessage} />
                </div>
            </div>
        </div>
    );
}

export default Page;