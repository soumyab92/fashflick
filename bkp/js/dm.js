// dm.js
fetch('./js/products.json')
    .then(response => response.json())
    .then(data => {
        const products = data.products;

        // ==== Trending Products ====
        const trendingProducts = products.filter(product => product.trending);
        let sliderTrendingHTML = '';

        trendingProducts.forEach(product => {
            sliderTrendingHTML += `
                <div class="pro_main_box">
                    <div class="img-box">
                        <img src="${product.images[0]}" class="img-fluid" alt="Product">
                        <a href="productMain.html?id=${product.id}" class="common-btn">BUY NOW</a>
                    </div>
                    <div class="content_box">
                        <h3>${product.name}</h3>
                        <div class="price_box">
                            <p>$${product.cross_price} <span>$${product.price}</span></p>
                            <div>
                                <span>4.5</span>
                                <img src="images/star.svg" class="img-fluid" alt="star">
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        const trendingDiv = document.querySelector('.slide_1');
        if (trendingDiv) {
            trendingDiv.innerHTML = sliderTrendingHTML;
        } else {
            console.error("Div with class 'slide_1' not found");
        }

        // ==== Season Products ====
        const seasonProducts = products.filter(product => product.season);
        let sliderSeasonHTML = '';

        seasonProducts.forEach(product => {
            sliderSeasonHTML += `
                <div class="pro_main_box">
                    <div class="img-box">
                        <img src="${product.images[0]}" class="img-fluid" alt="Product">
                        <a href="productMain.html?id=${product.id}" class="common-btn">BUY NOW</a>
                    </div>
                    <div class="content_box">
                        <h3>${product.name}</h3>
                        <div class="price_box">
                            <p>$${product.cross_price} <span>$${product.price}</span></p>
                            <div>
                                <span>4.5</span>
                                <img src="images/star.svg" class="img-fluid" alt="star">
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        const seasonDiv = document.querySelector('.slide_2');
        if (seasonDiv) {
            seasonDiv.innerHTML = sliderSeasonHTML;
        } else {
            console.error("Div with class 'slide_2' not found");
        }

        // ==== Categories ====
        let categoryHTML = '';

        products.forEach(product => {
            if (product.category && product.images && product.images.length > 0) {
                categoryHTML += `
                    <div class="cat_slider_box">
                        <img src="${product.category_img}" alt="cat">
                        <h6>${product.category}</h6>
                    </div>
                `;
            }
        });

        const categoryContainer = document.querySelector('.cat_slider');
        if (categoryContainer) {
            categoryContainer.innerHTML = categoryHTML;
        } else {
            console.error("Div with class 'cat_slider' not found");
        }
    })
    .catch(error => {
        console.error('Error loading products:', error);
    });

// ==== All product Show in shop page ====
function generateProductHTML(product) {
    return `
    <div class="col-md-4">
        <div class="pro_main_box">
            <div class="img-box">
                <img src="${product.images[0]}" class="img-fluid" alt="${product.name}">
                <a href="javascript:void(0);" class="common-btn add-to-cart" data-id="${product.id}">Add to Cart</a>
                <a href="javascript:void(0);" class="common-btn buy-now" data-id="${product.id}">Buy Now</a>
            </div>
            <div class="content_box">
                <h3>${product.name}</h3>
                <div class="price_box">
                    <p>$${product.cross_price} <span>$${product.price}</span></p>
                    <div>
                        <span>4.5</span>
                        <img src="images/star.svg" class="img-fluid" alt="star">
                    </div>
                </div>
            </div>
        </div>
        </div>
    `;
}