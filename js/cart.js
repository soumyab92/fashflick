// Get cart data from localStorage or initialize empty
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Render cart items
function renderCart() {
  const cartDiv = document.getElementById('cartItems');
  const totalDiv = document.getElementById('total');

  if (cart.length === 0) {
    cartDiv.innerHTML = '<p>Your cart is empty.</p>';
    totalDiv.innerHTML = '';
    return;
  }

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
        <p>$${product.price}</p>
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
}

// Quantity plus-minus logic
function attachQuantityListeners() {
  document.querySelectorAll('.quantity-control').forEach(control => {
    const index = control.dataset.index;
    const input = control.querySelector('.quantity-input');
    const decreaseBtn = control.querySelector('.btn-decrease');
    const increaseBtn = control.querySelector('.btn-increase');

    decreaseBtn.addEventListener('click', () => {
      if (cart[index].quantity > 1) {
        cart[index].quantity--;
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
      }
    });

    increaseBtn.addEventListener('click', () => {
      cart[index].quantity++;
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCart();
    });
  });
}

// Checkout validation and storage
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
          input.classList.remove('input-error');
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
      window.location.href = 'thankyou.html';
    });
  }
}

// Clear cart
function attachClearCartHandler() {
  const clearCartBtn = document.getElementById('clearCartBtn');
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
      cart = [];
      localStorage.removeItem('cart');
      renderCart();
    });
  }
}

// Prevent alphabets in phone input
document.addEventListener('DOMContentLoaded', () => {
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      phoneInput.value = phoneInput.value.replace(/[^0-9]/g, '');
    });
  }
});

// Initial render
renderCart();

// Update all cart badges on page
function updateAllCartBadges() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('.cart-badge').forEach(badge => {
    badge.textContent = totalQuantity;
  });
}

// Call badge update on page load
updateAllCartBadges();