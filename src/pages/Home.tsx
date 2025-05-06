import  { Plane, MapPin, Clock, CreditCard, Check, Star } from 'lucide-react';
import SearchForm from '../components/SearchForm';

const Home = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center h-[500px]" 
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1476900543704-4312b78632f8?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwzfHxhaXJwbGFuZSUyMGZsaWdodCUyMHRyYXZlbHxlbnwwfHx8fDE3NDYwMTQxNDJ8MA&ixlib=rb-4.0.3&fit=fillmax&h=800&w=1200')` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Find and Book Your <span className="text-primary-400">Perfect Flight</span></h1>
          <p className="text-xl text-white mb-8 max-w-2xl">Discover amazing deals on flights to destinations worldwide. Book easily and securely with SkyWay.</p>
        </div>
      </div>
      
      {/* Search Form Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 mb-12 z-10">
        <SearchForm />
      </div>
      
      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose SkyWay</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <Plane className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
            <p className="text-gray-600">Choose from thousands of flights across hundreds of airlines worldwide.</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <MapPin className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Global Destinations</h3>
            <p className="text-gray-600">Fly to over 5,000 destinations across 200+ countries around the world.</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <Clock className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Fast Booking</h3>
            <p className="text-gray-600">Book your flight in minutes with our simple and intuitive booking process.</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <CreditCard className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
            <p className="text-gray-600">Your payment information is always protected with our secure payment system.</p>
          </div>
        </div>
      </div>
      
      {/* Popular Destinations */}
      <div className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Destinations</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="relative h-64 rounded-lg overflow-hidden group">
              <img src="https://images.unsplash.com/photo-1562587592-889f254ff71c?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw0fHxhaXJwbGFuZSUyMGZsaWdodCUyMHRyYXZlbHxlbnwwfHx8fDE3NDYwMTQxNDJ8MA&ixlib=rb-4.0.3&fit=fillmax&h=800&w=1200" 
                  alt="New York" 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
              <div className="absolute bottom-0 left-0 p-4">
                <h3 className="text-xl font-bold text-white">New York</h3>
                <p className="text-sm text-white">Flights from $199</p>
              </div>
            </div>
            
            <div className="relative h-64 rounded-lg overflow-hidden group">
              <img src="https://images.unsplash.com/photo-1611818164352-70f028c2ba2a?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxhaXJwbGFuZSUyMGZsaWdodCUyMHRyYXZlbHxlbnwwfHx8fDE3NDYwMTQxNDJ8MA&ixlib=rb-4.0.3&fit=fillmax&h=800&w=1200" 
                  alt="London" 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
              <div className="absolute bottom-0 left-0 p-4">
                <h3 className="text-xl font-bold text-white">London</h3>
                <p className="text-sm text-white">Flights from $299</p>
              </div>
            </div>
            
            <div className="relative h-64 rounded-lg overflow-hidden group">
              <img src="https://images.unsplash.com/photo-1615561916422-7014e1078997?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwyfHxhaXJwbGFuZSUyMGZsaWdodCUyMHRyYXZlbHxlbnwwfHx8fDE3NDYwMTQxNDJ8MA&ixlib=rb-4.0.3&fit=fillmax&h=800&w=1200" 
                  alt="Tokyo" 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
              <div className="absolute bottom-0 left-0 p-4">
                <h3 className="text-xl font-bold text-white">Tokyo</h3>
                <p className="text-sm text-white">Flights from $499</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Testimonials */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card">
            <div className="flex items-center mb-4">
              <div className="flex text-primary-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
            </div>
            <p className="text-gray-600 mb-4">"I found a great deal on an international flight. The booking process was simple and I received my tickets instantly."</p>
            <div className="flex items-center">
              <div className="mr-3">
                <p className="font-semibold">Sarah Johnson</p>
                <p className="text-sm text-gray-500">New York, USA</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center mb-4">
              <div className="flex text-primary-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
            </div>
            <p className="text-gray-600 mb-4">"SkyWay made it so easy to book my family vacation. We saved over $300 compared to other booking sites!"</p>
            <div className="flex items-center">
              <div className="mr-3">
                <p className="font-semibold">Michael Chen</p>
                <p className="text-sm text-gray-500">Vancouver, Canada</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center mb-4">
              <div className="flex text-primary-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
            </div>
            <p className="text-gray-600 mb-4">"The customer service was excellent when I needed to change my flight. They were helpful and resolved my issue quickly."</p>
            <div className="flex items-center">
              <div className="mr-3">
                <p className="font-semibold">Emma Williams</p>
                <p className="text-sm text-gray-500">London, UK</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
 