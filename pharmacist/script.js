document.addEventListener('DOMContentLoaded', () => {

    // --- LOGIN HANDLING ---
    const loginContainer = document.getElementById('login-container');
    const appContainer = document.getElementById('app-container');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Hardcoded credentials for demonstration
        if (username === 'pharmacist' && password === 'password123') {
            loginContainer.classList.add('hidden');
            appContainer.classList.remove('hidden');
            appContainer.classList.add('flex'); // Restore flex display
            // --- INITIALIZE APP ---
            seedData();
            renderPage(DashboardPage);
        } else {
            loginError.textContent = 'Invalid username or password.';
        }
    });

    // --- STATE MANAGEMENT & LOCAL STORAGE ---
    const APP_PREFIX = 'pharmacy_dashboard_';
    let state = {
        inventory: JSON.parse(localStorage.getItem(APP_PREFIX + 'inventory')) || [],
        orders: JSON.parse(localStorage.getItem(APP_PREFIX + 'orders')) || [],
    };

    // Seed initial data if local storage is empty
    function seedData() {
        if (!localStorage.getItem(APP_PREFIX + 'inventory') || state.inventory.length === 0) {
            state.inventory = [
                { id: 1, name: 'Paracetamol 500mg', quantity: 150, expiry: '2026-12-31' },
                { id: 2, name: 'Amoxicillin 250mg', quantity: 8, expiry: '2025-08-01' },
                { id: 3, name: 'Ibuprofen 200mg', quantity: 80, expiry: '2026-10-15' },
                { id: 4, name: 'Cetirizine 10mg', quantity: 200, expiry: '2027-01-20' },
                { id: 5, name: 'ORS Powder', quantity: 5, expiry: '2025-06-30' },
            ];
        }
        if (!localStorage.getItem(APP_PREFIX + 'orders') || state.orders.length === 0) {
            state.orders = [
                { id: 1, medName: 'Paracetamol 500mg', quantity: 20, date: '2025-09-28' },
                { id: 2, medName: 'Amoxicillin 250mg', quantity: 15, date: '2025-09-28' },
                { id: 3, medName: 'Ibuprofen 200mg', quantity: 10, date: '2025-09-27' },
                { id: 4, medName: 'Paracetamol 500mg', quantity: 30, date: '2025-09-26' },
            ];
        }
        updateLocalStorage();
    }

    function updateLocalStorage() {
        localStorage.setItem(APP_PREFIX + 'inventory', JSON.stringify(state.inventory));
        localStorage.setItem(APP_PREFIX + 'orders', JSON.stringify(state.orders));
    }

    // --- UI TEMPLATES ---

    const DashboardPage = () => {
        const lowStockCount = state.inventory.filter(item => item.quantity < 10).length;
        const totalMedicines = state.inventory.length;
        
        const usageCounts = state.orders.reduce((acc, order) => {
            acc[order.medName] = (acc[order.medName] || 0) + order.quantity;
            return acc;
        }, {});
        
        const mostUsed = Object.keys(usageCounts).length > 0 
            ? Object.keys(usageCounts).reduce((a, b) => usageCounts[a] > usageCounts[b] ? a : b)
            : 'N/A';
            
        return `
            <div class="page-content">
                <h1 class="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div class="card bg-white p-6 rounded-lg shadow-md flex items-center">
                        <i class="fas fa-exclamation-triangle text-4xl text-red-500 mr-4"></i>
                        <div>
                            <p class="text-gray-500">Urgent Restocks</p>
                            <p class="text-3xl font-bold">${lowStockCount}</p>
                        </div>
                    </div>
                    <div class="card bg-white p-6 rounded-lg shadow-md flex items-center">
                        <i class="fas fa-pills text-4xl text-green-500 mr-4"></i>
                        <div>
                            <p class="text-gray-500">Most Used Medicine</p>
                            <p class="text-xl font-bold">${mostUsed}</p>
                        </div>
                    </div>
                    <div class="card bg-white p-6 rounded-lg shadow-md flex items-center">
                        <i class="fas fa-archive text-4xl text-blue-500 mr-4"></i>
                        <div>
                            <p class="text-gray-500">Total Medicines</p>
                            <p class="text-3xl font-bold">${totalMedicines}</p>
                        </div>
                    </div>
                </div>
                <div class="mt-8 bg-white p-6 rounded-lg shadow-md">
                    <h2 class="text-xl font-bold text-gray-800 mb-4">Low Stock Alerts ( < 10 )</h2>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left">
                            <thead>
                                <tr class="bg-gray-100">
                                    <th class="p-3">Name</th>
                                    <th class="p-3">Quantity</th>
                                    <th class="p-3">Expiry Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${state.inventory.filter(item => item.quantity < 10)
                                    .map(item => `
                                        <tr class="border-b hover:bg-gray-50">
                                            <td class="p-3 font-medium text-gray-700">${item.name}</td>
                                            <td class="p-3 text-red-600 font-bold">${item.quantity}</td>
                                            <td class="p-3 text-gray-600">${item.expiry}</td>
                                        </tr>
                                `).join('') || '<tr><td colspan="3" class="p-4 text-center text-gray-500">No low stock items.</td></tr>'}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="mt-8 bg-white p-6 rounded-lg shadow-md">
                    <h2 class="text-xl font-bold text-gray-800 mb-4">Quick Action: Add Medicine</h2>
                    <form id="quick-add-form" class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div>
                            <label for="quick-name" class="block text-sm font-medium text-gray-700">Name</label>
                            <input type="text" id="quick-name" required class="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500">
                        </div>
                        <div>
                            <label for="quick-quantity" class="block text-sm font-medium text-gray-700">Quantity</label>
                            <input type="number" id="quick-quantity" min="1" required class="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500">
                        </div>
                        <div>
                            <label for="quick-expiry" class="block text-sm font-medium text-gray-700">Expiry Date</label>
                            <input type="date" id="quick-expiry" required class="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500">
                        </div>
                        <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 h-10">
                            <i class="fas fa-plus mr-2"></i>Quick Add
                        </button>
                    </form>
                </div>
            </div>`;
    };

    const InventoryPage = () => `
        <div class="page-content">
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-3xl font-bold text-gray-800">Inventory</h1>
                <button id="add-medicine-btn" class="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 flex items-center">
                    <i class="fas fa-plus mr-2"></i> Add Medicine
                </button>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md">
                <div class="overflow-x-auto">
                    <table class="w-full text-left" id="inventory-table">
                        <thead>
                            <tr class="bg-gray-100">
                                <th class="p-3">Name</th>
                                <th class="p-3">Quantity</th>
                                <th class="p-3">Expiry Date</th>
                                <th class="p-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            </tbody>
                    </table>
                </div>
            </div>
        </div>`;

    const OrdersPage = () => `
        <div class="page-content">
            <h1 class="text-3xl font-bold text-gray-800 mb-6">Previous Orders</h1>
            <div class="bg-white p-6 rounded-lg shadow-md">
                 <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead>
                            <tr class="bg-gray-100">
                                <th class="p-3">Order ID</th>
                                <th class="p-3">Medicine Name</th>
                                <th class="p-3">Quantity</th>
                                <th class="p-3">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${state.orders.map(order => `
                                <tr class="border-b hover:bg-gray-50">
                                    <td class="p-3 text-gray-600">#${order.id}</td>
                                    <td class="p-3 font-medium text-gray-700">${order.medName}</td>
                                    <td class="p-3 text-gray-600">${order.quantity}</td>
                                    <td class="p-3 text-gray-600">${order.date}</td>
                                </tr>
                            `).join('') || '<tr><td colspan="4" class="p-4 text-center text-gray-500">No orders found.</td></tr>'}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>`;

    const AnalyticsPage = () => {
         const usageCounts = state.orders.reduce((acc, order) => {
            acc[order.medName] = (acc[order.medName] || 0) + order.quantity;
            return acc;
        }, {});
        const sortedMeds = Object.entries(usageCounts).sort(([,a],[,b]) => b-a);
        const maxUsage = sortedMeds.length > 0 ? sortedMeds[0][1] : 0;

        return `
        <div class="page-content">
            <h1 class="text-3xl font-bold text-gray-800 mb-6">Analytics</h1>
            <div class="bg-white p-6 rounded-lg shadow-md">
                <h2 class="text-xl font-bold text-gray-800 mb-4">Most Used Medicines by Quantity</h2>
                <div class="space-y-4">
                    ${sortedMeds.length > 0 ? sortedMeds.map(([name, count]) => `
                        <div>
                            <p class="font-semibold text-gray-700">${name} (${count})</p>
                            <div class="bg-gray-200 rounded-full h-4">
                                <div class="bg-blue-500 h-4 rounded-full" style="width: ${maxUsage > 0 ? (count / maxUsage) * 100 : 0}%"></div>
                            </div>
                        </div>
                    `).join('') : '<p class="text-gray-500">No order data available for analytics.</p>'}
                </div>
            </div>
        </div>`;
    }

    // --- RENDER FUNCTIONS ---
    const pageContent = document.getElementById('page-content');
    
    function renderPage(page) {
        pageContent.innerHTML = page();
        if (page === InventoryPage) renderInventoryTable();
    }

    function renderInventoryTable() {
        const tableBody = document.querySelector('#inventory-table tbody');
        if (!tableBody) return;
        tableBody.innerHTML = state.inventory.map(item => `
            <tr class="border-b hover:bg-gray-50" data-id="${item.id}">
                <td class="p-3 font-medium text-gray-700">${item.name}</td>
                <td class="p-3 ${item.quantity < 10 ? 'text-red-600 font-bold' : 'text-gray-600'}">${item.quantity}</td>
                <td class="p-3 text-gray-600">${item.expiry}</td>
                <td class="p-3 text-right">
                    <button class="edit-btn text-blue-500 hover:text-blue-700 mr-3" title="Edit"><i class="fas fa-pencil-alt"></i></button>
                    <button class="delete-btn text-red-500 hover:text-red-700" title="Delete"><i class="fas fa-trash-alt"></i></button>
                </td>
            </tr>
        `).join('') || '<tr><td colspan="4" class="p-4 text-center text-gray-500">Inventory is empty.</td></tr>';
    }

    // --- NAVIGATION ---
    const navLinks = document.querySelectorAll('.nav-link');
    const pageMap = {
        'nav-dashboard': DashboardPage,
        'nav-inventory': InventoryPage,
        'nav-orders': OrdersPage,
        'nav-analytics': AnalyticsPage,
    };

    function handleNavigation(e) {
        e.preventDefault();
        const link = e.currentTarget;

        navLinks.forEach(l => {
            l.classList.remove('bg-blue-100', 'text-blue-600', 'font-semibold');
            l.classList.add('text-gray-600');
        });

        link.classList.add('bg-blue-100', 'text-blue-600', 'font-semibold');
        link.classList.remove('text-gray-600');

        renderPage(pageMap[link.id]);
    }

    navLinks.forEach(link => link.addEventListener('click', handleNavigation));

    // --- MODAL HANDLING ---
    const modal = document.getElementById('medicine-modal');
    const modalTitle = document.getElementById('modal-title');
    const medicineForm = document.getElementById('medicine-form');
    const medicineIdInput = document.getElementById('medicine-id');
    const medicineNameInput = document.getElementById('medicine-name');
    const quantityInput = document.getElementById('quantity');
    const expiryDateInput = document.getElementById('expiry-date');

    function openModal(mode, medicine = null) {
        medicineForm.reset();
        if (mode === 'edit' && medicine) {
            modalTitle.textContent = 'Edit Medicine';
            medicineIdInput.value = medicine.id;
            medicineNameInput.value = medicine.name;
            quantityInput.value = medicine.quantity;
            expiryDateInput.value = medicine.expiry;
        } else {
            modalTitle.textContent = 'Add New Medicine';
            medicineIdInput.value = '';
        }
        modal.classList.remove('hidden');
    }

    function closeModal() {
        modal.classList.add('hidden');
    }

    document.getElementById('cancel-modal').addEventListener('click', closeModal);

    // --- CRUD OPERATIONS ---
    medicineForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = medicineIdInput.value;
        const medicineData = {
            name: medicineNameInput.value,
            quantity: parseInt(quantityInput.value),
            expiry: expiryDateInput.value,
        };

        if (id) { // Edit mode
            const index = state.inventory.findIndex(item => item.id == id);
            state.inventory[index] = { ...state.inventory[index], ...medicineData };
        } else { // Add mode
            medicineData.id = state.inventory.length > 0 ? Math.max(...state.inventory.map(i => i.id)) + 1 : 1;
            state.inventory.push(medicineData);
        }

        updateLocalStorage();
        renderInventoryTable();
        closeModal();
    });
    
    // --- CONFIRMATION MODAL ---
    const confirmModal = document.getElementById('confirm-modal');
    let onConfirmCallback = null;

    function showConfirmModal(callback) {
        onConfirmCallback = callback;
        confirmModal.classList.remove('hidden');
    }

    document.getElementById('confirm-cancel').addEventListener('click', () => {
        confirmModal.classList.add('hidden');
        onConfirmCallback = null;
    });

    document.getElementById('confirm-ok').addEventListener('click', () => {
        if (onConfirmCallback) onConfirmCallback();
        confirmModal.classList.add('hidden');
        onConfirmCallback = null;
    });
    
    // --- EVENT DELEGATION FOR PAGE BUTTONS ---
    pageContent.addEventListener('click', (e) => {
        if (e.target.closest('#add-medicine-btn')) {
            openModal('add');
        }

        const editBtn = e.target.closest('.edit-btn');
        if (editBtn) {
            const row = editBtn.closest('tr');
            const id = row.dataset.id;
            const medicine = state.inventory.find(item => item.id == id);
            openModal('edit', medicine);
        }
        
        const deleteBtn = e.target.closest('.delete-btn');
        if (deleteBtn) {
            const row = deleteBtn.closest('tr');
            const id = row.dataset.id;
            showConfirmModal(() => {
                state.inventory = state.inventory.filter(item => item.id != id);
                updateLocalStorage();
                renderInventoryTable();
            });
        }
    });
    
    // Event delegation for the new Quick Add form
    pageContent.addEventListener('submit', (e) => {
        if (e.target.id === 'quick-add-form') {
            e.preventDefault();
            const name = document.getElementById('quick-name').value;
            const quantity = parseInt(document.getElementById('quick-quantity').value);
            const expiry = document.getElementById('quick-expiry').value;

            const newMedicine = {
                id: state.inventory.length > 0 ? Math.max(...state.inventory.map(i => i.id)) + 1 : 1,
                name,
                quantity,
                expiry,
            };

            state.inventory.push(newMedicine);
            updateLocalStorage();
            renderPage(DashboardPage); // Re-render the dashboard to show updated stats and form reset
        }
    });

    // NOTE: App initialization (seedData and renderPage) is now called after a successful login.
});