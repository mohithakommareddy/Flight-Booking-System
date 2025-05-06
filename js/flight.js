document.addEventListener('DOMContentLoaded',  function() {
  // Get flight ID from URL
  const params = getUrlParams();
  const flightId = params.id;
  
  if (!flightId) {
    window.location.href = 'search.html';
    return;
  }
  
  // Get DOM elements
  const backButton = document.getElementById('back-button');
  const flightLoader = document.getElementById('flight-loader');
  const flightNotFound = document.getElementById('flight-not-found');
  const flightInfo = document.getElementById('flight-info');
  const bookButton = document.getElementById('book-button');
  
  // DOM elements for flight details
  const airlineName = document.getElementById('airline-name');
  const flightNumber = document.getElementById('flight-number');
  const flightDate = document.getElementById('flight-date');
  const flightDuration = document.getElementById('flight-duration');
  const flightPrice = document.getElementById('flight-price');
  const departureTime = document.getElementById('departure-time');
  const departureLocation = document.getElementById('departure-location');
  const arrivalTime = document.getElementById('arrival-time');
  const arrivalLocation = document.getElementById('arrival-location');
  const routeDuration = document.getElementById('route-duration');
  const totalPrice = document.getElementById('total-price');
  
  // Event listeners
  backButton.addEventListener('click', function() {
    window.history.back();
  });
  
  // Fetch flight data
  fetchFlightDetails();
  
  // Functions
  function fetchFlightDetails() {
    // Show loader
    flightLoader.classList.remove('hidden');
    flightInfo.classList.add('hidden');
    flightNotFound.classList.add('hidden');
    
    // In a real app, this would be an API call
    // For demo purposes, we'll simulate an API call with mock data
    setTimeout(() => {
      // This would normally be a fetch request to your API
      // fetch(`/api/flights/${flightId}`)
      
      // Mock data for demo
      const flight = getMockFlight(flightId);
      
      if (flight) {
        renderFlightDetails(flight);
      } else {
        showFlightNotFound();
      }
      
    }, 1000); // Simulate network delay
  }
  
  function getMockFlight(id) {
    // Mock flight data - in a real app, this would come from an API
    const mockFlights = [
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
        departureDate: '2023-07-15'
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
        departureDate: '2023-07-15'
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
        departureDate: '2023-07-15'
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
        departureDate: '2023-07-15'
      },
      {
        id: 5,
        airline: 'SkyWay Airlines',
        flightNumber: 'SW205',
        from: 'London (LHR)',
        to: 'Paris (CDG)',
        departureTime: '09:30',
        arrivalTime: '11:45',
        duration: '1h 15m',
        price: 199,
        seatsAvailable: 22,
        departureDate: '2023-07-20'
      },
      {
        id: 6,
        airline: 'Euro Connect',
        flightNumber: 'EC118',
        from: 'London (LHR)',
        to: 'Paris (CDG)',
        departureTime: '14:15',
        arrivalTime: '16:30',
        duration: '1h 15m',
        price: 179,
        seatsAvailable: 5,
        departureDate: '2023-07-20'
      },
    ];
    
    return mockFlights.find(flight => flight.id === parseInt(id));
  }
  
  function renderFlightDetails(flight) {
    // Hide loader and show flight info
    flightLoader.classList.add('hidden');
    flightInfo.classList.remove('hidden');
    
    // Populate flight details
    airlineName.textContent = flight.airline;
    flightNumber.textContent = `Flight ${flight.flightNumber}`;
    flightDate.textContent = formatDate(flight.departureDate);
    flightDuration.textContent = flight.duration;
    flightPrice.textContent = formatPrice(flight.price);
    departureTime.textContent = flight.departureTime;
    departureLocation.textContent = flight.from;
    arrivalTime.textContent = flight.arrivalTime;
    arrivalLocation.textContent = flight.to;
    routeDuration.textContent = flight.duration;
    totalPrice.textContent = formatPrice(flight.price);
    
    // Update booking button
    bookButton.href = `booking.html?id=${flight.id}`;
  }
  
  function showFlightNotFound() {
    flightLoader.classList.add('hidden');
    flightInfo.classList.add('hidden');
    flightNotFound.classList.remove('hidden');
  }
});
 