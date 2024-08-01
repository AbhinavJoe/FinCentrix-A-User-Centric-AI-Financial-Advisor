// import React from 'react';
// import { RiRobot3Fill } from 'react-icons/ri';
// import ReactMarkdown from 'react-markdown';

// interface AITextProp {
//     text: string
// }

// const AiMessage: React.FC<AITextProp> = ({ text }) => {
//     return (
//         <div className="w-[60%] flex flex-col">
//             <div className='border-2 bg-transparent border-[#43443f] rounded-xl w-fit mb-1'>
//                 <RiRobot3Fill className='text-xl' />
//             </div>
//             <div className="bg-[#393937]/60 border-2 border-[#43443f] rounded-xl text-lg px-4 py-3 w-fit select-text">
//                 <ReactMarkdown>{text}</ReactMarkdown>
//             </div>
//         </div >
//     );
// }

// export default AiMessage;

import React from 'react';
import { RiRobot3Fill } from 'react-icons/ri';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AITextProp {
    text: string
}

const AiMessage: React.FC<AITextProp> = ({ text }) => {
    return (
        <div className="w-[60%] flex flex-col">
            <div className='border-2 bg-transparent border-[#43443f] rounded-xl w-fit mb-1'>
                <RiRobot3Fill className='text-xl' />
            </div>
            <div className="bg-[#393937]/60 border-2 border-[#43443f] rounded-xl text-lg px-4 py-3 w-fit select-text">
                <ReactMarkdown
                    children={text}
                    remarkPlugins={[remarkGfm]}
                    className="markdown-body"
                />
            </div>
        </div>
    );
}

export default AiMessage;
