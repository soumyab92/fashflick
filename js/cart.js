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
      <div class="cart_item" style="margin-bottom: 20px;">
        <img src="${product.images[0]}" alt="${product.name}" style="width: 100px;">
        <h4>${product.name}</h4>
        <p>Price: $${product.price}</p>
        <label>
          Quantity:
          <input type="number" min="1" data-index="${index}" class="quantity-input" value="${product.quantity}" style="width: 60px;">
        </label>
        <p>Subtotal: $${subtotal.toFixed(2)}</p>
      </div>
    `;
  });

  cartDiv.innerHTML = html;
  totalDiv.innerHTML = `
    <h3>Total: $${total.toFixed(2)}</h3>
    <button id="checkoutBtn" class="common-btn" style="margin-top: 10px;">Checkout</button>
    <button id="clearCartBtn" class="common-btn" style="margin-top: 10px; margin-left: 10px; background-color: #e74c3c;">Clear Cart</button>
  `;

  attachQuantityListeners();
  attachCheckoutHandler(total);
  attachClearCartHandler();
}

// Handle quantity updates
function attachQuantityListeners() {
  document.querySelectorAll('.quantity-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const index = e.target.dataset.index;
      const newQty = parseInt(e.target.value);

      if (newQty >= 1) {
        cart[index].quantity = newQty;
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart(); // Re-render on update
      }
    });
  });
}

// Handle checkout
function attachCheckoutHandler(total) {
  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      localStorage.setItem('orderDetails', JSON.stringify({
        cart: cart,
        total: total.toFixed(2),
        date: new Date().toLocaleString()
      }));
      window.location.href = 'thankyou.html';
    });
  }
}

// Handle clear cart
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

// Initial render
renderCart();

function attachCheckoutHandler(total) {
  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      // Collect required fields
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

      // If valid, proceed with storing data
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
document.addEventListener('DOMContentLoaded', () => {
    const phoneInput = document.getElementById('phone');

    phoneInput.addEventListener('input', () => {
      phoneInput.value = phoneInput.value.replace(/[^0-9]/g, '');
    });
  });