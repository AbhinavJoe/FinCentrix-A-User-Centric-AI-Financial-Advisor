import { useRouter } from "next/navigation";
import { CgLogOut } from "react-icons/cg";

const Logout = () => {
    const route = useRouter()
    return (
        <div className="absolute top-5 left-5 text-4xl">
            <CgLogOut onClick={() => route.push('/')} className="hover:cursor-pointer" />
        </div >
    );
}

export default Logout