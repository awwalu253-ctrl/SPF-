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

// script.checkout.js

// 1. CONFIGURATION
// Your WhatsApp number (formatted: 234 followed by the rest of the digits, without the leading 0)
// Your number: 09138577860 -> Formatted for API: 2349138577860
const WHATSAPP_NUMBER = '2348028607360'; 

// Define a fixed shipping rate in Naira (NGN)
const FIXED_SHIPPING_FEE = 1500; 
const CURRENCY_SYMBOL = '₦';

// 2. CORE DATA RETRIEVAL
// Fetches the cart items from the user's browser storage (Local Storage key must match products page!)
let cart = JSON.parse(localStorage.getItem('reveddyCart')) || []; 

// Helper function to format numbers to Nigerian Naira format (commas for thousands)
function formatNaira(amount) {
    // Ensure the amount is treated as a number
    const numAmount = Number(amount); 
    return `${CURRENCY_SYMBOL}${numAmount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
}

// 3. RENDER FUNCTION (Renders the summary box on the right)
// This function must be defined globally before the DOMContentLoaded listener uses it.
function renderCheckoutSummary() {
    // Select elements for summary display
    const itemsContainer = document.getElementById('checkout-cart-items');
    const subtotalSpan = document.getElementById('summary-subtotal');
    const shippingSpan = document.getElementById('summary-shipping');
    const totalSpan = document.getElementById('summary-total');
    const buttonTotalSpan = document.getElementById('button-total-price');

    // Safety check: if the element is not found, stop the function
    if (!itemsContainer) return;

    itemsContainer.innerHTML = ''; // Clear previous contents
    let subtotal = 0;

    if (cart.length === 0) {
        // Display a message if the cart is empty
        itemsContainer.innerHTML = '<p class="text-center">Your cart is empty! Please add products.</p>';
        subtotal = 0; // Ensure subtotal is 0
    } else {
        cart.forEach(item => {
            // Check for valid price/quantity to avoid errors
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

    // Update the display elements with Naira format
    if (subtotalSpan) {
        subtotalSpan.textContent = formatNaira(subtotal);
    }
    if (shippingSpan) {
        shippingSpan.textContent = formatNaira(FIXED_SHIPPING_FEE);
    }
    if (totalSpan) {
        totalSpan.textContent = formatNaira(total);
    }
    if (buttonTotalSpan) {
        // Only show the number for the button text
        buttonTotalSpan.textContent = Number(total).toLocaleString('en-NG', { minimumFractionDigits: 2 });
    }
}


// 4. MAIN EXECUTION BLOCK (Runs when the page is fully loaded)
document.addEventListener('DOMContentLoaded', () => {
    
    // 4a. Render the summary immediately when the page loads
    renderCheckoutSummary(); 

    // 4b. Handle the Order Form Submission
    const orderForm = document.getElementById('order-form');
    
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Stop the page from reloading

            // A. Check for empty cart
            if (cart.length === 0) {
                alert('Your cart is empty! Please add products before checking out.');
                return;
            }
            
            // B. Gather Form Data
            const firstName = document.querySelector('input[placeholder="First Name"]').value;
            const lastName = document.querySelector('input[placeholder="Last Name"]').value;
            const phone = document.querySelector('input[placeholder="Phone Number (+234)"]').value;
            const streetAddress = document.querySelector('input[placeholder="Street Address / House No."]').value;
            const landmark = document.querySelector('input[placeholder="Nearest Landmark (Optional)"]').value;
            const state = document.getElementById('state-selector').value;
            const city = document.querySelector('input[placeholder="City / Local Government Area (LGA)"]').value;
            
            const paymentMethodElement = document.querySelector('input[name="payment_method"]:checked');
            const paymentMethod = paymentMethodElement ? paymentMethodElement.value : null;

            // C. Basic Validation Check (covers the most critical fields)
            if (!firstName || !phone || !streetAddress || !state || !city || !paymentMethod) {
                alert('Please fill in all required contact and address fields and select a payment method.');
                return;
            }

            // D. Construct the Order Details Message for WhatsApp
            let orderMessage = `*NEW SKINCARE ORDER!*%0A---%0A`;
            
            // 1. Customer Info
            orderMessage += `*CUSTOMER INFO*%0A`;
            orderMessage += `Name: ${firstName} ${lastName}%0A`;
            orderMessage += `Phone: ${phone}%0A`;
            orderMessage += `Payment: ${paymentMethod === 'cash_on_delivery' ? 'Cash on Delivery (CoD)' : 'Bank Transfer (Pre-payment)'}%0A%0A`;
            
            // 2. Shipping Address
            orderMessage += `*SHIPPING ADDRESS*%0A`;
            orderMessage += `Address: ${streetAddress}%0A`;
            if (landmark) {
                 orderMessage += `Landmark: ${landmark}%0A`;
            }
            orderMessage += `City/LGA: ${city}%0A`;
            orderMessage += `State: ${state}, Nigeria%0A%0A`;
            
            // 3. Order Items & Summary
            orderMessage += `*ORDER ITEMS*%0A`;
            let subtotal = 0;
            cart.forEach(item => {
                const itemPrice = parseFloat(item.price) || 0;
                const itemQuantity = parseInt(item.quantity) || 0;
                const itemTotal = itemPrice * itemQuantity;
                subtotal += itemTotal;
                orderMessage += `- ${item.name} (${itemQuantity} units) @ ${formatNaira(itemPrice)} each%0A`;
            });

            // 4. Final Totals
            const total = subtotal + FIXED_SHIPPING_FEE;
            orderMessage += `%0A*ORDER SUMMARY*%0A`;
            orderMessage += `Subtotal: ${formatNaira(subtotal)}%0A`;
            orderMessage += `Shipping Fee: ${formatNaira(FIXED_SHIPPING_FEE)}%0A`;
            orderMessage += `*TOTAL AMOUNT DUE: ${formatNaira(total)}*%0A%0A`;

            // E. Build and Open the WhatsApp Link
            const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${orderMessage}`;
            
            // Clear the cart before redirecting
            localStorage.removeItem('reveddyCart');
            
            // Open the WhatsApp chat in a new tab
            window.open(whatsappUrl, '_blank'); 

            // F. Optional: Redirect to a final success page after a short delay
            // setTimeout(() => {
            //     window.location.href = 'thank_you.html'; 
            // }, 500); 
        });
    }


    // Function to save all form field data to Local Storage
function saveFormData() {
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        streetAddress: document.getElementById('streetAddress').value,
        landmark: document.getElementById('landmark').value, // Assuming you have a landmark ID
        state: document.getElementById('state-selector').value,
        city: document.getElementById('city').value, // Assuming you have a city ID
        receiptLink: document.getElementById('receipt-link-input').value,
        // We'll handle the radio buttons separately in loadFormData
    };
    localStorage.setItem('checkoutFormData', JSON.stringify(formData));
}
});