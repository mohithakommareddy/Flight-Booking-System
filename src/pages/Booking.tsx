import  { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, CreditCard, Mail, Phone, AlertCircle } from 'lucide-react';
import { Flight } from '../types';
import { mockFlights } from '../data/mockData';

const Booking = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    nationality: '',
    passportNumber: '',
    passportExpiry: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundFlight = mockFlights.find(f => f.id === Number(id)) || null;
      setFlight(foundFlight);
      setLoading(false);
    }, 500);
  }, [id]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData.dateOfBirth.trim()) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }
    
    if (!formData.nationality.trim()) {
      newErrors.nationality = 'Nationality is required';
    }
    
    if (!formData.passportNumber.trim()) {
      newErrors.passportNumber = 'Passport number is required';
    }
    
    if (!formData.passportExpiry.trim()) {
      newErrors.passportExpiry = 'Passport expiry date is required';
    } else {
      const expiryDate = new Date(formData.passportExpiry);
      const currentDate = new Date();
      const sixMonthsFromNow = new Date();
      sixMonthsFromNow.setMonth(currentDate.getMonth() + 6);
      
      if (expiryDate < sixMonthsFromNow) {
        newErrors.passportExpiry = 'Passport must be valid for at least 6 months';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Proceed to payment
      navigate(`/payment/${id}`, { state: { passengerDetails: formData } });
    }
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
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-primary-600 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to flight details
      </button>
      
      <div className="card mb-8">
        <h1 className="text-2xl font-bold mb-2">Passenger Details</h1>
        <p className="text-gray-600 mb-6">Please enter the passenger details exactly as they appear on their passport/ID.</p>
        
        <div className="mb-6 p-4 bg-blue-50 rounded-md">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
            <p className="text-sm text-blue-700">
              Your information is protected using secure encryption and will only be used for this booking.
            </p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <User className="h-5 w-5 text-primary-600 mr-2" />
              Personal Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`input ${errors.firstName ? 'border-red-500' : ''}`}
                />
                {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`input ${errors.lastName ? 'border-red-500' : ''}`}
                />
                {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`input pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`input pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className={`input ${errors.dateOfBirth ? 'border-red-500' : ''}`}
                />
                {errors.dateOfBirth && <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                <select
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  className={`input ${errors.nationality ? 'border-red-500' : ''}`}
                >
                  <option value="">Select nationality</option>
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                  <option value="IN">India</option>
                </select>
                {errors.nationality && <p className="mt-1 text-sm text-red-600">{errors.nationality}</p>}
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <CreditCard className="h-5 w-5 text-primary-600 mr-2" />
              Travel Document
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Passport Number</label>
                <input
                  type="text"
                  name="passportNumber"
                  value={formData.passportNumber}
                  onChange={handleChange}
                  className={`input ${errors.passportNumber ? 'border-red-500' : ''}`}
                />
                {errors.passportNumber && <p className="mt-1 text-sm text-red-600">{errors.passportNumber}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Passport Expiry Date</label>
                <input
                  type="date"
                  name="passportExpiry"
                  value={formData.passportExpiry}
                  onChange={handleChange}
                  className={`input ${errors.passportExpiry ? 'border-red-500' : ''}`}
                />
                {errors.passportExpiry && <p className="mt-1 text-sm text-red-600">{errors.passportExpiry}</p>}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-500 mb-1">Flight</p>
              <p className="font-medium">{flight.flightNumber} - {flight.from} to {flight.to}</p>
            </div>
            
            <div className="flex flex-col items-end">
              <p className="text-sm text-gray-500 mb-1">Total price</p>
              <p className="text-2xl font-bold text-primary-600">${flight.price}</p>
            </div>
          </div>
          
          <div className="mt-6 text-center md:text-right">
            <button type="submit" className="btn btn-primary py-3 px-8">
              Continue to Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Booking;
 