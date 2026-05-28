// admin.js — Beheer van beats en bestellingen in het adminpaneel

/* global getOrders, updateCartBadge */

// Standaard beats die worden gebruikt als er niets in localStorage staat
const DEFAULT_BEATS = [
    {
        id: 1,
        title: "Midnight Dreams",
        producer: "Producer A",
        bpm: 140,
        genre: "Trap",
        image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400",
        licenses: [
            { type: "Basic", format: "MP3", price: 29.99 },
            { type: "Premium", format: "WAV", price: 49.99 },
            { type: "Exclusive", format: "WAV + Stems", price: 149.99 },
        ],
    },
    {
        id: 2,
        title: "Urban Vibes",
        producer: "Producer B",
        bpm: 120,
        genre: "Hip Hop",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
        licenses: [
            { type: "Basic", format: "MP3", price: 39.99 },
            { type: "Premium", format: "WAV", price: 59.99 },
            { type: "Exclusive", format: "WAV + Stems", price: 179.99 },
        ],
    },
    {
        id: 3,
        title: "Summer Breeze",
        producer: "Producer C",
        bpm: 95,
        genre: "R&B",
        image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400",
        licenses: [
            { type: "Basic", format: "MP3", price: 24.99 },
            { type: "Premium", format: "WAV", price: 44.99 },
            { type: "Exclusive", format: "WAV + Stems", price: 129.99 },
        ],
    },
    {
        id: 4,
        title: "Electric Pulse",
        producer: "Producer D",
        bpm: 128,
        genre: "EDM",
        image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400",
        licenses: [
            { type: "Basic", format: "MP3", price: 49.99 },
            { type: "Premium", format: "WAV", price: 79.99 },
            { type: "Exclusive", format: "WAV + Stems", price: 199.99 },
        ],
    },
    {
        id: 5,
        title: "Dark Matter",
        producer: "Producer E",
        bpm: 150,
        genre: "Drill",
        image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400",
        licenses: [
            { type: "Basic", format: "MP3", price: 34.99 },
            { type: "Premium", format: "WAV", price: 54.99 },
            { type: "Exclusive", format: "WAV + Stems", price: 159.99 },
        ],
    },
];

const STORAGE_KEY = 'admin_beats';

// Haal beats op uit localStorage, of gebruik de standaard beats als fallback
function getBeats() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_BEATS.map(b => ({ ...b, licenses: b.licenses.map(l => ({ ...l })) }));
}

// Sla de beats op in localStorage
function saveBeats(beats) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(beats));
}

const EDIT_SVG_PATH = 'M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0'
    + '-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z';

