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
});


// ====================================================================
// --- GLOBAL CART STORAGE AND UTILITY FUNCTIONS ---
// (These functions are defined globally for easy access)
// ====================================================================
let cart = JSON.parse(localStorage.getItem('reveddyCart')) || []; 

function saveCart() {
    localStorage.setItem('reveddyCart', JSON.stringify(cart));
}

// Function to clear the cart entirely. Defined globally.
function clearCart() {
    cart = []; 
    saveCart(); 
    // This calls the renderCart function defined inside DOMContentLoaded
    renderCart(); 
}


// ====================================================================
// --- CORE DOM CONTENT LOADED BLOCK ---
// ====================================================================
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. SELECT ALL NECESSARY ELEMENTS
    const cartItemsContainer = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');
    const cartSubtotalSpan = document.getElementById('cartSubtotal');
    const cartModal = document.getElementById('cartModal');
    const cartIcon = document.getElementById('cart-icon');
    
    const searchInput = document.getElementById('search-input');
    const productCards = document.querySelectorAll('.product-card'); 
    const filterButtons = document.querySelectorAll('.filter-btn');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const noMatchMessage = document.getElementById('no-match-message');
    const notificationBar = document.getElementById('notification-bar');
    // ADDED MISSING SELECTION LINE
    const clearCartButton = document.getElementById('clear-cart-btn'); 


    // --------------------------------------------------------------------------
    // --- UTILITIES: Show/Hide Notification Bar (Item Added Success) ---
    // --------------------------------------------------------------------------
    function showNotification() {
        if (notificationBar) {
            notificationBar.classList.add('show');
            
            setTimeout(() => {
                notificationBar.classList.remove('show');
            }, 3000); 
        }
    }

    // --------------------------------------------------------------------------
    // --- UTILITIES: Cart Total and Badge Update ---
    // --------------------------------------------------------------------------
    function updateCartTotal() {
        let subtotal = 0;
        let totalQuantity = 0;

        cart.forEach(item => {
            subtotal += (item.price * item.quantity);
            totalQuantity += item.quantity;
        });
        
        if (cartSubtotalSpan) {
            cartSubtotalSpan.textContent = `$${subtotal.toFixed(2)}`;
        }

        const cartCountBadge = document.getElementById('cart-count-badge');
        if (cartCountBadge) {
            cartCountBadge.textContent = totalQuantity;
            cartCountBadge.style.display = 'inline-block'; 
            cartCountBadge.style.opacity = totalQuantity === 0 ? '0.5' : '1';
        }

        const emptyState = cartItemsContainer ? cartItemsContainer.querySelector('.cart-empty-state') : null;
        
        if (subtotal > 0) {
            if (cartSummary) cartSummary.style.display = 'block';
            if (emptyState) emptyState.remove();
        } else {
            if (cartSummary) cartSummary.style.display = 'none';
            if (!emptyState && cartItemsContainer) {
                cartItemsContainer.innerHTML = `
                    <div class="cart-empty-state">
                        <i class="fas fa-shopping-cart cart-icon-large"></i>
                        <p>Your cart is empty</p>
                    </div>
                `;
            }
        }
    }

    // --------------------------------------------------------------------------
    // --- UTILITIES: Cart Rendering and Listeners (Attach/Remove Items) ---
    // --------------------------------------------------------------------------
    function attachCartListeners() {
        cartItemsContainer.querySelectorAll('.quantity-change-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                const change = parseInt(e.currentTarget.getAttribute('data-change'));
                
                const itemIndex = cart.findIndex(item => item.id === id);
                if (itemIndex > -1) {
                    cart[itemIndex].quantity += change;
                    if (cart[itemIndex].quantity <= 0) {
                        cart.splice(itemIndex, 1);
                    }
                }
                saveCart();
                renderCart();
            });
        });

        cartItemsContainer.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                const itemIndex = cart.findIndex(item => item.id === id);
                
                if (itemIndex > -1) {
                    cart.splice(itemIndex, 1);
                }
                saveCart();
                renderCart();
            });
        });
    }

    function renderCart() { 
        if (!cartItemsContainer) return;

        cartItemsContainer.querySelectorAll('.cart-item').forEach(item => item.remove());

        if (cart.length > 0) {
            cart.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('cart-item');
                itemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    </div>
                    <div class="quantity-controls">
                        <button class="quantity-change-btn" data-id="${item.id}" data-change="-1">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-change-btn" data-id="${item.id}" data-change="1">+</button>
                    </div>
                    <button class="remove-item-btn" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
                `;
                cartItemsContainer.prepend(itemElement);
            });
        }

        attachCartListeners();
        updateCartTotal();
    }


    // --------------------------------------------------------------------------
    // --- 3. ADD TO CART LISTENER ---
    // --------------------------------------------------------------------------
    if (addToCartButtons.length > 0) { 
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const card = event.target.closest('.product-card');
                if (!card) return; 

                const product = {
                    id: card.getAttribute('data-name'), 
                    name: card.getAttribute('data-name'),
                    price: parseFloat(card.getAttribute('data-price')),
                    image: card.querySelector('img') ? card.querySelector('img').src : 'placeholder.jpg', 
                    quantity: 1
                };

                const existingItem = cart.find(item => item.id === product.id);

                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push(product);
                }
                
                saveCart(); 
                showNotification(); 
                renderCart();
            });
        });
    }


    // --------------------------------------------------------------------------
    // --- 4. PRODUCT SEARCH AND FILTERING LOGIC ---
    // --------------------------------------------------------------------------
    
    // Search Input Listener
    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            const searchTerm = event.target.value.toLowerCase();
            let matchCount = 0;
            
            productCards.forEach(card => {
                const name = card.getAttribute('data-name').toLowerCase();
                const isMatch = name.includes(searchTerm);

                if (isMatch) {
                    card.classList.remove('hidden');
                    card.style.opacity = '1';
                    matchCount++;
                } else {
                    card.classList.add('hidden');
                    card.style.opacity = '0';
                }
            });

            if (noMatchMessage) {
                if (matchCount === 0 && searchTerm.length > 0) {
                    noMatchMessage.style.display = 'block';
                } else {
                    noMatchMessage.style.display = 'none';
                }
            }

            filterButtons.forEach(btn => btn.classList.remove('active'));
            const allButton = document.querySelector('.filter-btn[data-filter="all"]');
            if (allButton) { allButton.classList.add('active'); }
        });
    }

    // Filter Button Listeners
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filterValue = button.getAttribute('data-filter');
            
            if (searchInput) searchInput.value = '';
            if (noMatchMessage) noMatchMessage.style.display = 'none';

            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            productCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('hidden');
                    card.style.opacity = '1';
                } else {
                    card.classList.add('hidden');
                    card.style.opacity = '0';
                }
            });
        });
    });
    
    // --------------------------------------------------------------------------
    // --- 5. INITIALIZATION & LISTENERS (Modal Controls and Clear Cart) ---
    // --------------------------------------------------------------------------
    
    // FINAL CLEAR CART LISTENER (Attached once the DOM is ready)
    if (clearCartButton) {
        clearCartButton.addEventListener('click', () => {
            clearCart();
        });
    }

    // Modal Close Button Listener
    const closeBtn = cartModal ? cartModal.querySelector('.close-btn') : null;
    if (closeBtn && cartModal) {
        closeBtn.addEventListener('click', () => { cartModal.style.display = 'none'; });
    }

    // Modal Background Click Listener
    if (cartModal) {
        window.addEventListener('click', (event) => {
            if (event.target === cartModal) { cartModal.style.display = 'none'; }
        });
    }

    // Modal Open Listener 
    if (cartIcon && cartModal) {
        cartIcon.addEventListener('click', () => {
            cartModal.style.display = 'block';
            renderCart(); 
        });
    }

    // Initial render to load stored cart data and set badge
    renderCart(); 


    const menuToggle = document.getElementById('menu-toggle');
    const header = document.querySelector('.header');

    if (menuToggle && header) {
        menuToggle.addEventListener('click', () => {
            // This class is checked in the CSS media query to show the links
            header.classList.toggle('mobile-menu-open');
        });
    }

});

