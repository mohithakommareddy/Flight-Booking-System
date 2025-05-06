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
  const bookingLoader = document.getElementById('booking-loader');
  const flightNotFound = document.getElementById('flight-not-found');
  const passengerFormContainer = document.getElementById('passenger-form-container');
  const passengerForm = document.getElementById('passenger-form');
  const flightSummaryText = document.getElementById('flight-summary-text');
  const priceSummary = document.getElementById('price-summary');
  
  // Error message elements
  const firstNameError = document.getElementById('firstName-error');
  const lastNameError = document.getElementById('lastName-error');
  const emailError = document.getElementById('email-error');
  const phoneError = document.getElementById('phone-error');
  const dateOfBirthError = document.getElementById('dateOfBirth-error');
  const nationalityError = document.getElementById('nationality-error');
  const passportNumberError = document.getElementById('passportNumber-error');
  const passportExpiryError = document.getElementById('passportExpiry-error');
  
  // Current flight data
  let currentFlight = null;
  
  // Event listeners
  backButton.addEventListener('click', function() {
    window.location.href = `flight.html?id=${flightId}`;
  });
  
  passengerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (validateForm()) {
      const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        dateOfBirth: document.getElementById('dateOfBirth').value,
        nationality: document.getElementById('nationality').value,
        passportNumber: document.getElementById('passportNumber').value,
        passportExpiry: document.getElementById('passportExpiry').value
      };
      
      // Store passenger details in sessionStorage
      sessionStorage.setItem('passengerDetails', JSON.stringify(formData));
      sessionStorage.setItem('flightDetails', JSON.stringify(currentFlight));
      
      // Redirect to payment page
      window.location.href = `payment.html?id=${flightId}`;
    }
  });
  
  // Fetch flight data
  fetchFlightDetails();
  
  // Functions
  function fetchFlightDetails() {
    // Show loader
    bookingLoader.classList.remove('hidden');
    passengerFormContainer.classList.add('hidden');
    flightNotFound.classList.add('hidden');
    
    // In a real app, this would be an API call
    // For demo purposes, we'll simulate an API call with mock data
    setTimeout(() => {
      // This would normally be a fetch request to your API
      // fetch(`/api/flights/${flightId}`)
      
      // Mock data for demo
      const flight = getMockFlight(flightId);
      
      if (flight) {
        currentFlight = flight;
        renderBookingForm(flight);
      } else {
        showFlightNotFound();
      }
      
    }, 800); // Simulate network delay
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
  
  function renderBookingForm(flight) {
    // Hide loader and show form
    bookingLoader.classList.add('hidden');
    passengerFormContainer.classList.remove('hidden');
    
    // Populate flight summary
    flightSummaryText.textContent = `${flight.flightNumber} - ${flight.from} to ${flight.to}`;
    priceSummary.textContent = formatPrice(flight.price);
    
    // Set min date for passport expiry (today + 6 months)
    const today = new Date();
    const sixMonthsLater = new Date(today);
    sixMonthsLater.setMonth(today.getMonth() + 6);
    
    document.getElementById('passportExpiry').min = sixMonthsLater.toISOString().split('T')[0];
    
    // Set max date for date of birth (must be at least 2 years old)
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
    
    document.getElementById('dateOfBirth').max = twoYearsAgo.toISOString().split('T')[0];
  }
  
  function showFlightNotFound() {
    bookingLoader.classList.add('hidden');
    passengerFormContainer.classList.add('hidden');
    flightNotFound.classList.remove('hidden');
  }
  
  function validateForm() {
    // Reset error messages
    firstNameError.textContent = '';
    lastNameError.textContent = '';
    emailError.textContent = '';
    phoneError.textContent = '';
    dateOfBirthError.textContent = '';
    nationalityError.textContent = '';
    passportNumberError.textContent = '';
    passportExpiryError.textContent = '';
    
    let isValid = true;
    
    // Get form values
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const dateOfBirth = document.getElementById('dateOfBirth').value;
    const nationality = document.getElementById('nationality').value;
    const passportNumber = document.getElementById('passportNumber').value.trim();
    const passportExpiry = document.getElementById('passportExpiry').value;
    
    // Validate first name
    if (!firstName) {
      firstNameError.textContent = 'First name is required';
      isValid = false;
    }
    
    // Validate last name
    if (!lastName) {
      lastNameError.textContent = 'Last name is required';
      isValid = false;
    }
    
    // Validate email
    if (!email) {
      emailError.textContent = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      emailError.textContent = 'Email is invalid';
      isValid = false;
    }
    
    // Validate phone
    if (!phone) {
      phoneError.textContent = 'Phone number is required';
      isValid = false;
    }
    
    // Validate date of birth
    if (!dateOfBirth) {
      dateOfBirthError.textContent = 'Date of birth is required';
      isValid = false;
    }
    
    // Validate nationality
    if (!nationality) {
      nationalityError.textContent = 'Nationality is required';
      isValid = false;
    }
    
    // Validate passport number
    if (!passportNumber) {
      passportNumberError.textContent = 'Passport number is required';
      isValid = false;
    }
    
    // Validate passport expiry
    if (!passportExpiry) {
      passportExpiryError.textContent = 'Passport expiry date is required';
      isValid = false;
    } else {
      const expiryDate = new Date(passportExpiry);
      const currentDate = new Date();
      const sixMonthsFromNow = new Date();
      sixMonthsFromNow.setMonth(currentDate.getMonth() + 6);
      
      if (expiryDate < sixMonthsFromNow) {
        passportExpiryError.textContent = 'Passport must be valid for at least 6 months';
        isValid = false;
      }
    }
    
    return isValid;
  }
});
 