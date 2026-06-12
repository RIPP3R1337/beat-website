// storage.js — Alle localStorage-functies voor de winkelwagen, bestellingen en beats

// Haal de huidige winkelwagen op uit localStorage
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// Sla de winkelwagen op in localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Verwijder de winkelwagen uit localStorage
function clearCart() {
    localStorage.removeItem('cart');
}


// Werk het winkelwagen-badge icoontje in de navbar bij
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

// Haal alle bestellingen op uit localStorage
function getOrders() {
    return JSON.parse(localStorage.getItem('orders')) || [];
}

// Sla een nieuwe bestelling op met datum, tijd en items
function addOrder(items, total) {
    const orders = getOrders();
    const id = 'ORD-' + String(orders.length + 1).padStart(3, '0');
    const now = new Date();
    orders.push({
        id,
        date: now.toLocaleDateString('nl-NL'),
        time: now.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }),
        items: items.map(i => ({ ...i })),
        total,
    });
    localStorage.setItem('orders', JSON.stringify(orders));
}

// Voeg een beat toe aan de winkelwagen met de gekozen licentie
function addToCart(beatId, beats, license) {
    const cart = getCart();
    const beat = beats.find(b => b.id === beatId);
    if (!beat) return;

    // Voorkom alleen exacte duplicaten van dezelfde beat + licentie.
    const existing = cart.find(item => item.id === beatId
        && item.license === license.type
        && item.format === license.format);
    if (existing) return;

    cart.push({
        id: beat.id,
        title: beat.title,
        producer: beat.producer,
        bpm: beat.bpm,
        genre: beat.genre,
        image: beat.image,
        license: license.type,
        format: license.format,
        price: license.price,
        cartKey: `${beat.id}|${license.type}|${license.format}`,
    });

    saveCart(cart);
}

export {
    getCart,
    saveCart,
    clearCart,
    updateCartBadge,
    getOrders,
    addOrder,
    addToCart,
};