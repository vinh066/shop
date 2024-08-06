function displayCartItems() {
    const cartItemsDiv = document.getElementById('cart-items');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p>Giỏ hàng của bạn trống.</p>';
    } else {
        cartItemsDiv.innerHTML = '';
        cart.forEach((product, index) => {
            const productDiv = document.createElement('div');
            productDiv.className = 'product-detail';
            productDiv.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p><strong>Price:</strong> ${product.price}</p>
                <p>${product.description}</p>
                <p><strong>Quantity:</strong> ${product.quantity}</p>
                <button class="remove-from-cart" data-index="${index}">Remove</button>
            `;
            cartItemsDiv.appendChild(productDiv);
        });

        document.querySelectorAll('.remove-from-cart').forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                removeFromCart(index);
            });
        });
    }
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
    updateCartCount();
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalCount = cart.reduce((sum, product) => sum + product.quantity, 0);
    document.getElementById('cart-count').innerText = totalCount;
}

document.addEventListener('DOMContentLoaded', () => {
    displayCartItems();
    updateCartCount();
});
