import React from 'react';
import { RiRobot3Fill } from 'react-icons/ri';
import ReactMarkdown from 'react-markdown';

interface AITextProp {
    text: string
}

const AiMessage: React.FC<AITextProp> = ({ text }) => {
    return (
        <div className="w-[60%] flex flex-col">
            <div className='border-2 bg-transparent border-black rounded-xl w-fit mb-1'>
                <RiRobot3Fill className='text-xl' />
            </div>
            <div className="bg-white border-4 border-black rounded-xl text-lg px-4 py-3 w-fit">
                <ReactMarkdown>{text}</ReactMarkdown>
            </div>
        </div >
    );
}

export default AiMessage;
