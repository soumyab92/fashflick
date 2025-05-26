// Get the product ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

// Fetch products and display the selected one
fetch('./js/products.json')
  .then(response => response.json())
  .then(data => {
    const products = data.products;

    // Find the product with the matching ID
    const product = products.find(p => String(p.id) === productId);

    if (!product) {
      document.getElementById('product-details').innerHTML = '<p>Product not found.</p>';
      return;
    }

    // Display product details
    document.getElementById('product-details').innerHTML = `
      <div>
        <h1>${product.name}</h1>
        <img src="${product.images[0]}" alt="${product.name}" width="300" />
        <p><strong>Price:</strong> $${product.price}</p>
        <p><strong>Original Price:</strong> $${product.cross_price}</p>
        <p><strong>Category:</strong> ${product.category}</p>
        <p><strong>Description:</strong> ${product.description || 'No description provided.'}</p>
      </div>
    `;
  })
  .catch(error => {
    console.error('Error loading product:', error);
    document.getElementById('product-details').innerHTML = '<p>Failed to load product.</p>';
  });
