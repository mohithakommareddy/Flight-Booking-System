document.addEventListener('DOMContentLoaded',  function() {
  // Set copyright year
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
  
  // Mobile menu toggle
  const mobileMenuButton = document.getElementById('mobile-menu-toggle');
  if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', function() {
      const nav = document.querySelector('nav');
      const authButtons = document.querySelector('.auth-buttons');
      
      nav.style.display = nav.style.display === 'block' ? 'none' : 'block';
      if (authButtons) {
        authButtons.style.display = authButtons.style.display === 'flex' ? 'none' : 'flex';
      }
      
      // Toggle menu button appearance
      const spans = mobileMenuButton.querySelectorAll('span');
      if (nav.style.display === 'block') {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });
  }
  
  // Search form setup
  const searchForm = document.getElementById('search-form');
  if (searchForm) {
    // Set min date for departure and return to today
    const today = new Date().toISOString().split('T')[0];
    const departInput = document.getElementById('depart');
    const returnInput = document.getElementById('return');
    
    if (departInput) {
      departInput.min = today;
      
      // Default to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      departInput.value = tomorrow.toISOString().split('T')[0];
    }
    
    if (returnInput) {
      returnInput.min = today;
    }
    
    // Update return date min value when depart date changes
    if (departInput && returnInput) {
      departInput.addEventListener('change', function() {
        returnInput.min = departInput.value;
        
        // If return is before depart, update it
        if (returnInput.value && returnInput.value < departInput.value) {
          returnInput.value = departInput.value;
        }
      });
    }
    
    // Form submission
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const fromValue = document.getElementById('from').value;
      const toValue = document.getElementById('to').value;
      const departValue = document.getElementById('depart').value;
      const returnValue = document.getElementById('return').value;
      const passengersValue = document.getElementById('passengers').value;
      
      // Redirect to search page with query parameters
      const searchParams = new URLSearchParams({
        from: fromValue,
        to: toValue,
        depart: departValue,
        passengers: passengersValue
      });
      
      if (returnValue) {
        searchParams.append('return', returnValue);
      }
      
      window.location.href = `search.html?${searchParams.toString()}`;
    });
  }
});

// Helper functions for all pages
function formatPrice(price) {
  return '$' + parseFloat(price).toFixed(2);
}

function formatDate(dateString) {
  const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

function getUrlParams() {
  const params = {};
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  
  for (const [key, value] of urlParams.entries()) {
    params[key] = value;
  }
  
  return params;
}
 