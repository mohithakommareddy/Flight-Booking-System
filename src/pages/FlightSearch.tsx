import  { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Clock, Filter, Sun, Moon } from 'lucide-react';
import SearchForm from '../components/SearchForm';
import FlightCard from '../components/FlightCard';
import { Flight } from '../types';

const mockFlights: Flight[] = [
  {
    id: 1,
    airline: 'SkyWay Airlines',
    flightNumber: 'SW101',
    from: 'New York (JFK)',
    to: 'London (LHR)',
    departureTime: '08:00',
    arrivalTime: '20:00',
    duration: '7h 00m',
    price: 549,
    seatsAvailable: 12,
    departureDate: '2023-07-15',
    returnDate: null
  },
  {
    id: 2,
    airline: 'Global Airways',
    flightNumber: 'GA205',
    from: 'New York (JFK)',
    to: 'London (LHR)',
    departureTime: '12:30',
    arrivalTime: '00:30',
    duration: '7h 00m',
    price: 499,
    seatsAvailable: 8,
    departureDate: '2023-07-15',
    returnDate: null
  },
  {
    id: 3,
    airline: 'Atlantic Express',
    flightNumber: 'AE310',
    from: 'New York (JFK)',
    to: 'London (LHR)',
    departureTime: '16:45',
    arrivalTime: '04:45',
    duration: '7h 00m',
    price: 475,
    seatsAvailable: 3,
    departureDate: '2023-07-15',
    returnDate: null
  },
  {
    id: 4,
    airline: 'SkyWay Airlines',
    flightNumber: 'SW102',
    from: 'New York (JFK)',
    to: 'London (LHR)',
    departureTime: '21:15',
    arrivalTime: '09:15',
    duration: '7h 00m',
    price: 450,
    seatsAvailable: 15,
    departureDate: '2023-07-15',
    returnDate: null
  }
];

const FlightSearch = () => {
  const location = useLocation();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    timeOfDay: 'all',
    airlines: [] as string[]
  });
  
  useEffect(() => {
    // Simulate API call with location.state as search params
    setTimeout(() => {
      setFlights(mockFlights);
      setLoading(false);
    }, 1000);
  }, [location]);
  
  const handleFilterChange = (type: string, value: any) => {
    setFilters({
      ...filters,
      [type]: value
    });
  };
  
  const filteredFlights = flights.filter(flight => {
    // Price filter
    if (flight.price < filters.priceRange[0] || flight.price > filters.priceRange[1]) {
      return false;
    }
    
    // Time of day filter
    if (filters.timeOfDay !== 'all') {
      const hour = parseInt(flight.departureTime.split(':')[0]);
      if (filters.timeOfDay === 'morning' && (hour < 6 || hour >= 12)) {
        return false;
      }
      if (filters.timeOfDay === 'afternoon' && (hour < 12 || hour >= 18)) {
        return false;
      }
      if (filters.timeOfDay === 'evening' && (hour < 18 || hour >= 24)) {
        return false;
      }
    }
    
    // Airline filter
    if (filters.airlines.length > 0 && !filters.airlines.includes(flight.airline)) {
      return false;
    }
    
    return true;
  });
  
  const uniqueAirlines = [...new Set(flights.map(flight => flight.airline))];
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <SearchForm />
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters */}
        <div className="md:w-1/4">
          <div className="card sticky top-4">
            <div className="flex items-center mb-6">
              <Filter className="h-5 w-5 text-primary-600 mr-2" />
              <h2 className="text-xl font-semibold">Filters</h2>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Price Range</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">${filters.priceRange[0]}</span>
                <span className="text-sm text-gray-600">${filters.priceRange[1]}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="1000" 
                step="50"
                value={filters.priceRange[1]} 
                onChange={e => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                className="w-full"
              />
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Time of Day</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    checked={filters.timeOfDay === 'all'} 
                    onChange={() => handleFilterChange('timeOfDay', 'all')}
                    className="mr-2"
                  />
                  <Clock className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm">Any Time</span>
                </label>
                
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    checked={filters.timeOfDay === 'morning'} 
                    onChange={() => handleFilterChange('timeOfDay', 'morning')}
                    className="mr-2"
                  />
                  <Sun className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm">Morning (6AM - 12PM)</span>
                </label>
                
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    checked={filters.timeOfDay === 'afternoon'} 
                    onChange={() => handleFilterChange('timeOfDay', 'afternoon')}
                    className="mr-2"
                  />
                  <Sun className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm">Afternoon (12PM - 6PM)</span>
                </label>
                
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    checked={filters.timeOfDay === 'evening'} 
                    onChange={() => handleFilterChange('timeOfDay', 'evening')}
                    className="mr-2"
                  />
                  <Moon className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm">Evening (6PM - 12AM)</span>
                </label>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Airlines</h3>
              <div className="space-y-2">
                {uniqueAirlines.map((airline, index) => (
                  <label key={index} className="flex items-center">
                    <input 
                      type="checkbox" 
                      checked={filters.airlines.includes(airline)} 
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleFilterChange('airlines', [...filters.airlines, airline]);
                        } else {
                          handleFilterChange('airlines', filters.airlines.filter(a => a !== airline));
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">{airline}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Flight Results */}
        <div className="md:w-3/4">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {loading ? 'Searching for flights...' : 
                filteredFlights.length === 0 ? 'No flights found' : 
                `${filteredFlights.length} flights found`}
            </h2>
            
            <select 
              className="input max-w-[200px]"
              onChange={(e) => {
                const sortedFlights = [...flights];
                if (e.target.value === 'price-asc') {
                  sortedFlights.sort((a, b) => a.price - b.price);
                } else if (e.target.value === 'price-desc') {
                  sortedFlights.sort((a, b) => b.price - a.price);
                } else if (e.target.value === 'duration') {
                  sortedFlights.sort((a, b) => {
                    const getDuration = (duration: string) => {
                      const parts = duration.match(/(\d+)h\s*(\d+)m/);
                      if (!parts) return 0;
                      return parseInt(parts[1]) * 60 + parseInt(parts[2]);
                    };
                    return getDuration(a.duration) - getDuration(b.duration);
                  });
                }
                setFlights(sortedFlights);
              }}
            >
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="duration">Duration: Shortest</option>
            </select>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : filteredFlights.length === 0 ? (
            <div className="card flex flex-col items-center justify-center py-12">
              <h3 className="text-xl font-medium mb-2">No flights match your filters</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filters to see more results</p>
              <button 
                onClick={() => setFilters({
                  priceRange: [0, 1000],
                  timeOfDay: 'all',
                  airlines: []
                })}
                className="btn btn-outline"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div>
              {filteredFlights.map(flight => (
                <FlightCard key={flight.id} flight={flight} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlightSearch;
 