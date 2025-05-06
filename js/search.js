document.addEventListener('DOMContentLoaded',  function() {
  // Get URL parameters and populate search form
  const params = getUrlParams();
  
  if (params.from) document.getElementById('from').value = params.from;
  if (params.to) document.getElementById('to').value = params.to;
  if (params.depart) document.getElementById('depart').value = params.depart;
  if (params.return) document.getElementById('return').value = params.return;
  if (params.passengers) document.getElementById('passengers').value = params.passengers;
  
  // Get DOM elements
  const flightsList = document.getElementById('flights-list');
  const flightsLoader = document.getElementById('flights-loader');
  const resultsCount = document.getElementById('results-count');
  const noFlights = document.getElementById('no-flights');
  const resetFilters = document.getElementById('reset-filters');
  const priceSlider = document.getElementById('price-slider');
  const maxPriceDisplay = document.getElementById('max-price');
  const sortBy = document.getElementById('sort-by');
  const airlinesFilter = document.getElementById('airlines-filter');
  
  // Initialize state
  let flights = [];
  let filteredFlights = [];
  let airlines = new Set();
  let filters = {
    maxPrice: 1000,
    timeOfDay: 'all',
    airlines: []
  };
  
  // Fetch flights data
  fetchFlights();
  
  // Event listeners
  priceSlider.addEventListener('input', function() {
    filters.maxPrice = parseInt(this.value);
    maxPriceDisplay.textContent = formatPrice(filters.maxPrice);
    applyFilters();
  });
  
  document.querySelectorAll('input[name="time-of-day"]').forEach(radio => {
    radio.addEventListener('change', function() {
      filters.timeOfDay = this.value;
      applyFilters();
    });
  });
  
  sortBy.addEventListener('change', function() {
    sortFlights(this.value);
    renderFlights();
  });
  
  resetFilters.addEventListener('click', function() {
    resetAllFilters();
  });
  
  // Functions
  function fetchFlights() {
    // Show loader
    flightsLoader.classList.remove('hidden');
    flightsList.classList.add('hidden');
    noFlights.classList.add('hidden');
    
    // In a real app, this would be an API call with the search parameters
    // For demo purposes, we'll simulate an API call with mock data
    setTimeout(() => {
      // This would normally be a fetch request to your API
      // fetch(`/api/flights?from=${params.from}&to=${params.to}&date=${params.depart}`)
      
      // Mock data for demo
      flights = [
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
          departureDate: params.depart || '2023-07-15'
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
          departureDate: params.depart || '2023-07-15'
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
          departureDate: params.depart || '2023-07-15'
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
          departureDate: params.depart || '2023-07-15'
        },
        {
          id: 5,
          airline: 'SkyWay Airlines',
          flightNumber: 'SW205',
          from: params.from || 'New York (JFK)',
          to: params.to || 'Paris (CDG)',
          departureTime: '09:30',
          arrivalTime: '11:45',
          duration: '1h 15m',
          price: 199,
          seatsAvailable: 22,
          departureDate: params.depart || '2023-07-15'
        },
        {
          id: 6,
          airline: 'Euro Connect',
          flightNumber: 'EC118',
          from: params.from || 'New York (JFK)',
          to: params.to || 'Paris (CDG)',
          departureTime: '14:15',
          arrivalTime: '16:30',
          duration: '1h 15m',
          price: 179,
          seatsAvailable: 5,
          departureDate: params.depart || '2023-07-15'
        },
      ];
      
      // Set airlines for filter
      flights.forEach(flight => airlines.add(flight.airline));
      
      // Initialize filtered flights
      filteredFlights = [...flights];
      
      // Sort flights by price (low to high) by default
      sortFlights('price-asc');
      
      // Populate airline filters
      populateAirlineFilters();
      
      // Hide loader and show results
      flightsLoader.classList.add('hidden');
      
      // Apply filters and render flights
      applyFilters();
      
    }, 1500); // Simulate network delay
  }
  
  function populateAirlineFilters() {
    let html = '<h3>Airlines</h3>';
    
    airlines.forEach(airline => {
      html += `
        <label class="radio-label">
          <input type="checkbox" name="airline" value="${airline}" data-airline="${airline}">
          <span>${airline}</span>
        </label>
      `;
    });
    
    airlinesFilter.innerHTML = html;
    
    // Add event listeners to airline checkboxes
    document.querySelectorAll('input[name="airline"]').forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        const airline = this.getAttribute('data-airline');
        
        if (this.checked) {
          if (!filters.airlines.includes(airline)) {
            filters.airlines.push(airline);
          }
        } else {
          filters.airlines = filters.airlines.filter(a => a !== airline);
        }
        
        applyFilters();
      });
    });
  }
  
  function applyFilters() {
    filteredFlights = flights.filter(flight => {
      // Price filter
      if (flight.price > filters.maxPrice) {
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
        if (filters.timeOfDay === 'evening' && (hour < 18)) {
          return false;
        }
      }
      
      // Airline filter
      if (filters.airlines.length > 0 && !filters.airlines.includes(flight.airline)) {
        return false;
      }
      
      return true;
    });
    
    renderFlights();
  }
  
  function sortFlights(sortOption) {
    switch (sortOption) {
      case 'price-asc':
        filteredFlights.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filteredFlights.sort((a, b) => b.price - a.price);
        break;
      case 'duration':
        filteredFlights.sort((a, b) => {
          const getDuration = (duration) => {
            const [hours, minutes] = duration.split('h ');
            return parseInt(hours) * 60 + parseInt(minutes);
          };
          return getDuration(a.duration) - getDuration(b.duration);
        });
        break;
    }
  }
  
  function renderFlights() {
    if (filteredFlights.length === 0) {
      flightsList.classList.add('hidden');
      noFlights.classList.remove('hidden');
      resultsCount.textContent = 'No flights found';
    } else {
      flightsList.classList.remove('hidden');
      noFlights.classList.add('hidden');
      resultsCount.textContent = `${filteredFlights.length} flights found`;
      
      let html = '';
      
      filteredFlights.forEach(flight => {
        html += `
          <div class="flight-card">
            <div class="flight-info">
              <div class="airline-info">
                <div class="airline-logo">
                  <i class="icon-plane"></i>
                </div>
                <div>
                  <p class="airline-name">${flight.airline}</p>
                  <p class="flight-number">Flight ${flight.flightNumber}</p>
                </div>
              </div>
              
              <div class="flight-route">
                <div class="route-time">
                  <p class="time">${flight.departureTime}</p>
                  <p class="location">${flight.from}</p>
                </div>
                
                <div class="route-line">
                  <div class="line"></div>
                  <i class="icon-plane"></i>
                  <div class="duration">
                    <i class="icon-clock"></i> ${flight.duration}
                  </div>
                </div>
                
                <div class="route-time">
                  <p class="time">${flight.arrivalTime}</p>
                  <p class="location">${flight.to}</p>
                </div>
              </div>
            </div>
            
            <div class="flight-pricing">
              <div class="flight-price">
                <p class="price">${formatPrice(flight.price)}</p>
                <p class="seats">${flight.seatsAvailable} seats left</p>
                
                <a href="flight.html?id=${flight.id}" class="btn btn-primary">Select</a>
              </div>
            </div>
          </div>
        `;
      });
      
      flightsList.innerHTML = html;
    }
  }
  
  function resetAllFilters() {
    filters = {
      maxPrice: 1000,
      timeOfDay: 'all',
      airlines: []
    };
    
    // Reset UI
    priceSlider.value = 1000;
    maxPriceDisplay.textContent = formatPrice(1000);
    document.querySelector('input[name="time-of-day"][value="all"]').checked = true;
    document.querySelectorAll('input[name="airline"]').forEach(checkbox => {
      checkbox.checked = false;
    });
    
    applyFilters();
  }
});
 