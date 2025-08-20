// Sample data - simplified without categories and priority
const babyShowerItems = [
	{ id: 1, name: "Cuna" },
	{ id: 2, name: "Cochecito" },
	{ id: 3, name: "Pañales Recién Nacido" },
	{ id: 4, name: "Ropa 0-3 meses" },
	{ id: 5, name: "Biberones" },
	{ id: 6, name: "Toallas para bebé" },
	{ id: 7, name: "Manta suave" },
	{ id: 8, name: "Juguetes suaves" },
	{ id: 9, name: "Silla para auto" },
	{ id: 10, name: "Monitor de bebé" },
	{ id: 11, name: "Cambiador" },
	{ id: 12, name: "Crema para pañal" }
];

let faltantes = [...babyShowerItems];
let comprados = [];
let currentItem = null;

// DOM Elements
const modal = document.getElementById('modal');
const buyerNameInput = document.getElementById('buyerName');
const itemNameEl = document.getElementById('itemName');
const confirmBtn = document.getElementById('confirmBtn');
const cancelBtn = document.getElementById('cancelBtn');
const faltantesList = document.getElementById('faltantesList');
const compradosList = document.getElementById('compradosList');
// Remove category icons reference since we're not using them anymore
const pendingCount = document.getElementById('pendingCount');
const completedCount = document.getElementById('completedCount');

function updateCounts() {
	pendingCount.textContent = faltantes.length;
	completedCount.textContent = comprados.length;
}

function renderFaltantes() {
	faltantesList.innerHTML = '';

	if (faltantes.length === 0) {
		faltantesList.innerHTML = `
                    <div class="empty-state success">
                        <h3>¡Todo listo!</h3>
                        <p>No quedan artículos por comprar</p>
                    </div>
                `;
		return;
	}

	faltantes.forEach(item => {
		const itemEl = document.createElement('div');
		itemEl.className = `item slide-in`;
		itemEl.innerHTML = `
                    <div class="item-content">
                        <div class="item-info">
                            <h3>${item.name}</h3>
                        </div>
                    </div>
                    <button class="item-button">Marcar como comprado</button>
                `;

		itemEl.addEventListener('click', () => openModal(item));
		faltantesList.appendChild(itemEl);
	});
}

function renderComprados() {
	compradosList.innerHTML = '';

	if (comprados.length === 0) {
		compradosList.innerHTML = `
                    <div class="empty-state">
                        <p>Aún no hay artículos comprados</p>
                    </div>
                `;
		return;
	}

	comprados.forEach(item => {
		const itemEl = document.createElement('div');
		itemEl.className = 'completed-item fade-in';
		itemEl.innerHTML = `
                    <div class="item-content">
                        <div class="item-info">
                            <h3>${item.name}</h3>
                            <p class="buyer">Se encarga: ${item.buyer}</p>
                        </div>
                    </div>
                    <div class="completed-icon">✓</div>
                `;
		compradosList.appendChild(itemEl);
	});
}

function openModal(item) {
	currentItem = item;
	itemNameEl.textContent = item.name;
	buyerNameInput.value = '';
	buyerNameInput.classList.remove('error');
	modal.classList.add('show');
	setTimeout(() => buyerNameInput.focus(), 100);
}

function closeModal() {
	modal.classList.remove('show');
	currentItem = null;
	buyerNameInput.value = '';
	buyerNameInput.classList.remove('error');
}

function confirmPurchase() {
	const buyerName = buyerNameInput.value.trim();

	if (!buyerName) {
		buyerNameInput.focus();
		buyerNameInput.classList.add('error');
		setTimeout(() => {
			buyerNameInput.classList.remove('error');
		}, 2000);
		return;
	}

	if (currentItem) {
		// Move item from faltantes to comprados
		const itemIndex = faltantes.findIndex(item => item.id === currentItem.id);
		if (itemIndex > -1) {
			const purchasedItem = { ...faltantes[itemIndex], buyer: buyerName };
			faltantes.splice(itemIndex, 1);
			comprados.push(purchasedItem);

			renderFaltantes();
			renderComprados();
			updateCounts();
		}
	}

	closeModal();
}

// Event Listeners
confirmBtn.addEventListener('click', confirmPurchase);
cancelBtn.addEventListener('click', closeModal);

buyerNameInput.addEventListener('keypress', (e) => {
	if (e.key === 'Enter') {
		confirmPurchase();
	} else if (e.key === 'Escape') {
		closeModal();
	}
});

// Close modal when clicking backdrop
modal.addEventListener('click', (e) => {
	if (e.target === modal) {
		closeModal();
	}
});

// Initialize the app
renderFaltantes();
renderComprados();
updateCounts();