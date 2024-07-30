import Logout from "@/components/Logout"
import { useRouter, useSearchParams } from "next/navigation";

const NavBar = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const username = searchParams?.get('username');
    return (
        <div className="flex justify-between items-center top-2 w-full h-fit bg-[#393937]/60 px-4 border-b-2 border-[#43443f]">
            <span className="font-semibold text-xl text-[#da7756]/70 hover:cursor-pointer hover:text-[#da7756]" onClick={() => router.push(`/Dashboard?username=${username}`)}>Back to Dashboard</span>
            <div className="">
                <Logout page="" />
            </div>
        </div>
    );
}

export default NavBar;