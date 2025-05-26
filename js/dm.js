fetch('./js/products.json')
  .then(response => response.json())
  .then(data => {
    // ===== CATEGORY SECTION =====
    const categoriSec = data.products.filter(product => product.category);
    let cat_div = '';

    for (let i = 0; i < categoriSec.length; i++) {
      cat_div += `
        <div class="cat_slider_box">
          <img src="${categoriSec[i].category_img}" alt="cat">
          <h6>${categoriSec[i].category}</h6>
        </div>
      `;
    }

    document.querySelector('.cat_slider').innerHTML = cat_div;

    // ===== TRENDING PRODUCTS =====
    const trendingProducts = data.products.filter(product => product.trending === true);
    let slider_div = '';

    for (let i = 0; i < trendingProducts.length; i++) {
      const product = trendingProducts[i]; // ✅ Define product here

      slider_div += `
        <div class="pro_main_box">
          <div class="img-box">
            <img src="${product.images[0]}" class="img-fluid" alt="Product">
            <a href="product.html?id=${product.id}" class="common-btn">BUY NOW</a>
          </div>
          <div class="content_box">
            <h3>${product.name}</h3>
            <div class="price_box">
              <p>$${product.cross_price} <span>${product.price}</span></p>
              <div>
                <span>4.5</span>
                <img src="images/star.svg" class="img-fluid" alt="star">
              </div>
            </div>
          </div>
        </div>
      `;
    }

    document.querySelector('.slide_1').innerHTML = slider_div;

    // ===== SEASONAL PRODUCTS =====
    const seasonProducts = data.products.filter(product => product.season === true);
    let season_div = '';

    for (let i = 0; i < seasonProducts.length; i++) {
      const product = seasonProducts[i]; // ✅ Define product here too

      season_div += `
        <div class="pro_main_box">
          <div class="img-box">
            <img src="${product.images[0]}" class="img-fluid" alt="Product">
            <a href="product.html?id=${product.id}" class="common-btn">BUY NOW</a>
          </div>
          <div class="content_box">
            <h3>${product.name}</h3>
            <div class="price_box">
              <p>$${product.cross_price} <span>${product.price}</span></p>
              <div>
                <span>4.5</span>
                <img src="images/star.svg" class="img-fluid" alt="star">
              </div>
            </div>
          </div>
        </div>
      `;
    }


    document.querySelector('.slide_2').innerHTML = season_div;


    function updateAllCartBadges() {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
      document.querySelectorAll('.cart-badge').forEach(badge => {
        badge.textContent = totalQuantity;
      });
    }

    updateAllCartBadges();

  })

  .catch(error => {
    console.error('Error fetching products:', error);
  });
