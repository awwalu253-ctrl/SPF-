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

    // ... [Existing JS code for Header, Search, Fade-In, Hero Tilt, and Modal] ...

    // --------------------------------------------------------------------------
    // --- 6. FAQ Accordion Functionality ---
    // --------------------------------------------------------------------------
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            
            // Toggle the 'active' class on the header
            header.classList.toggle('active');
            
            // Toggle the 'open' class on the content
            content.classList.toggle('open');

            // Close all other open accordion items
            accordionHeaders.forEach(otherHeader => {
                if (otherHeader !== header && otherHeader.classList.contains('active')) {
                    otherHeader.classList.remove('active');
                    otherHeader.nextElementSibling.classList.remove('open');
                }
            });
        });
    });

// ... [End of DOMContentLoaded] ...
});
