import { useRouter } from "next/navigation";
import { CgLogOut } from "react-icons/cg";

const Logout = () => {
    const router = useRouter();

    const handleLogout = async () => {
        const response = await fetch('/api/logout', {
            method: 'POST'
        });
        if (response.ok) {
            router.push('/');
        } else {
            console.error('Failed to log out');
        }
    };

    return (
        <div className="absolute top-5 left-5 text-4xl">
            <CgLogOut onClick={handleLogout} className="hover:cursor-pointer" />
        </div>
    );
}

export default Logout;
