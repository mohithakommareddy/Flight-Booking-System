import  { Link } from 'react-router-dom';
import { Plane, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Plane className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-primary-600">SkyWay</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="px-3 py-2 text-gray-700 hover:text-primary-600">Home</Link>
            <Link to="/search" className="px-3 py-2 text-gray-700 hover:text-primary-600">Flights</Link>
            <button className="btn btn-primary flex items-center">
              <User className="h-4 w-4 mr-2" />
              Sign In
            </button>
          </div>
          
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-500">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 text-gray-700 hover:text-primary-600">Home</Link>
            <Link to="/search" className="block px-3 py-2 text-gray-700 hover:text-primary-600">Flights</Link>
            <button className="w-full text-left mt-3 btn btn-primary flex items-center">
              <User className="h-4 w-4 mr-2" />
              Sign In
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
 