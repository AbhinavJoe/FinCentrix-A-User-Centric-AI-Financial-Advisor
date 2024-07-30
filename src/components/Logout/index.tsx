import { useRouter } from "next/navigation";
import { CgLogOut } from "react-icons/cg";
import Cookies from 'js-cookie';

interface LogoutProps {
    page: string;
}

const Logout: React.FC<LogoutProps> = ({ page }) => {
    const router = useRouter();

    const handleLogout = async () => {
        const response = await fetch('/api/logout', {
            method: 'POST'
        });
        if (response.ok) {
            router.push('/');
            // Cookies.remove('token', { path: '/' });
            // router.push('/');
        } else {
            console.error('Failed to log out');
        }
    };

    return (
        <div className={`${page == "" ? "static" : "absolute"} top-5 left-5 text-4xl`}>
            <CgLogOut onClick={handleLogout} className="hover:cursor-pointer text-[#da7756]/70 hover:text-[#da7756]" />
        </div>
    );
}

export default Logout;
