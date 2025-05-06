import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users } from 'lucide-react';

const SearchForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    departDate: '',
    returnDate: '',
    passengers: 1
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/search', { state: formData });
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              name="from"
              value={formData.from}
              onChange={handleChange}
              placeholder="City or Airport"
              className="input pl-10"
              required
            />
          </div>
        </div>
        
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              name="to"
              value={formData.to}
              onChange={handleChange}
              placeholder="City or Airport"
              className="input pl-10"
              required
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Depart</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="date"
              name="departDate"
              value={formData.departDate}
              onChange={handleChange}
              className="input pl-10"
              required
            />
          </div>
        </div>
        
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Return</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="date"
              name="returnDate"
              value={formData.returnDate}
              onChange={handleChange}
              className="input pl-10"
            />
          </div>
        </div>
        
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Passengers</label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              name="passengers"
              value={formData.passengers}
              onChange={handleChange}
              className="input pl-10"
              required
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center">
        <button type="submit" className="btn btn-primary px-8 py-3">Search Flights</button>
      </div>
    </form>
  );
};

export default SearchForm;
 