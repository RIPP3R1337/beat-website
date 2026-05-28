// cart.js — Winkelwagen weergave en interacties

// Render de winkelwagen: toont items, leeg-state of bestelbevestiging
function renderCart() {
    const cart = getCart();
    const container = document.getElementById('cart-container');
    const emptyState = document.getElementById('cart-empty');
    const cartContent = document.getElementById('cart-content');
    const cartPurchase = document.getElementById('cart-purchase');

    updateCartBadge();

    if (cart.length === 0) {
        emptyState.classList.remove('hidden');
        cartContent.classList.add('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    cartContent.classList.remove('hidden');

    const itemsList = document.getElementById('cart-items');
    itemsList.innerHTML = '';

    cart.forEach(item => {
        const row = document.createElement('div');
        row.className = 'bg-white rounded-lg shadow-md p-4 flex items-center space-x-4';
        row.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="w-24 h-24 object-cover rounded">
            <div class="flex-1">
                <h3 class="font-bold text-lg text-gray-900">${item.title}</h3>
                <p class="text-gray-600 text-sm">${item.producer}</p>
                <p class="text-gray-500 text-sm">${item.genre} • ${item.bpm} BPM</p>
                <span class="inline-block mt-1 text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                    ${item.license} — ${item.format}
                </span>
            </div>
            <div class="text-right">
                <p class="text-xl font-bold text-blue-600">$${item.price.toFixed(2)}</p>
            </div>
            <button class="remove-item text-red-500 hover:text-red-700 p-2" data-id="${item.id}">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
            </button>`;
        itemsList.appendChild(row);
    });

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
}

// Werk het winkelwagen-badge icoontje bij in de navbar
function updateCartBadge() {
    const cart = getCart();
    const badge = document.getElementById('cart-badge');
    if (!badge) return;
    if (cart.length > 0) {
        badge.textContent = cart.length;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}

document.addEventListener('click', (e) => {
    const btn = e.target.closest('.remove-item');
    if (!btn) return;
    const id = parseInt(btn.dataset.id);
    const cart = getCart().filter(item => item.id !== id);
    saveCart(cart);
    renderCart();
});

document.getElementById('clear-cart-btn').addEventListener('click', () => {
    clearCart();
    renderCart();
});


document.getElementById('checkout-btn').addEventListener('click', () => {
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    addOrder(cart, total);
    clearCart();
    renderCart();

    document.getElementById('cart-empty').classList.add('hidden');
    document.getElementById('cart-content').classList.add('hidden');
    document.getElementById('cart-purchase').classList.remove('hidden');

    setTimeout(() => {
        document.getElementById('cart-purchase').classList.add('hidden');
        document.getElementById('cart-empty').classList.remove('hidden');
    }, 3000);
});

renderCart();
