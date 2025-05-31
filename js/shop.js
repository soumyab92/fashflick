// Store original products fetched from the JSON
let originalProducts = [];

// Track selected sort and filters
let activeSort = '';
let activeCategories = [];
let activePriceRanges = [];

// Load product data
fetch('./js/products.json')
  .then(res => res.json())
  .then(data => {
    originalProducts = data.products;

    // Get all unique categories from products
    const uniqueCategories = [...new Set(originalProducts.map(p => p.category))];

    // Render dynamic category checkboxes
    renderCategoryFilters(uniqueCategories);

    // Display all products initially
    renderProducts(originalProducts);

    // Attach all event listeners after rendering
    setupEventListeners();
  });

// Render products to the page
function renderProducts(products) {
  const allProductDiv = products.map(product => `
    <div class="col-6 col-md-4 mb-5">
      <div class="pro_main_box">
        <div class="img-box">
          <img src="${product.images[0]}" class="img-fluid" alt="Product">
          <a href="product.html?id=${product.id}" class="common-btn" onclick='storeProduct(${JSON.stringify(product)})'>BUY NOW</a>
        </div>
        <div class="content_box">
          <h3>${product.name}</h3>
          <div class="price_box">
            <p><s>$${product.cross_price}</s><span>$${product.price}</span></p>
            <div>
              <span>4.5</span>
              <img src="images/star.svg" class="img-fluid" alt="star">
            </div>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  // Inject product HTML into the page
  document.querySelector('.allProduct').innerHTML = allProductDiv;
}

// Save clicked product in localStorage
function storeProduct(product) {
  localStorage.setItem('selectedProduct', JSON.stringify(product));
}

// Create category checkboxes dynamically
function renderCategoryFilters(categories) {
  const filterContainer = document.getElementById('categoryFilters');

  // Map each category to a labeled checkbox
  filterContainer.innerHTML = categories.map(cat => `
    <label><input type="checkbox" value="${cat}"> ${cat}</label>
  `).join('');
}

// Attach event listeners for filter/sort/reset
function setupEventListeners() {
  // CATEGORY filter change
  document.querySelectorAll('#categoryFilters input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', handleFilterSort);
  });

  // PRICE filter change
  document.querySelectorAll('.price_filter input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', handleFilterSort);
  });

  // SORT selection change
  document.getElementById('sortSelect').addEventListener('change', function () {
    activeSort = this.value;
    handleFilterSort();
  });

  // RESET button click
  document.querySelector('.reset_btn').addEventListener('click', () => {
    // Uncheck all filters
    document.querySelectorAll('#categoryFilters input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('.price_filter input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('.avl_filter input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.querySelector('.filter_sec').classList.remove('active');

    // Reset sort
    // document.getElementById('sortSelect').value = '';
    // activeSort = '';

    // Show all products again
    renderProducts(originalProducts);
  });

  // Add event listeners for availability filters (In Stock / Out of Stock)
  document.querySelectorAll('.avl_filter input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', handleFilterSort);
  });
}

// Filter + sort logic
function handleFilterSort() {
  // Get selected category filters
  const selectedCategories = Array.from(document.querySelectorAll('#categoryFilters input[type="checkbox"]:checked'))
    .map(cb => cb.value);

  // Get selected price ranges
  const selectedPriceRanges = Array.from(document.querySelectorAll('.price_filter input[type="checkbox"]:checked'))
    .map(cb => cb.id);

  // Get selected availability filters
  const inStockChecked = document.getElementById('inStock').checked;
  const outOfStockChecked = document.getElementById('outOfStock').checked;

  let filtered = [...originalProducts];

  // Apply category filter if selected
  if (selectedCategories.length > 0) {
    filtered = filtered.filter(product => selectedCategories.includes(product.category));
  }

  // Apply price filter if selected
  if (selectedPriceRanges.length > 0) {
    filtered = filtered.filter(product => {
      const price = product.price;
      return selectedPriceRanges.some(id => {
        if (id === 'price1') return price >= 20 && price < 50;
        if (id === 'price2') return price >= 50 && price < 100;
        if (id === 'price3') return price >= 100 && price < 150;
        if (id === 'price4') return price >= 150 && price <= 200;
        return false;
      });
    });
  }

  // Apply availability filter
  if (inStockChecked && !outOfStockChecked) {
    filtered = filtered.filter(product => product.inStock === true);
  } else if (!inStockChecked && outOfStockChecked) {
    filtered = filtered.filter(product => product.inStock === false);
  }
  // If both or none are checked, do not filter by availability

  // Sort by price if selected
  if (activeSort === 'asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (activeSort === 'desc') {
    filtered.sort((a, b) => b.price - a.price);
  }

  // Display the filtered and sorted products
  renderProducts(filtered);
}

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

// Filter on mobile MObile
document.querySelector('.filter_btn').addEventListener('click', function () {
  document.querySelector('.filter_sec').classList.add('active');
});
document.querySelector('.apply_btn').addEventListener('click', function () {
  document.querySelector('.filter_sec').classList.remove('active');
});
