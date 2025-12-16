document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Header Scroll Animation ---
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- 2. Inline Search Toggle Functionality (NEW) ---
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
    
    // Optional: Clicking anywhere else on the page can close the search bar
    document.addEventListener('click', (e) => {
        const isClickInsideSearch = searchIcon.contains(e.target) || searchInput.contains(e.target);
        
        if (searchInput.classList.contains('open') && !isClickInsideSearch) {
             // Close the search bar if clicking outside of it
             searchInput.classList.remove('open');
             searchInput.value = '';
        }
    });

    // --- (The rest of the JS code for Hero Tilt and Fade-in continues below) ---

    // --- 3. Hero Section Tilt/Parallax Animation ---
    const heroSection = document.querySelector('.hero-section');
    const heroText = document.querySelector('.hero-text');
    const heroTagline = document.querySelector('.hero-tagline');
    
    const maxShift = 10;
    const maxRotation = 1; 

    if (heroText && heroTagline) {
        heroText.style.transition = 'transform 0.1s ease-out';
        heroTagline.style.transition = 'transform 0.1s ease-out';
    }

    if (heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;

            const tiltX = mouseY / (rect.height / 2); 
            const tiltY = mouseX / (rect.width / 2); 
            
            // Hero Text Transform
            const textShiftX = -tiltY * (maxShift * 1.5); 
            const textShiftY = -tiltX * (maxShift * 1.5);
            const textRotateX = tiltX * maxRotation;
            const textRotateY = -tiltY * maxRotation;

            if (heroText) {
                heroText.style.transform = `
                    translate3d(${textShiftX}px, ${textShiftY}px, 0)
                    perspective(1000px) 
                    rotateX(${textRotateX}deg) 
                    rotateY(${textRotateY}deg)
                `;
            }
            
            // Hero Tagline Transform
            const taglineShiftX = tiltY * (maxShift * 2.5); 
            const taglineShiftY = tiltX * (maxShift * 2.5);
            const taglineRotateX = -tiltX * (maxRotation * 2);
            const taglineRotateY = tiltY * (maxRotation * 2);

            if (heroTagline) {
                heroTagline.style.transform = `
                    translate3d(${taglineShiftX}px, ${taglineShiftY}px, 0) 
                    perspective(1000px) 
                    rotateX(${taglineRotateX}deg) 
                    rotateY(${taglineRotateY}deg)
                `;
            }
        });

        heroSection.addEventListener('mouseleave', () => {
            if (heroText) heroText.style.transform = 'translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg)';
            if (heroTagline) heroTagline.style.transform = 'translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg)';
        });
    }

    // --- 4. Page Content Fade-In Logic ---
    const contentSections = document.querySelectorAll('.products-section, .cta-footer, .sitemap-footer');

    if (contentSections.length > 0) {
        setTimeout(() => {
            contentSections.forEach(section => {
                section.classList.add('fade-in');
            });
        }, 300); 
    }
});

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Header Scroll Animation Logic (If applicable, ensure this is present) ---
    // This is optional, but often paired with fixed headers.
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- 2. MOBILE MENU TOGGLE LOGIC ---
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links'); // The <ul> element

    if (menuToggle && header && navLinks) {
        
        // Function to toggle the menu state
        const toggleMenu = () => {
            header.classList.toggle('mobile-menu-open');
            // Optional: Toggle the icon from bars to an X
            const icon = menuToggle.querySelector('i');
            if (header.classList.contains('mobile-menu-open')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        };

        // A. Toggle the menu when the hamburger icon is clicked
        menuToggle.addEventListener('click', toggleMenu);

        // B. Automatically close the menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                // Only close if the menu is actually open
                if (header.classList.contains('mobile-menu-open')) {
                    toggleMenu(); 
                }
            });
        });
    }

    // --- 3. SEARCH INPUT TOGGLE LOGIC (Based on your About page setup) ---
    const searchIcon = document.getElementById('search-icon');
    const searchInput = document.getElementById('search-input');

    if (searchIcon && searchInput) {
        searchIcon.addEventListener('click', () => {
            // Note: Since you forced the search input to be open on mobile,
            // this desktop toggle logic might only be used on wider screens (1024px+).
            searchInput.classList.toggle('open');
            if (searchInput.classList.contains('open')) {
                searchInput.focus();
            }
        });
    }

    // --- 4. Bio Card/Modal Logic (Ensure your existing code is here too) ---
    // (If you have other JS for the cart, modal, etc., make sure it is also inside document.addEventListener)
});