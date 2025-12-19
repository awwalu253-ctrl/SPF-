document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------------------------------
    // --- 1. Header Scroll Animation (Transparent to Solid) ---
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

        // Initial check on load
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        }
    }

    // --------------------------------------------------------------------------
    // --- 2. Mobile Menu Drop-Down ---
    // --------------------------------------------------------------------------
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle && header) {
        menuToggle.addEventListener('click', () => {
            // Toggle dropdown menu
            header.classList.toggle('mobile-menu-open');
        });
    }

    // --------------------------------------------------------------------------
    // --- 3. Inline Search Toggle Functionality ---
    // --------------------------------------------------------------------------
    const searchIcon = document.getElementById('search-icon');
    const searchInput = document.getElementById('search-input');

    if (searchIcon && searchInput) {
        searchIcon.addEventListener('click', () => {
            searchInput.classList.toggle('open');
            if (searchInput.classList.contains('open')) {
                searchInput.focus();
            } else {
                searchInput.value = '';
            }
        });
    }

    // Optional: Close the search bar if clicking anywhere else
    document.addEventListener('click', (e) => {
        const isClickInsideSearch = searchIcon && searchInput && 
            (searchIcon.contains(e.target) || searchInput.contains(e.target));
        
        if (searchInput && searchInput.classList.contains('open') && !isClickInsideSearch) {
            searchInput.classList.remove('open');
            searchInput.value = '';
        }
    });

    // --------------------------------------------------------------------------
    // --- 4. Checkout / Cart Functionality ---
    // --------------------------------------------------------------------------
    // NOTE: Changed WhatsApp number to the one provided in the previous response
    const WHATSAPP_NUMBER = '2349077661358'; 
    const FIXED_SHIPPING_FEE = 1500;
    const CURRENCY_SYMBOL = '₦';
    let cart = JSON.parse(localStorage.getItem('reveddyCart')) || [];

    function formatNaira(amount) {
        const numAmount = Number(amount);
        return `${CURRENCY_SYMBOL}${numAmount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
    }

    function renderCheckoutSummary() {
        const itemsContainer = document.getElementById('checkout-cart-items');
        const subtotalSpan = document.getElementById('summary-subtotal');
        const shippingSpan = document.getElementById('summary-shipping');
        const totalSpan = document.getElementById('summary-total');
        const buttonTotalSpan = document.getElementById('button-total-price');

        if (!itemsContainer) return;
        itemsContainer.innerHTML = '';
        let subtotal = 0;

        if (cart.length === 0) {
            itemsContainer.innerHTML = '<p class="text-center">Your cart is empty! Please add products.</p>';
            subtotal = 0;
        } else {
            cart.forEach(item => {
                const itemPrice = parseFloat(item.price) || 0;
                const itemQuantity = parseInt(item.quantity) || 0;
                const itemTotal = itemPrice * itemQuantity;
                subtotal += itemTotal;

                const itemElement = document.createElement('div');
                itemElement.classList.add('checkout-item');
                itemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="checkout-item-image">
                    <div class="checkout-item-details">
                        <div class="checkout-item-title">${item.name}</div>
                        <div class="checkout-item-price">${formatNaira(itemPrice)} x ${itemQuantity}</div>
                    </div>
                    <div class="checkout-item-total">${formatNaira(itemTotal)}</div>
                `;
                itemsContainer.appendChild(itemElement);
            });
        }

        const total = subtotal + FIXED_SHIPPING_FEE;
        if (subtotalSpan) subtotalSpan.textContent = formatNaira(subtotal);
        if (shippingSpan) shippingSpan.textContent = formatNaira(FIXED_SHIPPING_FEE);
        if (totalSpan) totalSpan.textContent = formatNaira(total);
        if (buttonTotalSpan) buttonTotalSpan.textContent = Number(total).toLocaleString('en-NG', { minimumFractionDigits: 2 });
    }

    renderCheckoutSummary();

    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (cart.length === 0) {
                alert('Your cart is empty! Please add products before checking out.');
                return;
            }

            // Gather Form Data
            const firstName = document.querySelector('input[placeholder="First Name"]').value;
            const lastName = document.querySelector('input[placeholder="Last Name"]').value;
            const phone = document.querySelector('input[placeholder="Phone Number (+234)"]').value;
            const streetAddress = document.querySelector('input[placeholder="Street Address / House No."]').value;
            const landmark = document.querySelector('input[placeholder="Nearest Landmark (Optional)"]').value;
            const state = document.getElementById('state-selector').value;
            const city = document.querySelector('input[placeholder="City / Local Government Area (LGA)"]').value;
            const paymentMethodElement = document.querySelector('input[name="payment_method"]:checked');
            const paymentMethod = paymentMethodElement ? paymentMethodElement.value : null;

            if (!firstName || !phone || !streetAddress || !state || !city || !paymentMethod) {
                alert('Please fill in all required fields and select a payment method.');
                return;
            }

            // Construct WhatsApp Message
            let orderMessage = `*NEW SKINCARE ORDER!*%0A---%0A`;
            orderMessage += `*CUSTOMER INFO*%0AName: ${firstName} ${lastName}%0APhone: ${phone}%0APayment: ${paymentMethod === 'cash_on_delivery' ? 'Cash on Delivery (CoD)' : 'Bank Transfer (Pre-payment)'}%0A%0A`;
            orderMessage += `*SHIPPING ADDRESS*%0AAddress: ${streetAddress}%0A`;
            if (landmark) orderMessage += `Landmark: ${landmark}%0A`;
            orderMessage += `City/LGA: ${city}%0AState: ${state}, Nigeria%0A%0A`;

            orderMessage += `*ORDER ITEMS*%0A`;
            let subtotal = 0;
            cart.forEach(item => {
                const itemPrice = parseFloat(item.price) || 0;
                const itemQuantity = parseInt(item.quantity) || 0;
                const itemTotal = itemPrice * itemQuantity;
                subtotal += itemTotal;
                orderMessage += `- ${item.name} (${itemQuantity} units) @ ${formatNaira(itemPrice)} each%0A`;
            });

            const total = subtotal + FIXED_SHIPPING_FEE;
            orderMessage += `%0A*ORDER SUMMARY*%0ASubtotal: ${formatNaira(subtotal)}%0AShipping Fee: ${formatNaira(FIXED_SHIPPING_FEE)}%0A*TOTAL AMOUNT DUE: ${formatNaira(total)}*%0A%0A`;

            const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${orderMessage}`;
            
            // 1. Open WhatsApp chat in a new tab
            window.open(whatsappUrl, '_blank');
            
            // 2. Clear the cart (so the cart is empty if they refresh the success page)
            localStorage.removeItem('reveddyCart');
            
            // 3. Redirect to the order success page after a short delay
            // The delay gives the browser a moment to handle the window.open()
            setTimeout(() => {
                window.location.href = 'order_success.html'; // <<< CHANGE THIS FILENAME IF NECESSARY
            }, 500); // 500ms delay

        });
    }

    // Optional: Save form data to localStorage
    function saveFormData() {
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            phoneNumber: document.getElementById('phoneNumber').value,
            streetAddress: document.getElementById('streetAddress').value,
            landmark: document.getElementById('landmark').value,
            state: document.getElementById('state-selector').value,
            city: document.getElementById('city').value,
            receiptLink: document.getElementById('receipt-link-input').value
        };
        localStorage.setItem('checkoutFormData', JSON.stringify(formData));
    }
});