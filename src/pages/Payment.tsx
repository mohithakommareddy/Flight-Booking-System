import  { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CreditCard, Check, X, Lock, Plane } from 'lucide-react';
import { Flight } from '../types';
import { mockFlights } from '../data/mockData';

const Payment = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    saveCard: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);
  
  const passengerDetails = location.state?.passengerDetails || null;
  
  useEffect(() => {
    // Redirect if no passenger details
    if (!passengerDetails) {
      navigate(`/booking/${id}`);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      const foundFlight = mockFlights.find(f => f.id === Number(id)) || null;
      setFlight(foundFlight);
      setLoading(false);
    }, 500);
  }, [id, navigate, passengerDetails]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    setFormData({
      ...formData,
      cardNumber: formattedValue
    });
    
    if (errors.cardNumber) {
      setErrors({ ...errors, cardNumber: '' });
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
    } else if (formData.cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }
    
    if (!formData.cardName.trim()) {
      newErrors.cardName = 'Cardholder name is required';
    }
    
    if (!formData.expiryDate.trim()) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Expiry date must be in the format MM/YY';
    } else {
      const [month, year] = formData.expiryDate.split('/');
      const expiry = new Date();
      expiry.setFullYear(2000 + parseInt(year), parseInt(month) - 1);
      
      if (expiry < new Date()) {
        newErrors.expiryDate = 'Card is expired';
      }
    }
    
    if (!formData.cvv.trim()) {
      newErrors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = 'CVV must be 3 or 4 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setProcessing(true);
      
      // Simulate payment processing
      setTimeout(() => {
        // Simulate 90% success rate
        const success = Math.random() < 0.9;
        
        if (success) {
          navigate(`/confirmation/${id}`, { 
            state: { 
              paymentSuccess: true,
              paymentMethod,
              passengerDetails,
              bookingReference: `SKY${Math.floor(100000 + Math.random() * 900000)}`,
              flightDetails: flight  // Pass flight details to confirmation page
            } 
          });
        } else {
          setProcessing(false);
          setErrors({
            cardNumber: 'Payment failed. Please check your card details and try again.'
          });
        }
      }, 2000);
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
        disabled={processing}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to passenger details
      </button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card">
            <h1 className="text-2xl font-bold mb-6">Payment</h1>
            
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-4">Payment Method</h2>
              
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('credit')}
                  className={`flex items-center px-4 py-3 rounded-md border ${
                    paymentMethod === 'credit' 
                      ? 'border-primary-600 bg-primary-50' 
                      : 'border-gray-300'
                  }`}
                  disabled={processing}
                >
                  <CreditCard className={`h-5 w-5 mr-2 ${
                    paymentMethod === 'credit' ? 'text-primary-600' : 'text-gray-400'
                  }`} />
                  <span>Credit/Debit Card</span>
                  {paymentMethod === 'credit' && (
                    <Check className="h-5 w-5 ml-2 text-primary-600" />
                  )}
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <h2 className="text-lg font-medium mb-4">Card Details</h2>
                
                {errors.cardNumber && errors.cardNumber.includes('Payment failed') && (
                  <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center">
                    <X className="h-5 w-5 text-red-500 mr-2" />
                    <p className="text-sm">{errors.cardNumber}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className={`input pl-10 ${errors.cardNumber ? 'border-red-500' : ''}`}
                        disabled={processing}
                      />
                    </div>
                    {errors.cardNumber && !errors.cardNumber.includes('Payment failed') && (
                      <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleChange}
                      placeholder="John Smith"
                      className={`input ${errors.cardName ? 'border-red-500' : ''}`}
                      disabled={processing}
                    />
                    {errors.cardName && <p className="mt-1 text-sm text-red-600">{errors.cardName}</p>}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        placeholder="MM/YY"
                        maxLength={5}
                        className={`input ${errors.expiryDate ? 'border-red-500' : ''}`}
                        disabled={processing}
                      />
                      {errors.expiryDate && <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        placeholder="123"
                        maxLength={4}
                        className={`input ${errors.cvv ? 'border-red-500' : ''}`}
                        disabled={processing}
                      />
                      {errors.cvv && <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="saveCard"
                      checked={formData.saveCard}
                      onChange={handleChange}
                      className="mr-2"
                      disabled={processing}
                    />
                    <span className="text-sm text-gray-700">Save this card for future payments</span>
                  </label>
                </div>
              </div>
              
              <div className="mt-6 text-center md:text-right">
                <button 
                  type="submit" 
                  className="btn btn-primary py-3 px-8 flex items-center justify-center"
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Pay Securely
                    </>
                  )}
                </button>
              </div>
              
              <div className="mt-4 text-center text-sm text-gray-500 flex items-center justify-center md:justify-end">
                <Lock className="h-4 w-4 mr-1 text-green-600" />
                <span>Payments are secure and encrypted</span>
              </div>
            </form>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="card sticky top-4">
            <h2 className="text-lg font-semibold mb-4">Booking Summary</h2>
            
            <div className="mb-4 border-b border-gray-200 pb-4">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Plane className="h-5 w-5 text-primary-600" />
                </div>
                <div className="ml-3">
                  <p className="font-medium">{flight.airline}</p>
                  <p className="text-sm text-gray-500">Flight {flight.flightNumber}</p>
                </div>
              </div>
              
              <div className="mt-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">From</span>
                  <span className="font-medium">{flight.from}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">To</span>
                  <span className="font-medium">{flight.to}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Date</span>
                  <span className="font-medium">{flight.departureDate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Time</span>
                  <span className="font-medium">{flight.departureTime} - {flight.arrivalTime}</span>
                </div>
              </div>
            </div>
            
            <div className="mb-4 border-b border-gray-200 pb-4">
              <h3 className="text-md font-medium mb-2">Passenger</h3>
              
              {passengerDetails && (
                <div className="text-sm">
                  <p className="mb-1">{passengerDetails.firstName} {passengerDetails.lastName}</p>
                  <p className="text-gray-600">{passengerDetails.email}</p>
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-md font-medium mb-2">Price Details</h3>
              
              <div className="text-sm">
                <div className="flex justify-between mb-1">
                  <span>Base fare</span>
                  <span>${flight.price - 30}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Taxes & fees</span>
                  <span>$30</span>
                </div>
                <div className="flex justify-between font-semibold text-lg mt-2 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-primary-600">${flight.price}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
 