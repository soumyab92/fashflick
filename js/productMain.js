// Function to update all cart badge elements
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalQuantity = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  document.querySelectorAll('.cart-badge').forEach(badge => {
    badge.textContent = totalQuantity;
  });
}

// Initial badge update
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

    // Populate product details
    document.getElementById('productDetails').innerHTML = `
      <div class="rev_box">
        <span class="icon">
          <img src="images/5star.png" alt="" />
        </span>
        <span>Rated 4.76/5 based on +1475 reviews</span>
      </div>
      <h3>${product.name}</h3>
      <p class="product-price">
        <span class="old-price">$${product.cross_price}</span> 
        $${product.price} 
        <span class="badge bg-danger">55% OFF</span>
      </p>
      <p>${product.description}</p>

      <!-- Size -->
      <div class="filter_with_size">
        <h3>Size:</h3> 
        <ul><li>S</li></ul>
      </div>

      <!-- Color -->
      <div class="filter_with_color">
        <h3>Color:</h3> 
        <ul><li class="purple"></li></ul>
      </div>

      <!-- Quantity -->
      <div class="input-group mb-3" style="width: 130px;">
        <button class="btn btn-outline-secondary" type="button" id="qtyMinus">−</button>
        <input type="text" id="qtyInput" class="form-control text-center" value="1">
        <button class="btn btn-outline-secondary" type="button" id="qtyPlus">+</button>
      </div>

      <!-- Buttons -->
      <div class="d-flex mb-3">
        <a href="javascript:void(0);" class="common-btn" id="addToCartBtn">Add To Cart</a>
        <a href="javascript:void(0);" class="common-btn" id="buyNowBtn">BUY NOW</a>
      </div>

      <ul class="list-unstyled mb-3">
        <li><strong>Sku:</strong> SKU_45</li>
        <li><strong>Available:</strong> 2</li>
      </ul>

      <div class="secure-icons">
        <strong>Secure Checkout</strong><br>
        <img src="images/secure_payments 1.png" class="img-fluid">
      </div>
    `;

    // Set product name in header if exists
    const proName = document.getElementById('pro_nem');
    if (proName) {
      proName.innerHTML = `<p>${product.name}</p>`;
    }

    // Set product description in tab section
    const descDiv = document.getElementById('productDescription');
    if (descDiv) {
      descDiv.innerHTML = `<p>${product.description}</p>`;
    }

    // Populate main image slider
    const sliderFor = document.querySelector('.slider-for');
    if (sliderFor) {
      sliderFor.innerHTML = product.images.map(img => `
        <img src="${img}" class="img-fluid rounded">
      `).join('');
    }

    // Populate thumbnail slider
    const sliderNav = document.querySelector('.slider-nav');
    if (sliderNav) {
      sliderNav.innerHTML = product.images.map(img => `
        <img src="${img}" class="img-thumbnail">
      `).join('');
    }

    // Quantity logic
    const qtyInput = document.getElementById('qtyInput');
    const qtyPlus = document.getElementById('qtyPlus');
    const qtyMinus = document.getElementById('qtyMinus');

    qtyPlus.addEventListener('click', () => {
      qtyInput.value = parseInt(qtyInput.value) + 1;
    });

    qtyMinus.addEventListener('click', () => {
      if (parseInt(qtyInput.value) > 1) {
        qtyInput.value = parseInt(qtyInput.value) - 1;
      }
    });

    // Add to Cart functionality
    document.getElementById('addToCartBtn').addEventListener('click', () => {
      const quantity = parseInt(qtyInput.value) || 1;
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      const exists = cart.find(item => item.id === product.id);
      if (exists) {
        exists.quantity += quantity;
      } else {
        cart.push({ ...product, quantity });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartBadge();
      alert('Product added to cart!');
    });

    // Buy Now functionality
    document.getElementById('buyNowBtn').addEventListener('click', () => {
      const quantity = parseInt(qtyInput.value) || 1;
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      const exists = cart.find(item => item.id === product.id);
      if (exists) {
        exists.quantity += quantity;
      } else {
        cart.push({ ...product, quantity });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartBadge();
      window.location.href = 'cart.html';
    });
  });