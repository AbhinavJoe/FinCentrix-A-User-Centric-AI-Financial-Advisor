import Logout from "@/components/Logout"
import { useRouter, useSearchParams } from "next/navigation";

const NavBar = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const username = searchParams?.get('username');
    return (
        <div className="fixed flex justify-end w-full h-fit px-4 top-2 z-10">
            {/* <span className="font-semibold md:text-xl text-lg text-[#da7756]/70 hover:cursor-pointer hover:text-[#da7756]" onClick={() => router.push(`/Dashboard?username=${username}`)}>Back to Dashboard</span> */}
            <div className="left-3 top-2">
                <Logout page="" />
            </div>
        </div>
    );
}

export default NavBar;