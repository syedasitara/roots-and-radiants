

const cartIcon = document.getElementById('cartIcon');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCountElement = document.querySelector('.cart-count');
const decreaseQty = document.getElementById('decreaseQty');
const increaseQty = document.getElementById('increaseQty');
const quantityInput = document.getElementById('quantity');
const addToCartBtn = document.getElementById('addToCartBtn');
const buyNowBtn = document.getElementById('buyNowBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileNav = document.getElementById('mobileNav');
const closeMobileNav = document.getElementById('closeMobileNav');
const productImage = document.getElementById('productImage');
const thumbnails = document.querySelectorAll('.thumbnail');
const proceedToCheckout = document.getElementById('proceedToCheckout');
const continueShopping = document.getElementById('continueShopping');
const checkoutModal = document.getElementById('checkoutModal');
const closeCheckout = document.getElementById('closeCheckout');
const checkoutForm = document.getElementById('checkoutForm');
const checkoutOrderSummary = document.getElementById('checkoutOrderSummary');
const checkoutSubtotal = document.getElementById('checkoutSubtotal');
const checkoutTotal = document.getElementById('checkoutTotal');
const checkoutShipping = document.getElementById('checkoutShipping'); // For dynamic shipping (Rs. 0)
const successModal = document.getElementById('successModal');
const orderIdElement = document.getElementById('orderId');
const continueShoppingSuccess = document.getElementById('continueShoppingSuccess');
const placeOrderBtn = document.getElementById('placeOrderBtn');

// Cart State
let cartCount = 0;
let cartItems = [];
const productPrice = 1250;
const shippingFee = 0; // Shipping is free

// EmailJS Configuration
const EMAILJS_SERVICE_ID = 'service_t23y648'; // Aapka Gmail Service ID
const EMAILJS_CUSTOMER_TEMPLATE_ID = 'template_sys9qsa'; // <--- APNA CUSTOMER TEMPLATE ID YAHAN DAALEIN
const EMAILJS_ADMIN_TEMPLATE_ID = 'template_wg9k2sg';   // <--- APNA ADMIN TEMPLATE ID YAHAN DAALEIN
const ADMIN_EMAIL = 'rootsradiance008@gmail.com'; // Admin ka email address

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    updateCartDisplay();
});

function initializeEventListeners() {
    // Cart functionality
    if (cartIcon) cartIcon.addEventListener('click', toggleCart);
    if (closeCart) closeCart.addEventListener('click', closeCartHandler);
    
    // Buy Now button
    if (buyNowBtn) buyNowBtn.addEventListener('click', handleBuyNow);
    
    // Quantity controls
    if (decreaseQty) decreaseQty.addEventListener('click', decreaseQuantity);
    if (increaseQty) increaseQty.addEventListener('click', increaseQuantity);
    if (quantityInput) quantityInput.addEventListener('change', validateQuantity);
    
    // Add to cart
    if (addToCartBtn) addToCartBtn.addEventListener('click', addToCart);
    
    // Mobile menu
    if (mobileMenu) mobileMenu.addEventListener('click', openMobileNav);
    if (closeMobileNav) closeMobileNav.addEventListener('click', closeMobileNavHandler);
    
    // Image thumbnails
    if (thumbnails.length > 0) {
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', () => changeProductImage(thumbnail));
        });
    }
    
    // Checkout functionality
    if (proceedToCheckout) proceedToCheckout.addEventListener('click', handleProceedToCheckout);
    if (closeCheckout) closeCheckout.addEventListener('click', closeCheckoutHandler);
    
    // Checkout form
    if (checkoutForm) checkoutForm.addEventListener('submit', handleCheckoutSubmit);
    
    // Success modal
    if (continueShoppingSuccess) continueShoppingSuccess.addEventListener('click', closeSuccessModal);
    
    // Custom Continue Shopping handler (closes cart + scrolls to product)
    if (continueShopping) {
        continueShopping.addEventListener('click', () => {
            closeCartHandler();
            const productSection = document.getElementById('product');
            if (productSection) {
                productSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
    
    // Close modals when clicking outside
    document.addEventListener('click', (e) => {
        if (cartModal && cartModal.classList.contains('active') && !cartModal.contains(e.target) && cartIcon && !cartIcon.contains(e.target)) {
            closeCartHandler();
        }
        if (checkoutModal && checkoutModal.classList.contains('active') && !checkoutModal.contains(e.target) && !document.getElementById('placeOrderBtn').contains(e.target)) {
            // Added check to prevent closing when clicking "Place Order" button
            // If the modal content and form are within the modal, this might need refinement
            if (!document.querySelector('.checkout-modal-content').contains(e.target)) {
                 closeCheckoutHandler();
            }
           
        }
        if (successModal && successModal.classList.contains('active') && !successModal.contains(e.target)) {
            closeSuccessModal();
        }
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                closeMobileNavHandler();
            }
        });
    });
    
    // Header scroll effect
    window.addEventListener('scroll', handleHeaderScroll);
}

