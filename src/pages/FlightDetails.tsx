import  { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Plane, CreditCard, Clock, User, Calendar, Briefcase, Coffee, Wifi } from 'lucide-react';
import { Flight } from '../types';
import { mockFlights } from '../data/mockData';

const FlightDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(true);
  
  const fromConfirmation = location.state?.fromConfirmation || false;
  
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundFlight = mockFlights.find(f => f.id === Number(id)) || null;
      setFlight(foundFlight);
      setLoading(false);
    }, 500);
  }, [id]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (!flight) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Flight Not Found</h2>
          <p className="text-gray-600 mb-6">The flight you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => navigate('/search')} className="btn btn-primary">
            Go Back to Search
          </button>
        </div>
      </div>
    );
  }
  
  const handleBooking = () => {
    navigate(`/booking/${flight.id}`);
  };
  
  const handleConfirmationReturn = () => {
    navigate(-1);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button 
        onClick={fromConfirmation ? handleConfirmationReturn : () => navigate(-1)} 
        className="flex items-center text-primary-600 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        {fromConfirmation ? 'Back to confirmation' : 'Back to results'}
      </button>
      
      <div className="card mb-8">
        <h1 className="text-2xl font-bold mb-6">Flight Details</h1>
        
        <div className="flex flex-col lg:flex-row justify-between border-b border-gray-200 pb-6 mb-6">
          <div className="mb-6 lg:mb-0">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Plane className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold">{flight.airline}</h2>
                <p className="text-gray-600">Flight {flight.flightNumber}</p>
              </div>
            </div>
            
            <div className="flex items-center text-sm text-gray-500 space-x-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{flight.departureDate}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{flight.duration}</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-3xl font-bold text-primary-600">${flight.price}</p>
            <p className="text-gray-500">per passenger</p>
          </div>
        </div>
        
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center mb-6">
            <div className="flex-1">
              <div className="flex items-center justify-between md:justify-start md:space-x-16">
                <div className="text-center">
                  <p className="text-2xl font-bold">{flight.departureTime}</p>
                  <p className="text-sm text-gray-500">{flight.from}</p>
                </div>
                
                <div className="mx-4 flex-1 flex flex-col items-center max-w-[150px]">
                  <div className="flex items-center w-full">
                    <div className="h-0.5 flex-1 bg-gray-300"></div>
                    <Plane className="h-5 w-5 mx-2 text-gray-400 transform rotate-90" />
                    <div className="h-0.5 flex-1 bg-gray-300"></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{flight.duration}</div>
                </div>
                
                <div className="text-center">
                  <p className="text-2xl font-bold">{flight.arrivalTime}</p>
                  <p className="text-sm text-gray-500">{flight.to}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Features & Amenities</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center">
              <Briefcase className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm">Carry-on baggage included</span>
            </div>
            <div className="flex items-center">
              <Coffee className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm">Complimentary meals</span>
            </div>
            <div className="flex items-center">
              <Wifi className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm">In-flight Wifi</span>
            </div>
            <div className="flex items-center">
              <User className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm">Extra legroom</span>
            </div>
          </div>
        </div>
        
        {!fromConfirmation && (
          <div className="border-t border-gray-200 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-sm text-gray-500 mb-1">Booking for</p>
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-2" />
                  <span>1 Passenger</span>
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <p className="text-sm text-gray-500 mb-1">Total price</p>
                <p className="text-2xl font-bold text-primary-600">${flight.price}</p>
              </div>
            </div>
            
            <div className="mt-6 text-center md:text-right">
              <button onClick={handleBooking} className="btn btn-primary py-3 px-8">
                Continue to Booking
              </button>
            </div>
          </div>
        )}
        
        {fromConfirmation && (
          <div className="border-t border-gray-200 pt-6">
            <div className="mt-6 text-center">
              <button onClick={handleConfirmationReturn} className="btn btn-primary py-3 px-8">
                Return to Confirmation
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Important Information</h3>
        
        <div className="space-y-4 text-sm text-gray-600">
          <p>
            <strong>Refund Policy:</strong> This ticket is refundable with a $50 processing fee up to 24 hours before departure.
          </p>
          <p>
            <strong>Check-in:</strong> Online check-in is available 24 hours before departure. Airport check-in closes 45 minutes before departure.
          </p>
          <p>
            <strong>Baggage:</strong> 1 carry-on bag (max 7kg) and 1 checked bag (max 23kg) are included in the fare.
          </p>
          <div className="mt-4">
            <img 
              src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw1fHxhaXJwbGFuZSUyMGZsaWdodCUyMHRyYXZlbHxlbnwwfHx8fDE3NDYwMTUyMTB8MA&ixlib=rb-4.0.3&fit=fillmax&h=300&w=600" 
              alt="Airplane in flight" 
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightDetails;
 