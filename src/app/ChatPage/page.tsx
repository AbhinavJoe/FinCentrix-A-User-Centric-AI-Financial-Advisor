"use client";
import { JSX, Suspense, useEffect, useRef, useState } from "react";
import UserMessage from "@/app/ChatPage/UserMessage/index";
import InputBox from "@/app/ChatPage/InputBox/index";
import AiMessage from "@/app/ChatPage/AIMessage/index";
import NavBar from "@/app/ChatPage/NavBar/index";
import { useSearchParams } from "next/navigation";
import SideBar from "@/app/ChatPage/SideBar/index";
import Loading from "@/components/Loading";
import { BsLayoutTextSidebar } from "react-icons/bs";

const Page = () => {
    const [isEmpty, setIsEmpty] = useState<boolean>(true);
    const [isSmallScreen, setIsSmallScreen] = useState<boolean | null>(null);
    const [elements, setElements] = useState<JSX.Element[]>([]);
    const [isThinking, setIsThinking] = useState<boolean>(false);
    const searchParams = useSearchParams();
    const [isSidebar, setIsSideBar] = useState<boolean>(false);
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
        <div className="h-[100vh]">
            <NavBar />
            <span className="fixed font-bold md:text-2xl text-lg text-[#da7756]/70 hover:cursor-pointer hover:text-[#da7756] pt-4 pl-4">FinCentrix</span>
            <div className="fixed h-full flex flex-col justify-end" onMouseEnter={() => setIsSideBar(true)} onMouseLeave={() => setIsSideBar(false)}>
                {/* {!isSmallScreen ? (
                <div className="w-1/4 h-full">
                    <SideBar username={username || ''} />
                </div>
                ) : null} */}
                {
                    isSidebar ? (
                        <SideBar username={username || ''} />
                    ) : <BsLayoutTextSidebar className="text-xl m-4 font-extrabold hover:cursor-pointer text-[#da7756]/70 hover:text-[#da7756]" />
                }
            </div>

            <div className="md:w-[55%] w-full h-full mx-auto">
                <div className="w-full h-full flex flex-col justify-between gap-1 pt-6">
                    <div className="flex flex-col gap-2 text-base md:max-h-[89vh] max-h-[82vh] scroll-container overflow-y-hidden overflow-x-hidden">
                        {isEmpty ? <div className="text-[#da7756]/70 md:text-xl text-lg font-bold text-center">
                            Ask away! FinCentrix will advice on all your finanical qualms
                        </div> : null}
                        {elements}
                        <div ref={bottomOfChat}></div>
                        {isThinking ? <span className="md:text-lg text-base font-semibold">Analyzing...</span> : null}
                    </div>
                    <div className="w-full">
                        <InputBox addUserMessage={addUserMessage} isDisabled={isThinking} />
                    </div>
                </div>
            </div >
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
