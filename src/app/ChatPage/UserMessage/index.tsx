import { FaUserCircle } from "react-icons/fa";

interface UserTextProp {
    text: string
}

const userMessage: React.FC<UserTextProp> = ({ text }) => {
    return (
        <div className="flex justify-end">
            <div className="md:w-[70%] w-[90%] flex justify-end">
                <div className="flex flex-col">
                    <span className="self-end pb-1"><FaUserCircle className="text-xl" /></span>
                    <div className="bg-black/40 border-2 border-[#43443f] rounded-xl md:text-lg text-sm px-4 py-3 w-fit break-all select-text">
                        {text}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default userMessage