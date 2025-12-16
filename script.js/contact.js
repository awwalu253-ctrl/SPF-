document.addEventListener('DOMContentLoaded', () => {
    
    // --------------------------------------------------------------------------
    // --- 1. Header Scroll Animation (Transparent to Solid) ---
    // --------------------------------------------------------------------------
    const header = document.querySelector('.header');

    // Only apply if the header element exists
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
        // Initial check on load in case the user reloads while scrolled down
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        }
    }

    // --------------------------------------------------------------------------
    // --- 2. Mobile Menu Toggle Functionality (NEW ADDITION) ---
    // --------------------------------------------------------------------------
    const menuToggle = document.getElementById('menu-toggle');
    // 'header' is already defined above

    if (menuToggle && header) {
        menuToggle.addEventListener('click', () => {
            // This class is checked in the CSS media query to show the links
            header.classList.toggle('mobile-menu-open');
        });
    }

    // --------------------------------------------------------------------------
    // --- 3. Inline Search Toggle Functionality ---
    // --------------------------------------------------------------------------
    const searchIcon = document.getElementById('search-icon');
    const searchInput = document.getElementById('search-input');

    const toggleInlineSearch = () => {
        if (searchInput) {
            // Toggles the 'open' class on the input field itself
            searchInput.classList.toggle('open');
            
            if (searchInput.classList.contains('open')) {
                searchInput.focus();
            } else {
                // Optional: Clear the input when it closes
                searchInput.value = '';
            }
        }
    };

    if (searchIcon) {
        // Attach listener to the search icon
        searchIcon.addEventListener('click', toggleInlineSearch);
    }
    
    // Optional: Close the search bar if clicking anywhere else on the page
    document.addEventListener('click', (e) => {
        // Check if the click target is outside both the icon and the input
        const isClickInsideSearch = searchIcon && searchInput && (searchIcon.contains(e.target) || searchInput.contains(e.target));
        
        if (searchInput && searchInput.classList.contains('open') && !isClickInsideSearch) {
             // Close the search bar if clicking outside of it
             searchInput.classList.remove('open');
             searchInput.value = '';
        }
    });


    // --------------------------------------------------------------------------
    // --- 4. Content Fade-In Observer (Makes sections visible) ---
    // --------------------------------------------------------------------------
    const fadeInElements = document.querySelectorAll('.fade-in');

    // Options for the Intersection Observer
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // When element comes into view, set opacity to 1
                entry.target.style.opacity = '1';
                // Stop observing after the fade-in completes (optional)
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply the observer to all elements with the 'fade-in' class
    fadeInElements.forEach(element => {
        observer.observe(element);
    });
});