// Render de beats-tabel in het adminpaneel
function renderBeats(beats) {
    const tbody = document.getElementById('beats-tbody');
    tbody.innerHTML = beats.map(beat => {
        const basicPrice = beat.licenses.find(l => l.type === 'Basic');
        const price = basicPrice ? basicPrice.price.toFixed(2) : '0.00';
        const safeImg = escapeHtml(beat.image);
        const safeTitle = escapeHtml(beat.title);
        const img = beat.image
            ? `<img src="${safeImg}" alt="${safeTitle}" class="w-10 h-10 rounded object-cover">`
            : `<div class="w-10 h-10 rounded bg-gray-200 flex items-center justify-center text-gray-400">🎵</div>`;
        return `
    <tr>
        <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex items-center">
            ${img}
            <div class="ml-4">
            <div class="font-medium text-gray-900">${escapeHtml(beat.title)}</div>
            <div class="text-sm text-gray-500">${escapeHtml(beat.producer)}</div>
            </div>
        </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${escapeHtml(beat.genre)}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${beat.bpm}</td>
        <td class="px-6 py-4 whitespace-nowrap">
        <span class="text-lg font-semibold text-gray-900">$${price}</span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm">
        <div class="flex items-center space-x-3 gap-6">
            <button class="text-blue-600 hover:text-blue-800 flex items-center space-x-1" data-edit-id="${beat.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="${EDIT_SVG_PATH}"></path>
            </svg>
            <span>Bewerk</span>
            </button>
            <button class="text-red-600 hover:text-red-800 flex items-center space-x-1" data-delete-id="${beat.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0x 1-2-2L5 6"></path>
                <path d="M10 11v6"></path><path d="M14 11v6"></path>
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
            </svg>
            <span>Verwijder</span>
            </button>
        </div>
        </td>
    </tr>`;
    }).join('');
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Verberg en reset het formulier
function hideForm() {
    document.getElementById('add-beat-form').classList.add('hidden');
    document.getElementById('form-new-beat').reset();
    document.getElementById('beat-edit-id').value = '';
    document.getElementById('form-title').textContent = 'Nieuwe Beat Toevoegen';
}

// Open het formulier gevuld met de gegevens van een bestaande beat
function openEditForm(id) {
    const beat = getBeats().find(b => b.id === id);
    if (!beat) return;
    document.getElementById('beat-edit-id').value = beat.id;
    document.getElementById('beat-title').value = beat.title;
    document.getElementById('beat-producer').value = beat.producer;
    document.getElementById('beat-bpm').value = beat.bpm;
    document.getElementById('beat-genre').value = beat.genre;
    document.getElementById('beat-image').value = beat.image || '';
    const basic = beat.licenses.find(l => l.type === 'Basic');
    const premium = beat.licenses.find(l => l.type === 'Premium');
    const exclusive = beat.licenses.find(l => l.type === 'Exclusive');
    document.getElementById('beat-price-basic').value = basic ? basic.price : '';
    document.getElementById('beat-price-premium').value = premium ? premium.price : '';
    document.getElementById('beat-price-exclusive').value = exclusive ? exclusive.price : '';
    document.getElementById('form-title').textContent = 'Beat Bewerken';
    document.getElementById('add-beat-form').classList.remove('hidden');
    document.getElementById('add-beat-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Bereken en toon statistieken (totale omzet en aantal bestellingen)
function renderStats() {
    const orders = getOrders();
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    document.getElementById('total-revenue').textContent = `$${totalRevenue.toFixed(2)}`;
    document.getElementById('total-orders').textContent = orders.length;
}

// Render alle bestellingen in het adminpaneel
function renderOrders() {
    const orders = getOrders();
    const container = document.getElementById('orders-container');
    if (orders.length === 0) {
        container.innerHTML = '<div class="bg-white rounded-lg shadow-md p-8 text-center">'
            + '<p class="text-gray-500">Nog geen bestellingen</p></div>';
        return;
    }
    container.innerHTML = [...orders].reverse().map(order => `
        <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex justify-between items-center mb-3">
                <div>
                    <span class="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded">${order.id}</span>
                    <span class="text-sm text-gray-500 ml-2">${order.date} ${order.time || ''}</span>
                </div>
                <span class="text-lg font-bold text-green-600">$${order.total.toFixed(2)}</span>
            </div>
            <ul class="space-y-1">
                ${order.items.map(item => `
                    <li class="text-sm text-gray-700 flex justify-between">
                        <span>${escapeHtml(item.title)} <span class="text-gray-400">— ${escapeHtml(item.license)} (${escapeHtml(item.format)})</span></span>
                        <span class="font-medium">$${item.price.toFixed(2)}</span>
                    </li>`).join('')}
            </ul>
        </div>`).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    renderBeats(getBeats());
    updateCartBadge();
    renderStats();
    renderOrders();

    // Toggle formulier zichtbaarheid
    document.getElementById('btn-add-beat').addEventListener('click', () => {
        document.getElementById('add-beat-form').classList.toggle('hidden');
    });

    document.getElementById('btn-cancel-add').addEventListener('click', hideForm);

    // Nieuwe beat toevoegen of bewerken
    document.getElementById('form-new-beat').addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.getElementById('beat-title').value.trim();
        const producer = document.getElementById('beat-producer').value.trim();
        const bpm = parseInt(document.getElementById('beat-bpm').value, 10);
        const genre = document.getElementById('beat-genre').value.trim();
        const priceBasic = parseFloat(document.getElementById('beat-price-basic').value);
        const pricePremium = parseFloat(document.getElementById('beat-price-premium').value);
        const priceExclusive = parseFloat(document.getElementById('beat-price-exclusive').value);

        if (!title || !producer || !genre) {
            alert('Vul alle verplichte velden in (titel, producer, genre).');
            return;
        }
        if (Number.isNaN(bpm) || bpm <= 0) {
            alert('Vul een geldig BPM in (groter dan 0).');
            return;
        }
        if (Number.isNaN(priceBasic) || Number.isNaN(pricePremium)
            || Number.isNaN(priceExclusive)
            || priceBasic <= 0 || pricePremium <= 0 || priceExclusive <= 0) {
            alert('Vul geldige prijzen in voor alle licenties (groter dan 0).');
            return;
        }

        const beats = getBeats();
        const editId = document.getElementById('beat-edit-id').value;
        const beatData = {
            title,
            producer,
            bpm,
            genre,
            image: document.getElementById('beat-image').value.trim(),
            licenses: [
                { type: 'Basic', format: 'MP3', price: priceBasic },
                { type: 'Premium', format: 'WAV', price: pricePremium },
                { type: 'Exclusive', format: 'WAV + Stems', price: priceExclusive }
            ]
        };
        if (editId) {
            const index = beats.findIndex(b => b.id === parseInt(editId, 10));
            if (index !== -1) beats[index] = { ...beats[index], ...beatData };
        } else {
            const newId = beats.length > 0 ? Math.max(...beats.map(b => b.id)) + 1 : 1;
            beats.push({ id: newId, ...beatData });
        }
        saveBeats(beats);
        renderBeats(beats);
        hideForm();
    });

    // Beat bewerken of verwijderen
    document.getElementById('beats-tbody').addEventListener('click', (e) => {
        const editBtn = e.target.closest('[data-edit-id]');
        if (editBtn) {
            openEditForm(parseInt(editBtn.dataset.editId, 10));
            return;
        }
        const deleteBtn = e.target.closest('[data-delete-id]');
        if (deleteBtn) {
            const id = parseInt(deleteBtn.dataset.deleteId, 10);
            const beats = getBeats().filter(b => b.id !== id);
            saveBeats(beats);
            renderBeats(beats);
        }
    });

    // Reset naar origineel
    document.getElementById('btn-reset').addEventListener('click', () => {
        if (!confirm('Weet je zeker dat je wil resetten naar de originele 5 beats? Alle toegevoegde beats worden verwijderd.')) return;
        saveBeats(DEFAULT_BEATS.map(b => ({ ...b, licenses: b.licenses.map(l => ({ ...l })) })));
        renderBeats(getBeats());
        hideForm();
    });
});
