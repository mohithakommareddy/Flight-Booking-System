document.addEventListener('DOMContentLoaded',  function() {
  // Get flight ID from URL
  const params = getUrlParams();
  const flightId = params.id;
  
  // Check for stored passenger details
  const passengerDetailsString = sessionStorage.getItem('passengerDetails');
  const flightDetailsString = sessionStorage.getItem('flightDetails');
  
  if (!flightId || !passengerDetailsString || !flightDetailsString) {
    window.location.href = `booking.html?id=${flightId}`;
    return;
  }
  
  const passengerDetails = JSON.parse(passengerDetailsString);
  const flightDetails = JSON.parse(flightDetailsString);
  
  // Get DOM elements
  const backButton = document.getElementById('back-button');
  const paymentLoader = document.getElementById('payment-loader');
  const flightNotFound = document.getElementById('flight-not-found');
  const paymentContent = document.getElementById('payment-content');
  const paymentForm = document.getElementById('payment-form');
  const paymentError = document.getElementById('payment-error');
  const paymentErrorMessage = document.getElementById('payment-error-message');
  const payButton = document.getElementById('pay-button');
  
  // Payment details DOM elements
  const airlineName = document.getElementById('airline-name');
  const flightNumber = document.getElementById('flight-number');
  const flightFrom = document.getElementById('flight-from');
  const flightTo = document.getElementById('flight-to');
  const flightDate = document.getElementById('flight-date');
  const flightTime = document.getElementById('flight-time');
  const passengerName = document.getElementById('passenger-name');
  const passengerEmail = document.getElementById('passenger-email');
  const baseFare = document.getElementById('base-fare');
  const taxesFees = document.getElementById('taxes-fees');
  const totalPrice = document.getElementById('total-price');
  
  // Error message elements
  const cardNumberError = document.getElementById('cardNumber-error');
  const cardNameError = document.getElementById('cardName-error');
  const expiryDateError = document.getElementById('expiryDate-error');
  const cvvError = document.getElementById('cvv-error');
  
  // Event listeners
  backButton.addEventListener('click', function() {
    window.location.href = `booking.html?id=${flightId}`;
  });
  
  paymentForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (validateForm()) {
      // Start payment processing
      startPaymentProcessing();
      
      // In a real app, this would make an API call to process the payment
      // For demo purposes, we'll simulate a successful payment
      setTimeout(() => {
        // Generate booking reference
        const bookingReference = 'SKY' + Math.floor(100000 + Math.random() * 900000);
        
        // Store confirmation details
        sessionStorage.setItem('bookingReference', bookingReference);
        sessionStorage.setItem('paymentMethod', document.querySelector('.payment-method-option.active').getAttribute('data-method'));
        sessionStorage.setItem('paymentDate', new Date().toISOString());
        
        // Redirect to confirmation page
        window.location.href = `confirmation.html?id=${flightId}`;
      }, 2000);
    }
  });
  
  // Format card number with spaces
  const cardNumberInput = document.getElementById('cardNumber');
  cardNumberInput.addEventListener('input', function(e) {
    const value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const parts = [];
    
    for (let i = 0; i < value.length; i += 4) {
      parts.push(value.substr(i, 4));
    }
    
    e.target.value = parts.join(' ');
    
    // Clear error if any
    cardNumberError.textContent = '';
  });
  
  // Format expiry date with slash
  const expiryDateInput = document.getElementById('expiryDate');
  expiryDateInput.addEventListener('input', function(e) {
    const value = e.target.value.replace(/\D/g, '');
    
    if (value.length >= 3) {
      e.target.value = value.substring(0, 2) + '/' + value.substring(2, 4);
    } else {
      e.target.value = value;
    }
    
    // Clear error if any
    expiryDateError.textContent = '';
  });
  
  // Payment method selection
  const paymentMethodOptions = document.querySelectorAll('.payment-method-option');
  paymentMethodOptions.forEach(option => {
    option.addEventListener('click', function() {
      paymentMethodOptions.forEach(opt => opt.classList.remove('active'));
      this.classList.add('active');
    });
  });
  
  // Initialize payment page
  initPaymentPage();
  
  // Functions
  function initPaymentPage() {
    // Show loader
    paymentLoader.classList.remove('hidden');
    paymentContent.classList.add('hidden');
    flightNotFound.classList.add('hidden');
    
    // Render flight and passenger details
    renderPaymentDetails();
  }
  
  function renderPaymentDetails() {
    // Hide loader and show payment content
    paymentLoader.classList.add('hidden');
    paymentContent.classList.remove('hidden');
    
    // Populate flight details
    airlineName.textContent = flightDetails.airline;
    flightNumber.textContent = `Flight ${flightDetails.flightNumber}`;
    flightFrom.textContent = flightDetails.from;
    flightTo.textContent = flightDetails.to;
    flightDate.textContent = formatDate(flightDetails.departureDate);
    flightTime.textContent = `${flightDetails.departureTime} - ${flightDetails.arrivalTime}`;
    
    // Populate passenger details
    passengerName.textContent = `${passengerDetails.firstName} ${passengerDetails.lastName}`;
    passengerEmail.textContent = passengerDetails.email;
    
    // Calculate price breakdown
    const price = flightDetails.price;
    const taxes = 30; // Fixed taxes and fees for demo
    const basePrice = price - taxes;
    
    baseFare.textContent = formatPrice(basePrice);
    taxesFees.textContent = formatPrice(taxes);
    totalPrice.textContent = formatPrice(price);
  }
  
  function validateForm() {
    // Reset error messages
    cardNumberError.textContent = '';
    cardNameError.textContent = '';
    expiryDateError.textContent = '';
    cvvError.textContent = '';
    
    // Hide payment error
    paymentError.classList.add('hidden');
    
    let isValid = true;
    
    // Get form values
    const cardNumber = document.getElementById('cardNumber').value.trim().replace(/\s/g, '');
    const cardName = document.getElementById('cardName').value.trim();
    const expiryDate = document.getElementById('expiryDate').value.trim();
    const cvv = document.getElementById('cvv').value.trim();
    
    // Validate card number
    if (!cardNumber) {
      cardNumberError.textContent = 'Card number is required';
      isValid = false;
    } else if (cardNumber.length !== 16) {
      cardNumberError.textContent = 'Card number must be 16 digits';
      isValid = false;
    }
    
    // Validate card name
    if (!cardName) {
      cardNameError.textContent = 'Cardholder name is required';
      isValid = false;
    }
    
    // Validate expiry date
    if (!expiryDate) {
      expiryDateError.textContent = 'Expiry date is required';
      isValid = false;
    } else if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      expiryDateError.textContent = 'Expiry date must be in the format MM/YY';
      isValid = false;
    } else {
      const [month, year] = expiryDate.split('/');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;
      
      if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        expiryDateError.textContent = 'Card is expired';
        isValid = false;
      }
    }
    
    // Validate CVV
    if (!cvv) {
      cvvError.textContent = 'CVV is required';
      isValid = false;
    } else if (!/^\d{3,4}$/.test(cvv)) {
      cvvError.textContent = 'CVV must be 3 or 4 digits';
      isValid = false;
    }
    
    return isValid;
  }
  
  function startPaymentProcessing() {
    // Disable form and show loading state
    document.querySelectorAll('#payment-form input, #payment-form button').forEach(el => {
      el.disabled = true;
    });
    
    payButton.innerHTML = `
      <div class="spinner"></div>
      Processing...
    `;
  }
  
  function showPaymentError(message) {
    paymentErrorMessage.textContent = message;
    paymentError.classList.remove('hidden');
    
    // Re-enable form
    document.querySelectorAll('#payment-form input, #payment-form button').forEach(el => {
      el.disabled = false;
    });
    
    payButton.innerHTML = `
      <i class="icon-lock"></i> Pay Securely
    `;
  }
});
 