// Cart Functions
function toggleCart() {
    if (cartModal) {
        cartModal.classList.toggle('active');
        document.body.style.overflow = cartModal.classList.contains('active') ? 'hidden' : '';
    }
}

function closeCartHandler() {
    if (cartModal) {
        cartModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function decreaseQuantity() {
    if (quantityInput) {
        let currentQty = parseInt(quantityInput.value);
        if (currentQty > 1) {
            quantityInput.value = currentQty - 1;
        }
    }
}

function increaseQuantity() {
    if (quantityInput) {
        let currentQty = parseInt(quantityInput.value);
        if (currentQty < 10) {
            quantityInput.value = currentQty + 1;
        }
    }
}

function validateQuantity() {
    if (quantityInput) {
        let value = parseInt(quantityInput.value);
        if (isNaN(value) || value < 1) {
            quantityInput.value = 1;
        } else if (value > 10) {
            quantityInput.value = 10;
        }
    }
}

function addToCart() {
    if (!quantityInput) return;
    
    const quantity = parseInt(quantityInput.value);
    
    // Animation effect
    if (addToCartBtn) {
        const originalText = addToCartBtn.innerHTML;
        addToCartBtn.innerHTML = '<i class="fas fa-check"></i> Added to Cart!';
        addToCartBtn.style.background = 'var(--primary)';
        
        setTimeout(() => {
            addToCartBtn.innerHTML = originalText;
            addToCartBtn.style.background = '';
        }, 2000);
    }
    
    // Add to cart logic
    cartCount += quantity;
    if (cartCountElement) cartCountElement.textContent = cartCount;
    
    // Create cart item
    const cartItem = {
        name: "Herbal Shampoo & Conditioner",
        price: productPrice,
        quantity: quantity,
        image: "images/shampoo1.jpeg",
        id: 'shampoo_250ml'
    };
    
    // Check if item already in cart
    const existingItemIndex = cartItems.findIndex(item => item.id === cartItem.id);
    
    if (existingItemIndex !== -1) {
        cartItems[existingItemIndex].quantity += quantity;
    } else {
        cartItems.push(cartItem);
    }
    
    updateCartDisplay();
    showNotification(`${quantity} bottle(s) added to cart!`);
}

// Updated Buy Now function
function handleBuyNow() {
    if (cartCount === 0) {
        addToCart();
        setTimeout(() => {
            if (cartItems.length > 0) {
                openCheckout();
            } else {
                showNotification('Your cart is empty!');
            }
        }, 500);
    } else {
        if (cartItems.length > 0) {
            openCheckout();
            showNotification('Proceeding to checkout with existing cart items.');
        } else {
            showNotification('Your cart is empty!');
        }
    }
}

function handleProceedToCheckout() {
    if (cartItems.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    openCheckout();
}

function updateCartDisplay() {
    if (!cartItemsContainer) return;
    
    cartItemsContainer.innerHTML = '';
    let total = 0;
    
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        if (proceedToCheckout) {
            proceedToCheckout.disabled = true;
            proceedToCheckout.style.display = 'none';
        }
    } else {
        cartItems.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            cartItemElement.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">Rs. ${item.price.toLocaleString()}</div>
                    <div class="cart-item-quantity">
                        <button onclick="decreaseCartItem(${index})">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="increaseCartItem(${index})">+</button>
                    </div>
                    <button class="remove-item" onclick="removeCartItem(${index})">Remove</button>
                </div>
            `;
            
            cartItemsContainer.appendChild(cartItemElement);
        });
        if (proceedToCheckout) {
            proceedToCheckout.disabled = false;
            proceedToCheckout.style.display = 'block';
        }
    }
    
    if (cartTotal) cartTotal.textContent = `Rs. ${total.toLocaleString()}`;
}

// Cart item controls
function decreaseCartItem(index) {
    if (cartItems[index].quantity > 1) {
        cartItems[index].quantity--;
        cartCount--;
    } else {
        removeCartItem(index);
        return;
    }
    
    if (cartCountElement) cartCountElement.textContent = cartCount;
    updateCartDisplay();
}

function increaseCartItem(index) {
    cartItems[index].quantity++;
    cartCount++;
    if (cartCountElement) cartCountElement.textContent = cartCount;
    updateCartDisplay();
}

function removeCartItem(index) {
    cartCount -= cartItems[index].quantity;
    cartItems.splice(index, 1);
    if (cartCountElement) cartCountElement.textContent = cartCount;
    updateCartDisplay();
}

// Mobile Navigation
function openMobileNav() {
    if (mobileNav) {
        mobileNav.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeMobileNavHandler() {
    if (mobileNav) {
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Product Image Gallery
function changeProductImage(thumbnail) {
    if (!productImage) return;
    
    const newImage = thumbnail.getAttribute('data-image');
    productImage.src = newImage;
    
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    thumbnail.classList.add('active');
}

// Header Scroll Effect
function handleHeaderScroll() {
    const header = document.querySelector('.header');
    if (header) {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    }
}

// Checkout Functions
function openCheckout() {
    updateCheckoutDisplay();
    closeCartHandler();
    
    if (checkoutModal) {
        checkoutModal.classList.remove('active');
        setTimeout(() => {
            checkoutModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }, 100);
    }
    
    setTimeout(() => {
        const emailField = document.getElementById('email');
        if (emailField) emailField.focus();
    }, 200);
}

function closeCheckoutHandler() {
    if (checkoutModal) {
        checkoutModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function updateCheckoutDisplay() {
    if (!checkoutOrderSummary || !checkoutSubtotal || !checkoutTotal) return;
    
    let subtotal = 0;
    checkoutOrderSummary.innerHTML = '';
    
    cartItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'checkout-item';
        itemElement.innerHTML = `
            <div class="checkout-item-info">
                <div class="checkout-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="checkout-item-details">
                    <h5>${item.name}</h5>
                    <p>Quantity: ${item.quantity}</p>
                </div>
            </div>
            <div class="checkout-item-price">Rs. ${itemTotal.toLocaleString()}</div>
        `;
        
        checkoutOrderSummary.appendChild(itemElement);
    });
    
    const total = subtotal + shippingFee;
    
    checkoutSubtotal.textContent = `Rs. ${subtotal.toLocaleString()}`;
    if (checkoutShipping) checkoutShipping.textContent = `Rs. ${shippingFee.toLocaleString()}`;
    checkoutTotal.textContent = `Rs. ${total.toLocaleString()}`;
}
async function handleCheckoutSubmit(e) {
    e.preventDefault();

    const formData = new FormData(checkoutForm);
    const orderData = {
        email: formData.get('email'),
        phone: formData.get('phone'),
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        address: formData.get('address'),
        apartment: formData.get('apartment'),
        city: formData.get('city'),
        postalCode: formData.get('postalCode') || '',
        country: formData.get('country'),
        items: cartItems,
        subtotal: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        shipping: shippingFee,
        total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) + shippingFee,
        orderId: generateOrderId(),
        orderDate: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };

    // --- Start Debugging Logs ---
    console.log("--- handleCheckoutSubmit Debugging ---");
    console.log("Order Data collected:", orderData);
    console.log("Order Data Email (from form):", orderData.email);
    console.log("Admin Email Constant:", ADMIN_EMAIL);
    console.log("--------------------------------------");
    // --- End Debugging Logs ---

    if (!validateCheckoutForm(orderData)) {
        showNotification('Please fill all required fields correctly!');
        return;
    }

    if (placeOrderBtn) {
        placeOrderBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Placing Order...';
        placeOrderBtn.disabled = true;
    }

    try {
        // Prepare common parameters for EmailJS
        const commonEmailParams = {
            order_id: orderData.orderId,
            customer_name: `${orderData.firstName} ${orderData.lastName}`,
            order_date: orderData.orderDate,
            items_html: orderData.items.map(item => `
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #eee;">
                        <img src="${window.location.origin}/${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; vertical-align: middle; margin-right: 10px;">
                        ${item.name}
                    </td>
                    <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
                    <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">Rs. ${item.price.toLocaleString()}</td>
                    <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">Rs. ${(item.price * item.quantity).toLocaleString()}</td>
                </tr>
            `).join(''),
            items_summary: orderData.items.map(item =>
                `${item.name} (Qty: ${item.quantity}) - Rs. ${(item.price * item.quantity).toLocaleString()}`
            ).join('\n'), // Plain text summary for admin
            subtotal_amount: `Rs. ${orderData.subtotal.toLocaleString()}`,
            shipping_amount: `Rs. ${orderData.shipping.toLocaleString()}`,
            total_amount: `Rs. ${orderData.total.toLocaleString()}`,
            shipping_address: `${orderData.address}${orderData.apartment ? ', ' + orderData.apartment : ''}, ${orderData.city}, ${orderData.country}${orderData.postalCode ? ' - ' + orderData.postalCode : ''}`,
            phone_number: orderData.phone,
            customer_email: orderData.email // Explicitly pass customer_email here for both templates if needed
        };

        // --- 1. Send email to Customer via EmailJS ---
        const customerEmailParams = {
            ...commonEmailParams, // Copy all common parameters
            to_email: orderData.email, // Specific to customer - this is the actual recipient
            // Add any other specific customer parameters here if needed
        };
        console.log('Attempting to send customer email to:', customerEmailParams.to_email);
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_CUSTOMER_TEMPLATE_ID, customerEmailParams);
        console.log('Customer email sent successfully!');


        // --- 2. Send email to Admin via EmailJS ---
        const adminEmailParams = {
            ...commonEmailParams, // Copy all common parameters
            to_email: ADMIN_EMAIL, // Specific to admin - this is the actual recipient
            // Add any other specific admin parameters here if needed
        };
        console.log('Attempting to send admin email to:', adminEmailParams.to_email);
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_ADMIN_TEMPLATE_ID, adminEmailParams);
        console.log('Admin email sent successfully!');


        // If all successful:
        showSuccessModal(orderData.orderId);
        cartItems = [];
        cartCount = 0;
        if (cartCountElement) cartCountElement.textContent = '0';
        updateCartDisplay();
        closeCheckoutHandler();
        if (checkoutForm) checkoutForm.reset();
        showNotification('Order placed successfully! Confirmation emails sent.');

    } catch (error) {
        console.error('Error submitting order or sending email:', error);
        // More specific error message if available from EmailJS
        let errorMessage = error.text || error.message || 'Unknown error occurred.';
        if (error.status === 422 && error.text && error.text.includes('recipients address is empty')) {
             errorMessage = 'Recipient email address is missing. Please ensure all contact fields are filled and try again.';
        }
        showNotification(`Error placing order: ${errorMessage}. Please try again or contact support.`);
    } finally {
        if (placeOrderBtn) {
            placeOrderBtn.innerHTML = '<i class="fas fa-shopping-bag"></i> Place Order';
            placeOrderBtn.disabled = false;
        }
    }
}

// Generate unique order ID
function generateOrderId() {
    return 'RR' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
}

// Validate checkout form
function validateCheckoutForm(orderData) {
    const requiredFields = ['email', 'phone', 'firstName', 'lastName', 'address', 'city', 'country'];

    for (let field of requiredFields) {
        if (!orderData[field] || orderData[field].trim() === '') {
            showNotification(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
            return false;
        }
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(orderData.email)) {
        showNotification('Please enter a valid email address');
        return false;
    }

    // Basic phone validation (at least 10 digits)
    const phoneRegex = /^\+?\d{10,15}$/; // Allows optional '+' and 10-15 digits
    if (!phoneRegex.test(orderData.phone.replace(/\s/g, ''))) { // Remove spaces for validation
        showNotification('Please enter a valid phone number (e.g., +923001234567 or 03001234567)');
        return false;
    }

    return true;
}


// Show success modal
function showSuccessModal(orderId) {
    if (orderIdElement && orderId) {
        orderIdElement.textContent = orderId;
    }

    if (successModal) {
        successModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Close success modal
function closeSuccessModal() {
    if (successModal) {
        successModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Scroll back to product section after closing
    const productSection = document.getElementById('product');
    if (productSection) {
        productSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Notification system
function showNotification(message) {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-info-circle"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
}