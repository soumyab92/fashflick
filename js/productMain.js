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
        <span class="old-price"><s>$${product.cross_price}</s></span> 
        $${product.price} 
        <span class="badge">55% OFF</span>
      </p>
      <p class="pro_short_des">${product.description}</p>

      <!-- Size -->
      <div class="filter_with_size">
        <h4>Size:</h4> 
        <ul class="filter"><li>S</li></ul>
      </div>

      <!-- Color -->
      <div class="filter_with_color">
        <h4>Color:</h4> 
        <ul class="filter"><li class="purple"></li></ul>
      </div>

      <!-- Quantity -->
      <div class="quantity-box">
        <button class="minus" type="button" id="qtyMinus">−</button>
        <input type="text" id="qtyInput" class="valu" value="1">
        <button class="plus" type="button" id="qtyPlus">+</button>
      </div>

      <!-- Buttons -->
      <div class="pro_btn">
        <a href="javascript:void(0);" class="common-btn" id="addToCartBtn">Add To Cart</a>
        <a href="javascript:void(0);" class="common-btn" id="buyNowBtn">BUY NOW</a>
      </div>

      <ul class="list-unstyled more_detail">
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
      alert("Product added");
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
      // alert('Product added to cart!');
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

    // RELATED PRODUCTS: Filter and display
    const relatedProducts = data.products.filter(p => p.category === product.category && p.id !== product.id);

    const relatedContainer = document.querySelector('.related_pro');
    if (relatedContainer) {
      if (relatedProducts.length === 0) {
        relatedContainer.innerHTML = '<p>No related products found.</p>';
      } else {
        relatedContainer.innerHTML = relatedProducts.map(p => `
      <div class="pro_main_box">
        <div class="img-box">
          <img src="${p.images[0]}" class="img-fluid" alt="Product">
          <a href="product.html?id=${p.id}" class="common-btn">BUY NOW</a>
        </div>
        <div class="content_box">
          <h3>${p.name}</h3>
          <div class="price_box">
            <p>$${p.cross_price} <span>$${p.price}</span></p>
            <div>
              <span>4.5</span>
              <img src="images/star.svg" class="img-fluid" alt="star">
            </div>
          </div>
        </div>
      </div>
    `).join('');
      }
    }

  });