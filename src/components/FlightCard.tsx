import  { Clock, Plane } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Flight } from '../types';

interface FlightCardProps {
  flight: Flight;
}

const FlightCard = ({ flight }: FlightCardProps) => {
  return (
    <div className="card mb-4 hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row justify-between">
        <div className="mb-4 md:mb-0">
          <div className="flex items-center mb-2">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <Plane className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-3">
              <p className="font-medium">{flight.airline}</p>
              <p className="text-sm text-gray-500">Flight {flight.flightNumber}</p>
            </div>
          </div>
          
          <div className="flex items-center mt-4">
            <div className="text-center">
              <p className="text-lg font-bold">{flight.departureTime}</p>
              <p className="text-sm text-gray-500">{flight.from}</p>
            </div>
            
            <div className="mx-4 flex-1 flex flex-col items-center">
              <div className="flex items-center w-full">
                <div className="h-0.5 flex-1 bg-gray-300"></div>
                <Plane className="h-4 w-4 mx-2 text-gray-400 transform rotate-90" />
                <div className="h-0.5 flex-1 bg-gray-300"></div>
              </div>
              <div className="text-xs text-gray-500 mt-1 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {flight.duration}
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-lg font-bold">{flight.arrivalTime}</p>
              <p className="text-sm text-gray-500">{flight.to}</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col justify-between items-end">
          <div className="text-right">
            <p className="text-2xl font-bold text-primary-600">${flight.price}</p>
            <p className="text-sm text-gray-500">{flight.seatsAvailable} seats left</p>
          </div>
          
          <Link to={`/flight/${flight.id}`} className="btn btn-primary mt-4">
            Select
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;
 