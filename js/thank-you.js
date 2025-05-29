const order = JSON.parse(localStorage.getItem('orderDetails'));

const summaryDiv = document.getElementById('orderSummary');

if (!order || !order.cart || order.cart.length === 0) {
    summaryDiv.innerHTML = '<p>No order details found.</p>';
} else {
    let html = '';
    let total = 0;

    order.cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        html += `
          <div class="order-item">
            <img src="${item.images[0]}" alt="${item.name}" style="width: 80px;">
            <div class="thnk-you-price">
              <h4>${item.name}</h4>
              <p>Quantity: ${item.quantity}</p>
            </div>
            <p>Subtotal: $${subtotal.toFixed(2)}</p>
          </div>
        `;
    });

    html += `<h3>Total Paid: <span>$${total.toFixed(2)}</span></h3>`;
    summaryDiv.innerHTML = html;

    // Optional: Clear cart after successful checkout
    localStorage.removeItem('cart');
}