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
    // --- 2. Inline Search Toggle Functionality ---
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
    // --- 3. Page Content Fade-In Logic ---
    // --------------------------------------------------------------------------
    // Target any section that was given the 'fade-in' class in the HTML
    const fadeSections = document.querySelectorAll('.fade-in');

    if (fadeSections.length > 0) {
        // Use a slight delay to allow the page to render before fading in
        setTimeout(() => {
            fadeSections.forEach(section => {
                // This targets the style property directly, which works with the CSS transition
                section.style.opacity = '1'; 
            });
        }, 300); 
    }

    // --------------------------------------------------------------------------
    // --- 4. Hero Section Tilt/Parallax Animation (Only for Index.html) ---
    // --------------------------------------------------------------------------
    const heroSection = document.querySelector('.hero-section');
    const heroText = document.querySelector('.hero-text');
    const heroTagline = document.querySelector('.hero-tagline');
    
    // Only run this script if the hero section exists (i.e., we are on index.html)
    if (heroSection && heroText && heroTagline) {
        
        const maxShift = 10; // Max pixels for movement
        const maxRotation = 1; // Max degrees for rotation
        
        // Add a smooth transition to the elements so the mousemove effect isn't jumpy
        heroText.style.transition = 'transform 0.1s ease-out';
        heroTagline.style.transition = 'transform 0.1s ease-out';

        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;

            const tiltX = mouseY / (rect.height / 2); // Normalized tilt based on Y mouse position
            const tiltY = mouseX / (rect.width / 2); // Normalized tilt based on X mouse position
            
            // Text movement (opposite of mouse)
            const textShiftX = -tiltY * (maxShift * 1.5); 
            const textShiftY = -tiltX * (maxShift * 1.5);
            const textRotateX = tiltX * maxRotation;
            const textRotateY = -tiltY * maxRotation;

            heroText.style.transform = `
                translate3d(${textShiftX}px, ${textShiftY}px, 0)
                perspective(1000px) 
                rotateX(${textRotateX}deg) 
                rotateY(${textRotateY}deg)
            `;
            
            // Tagline movement (more aggressive, opposite direction)
            const taglineShiftX = tiltY * (maxShift * 2.5); 
            const taglineShiftY = tiltX * (maxShift * 2.5);
            const taglineRotateX = -tiltX * (maxRotation * 2);
            const taglineRotateY = tiltY * (maxRotation * 2);

            heroTagline.style.transform = `
                translate3d(${taglineShiftX}px, ${taglineShiftY}px, 0) 
                perspective(1000px) 
                rotateX(${taglineRotateX}deg) 
                rotateY(${taglineRotateY}deg)
            `;
        });

        heroSection.addEventListener('mouseleave', () => {
            // Reset elements to center position smoothly
            heroText.style.transform = 'translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg)';
            heroTagline.style.transform = 'translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg)';
        });
    }

});


const openBio = document.getElementById("openBio");
const closeBio = document.getElementById("closeBio");
const overlay = document.getElementById("overlay");

openBio.addEventListener("click", () => {
  overlay.classList.add("show");
});

closeBio.addEventListener("click", () => {
  overlay.classList.remove("show");
});

overlay.addEventListener("click", (e) => {
  if (e.target === overlay) {
    overlay.classList.remove("show");
  }
});







document.addEventListener('DOMContentLoaded', () => {
    // 1. Existing Bio Card Toggle Logic (Keep this)
    const openBio = document.getElementById('openBio');
    const closeBio = document.getElementById('closeBio');
    const overlay = document.getElementById('overlay');

    if (openBio && closeBio && overlay) {
        openBio.addEventListener('click', () => {
            overlay.classList.add('show');
        });

        closeBio.addEventListener('click', () => {
            overlay.classList.remove('show');
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('show');
            }
        });
    }


    // 2. NEW: Mobile Menu Toggle Logic
    const menuToggle = document.getElementById('menu-toggle');
    const header = document.querySelector('.header');

    if (menuToggle && header) {
        menuToggle.addEventListener('click', () => {
            // This class is checked in the CSS media query to show the links
            header.classList.toggle('mobile-menu-open');
        });
    }
});