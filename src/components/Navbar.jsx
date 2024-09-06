import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Navbar = () => {
    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/';
    };
    return (
        <nav className='sticky top-0 z-50 py-3 backdrop-blur-lg bg-zinc-900 p-4'>
            <div className="container px-4 mx-auto flex justify-between items-center text-sm">
                <div >
                    <a className="flex items-center" href="/">
                        <img className="w-10 h-10 mr-3" src={logo} alt="Logo" />
                        <h1 className="text-4xl font-bold text-[#8c52ff]">Workify</h1>
                    </a>
                </div>
                <div className='flex space-x-8'>
                    <Link
                        to="/freelancer/profile"
                        className="text-gray-100 transition-all duration-300 font-bold text-xl"
                    >
                        Profile
                    </Link>
                    <Link
                        to="/freelancer/findprojects"
                        className="text-gray-100 transition-all duration-300 font-bold text-xl">
                        Find Projects
                    </Link>
                    <Link
                        to="/freelancer/myprojects"
                        className="text-gray-100 transition-all duration-300 font-bold text-xl">
                        My Projects
                    </Link>
                    <Link
                        to="/freelancer/resume"
                        className="text-gray-100 transition-all duration-300 font-bold text-xl">
                        Resume Analysis
                    </Link>
                    <Link
                        onClick={handleLogout}
                        className="text-gray-100 transition-all duration-300 font-bold text-xl">
                        Log Out
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;