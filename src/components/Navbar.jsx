import { Link } from 'react-router-dom';


const Navbar = () => {
  return (
    <nav className='sticky top-0 z-50 py-3 backdrop-blur-lg bg-transparent p-4 nav-bar'>
      <div className="container px-4 mx-auto flex justify-between items-center text-sm">
        <div className="flex items-center">
          <a className='flex items-center' href="/">
             <img className="w-10 h-10 mr-3" src="https://img.icons8.com/?size=100&id=Elwv47CdCH7i&format=png&color=000000" alt="Workify Logo" />
             <h1 className="text-4xl font-bold text-gray-100">Workify</h1>
          </a>
        </div>
        <div className='flex space-x-8'>
          <Link 
            to="/profile"
            className="text-gray-100 hover:text-white hover:underline hover:underline-blue-500 hover:text-lg transition-all duration-300 font-bold text-xl"
          >
            Profile
          </Link>
          <Link 
            to="/myprojects"
            className="text-gray-100 hover:text-white hover:underline hover:underline-blue-900 hover:text-lg transition-all duration-300 font-bold text-xl"
          >
            My Projects
          </Link>
          <Link 
            to="/explore"
            className="text-gray-100 hover:text-white hover:underline hover:underline-blue-500 hover:text-lg transition-all duration-300 font-bold text-xl"
          >
            Explore
          </Link>
        </div>
      </div>
    </nav>
    

  );
}

export default Navbar;
