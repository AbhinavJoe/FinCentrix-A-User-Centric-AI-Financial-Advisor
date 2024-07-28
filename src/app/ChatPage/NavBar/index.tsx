import Logout from "@/components/Logout"
import { useRouter, useSearchParams } from "next/navigation";

const NavBar = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const username = searchParams?.get('username');
    return (
        <div className="flex justify-between items-center top-2 w-full h-fit bg-[##A8C57C] px-4">
            <span className="font-semibold text-xl hover:cursor-pointer hover:text-green-900" onClick={() => router.push(`/Dashboard?username=${username}`)}>Back to Dashboard</span>
            <div>
                <Logout page="" />
            </div>
        </div>
    );
}

export default NavBar;