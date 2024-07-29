"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import UserMessage from "@/app/ChatPage/UserMessage/index";
import InputBox from "@/app/ChatPage/InputBox/index";
import AiMessage from "@/app/ChatPage/AIMessage/index";
import NavBar from "@/app/ChatPage/NavBar/index";
import { useSearchParams } from "next/navigation";
import SideBar from "@/app/ChatPage/SideBar/index";
import dotenv from 'dotenv';

dotenv.config();

const Page = () => {
    const [elements, setElements] = useState<JSX.Element[]>([]);
    const [isThinking, setIsThinking] = useState<boolean>(false);
    const searchParams = useSearchParams();
    const username = searchParams ? searchParams.get('username') : null;

    const bottomOfChat = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (bottomOfChat.current) {
            bottomOfChat.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [elements]);

    const addUserMessage = async (userPrompt: string) => {
        const newUserMessage = <UserMessage text={userPrompt} />;
        setElements((prevElements) => [...prevElements, newUserMessage]);
        setIsThinking(true);

        try {
            const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_VM_URL + 'chat', {
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
            const aiResponse = <AiMessage text={data.messages} />;
            setElements((prevElements) => [...prevElements, aiResponse]);
        } catch (error) {
            console.error('Error:', error);
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
            const errorResponse = <AiMessage text={`Error: ${errorMessage}`} />;
            setElements((prevElements) => [...prevElements, errorResponse]);
        } finally {
            setIsThinking(false);
        }
    }

    return (
        <div className="h-[100vh] flex">
            <div className="w-1/4 h-full">
                <SideBar username={username || ''} />
            </div>
            <div className="w-3/4 max-h-[94.5vh] h-full">
                <NavBar />
                <div className="w-full h-full flex flex-col justify-between gap-1 px-5 pb-3 pt-5">
                    <div className="flex flex-col gap-3 overflow-y-auto text-base md:max-h-[87vh] max-h-[82vh] scroll-container overflow-x-hidden">
                        {elements}
                        <div ref={bottomOfChat}></div>
                        {isThinking ? <span className="text-lg font-semibold">Analyzing...</span> : null}
                    </div>
                    <div className='fixed bottom-2 left-3 right-3 md:static md:bottom-auto md:left-auto md:right-auto h-[3.125rem]'>
                        <div className="h-full flex justify-between overflow-hidden">
                            <InputBox addUserMessage={addUserMessage} isDisabled={isThinking} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const ChatPage = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Page />
        </Suspense>
    );
};

export default ChatPage;
