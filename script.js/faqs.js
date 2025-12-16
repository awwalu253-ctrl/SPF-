document.addEventListener('DOMContentLoaded', () => {

    // --------------------------------------------------------------------------
    // 1. Header Scroll Animation
    // --------------------------------------------------------------------------
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

    // --------------------------------------------------------------------------
    // 2. Mobile Menu Toggle (HAMBURGER)
    // --------------------------------------------------------------------------
    const menuToggle = document.getElementById('menu-toggle');

    if (menuToggle && header) {
        menuToggle.addEventListener('click', () => {
            header.classList.toggle('mobile-menu-open');
        });
    }

    // --------------------------------------------------------------------------
    // 3. Inline Search Toggle Functionality
    // --------------------------------------------------------------------------
    const searchIcon = document.getElementById('search-icon');
    const searchInput = document.getElementById('search-input');

    const toggleInlineSearch = (e) => {
        e.stopPropagation(); // prevent document click from closing it immediately

        if (!searchInput) return;

        searchInput.classList.toggle('open');

        if (searchInput.classList.contains('open')) {
            searchInput.focus();
        } else {
            searchInput.value = '';
        }
    };

    if (searchIcon) {
        searchIcon.addEventListener('click', toggleInlineSearch);
    }

    // Close search when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput || !searchIcon) return;

        const clickedInside =
            searchIcon.contains(e.target) || searchInput.contains(e.target);

        if (searchInput.classList.contains('open') && !clickedInside) {
            searchInput.classList.remove('open');
            searchInput.value = '';
        }
    });

    // --------------------------------------------------------------------------
    // 4. FAQ Accordion Functionality
    // --------------------------------------------------------------------------
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(headerItem => {
        headerItem.addEventListener('click', () => {
            const content = headerItem.nextElementSibling;

            headerItem.classList.toggle('active');
            content.classList.toggle('open');

            accordionHeaders.forEach(otherHeader => {
                if (
                    otherHeader !== headerItem &&
                    otherHeader.classList.contains('active')
                ) {
                    otherHeader.classList.remove('active');
                    otherHeader.nextElementSibling.classList.remove('open');
                }
            });
        });
    });

});
