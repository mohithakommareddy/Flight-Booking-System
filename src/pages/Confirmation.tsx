import  { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, X, Plane, Calendar, Clock, User, Mail, Phone, Download, Share, ArrowLeft } from 'lucide-react';
import { Flight } from '../types';
import { mockFlights } from '../data/mockData';

const Confirmation = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(true);
  
  const paymentSuccess = location.state?.paymentSuccess || false;
  const paymentMethod = location.state?.paymentMethod || '';
  const passengerDetails = location.state?.passengerDetails || null;
  const bookingReference = location.state?.bookingReference || '';
  const flightDetails = location.state?.flightDetails || null;
  
  useEffect(() => {
    // Use flight details passed from payment page if available
    if (flightDetails) {
      setFlight(flightDetails);
      setLoading(false);
      return;
    }
    
    // Redirect if no payment success
    if (!paymentSuccess || !passengerDetails) {
      navigate(`/flight/${id}`);
      return;
    }
    
    // Fallback to API call if flight details weren't passed
    setTimeout(() => {
      const foundFlight = mockFlights.find(f => f.id === Number(id)) || null;
      setFlight(foundFlight);
      setLoading(false);
    }, 500);
  }, [id, navigate, paymentSuccess, passengerDetails, flightDetails]);
  
  const viewFlightDetails = () => {
    navigate(`/flight/${id}`, { state: { fromConfirmation: true } });
  };
  
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
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="card mb-8">
        <div className="flex flex-col items-center text-center mb-8 p-6 bg-green-50 rounded-lg">
          <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600 mb-4">Your flight has been successfully booked and confirmed.</p>
          <div className="text-lg font-semibold">
            Booking Reference: <span className="text-primary-600">{bookingReference}</span>
          </div>
        </div>
        
        <div className="border-b border-gray-200 pb-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Flight Details</h2>
            <button onClick={viewFlightDetails} className="btn btn-outline flex items-center text-sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
              View Flight Details
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <Plane className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-3">
                  <p className="font-medium">{flight.airline}</p>
                  <p className="text-sm text-gray-500">Flight {flight.flightNumber}</p>
                </div>
              </div>
              
              <div className="flex items-center mb-2">
                <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                <span>{flight.departureDate}</span>
              </div>
              
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-400 mr-2" />
                <span>Duration: {flight.duration}</span>
              </div>
            </div>
            
            <div className="flex flex-col md:items-end">
              <div className="flex items-center mb-4 md:justify-end">
                <div className="text-center mr-4 md:order-2 md:ml-4 md:mr-0">
                  <p className="text-lg font-bold">{flight.departureTime}</p>
                  <p className="text-sm text-gray-500">{flight.from}</p>
                </div>
                
                <div className="mx-2 flex-1 flex flex-col items-center max-w-[100px]">
                  <div className="flex items-center w-full">
                    <div className="h-0.5 flex-1 bg-gray-300"></div>
                    <Plane className="h-4 w-4 mx-1 text-gray-400 transform rotate-90" />
                    <div className="h-0.5 flex-1 bg-gray-300"></div>
                  </div>
                </div>
                
                <div className="text-center md:order-1">
                  <p className="text-lg font-bold">{flight.arrivalTime}</p>
                  <p className="text-sm text-gray-500">{flight.to}</p>
                </div>
              </div>
              
              <div className="mt-2 text-right">
                <p className="text-sm text-gray-500">Ticket Price</p>
                <p className="text-xl font-bold text-primary-600">${flight.price}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-b border-gray-200 pb-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Passenger Information</h2>
          
          {passengerDetails && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Passenger Name</p>
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-2" />
                  <p className="font-medium">{passengerDetails.firstName} {passengerDetails.lastName}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-2" />
                  <p className="font-medium">{passengerDetails.email}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Phone</p>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-2" />
                  <p className="font-medium">{passengerDetails.phone}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Passport Number</p>
                <p className="font-medium">{passengerDetails.passportNumber}</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="border-b border-gray-200 pb-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Payment Method</p>
              <p className="font-medium">
                {paymentMethod === 'credit' ? 'Credit/Debit Card' : 'Other Method'}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-1">Payment Status</p>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <p className="font-medium text-green-600">Paid</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-1">Amount Paid</p>
              <p className="font-medium">${flight.price}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-1">Transaction Date</p>
              <p className="font-medium">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-between">
          <button className="btn btn-outline flex items-center justify-center">
            <Download className="h-5 w-5 mr-2" />
            Download E-Ticket
          </button>
          
          <div className="flex flex-col md:flex-row gap-4">
            <button onClick={viewFlightDetails} className="btn btn-outline flex items-center justify-center">
              <Plane className="h-5 w-5 mr-2" />
              View Flight Details
            </button>
            
            <button className="btn btn-primary flex items-center justify-center">
              <Share className="h-5 w-5 mr-2" />
              Share Itinerary
            </button>
          </div>
        </div>
      </div>
      
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Important Information</h2>
        
        <div className="space-y-4 text-sm text-gray-600">
          <p>
            <strong>Check-in:</strong> Online check-in opens 24 hours before departure and closes 2 hours before departure. You can also check in at the airport counter.
          </p>
          <p>
            <strong>Baggage:</strong> Your ticket includes 1 carry-on bag (max 7kg) and 1 checked bag (max 23kg). Additional baggage can be purchased separately.
          </p>
          <p>
            <strong>Changes:</strong> Flight changes can be made up to 24 hours before departure, subject to fare difference and change fee.
          </p>
          <p>
            <strong>Cancellation:</strong> Cancellations made more than 24 hours before departure are eligible for a partial refund minus cancellation fees.
          </p>
        </div>
        
        <div className="mt-8 flex flex-col md:flex-row justify-center gap-4">
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Book Another Flight
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
 