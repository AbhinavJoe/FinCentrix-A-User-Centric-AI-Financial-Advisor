import React from 'react';
import { RiRobot3Fill } from 'react-icons/ri';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './markdown.css';

interface AITextProp {
    text: string;
}

const AiMessage: React.FC<AITextProp> = ({ text }) => {
    return (
        <div className="md:w-[70%] w-[90%] flex flex-col">
            <div className='border-2 bg-transparent border-[#43443f] rounded-xl w-fit mb-1'>
                <RiRobot3Fill className='text-xl' />
            </div>
            <div className="bg-[#5a5a59] border-2 border-[#43443f] rounded-xl md:text-lg text-sm px-4 py-3 w-fit select-text">
                <ReactMarkdown remarkPlugins={[remarkGfm]} className="markdown-body">
                    {text}
                </ReactMarkdown>
            </div>
        </div>
    );
}

export default AiMessage;
