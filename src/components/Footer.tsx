import  { Plane } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center">
              <Plane className="h-6 w-6 text-primary-400" />
              <span className="ml-2 text-lg font-bold text-white">SkyWay</span>
            </div>
            <p className="mt-2 text-sm text-gray-400">Book your dream flights with ease.</p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Company</h3>
              <div className="mt-4 space-y-2">
                <a href="#" className="text-sm text-gray-400 hover:text-white">About</a>
                <div></div>
                <a href="#" className="text-sm text-gray-400 hover:text-white">Careers</a>
                <div></div>
                <a href="#" className="text-sm text-gray-400 hover:text-white">Contact</a>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Support</h3>
              <div className="mt-4 space-y-2">
                <a href="#" className="text-sm text-gray-400 hover:text-white">Help Center</a>
                <div></div>
                <a href="#" className="text-sm text-gray-400 hover:text-white">FAQs</a>
                <div></div>
                <a href="#" className="text-sm text-gray-400 hover:text-white">Privacy</a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between">
          <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} SkyWay Flight Booking. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
 