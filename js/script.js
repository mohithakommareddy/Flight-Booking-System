document.addEventListener('DOMContentLoaded',  function() {
  // Initialize date inputs with today and tomorrow as defaults
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDisplayDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  const departDateInput = document.getElementById('departDate');
  const returnDateInput = document.getElementById('returnDate');
  
  if (departDateInput) {
    departDateInput.min = formatDate(today);
    departDateInput.value = formatDate(today);
  }
  
  if (returnDateInput) {
    returnDateInput.min = formatDate(tomorrow);
    returnDateInput.value = formatDate(tomorrow);
  }
  
  // Handle one-way/round-trip toggle
  const tripTypeRadios = document.querySelectorAll('input[name="tripType"]');
  const returnDateDiv = document.querySelector('.return-date');
  
  if (tripTypeRadios.length > 0 && returnDateDiv) {
    tripTypeRadios.forEach(radio => {
      radio.addEventListener('change', function() {
        if (this.value === 'oneWay') {
          returnDateDiv.style.display = 'none';
          returnDateInput.removeAttribute('required');
        } else {
          returnDateDiv.style.display = 'block';
          returnDateInput.setAttribute('required', '');
        }
      });
    });
  }

  // Flight search form submission
  const searchForm = document.getElementById('flight-search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const tripType = document.querySelector('input[name="tripType"]:checked').value;
      const fromLocation = document.getElementById('fromLocation').value;
      const toLocation = document.getElementById('toLocation').value;
      const departDate = document.getElementById('departDate').value;
      const returnDate = document.getElementById('returnDate').value;
      const passengers = document.getElementById('passengers').value;
      const travelClass = document.getElementById('travelClass').value;
      
      // Generate search results
      generateSearchResults(tripType, fromLocation, toLocation, departDate, returnDate, passengers, travelClass);
      
      // Show the search results modal
      const searchResultsModal = new bootstrap.Modal(document.getElementById('searchResultsModal'));
      searchResultsModal.show();
    });
  }

  // Flight results generation
  function generateSearchResults(tripType, fromLocation, toLocation, departDate, returnDate, passengers, travelClass) {
    // Update search summary
    document.getElementById('routeSummary').textContent = `${fromLocation} → ${toLocation}${tripType === 'roundTrip' ? ` → ${fromLocation}` : ''}`;
    document.getElementById('departSummary').textContent = formatDisplayDate(departDate);
    
    if (tripType === 'roundTrip') {
      document.getElementById('returnSummary').textContent = formatDisplayDate(returnDate);
      document.querySelector('.return-summary').style.display = 'block';
    } else {
      document.querySelector('.return-summary').style.display = 'none';
    }
    
    document.getElementById('passengersSummary').textContent = `${passengers} ${parseInt(passengers) > 1 ? 'Adults' : 'Adult'}`;
    document.getElementById('classSummary').textContent = travelClass.charAt(0).toUpperCase() + travelClass.slice(1);
    
    // Generate outbound flights
    const outboundFlights = generateFlights(fromLocation, toLocation, departDate, 6);
    renderFlights(outboundFlights, 'outboundFlights');
    
    // Show/hide return flights section based on trip type
    const returnFlightsContainer = document.getElementById('returnFlightsContainer');
    if (tripType === 'roundTrip') {
      const returnFlights = generateFlights(toLocation, fromLocation, returnDate, 6);
      renderFlights(returnFlights, 'returnFlights');
      returnFlightsContainer.style.display = 'block';
    } else {
      returnFlightsContainer.style.display = 'none';
    }
    
    // Update flight count
    document.getElementById('flightsCount').textContent = `${outboundFlights.length} flights found`;
    
    // Generate unique airlines for filters
    const airlines = [...new Set(outboundFlights.map(flight => flight.airline))];
    const airlinesContainer = document.querySelector('.airlines-filter-container');
    airlinesContainer.innerHTML = '';
    
    airlines.forEach(airline => {
      const airlineId = airline.replace(/\s+/g, '');
      const checkbox = document.createElement('div');
      checkbox.classList.add('form-check', 'mb-2');
      checkbox.innerHTML = `
        <input class="form-check-input" type="checkbox" id="${airlineId}" checked>
        <label class="form-check-label" for="${airlineId}">${airline}</label>
      `;
      airlinesContainer.appendChild(checkbox);
    });
  }

  function generateFlights(from, to, date, count) {
    const airlines = ['SkyAir', 'Global Wings', 'Blue Horizon', 'Star Airlines', 'Royal Jets'];
    const flights = [];
    
    for (let i = 0; i < count; i++) {
      const departHour = 7 + Math.floor(Math.random() * 13); // Between 7 AM and 8 PM
      const departTime = new Date(date);
      departTime.setHours(departHour, Math.floor(Math.random() * 60));
      
      const durationMinutes = 120 + Math.floor(Math.random() * 480); // 2-10 hours
      const arrivalTime = new Date(departTime.getTime() + durationMinutes * 60000);
      
      const airline = airlines[Math.floor(Math.random() * airlines.length)];
      const flightNumber = `${airline.substring(0, 2).toUpperCase()}${100 + Math.floor(Math.random() * 900)}`;
      
      flights.push({
        airline,
        flightNumber,
        from,
        to,
        departTime,
        arrivalTime,
        duration: durationMinutes,
        price: 150 + Math.floor(Math.random() * 650),
        stops: Math.floor(Math.random() * 3), // 0, 1, or 2 stops
        // Add formatted time strings to avoid conversion issues
        departTimeStr: departTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        arrivalTimeStr: arrivalTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        dateStr: departTime.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      });
    }
    
    // Sort by price (lowest first)
    return flights.sort((a, b) => a.price - b.price);
  }

  function formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  function renderFlights(flights, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    flights.forEach(flight => {
      const flightCard = document.createElement('div');
      flightCard.classList.add('flight-card', 'bg-white', 'p-3', 'rounded', 'shadow-sm', 'mb-3');
      
      const stopsText = flight.stops === 0 ? 'Nonstop' : 
                        `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`;
      
      flightCard.innerHTML = `
        <div class="row align-items-center">
          <div class="col-md-3 mb-3 mb-md-0">
            <div class="d-flex align-items-center">
              <div class="airline-logo me-3 bg-light rounded p-2 text-center" style="width: 60px; height: 60px">
                <i class="bi bi-airplane fs-3 text-primary"></i>
              </div>
              <div>
                <h6 class="mb-0">${flight.airline}</h6>
                <small class="text-muted">${flight.flightNumber}</small>
              </div>
            </div>
          </div>
          
          <div class="col-md-5 mb-3 mb-md-0">
            <div class="flight-times d-flex justify-content-between align-items-center">
              <div class="text-center">
                <h5 class="mb-0">${flight.departTimeStr}</h5>
                <small class="text-muted">${flight.from}</small>
              </div>
              
              <div class="flight-duration text-center flex-grow-1 px-2">
                <div class="flight-line position-relative">
                  <span class="flight-stops position-absolute top-50 start-50 translate-middle bg-white px-2">
                    ${formatDuration(flight.duration)}
                  </span>
                </div>
                <small class="text-muted">${stopsText}</small>
              </div>
              
              <div class="text-center">
                <h5 class="mb-0">${flight.arrivalTimeStr}</h5>
                <small class="text-muted">${flight.to}</small>
              </div>
            </div>
          </div>
          
          <div class="col-md-2 mb-3 mb-md-0 text-center">
            <h5 class="text-primary mb-0">$${flight.price}</h5>
            <small class="text-muted">per person</small>
          </div>
          
          <div class="col-md-2 text-center">
            <button class="btn btn-primary w-100 select-flight-btn" data-flight='${JSON.stringify(flight)}'>Select</button>
          </div>
        </div>
        
        <div class="row mt-3">
          <div class="col-12">
            <button class="btn btn-link btn-sm p-0 text-decoration-none flight-details-btn" type="button" data-bs-toggle="collapse" data-bs-target="#details${flight.flightNumber}">
              Flight details <i class="bi bi-chevron-down"></i>
            </button>
            
            <div class="collapse mt-3" id="details${flight.flightNumber}">
              <div class="card card-body">
                <div class="row">
                  <div class="col-md-6">
                    <h6>Flight Details</h6>
                    <p class="mb-1"><strong>Flight:</strong> ${flight.flightNumber}</p>
                    <p class="mb-1"><strong>Aircraft:</strong> Boeing 737-800</p>
                    <p class="mb-1"><strong>Class:</strong> ${document.getElementById('travelClass').value.charAt(0).toUpperCase() + document.getElementById('travelClass').value.slice(1)}</p>
                    <p class="mb-1"><strong>Duration:</strong> ${formatDuration(flight.duration)}</p>
                    <p class="mb-0"><strong>In-flight:</strong> Wi-Fi, Meals, Entertainment</p>
                  </div>
                  <div class="col-md-6">
                    <h6>Baggage Information</h6>
                    <p class="mb-1"><strong>Cabin:</strong> 1 personal item + 1 carry-on bag</p>
                    <p class="mb-0"><strong>Checked:</strong> 1 bag included (23kg)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      
      container.appendChild(flightCard);
    });
    
    // Add event listeners to "Select" buttons
    document.querySelectorAll('.select-flight-btn').forEach(button => {
      button.addEventListener('click', function() {
        const flight = JSON.parse(this.getAttribute('data-flight'));
        showBookingModal(flight);
      });
    });
  }

  function showBookingModal(flight) {
    // Close search results modal
    const searchResultsModal = bootstrap.Modal.getInstance(document.getElementById('searchResultsModal'));
    if (searchResultsModal) {
      searchResultsModal.hide();
    }
    
    // Fill booking details
    document.getElementById('bookingAirline').textContent = flight.airline;
    document.getElementById('bookingFlightNumber').textContent = flight.flightNumber;
    document.getElementById('bookingFrom').textContent = flight.from;
    document.getElementById('bookingTo').textContent = flight.to;
    document.getElementById('bookingDepartTime').textContent = flight.departTimeStr;
    document.getElementById('bookingArrivalTime').textContent = flight.arrivalTimeStr;
    document.getElementById('bookingDuration').textContent = formatDuration(flight.duration);
    document.getElementById('bookingStops').textContent = flight.stops === 0 ? 'Nonstop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`;
    document.getElementById('bookingPrice').textContent = `$${flight.price}`;
    document.getElementById('bookingDate').textContent = flight.dateStr;
    document.getElementById('bookingClass').textContent = document.getElementById('travelClass').value.charAt(0).toUpperCase() + document.getElementById('travelClass').value.slice(1);
    
    const passengersCount = document.getElementById('passengers').value;
    document.getElementById('bookingPassengers').textContent = `${passengersCount} Adult${parseInt(passengersCount) > 1 ? 's' : ''}`;
    
    // Update booking summary
    document.getElementById('ticketSummary').textContent = `${passengersCount} x Ticket(s)`;
    document.getElementById('ticketPriceSummary').textContent = `$${flight.price} x ${passengersCount}`;
    
    const totalTicketPrice = flight.price * parseInt(passengersCount);
    const taxesAmount = Math.round(totalTicketPrice * 0.12);
    document.getElementById('taxesSummary').textContent = `$${taxesAmount}`;
    document.getElementById('totalPrice').textContent = `$${totalTicketPrice + taxesAmount}`;
    
    // Add additional passengers fields if needed
    const additionalPassengersContainer = document.getElementById('additionalPassengersContainer');
    additionalPassengersContainer.innerHTML = '';
    
    if (parseInt(passengersCount) > 1) {
      const hr = document.createElement('hr');
      hr.classList.add('my-4');
      additionalPassengersContainer.appendChild(hr);
      
      const heading = document.createElement('h5');
      heading.classList.add('mb-3');
      heading.textContent = 'Additional Passengers';
      additionalPassengersContainer.appendChild(heading);
      
      for (let i = 2; i <= parseInt(passengersCount); i++) {
        const passengerDiv = document.createElement('div');
        passengerDiv.classList.add('row', 'g-3', 'mb-4');
        passengerDiv.innerHTML = `
          <div class="col-12">
            <h6>Passenger ${i}</h6>
          </div>
          <div class="col-md-6">
            <label for="firstName${i}" class="form-label">First Name *</label>
            <input type="text" class="form-control" id="firstName${i}" name="firstName${i}" required>
          </div>
          <div class="col-md-6">
            <label for="lastName${i}" class="form-label">Last Name *</label>
            <input type="text" class="form-control" id="lastName${i}" name="lastName${i}" required>
          </div>
        `;
        additionalPassengersContainer.appendChild(passengerDiv);
      }
    }
    
    // Update insurance prices
    document.getElementById('insurancePriceSummary').textContent = `$${25 * parseInt(passengersCount)}`;
    document.getElementById('priorityBoardingPriceSummary').textContent = `$${15 * parseInt(passengersCount)}`;
    document.getElementById('extraLegroomPriceSummary').textContent = `$${30 * parseInt(passengersCount)}`;
    
    // Show booking modal
    const bookingModal = new bootstrap.Modal(document.getElementById('bookingModal'));
    bookingModal.show();
  }

  // Handle booking form submission
  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Close booking modal
      const bookingModal = bootstrap.Modal.getInstance(document.getElementById('bookingModal'));
      if (bookingModal) {
        bookingModal.hide();
      }
      
      // Generate booking reference
      const bookingReference = generateBookingReference();
      document.getElementById('bookingReference').textContent = bookingReference;
      
      // Fill confirmation details
      document.getElementById('bookingConfirmationDate').textContent = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      document.getElementById('bookingTotalAmount').textContent = document.getElementById('totalPrice').textContent;
      
      document.getElementById('confirmationAirline').textContent = document.getElementById('bookingAirline').textContent;
      document.getElementById('confirmationFlightNumber').textContent = document.getElementById('bookingFlightNumber').textContent;
      document.getElementById('confirmationFrom').textContent = document.getElementById('bookingFrom').textContent;
      document.getElementById('confirmationTo').textContent = document.getElementById('bookingTo').textContent;
      
      const departDate = document.getElementById('bookingDate').textContent;
      const departTime = document.getElementById('bookingDepartTime').textContent;
      const arriveTime = document.getElementById('bookingArrivalTime').textContent;
      
      document.getElementById('confirmationDepartDateTime').textContent = `${departDate} - ${departTime}`;
      document.getElementById('confirmationArriveDateTime').textContent = `${departDate} - ${arriveTime}`;
      document.getElementById('confirmationClass').textContent = `Class: ${document.getElementById('bookingClass').textContent}`;
      document.getElementById('confirmationPassengers').textContent = `Passengers: ${document.getElementById('bookingPassengers').textContent}`;
      
      // Show confirmation modal
      const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
      confirmationModal.show();
    });
  }

  function generateBookingReference() {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  // Toggle password visibility
  const togglePasswordBtn = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');
  
  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', function() {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      
      const icon = this.querySelector('i');
      if (icon) {
        icon.classList.toggle('bi-eye');
        icon.classList.toggle('bi-eye-slash');
      }
    });
  }
  
  // Handle payment method toggle
  const paymentMethodRadios = document.querySelectorAll('input[name="paymentMethod"]');
  const creditCardForm = document.getElementById('creditCardForm');
  const paypalForm = document.getElementById('paypalForm');
  
  if (paymentMethodRadios.length > 0 && creditCardForm && paypalForm) {
    paymentMethodRadios.forEach(radio => {
      radio.addEventListener('change', function() {
        if (this.value === 'creditCard') {
          creditCardForm.classList.remove('d-none');
          paypalForm.classList.add('d-none');
        } else if (this.value === 'paypal') {
          creditCardForm.classList.add('d-none');
          paypalForm.classList.remove('d-none');
        }
      });
    });
  }
  
  // Update price calculation based on additional services
  const travelInsurance = document.getElementById('travelInsurance');
  const priorityBoarding = document.getElementById('priorityBoarding');
  const extraLegroom = document.getElementById('extraLegroom');
  const airportPickup = document.getElementById('airportPickup');
  
  const insuranceCost = document.getElementById('insuranceCost');
  const priorityBoardingCost = document.getElementById('priorityBoardingCost');
  const extraLegroomCost = document.getElementById('extraLegroomCost');
  const airportPickupCost = document.getElementById('airportPickupCost');
  const totalPrice = document.getElementById('totalPrice');
  
  const updateTotal = () => {
    if (!totalPrice) return;
    
    // Extract base price
    const baseText = totalPrice.innerText;
    const basePrice = parseFloat(baseText.replace('$', ''));
    
    let additionalCost = 0;
    
    if (travelInsurance && travelInsurance.checked && insuranceCost) {
      insuranceCost.classList.remove('d-none');
      const amount = parseFloat(insuranceCost.querySelector('span:last-child').innerText.replace('$', ''));
      additionalCost += amount;
    } else if (insuranceCost) {
      insuranceCost.classList.add('d-none');
    }
    
    if (priorityBoarding && priorityBoarding.checked && priorityBoardingCost) {
      priorityBoardingCost.classList.remove('d-none');
      const amount = parseFloat(priorityBoardingCost.querySelector('span:last-child').innerText.replace('$', ''));
      additionalCost += amount;
    } else if (priorityBoardingCost) {
      priorityBoardingCost.classList.add('d-none');
    }
    
    if (extraLegroom && extraLegroom.checked && extraLegroomCost) {
      extraLegroomCost.classList.remove('d-none');
      const amount = parseFloat(extraLegroomCost.querySelector('span:last-child').innerText.replace('$', ''));
      additionalCost += amount;
    } else if (extraLegroomCost) {
      extraLegroomCost.classList.add('d-none');
    }
    
    if (airportPickup && airportPickup.checked && airportPickupCost) {
      airportPickupCost.classList.remove('d-none');
      const amount = parseFloat(airportPickupCost.querySelector('span:last-child').innerText.replace('$', ''));
      additionalCost += amount;
    } else if (airportPickupCost) {
      airportPickupCost.classList.add('d-none');
    }
    
    // Calculate base price without additionals
    const ticketPrice = parseFloat(document.getElementById('ticketPriceSummary').innerText.split(' x ')[0].replace('$', ''));
    const passengersCount = parseInt(document.getElementById('ticketPriceSummary').innerText.split(' x ')[1]);
    const totalTicketPrice = ticketPrice * passengersCount;
    const taxesAmount = Math.round(totalTicketPrice * 0.12);
    
    totalPrice.innerText = '$' + (totalTicketPrice + taxesAmount + additionalCost);
  };
  
  // Add event listeners to checkboxes
  if (travelInsurance) travelInsurance.addEventListener('change', updateTotal);
  if (priorityBoarding) priorityBoarding.addEventListener('change', updateTotal);
  if (extraLegroom) extraLegroom.addEventListener('change', updateTotal);
  if (airportPickup) airportPickup.addEventListener('change', updateTotal);
  
  // Price range slider in search results page
  const priceRange = document.getElementById('priceRange');
  const priceRangeValue = document.getElementById('priceRangeValue');
  
  if (priceRange && priceRangeValue) {
    priceRange.addEventListener('input', function() {
      priceRangeValue.textContent = '$' + this.value;
    });
  }
  
  // Smooth scroll for anchor links and handle "Book Now" clicks
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (href !== '#') {
        e.preventDefault();
        
        // If this is a "Book Now" button from deals section
        if (this.textContent.trim() === "Book Now") {
          // Set default popular destinations
          const dealCard = this.closest('.deal-card');
          if (dealCard) {
            const destination = dealCard.querySelector('.card-title')?.textContent.split(' to ')[1];
            if (destination) {
              const toLocationInput = document.getElementById('toLocation');
              if (toLocationInput) {
                toLocationInput.value = destination;
              }
            }
            
            // Also set the from location based on the deal card
            const origin = dealCard.querySelector('.card-title')?.textContent.split(' to ')[0];
            if (origin) {
              const fromLocationInput = document.getElementById('fromLocation');
              if (fromLocationInput) {
                fromLocationInput.value = origin;
              }
            }
          }
        }
        
        const targetElement = document.querySelector(href);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 70,
            behavior: 'smooth'
          });
        }
      }
    });
  });
  
  // Form validation
  const forms = document.querySelectorAll('.needs-validation');
  
  if (forms.length > 0) {
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        
        form.classList.add('was-validated');
      }, false);
    });
  }
  
  // Newsletter subscription
  const subscribeBtn = document.getElementById('subscribe-btn');
  
  if (subscribeBtn) {
    subscribeBtn.addEventListener('click', function() {
      const emailInput = this.previousElementSibling;
      
      if (emailInput && emailInput.value && emailInput.checkValidity()) {
        // Here you would normally send the email to the server
        alert('Thank you for subscribing to our newsletter!');
        emailInput.value = '';
      } else if (emailInput) {
        emailInput.reportValidity();
      }
    });
  }
});
  