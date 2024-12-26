"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import UserMessage from "@/app/ChatPage/UserMessage/index";
import InputBox from "@/app/ChatPage/InputBox/index";
import AiMessage from "@/app/ChatPage/AIMessage/index";
import NavBar from "@/app/ChatPage/NavBar/index";
import { useSearchParams } from "next/navigation";
import SideBar from "@/app/ChatPage/SideBar/index";
import Loading from "@/components/Loading";

const Page = () => {
    const [isEmpty, setIsEmpty] = useState<boolean>(true);
    const [isSmallScreen, setIsSmallScreen] = useState<boolean | null>(null);
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
        setIsEmpty(false);
        setIsThinking(true);

        try {
            const res = await fetch('/api/proxy', {
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
            // const aiResponse = <AiMessage text={data.messages} />;
            // const aiResponse = <AiMessage text={data.message.content} />; ollama response
            const aiResponse = <AiMessage text={data.choices[0]?.message?.content} />; // groq api response
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

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 768); // md breakpoint is 768px in Tailwind
        };

        // Calling handler right away so state gets updated with initial window size
        handleResize();

        window.addEventListener('resize', handleResize);

        // Cleaning up listener on unmount
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (isSmallScreen === null) {
        // If the screen size hasn't been determined, don't render anything
        return (
            <div className="flex justify-center">
                <Loading />
            </div>
        );
    }

    return (
        <div className="h-[100vh] flex">
            {!isSmallScreen ? (
                <div className="w-1/4 h-full">
                    <SideBar username={username || ''} />
                </div>
            ) : null}

            <div className="md:w-3/4 w-full max-h-[94.5vh] h-full">
                <NavBar />
                <div className="w-full h-full flex flex-col justify-between gap-1 pl-5 pr-2 pb-3 pt-5">
                    <div className="flex flex-col gap-3 overflow-y-auto text-base md:max-h-[87vh] max-h-[82vh] scroll-container overflow-x-hidden">
                        {isEmpty ? <div className="text-[#da7756]/70 md:text-xl text-lg font-bold text-center">
                            Ask away! FinCentrix will advice on all your finanical qualms
                        </div> : null}
                        {elements}
                        <div ref={bottomOfChat}></div>
                        {isThinking ? <span className="md:text-lg text-base font-semibold">Analyzing...</span> : null}
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
