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
