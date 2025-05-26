// Function to update all cart badge elements
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalQuantity = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  document.querySelectorAll('.cart-badge').forEach(badge => {
    badge.textContent = totalQuantity;
  });
}

// Initial badge update when page loads
updateCartBadge();

// Get product ID from URL
const urlParams = new URLSearchParams(window.location.search);
const productId = parseInt(urlParams.get('id'));

// Fetch product data
fetch('./js/products.json')
  .then(response => response.json())
  .then(data => {
    const product = data.products.find(p => p.id === productId);

    if (!product) {
      document.getElementById('productDetails').innerHTML = '<p>Product not found</p>';
      return;
    }

    document.getElementById('productDetails').innerHTML = `
      <div class="product_box">
        <img src="${product.images[0]}" alt="${product.name}" style="max-width: 300px;">
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <p>Price: $${product.price}</p>
        <button id="addToCartBtn">Add to Cart</button>
        <button id="buyNowBtn">Buy Now</button>
      </div>
    `;

    // Add to Cart functionality - just update cart and badge
    document.getElementById('addToCartBtn').addEventListener('click', () => {
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      const exists = cart.find(item => item.id === product.id);
      if (exists) {
        exists.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartBadge();
      alert('Product added to cart!');
    });

    // Buy Now button - add product and redirect to checkout page
    document.getElementById('buyNowBtn').addEventListener('click', () => {
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      const exists = cart.find(item => item.id === product.id);
      if (exists) {
        exists.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartBadge();
      // Redirect to checkout page
      window.location.href = 'cart.html';
    });
  });
