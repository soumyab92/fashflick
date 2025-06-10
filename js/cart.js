// Get cart data from localStorage or initialize an empty array
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// --- RENDER CART ---
// Renders the entire cart display, including items, total, and buttons.
function renderCart() {
  const cartDiv = document.getElementById('cartItems');
  const totalDiv = document.getElementById('total');

  // If cart is empty, show a message and clear the total section
  if (cart.length === 0) {
    cartDiv.innerHTML = '<p>Your cart is empty.</p>';
    totalDiv.innerHTML = '';
    updateAllCartBadges(); // Ensure badges are updated to 0
    return;
  }

  let html = '';
  let total = 0;

  // Loop through each product in the cart to build the HTML
  cart.forEach((product, index) => {
    const subtotal = product.price * product.quantity;
    total += subtotal;

    html += `
      <div class="cart_item">
        <img src="${product.images[0]}" alt="${product.name}" style="width: 100px;">
        <div class="quantity_box">
          <h4>${product.name}</h4>
          <div class="quantity-control" data-index="${index}">
            <button class="btn-decrease">−</button>
            <input type="text" class="quantity-input" value="${product.quantity}" readonly>
            <button class="btn-increase">+</button>
          </div>
        </div>
        <p>$${product.price.toFixed(2)}</p>
      </div>
    `;
  });

  // Display the generated HTML for cart items and the total section
  cartDiv.innerHTML = html;
  totalDiv.innerHTML = `
    <h3>Subtotal: <span>$${total.toFixed(2)}</span></h3>
    <div class="check_btn_grp">
      <button id="checkoutBtn" class="common-btn">Checkout</button>
      <button id="clearCartBtn" class="common-btn">Clear Cart</button>
    </div>
  `;

  // Attach event listeners to the newly created buttons and controls
  attachQuantityListeners();
  attachCheckoutHandler(total);
  attachClearCartHandler();
  
  // Update all cart badges on the page
  updateAllCartBadges();
}

// --- ATTACH EVENT LISTENERS ---

// Attaches click listeners to the quantity plus/minus buttons
function attachQuantityListeners() {
  document.querySelectorAll('.quantity-control').forEach(control => {
    const index = parseInt(control.dataset.index, 10);
    const decreaseBtn = control.querySelector('.btn-decrease');
    const increaseBtn = control.querySelector('.btn-increase');

    // Decrease button logic
    decreaseBtn.addEventListener('click', () => {
      // Check if the item exists to prevent errors
      if (cart[index]) {
        cart[index].quantity--; // Decrease quantity by 1

        // If quantity is 0 or less, remove the item from the cart
        if (cart[index].quantity <= 0) {
          cart.splice(index, 1); // Removes 1 item at the specified index
        }
        
        // Save the updated cart and re-render the display
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
      }
    });

    // Increase button logic
    increaseBtn.addEventListener('click', () => {
      if (cart[index]) {
        cart[index].quantity++;
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
      }
    });
  });
}

// Attaches click listener to the "Checkout" button
function attachCheckoutHandler(total) {
  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      const requiredFields = [
        { id: 'firstName', name: 'First Name' },
        { id: 'lastName', name: 'Last Name' },
        { id: 'phone', name: 'Phone' },
        { id: 'email', name: 'Email' },
        { id: 'address', name: 'Address' },
        { id: 'city', name: 'City' },
        { id: 'state', name: 'State' },
        { id: 'postalCode', name: 'Postal Code' }
      ];

      let isValid = true;
      let missingFields = [];

      requiredFields.forEach(field => {
        const input = document.getElementById(field.id);
        if (!input || !input.value.trim()) {
          isValid = false;
          missingFields.push(field.name);
          input?.classList.add('input-error');
        } else {
          input?.classList.remove('input-error');
        }
      });

      if (!isValid) {
        alert(`Please fill the following required fields:\n- ${missingFields.join('\n- ')}`);
        return;
      }

      const orderInfo = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value,
        apartment: document.getElementById('apartment').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        postalCode: document.getElementById('postalCode').value,
        cart: cart,
        total: total.toFixed(2),
        date: new Date().toLocaleString()
      };

      localStorage.setItem('orderDetails', JSON.stringify(orderInfo));
      // Clear the cart after successful checkout
      localStorage.removeItem('cart'); 
      window.location.href = 'thankyou.html';
    });
  }
}

// Attaches click listener to the "Clear Cart" button
function attachClearCartHandler() {
  const clearCartBtn = document.getElementById('clearCartBtn');
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        localStorage.removeItem('cart');
        renderCart();
      }
    });
  }
}


// --- UTILITY FUNCTIONS ---

// Update all cart badges on the page
function updateAllCartBadges() {
  const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalQuantity = currentCart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('.cart-badge').forEach(badge => {
    badge.textContent = totalQuantity;
  });
}

// Prevent alphabets in phone input
document.addEventListener('DOMContentLoaded', () => {
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      phoneInput.value = phoneInput.value.replace(/[^0-9]/g, '');
    });
  }
  
  // Initial render of the cart when the page loads
  renderCart();
});