document.addEventListener('DOMContentLoaded',  function() {
  // Get flight ID from URL
  const params = getUrlParams();
  const flightId = params.id;
  
  // Check for stored details
  const passengerDetailsString = sessionStorage.getItem('passengerDetails');
  const flightDetailsString = sessionStorage.getItem('flightDetails');
  const bookingReference = sessionStorage.getItem('bookingReference');
  const paymentMethod = sessionStorage.getItem('paymentMethod');
  const paymentDate = sessionStorage.getItem('paymentDate');
  
  if (!flightId || !passengerDetailsString || !flightDetailsString || !bookingReference) {
    window.location.href = 'index.html';
    return;
  }
  
  const passengerDetails = JSON.parse(passengerDetailsString);
  const flightDetails = JSON.parse(flightDetailsString);
  
  // Get DOM elements
  const confirmationLoader = document.getElementById('confirmation-loader');
  const flightNotFound = document.getElementById('flight-not-found');
  const confirmationContent = document.getElementById('confirmation-content');
  const viewFlightButton = document.getElementById('view-flight-button');
  const viewFlightDetails = document.getElementById('view-flight-details');
  
  // Confirmation details DOM elements
  const bookingReferenceElement = document.getElementById('booking-reference');
  const airlineName = document.getElementById('airline-name');
  const flightNumber = document.getElementById('flight-number');
  const flightDate = document.getElementById('flight-date');
  const flightDuration = document.getElementById('flight-duration');
  const departureTime = document.getElementById('departure-time');
  const departureLocation = document.getElementById('departure-location');
  const arrivalTime = document.getElementById('arrival-time');
  const arrivalLocation = document.getElementById('arrival-location');
  const ticketPrice = document.getElementById('ticket-price');
  const passengerName = document.getElementById('passenger-name');
  const passengerEmail = document.getElementById('passenger-email');
  const passengerPhone = document.getElementById('passenger-phone');
  const passengerPassport = document.getElementById('passenger-passport');
  const paymentMethodElement = document.getElementById('payment-method');
  const amountPaid = document.getElementById('amount-paid');
  const transactionDate = document.getElementById('transaction-date');
  
  // Event listeners
  viewFlightButton.addEventListener('click', function() {
    window.location.href = `flight.html?id=${flightId}&from=confirmation`;
  });
  
  viewFlightDetails.addEventListener('click', function() {
    window.location.href = `flight.html?id=${flightId}&from=confirmation`;
  });
  
  // Initialize confirmation page
  initConfirmationPage();
  
  // Functions
  function initConfirmationPage() {
    // Show loader
    confirmationLoader.classList.remove('hidden');
    confirmationContent.classList.add('hidden');
    flightNotFound.classList.add('hidden');
    
    // Render confirmation details
    renderConfirmationDetails();
  }
  
  function renderConfirmationDetails() {
    // Hide loader and show confirmation content
    confirmationLoader.classList.add('hidden');
    confirmationContent.classList.remove('hidden');
    
    // Populate booking reference
    bookingReferenceElement.textContent = bookingReference;
    
    // Populate flight details
    airlineName.textContent = flightDetails.airline;
    flightNumber.textContent = `Flight ${flightDetails.flightNumber}`;
    flightDate.textContent = formatDate(flightDetails.departureDate);
    flightDuration.textContent = flightDetails.duration;
    departureTime.textContent = flightDetails.departureTime;
    departureLocation.textContent = flightDetails.from;
    arrivalTime.textContent = flightDetails.arrivalTime;
    arrivalLocation.textContent = flightDetails.to;
    ticketPrice.textContent = formatPrice(flightDetails.price);
    
    // Populate passenger details
    passengerName.textContent = `${passengerDetails.firstName} ${passengerDetails.lastName}`;
    passengerEmail.textContent = passengerDetails.email;
    passengerPhone.textContent = passengerDetails.phone;
    passengerPassport.textContent = passengerDetails.passportNumber;
    
    // Populate payment details
    paymentMethodElement.textContent = paymentMethod === 'credit' ? 'Credit/Debit Card' : 'Other Method';
    amountPaid.textContent = formatPrice(flightDetails.price);
    transactionDate.textContent = formatDate(paymentDate);
  }
});
 