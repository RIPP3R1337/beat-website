const cartIconSVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="8" cy="21" r="1"></circle>
    <circle cx="19" cy="21" r="1"></circle>
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
</svg>`;

function createBeatCard(beat) {
    const firstLicense = beat.licenses[0];
    const licenseOptions = beat.licenses
        .map(l => `<option value='${JSON.stringify(l)}'>${l.type} — ${l.format}</option>`)
        .join('');

    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow';
    card.dataset.beatId = beat.id;
    card.innerHTML = `
    <div class="relative h-48">
        <img src="${beat.image}" alt="${beat.title}" class="w-full h-full object-cover">
    </div>
    <div class="p-4">
        <h3 class="font-bold text-xl text-gray-900 mb-1">${beat.title}</h3>
        <p class="text-gray-600 text-sm mb-3">${beat.producer}</p>
        <div class="flex space-x-4 text-sm text-gray-500 mb-3">
            <span>${beat.bpm} BPM</span>
            <span>${beat.genre}</span>
        </div>
        <select class="license-select w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
            ${licenseOptions}
        </select>
        <div class="flex justify-between items-center">
            <span class="beat-price text-2xl font-bold text-blue-600">$${firstLicense.price.toFixed(2)}</span>
            <button
                class="add-to-cart bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                data-id="${beat.id}">
                ${cartIconSVG}
                <span>Add to Cart</span>
            </button>
        </div>
    </div>`;

    // Update price display when license changes
    card.querySelector('.license-select').addEventListener('change', (e) => {
        const license = JSON.parse(e.target.value);
        card.querySelector('.beat-price').textContent = `$${license.price.toFixed(2)}`;
    });

    return card;
}

function renderBeats(beats) {
    const grid = document.getElementById('beats-grid');
    if (!grid) return;
    grid.innerHTML = '';
    beats.forEach(beat => grid.appendChild(createBeatCard(beat)));
}

function disableButton(btn) {
    btn.disabled = true;
    btn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
    btn.classList.add('bg-gray-400', 'cursor-not-allowed');
    btn.querySelector('span').textContent = 'In Cart';
}

const storedBeats = localStorage.getItem('admin_beats');
const beatsPromise = storedBeats
    ? Promise.resolve(JSON.parse(storedBeats))
    : fetch('./data/beats.json')
        .then(response => {
            if (!response.ok) throw new Error('Could not load beats.json');
            return response.json();
        });

beatsPromise.then(beats => {
    renderBeats(beats);
    updateCartBadge();

    const cart = getCart();
    cart.forEach(item => {
        const btn = document.querySelector(`.add-to-cart[data-id="${item.id}"]`);
        if (btn) disableButton(btn);
    });

    document.getElementById('beats-grid').addEventListener('click', (e) => {
        const btn = e.target.closest('.add-to-cart');
        if (!btn || btn.disabled) return;

        const card = btn.closest('[data-beat-id]');
        const selectedLicense = JSON.parse(card.querySelector('.license-select').value);
        const id = parseInt(btn.dataset.id);

        addToCart(id, beats, selectedLicense);
        updateCartBadge();
        disableButton(btn);
    });

    // Genre filter
    let activeGenre = 'all';

    document.getElementById('genre-filters').addEventListener('click', (e) => {
        const btn = e.target.closest('.genre-btn');
        if (!btn) return;

        activeGenre = btn.dataset.genre;

        document.querySelectorAll('.genre-btn').forEach(b => {
            b.classList.remove('active', 'bg-blue-600', 'text-white');
            b.classList.add('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300');
        });
        btn.classList.add('active', 'bg-blue-600', 'text-white');
        btn.classList.remove('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300');

        const filtered = activeGenre === 'all' ? beats : beats.filter(b => b.genre === activeGenre);
        renderBeats(filtered);

        // Re-disable buttons for items already in cart
        getCart().forEach(item => {
            const b = document.querySelector(`.add-to-cart[data-id="${item.id}"]`);
            if (b) disableButton(b);
        });
    });
})
    .catch(err => console.error('Error loading beats:', err));


