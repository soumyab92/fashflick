// Get cart data from localStorage or initialize an empty array
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// --- RENDER CART (Updated with Redirect Logic) ---
function renderCart() {
  // Find the main sections of the page to show/hide
  const formSection = document.getElementById('firstName')?.closest('form, div.checkout-form');
  const cartSummarySection = document.getElementById('cartItems')?.parentElement;

  // --- LOGIC: Handle Empty Cart ---
  if (cart.length === 0) {
    // 1. Hide the checkout form
    if (formSection) {
      formSection.style.display = 'none';
    }

    // 2. Display a message informing the user of the redirect
    if (cartSummarySection) {
      cartSummarySection.style.display = 'block';
      cartSummarySection.innerHTML = `
        <div style="text-align: center; padding: 40px 20px;">
          <h2>Your Shopping Cart is Empty</h2>
          <p>Redirecting you to the shop in 3 seconds...</p>
        </div>
      `;
    }
    
    // 3. Set a timer to redirect the user after 3 seconds (3000 milliseconds)
    setTimeout(() => {
      // IMPORTANT: Change 'shop.html' to the correct URL of your shop page!
      window.location.href = 'shop.html'; 
    }, 3000);

    updateAllCartBadges(); // Update badges to 0
    return; // Stop the function here
  }
  
  // --- LOGIC: Handle Non-Empty Cart (No changes here) ---
  // If the code reaches here, the cart has items. Ensure sections are visible.
  if (formSection) {
    formSection.style.display = ''; // Revert to default display
  }
  if (cartSummarySection) {
    cartSummarySection.style.display = '';
  }

  const cartDiv = document.getElementById('cartItems');
  const totalDiv = document.getElementById('total');
  
  let html = '';
  let total = 0;

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

  cartDiv.innerHTML = html;
  totalDiv.innerHTML = `
    <h3>Subtotal: <span>$${total.toFixed(2)}</span></h3>
    <div class="check_btn_grp">
      <button id="checkoutBtn" class="common-btn">Checkout</button>
      <button id="clearCartBtn" class="common-btn">Clear Cart</button>
    </div>
  `;

  attachQuantityListeners();
  attachCheckoutHandler(total);
  attachClearCartHandler();
  updateAllCartBadges();
}

// --- ALL OTHER FUNCTIONS REMAIN THE SAME ---

function attachQuantityListeners() {
  document.querySelectorAll('.quantity-control').forEach(control => {
    const index = parseInt(control.dataset.index, 10);
    const decreaseBtn = control.querySelector('.btn-decrease');
    const increaseBtn = control.querySelector('.btn-increase');

    decreaseBtn.addEventListener('click', () => {
      if (cart[index]) {
        cart[index].quantity--;
        if (cart[index].quantity <= 0) {
          cart.splice(index, 1);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
      }
    });

    increaseBtn.addEventListener('click', () => {
      if (cart[index]) {
        cart[index].quantity++;
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
      }
    });
  });
}

function attachCheckoutHandler(total) {
  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      const requiredFields = [
        { id: 'firstName', name: 'First Name' }, { id: 'lastName', name: 'Last Name' },
        { id: 'phone', name: 'Phone' }, { id: 'email', name: 'Email' },
        { id: 'address', name: 'Address' }, { id: 'city', name: 'City' },
        { id: 'state', name: 'State' }, { id: 'postalCode', name: 'Postal Code' }
      ];
      let isValid = true, missingFields = [];
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
      localStorage.removeItem('cart');
      window.location.href = 'thankyou.html';
    });
  }
}

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

function updateAllCartBadges() {
  const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalQuantity = currentCart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('.cart-badge').forEach(badge => {
    badge.textContent = totalQuantity;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      phoneInput.value = phoneInput.value.replace(/[^0-9]/g, '');
    });
  }
  renderCart();
});