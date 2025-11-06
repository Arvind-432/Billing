// Data Storage - Centralized State Management
const AppState = {
    products: [],
    customers: [],
    transactions: [],
    ledgerEntries: [],
    currentBill: [],
    selectedCustomer: null,
    selectedPaymentMethod: 'cash',
    currentCategory: 'all',
    storeInfo: {},
    editingProductId: null,
    categories: [],
    editingCategoryId: null,
    stockAdjustments: [],
    adjustingProductId: null,
    editingCustomerId: null,
    editingBillId: null,
    editBillItems: [],
    customerLedger: [],
    receivingPaymentForCustomerId: null
};

// Legacy variable references for backward compatibility
let products = AppState.products;
let customers = AppState.customers;
let transactions = AppState.transactions;
let ledgerEntries = AppState.ledgerEntries;
let currentBill = AppState.currentBill;
let selectedCustomer = AppState.selectedCustomer;
let selectedPaymentMethod = AppState.selectedPaymentMethod;
let currentCategory = AppState.currentCategory;
let storeInfo = AppState.storeInfo;
let editingProductId = AppState.editingProductId;
let categories = AppState.categories;
let editingCategoryId = AppState.editingCategoryId;
let stockAdjustments = AppState.stockAdjustments;
let adjustingProductId = AppState.adjustingProductId;
let editingCustomerId = AppState.editingCustomerId;
let editingBillId = AppState.editingBillId;
let editBillItems = AppState.editBillItems;
let customerLedger = AppState.customerLedger;
let receivingPaymentForCustomerId = AppState.receivingPaymentForCustomerId;

// Initialize App
function initializeApp() {
    loadFromLocalStorage();
    setupEventListeners();
    populateCategoryFilters();
    updateCustomerSelect();
    updateLedgerCustomerSelect();
    renderDashboard();
    renderBillingProducts();
    renderInventory();
    renderCustomers();
    setDefaultDates();
}

// LocalStorage Functions
function saveToLocalStorage() {
    try {
        const data = {
            products: AppState.products,
            customers: AppState.customers,
            transactions: AppState.transactions,
            ledgerEntries: AppState.ledgerEntries,
            storeInfo: AppState.storeInfo,
            categories: AppState.categories,
            stockAdjustments: AppState.stockAdjustments,
            customerLedger: AppState.customerLedger
        };
        // Use in-memory storage since localStorage is blocked
        window.posData = data;
    } catch (e) {
        console.log('Storage not available, using in-memory storage');
    }
}

function loadFromLocalStorage() {
    try {
        // Try to load from in-memory storage
        if (window.posData) {
            AppState.products = window.posData.products;
            AppState.customers = window.posData.customers;
            AppState.transactions = window.posData.transactions;
            AppState.ledgerEntries = window.posData.ledgerEntries;
            AppState.storeInfo = window.posData.storeInfo;
            AppState.categories = window.posData.categories;
            AppState.stockAdjustments = window.posData.stockAdjustments || [];
            AppState.customerLedger = window.posData.customerLedger;
            syncLegacyVariables();
            updateStoreNameDisplay();
            return;
        }
    } catch (e) {
        console.log('Could not load from storage');
    }
    // If no saved data, load sample data
    loadSampleData();
    loadStoreSettings();
    saveToLocalStorage();
}

function syncLegacyVariables() {
    products = AppState.products;
    customers = AppState.customers;
    transactions = AppState.transactions;
    ledgerEntries = AppState.ledgerEntries;
    currentBill = AppState.currentBill;
    selectedCustomer = AppState.selectedCustomer;
    selectedPaymentMethod = AppState.selectedPaymentMethod;
    currentCategory = AppState.currentCategory;
    storeInfo = AppState.storeInfo;
    editingProductId = AppState.editingProductId;
    categories = AppState.categories;
    editingCategoryId = AppState.editingCategoryId;
    stockAdjustments = AppState.stockAdjustments;
    adjustingProductId = AppState.adjustingProductId;
    editingCustomerId = AppState.editingCustomerId;
    editingBillId = AppState.editingBillId;
    editBillItems = AppState.editBillItems;
    customerLedger = AppState.customerLedger;
    receivingPaymentForCustomerId = AppState.receivingPaymentForCustomerId;
}

// Load Sample Data
function loadSampleData() {
    AppState.products = [
        { id: 1, name: "Basmati Rice 1kg", category: "Groceries", barcode: "8901030812345", price: 120.00, cost: 95.00, stock: 50, unit: "kg", tax_rate: 5, supplier: "Rice Mills Ltd", reorder_level: 10, expiry_tracking: true },
        { id: 2, name: "Toor Dal 500g", category: "Pulses", barcode: "8901030812346", price: 85.00, cost: 70.00, stock: 25, unit: "packet", tax_rate: 5, supplier: "Dal Suppliers", reorder_level: 5, expiry_tracking: true },
        { id: 3, name: "Amul Milk 1L", category: "Dairy", barcode: "8901030812347", price: 60.00, cost: 52.00, stock: 30, unit: "liter", tax_rate: 5, supplier: "Amul", reorder_level: 10, expiry_tracking: true },
        { id: 4, name: "Onions", category: "Vegetables", barcode: "8901030812348", price: 40.00, cost: 32.00, stock: 15.5, unit: "kg", tax_rate: 0, supplier: "Local Vendor", reorder_level: 5, weight_based: true },
        { id: 5, name: "Tomatoes", category: "Vegetables", barcode: "8901030812349", price: 35.00, cost: 28.00, stock: 20.0, unit: "kg", tax_rate: 0, supplier: "Local Vendor", reorder_level: 5, weight_based: true },
        { id: 6, name: "Atta 5kg", category: "Groceries", barcode: "8901030812350", price: 250.00, cost: 220.00, stock: 40, unit: "packet", tax_rate: 5, supplier: "Wheat Mills", reorder_level: 10 },
        { id: 7, name: "Sugar 1kg", category: "Groceries", barcode: "8901030812351", price: 45.00, cost: 40.00, stock: 60, unit: "kg", tax_rate: 5, supplier: "Sugar Mills", reorder_level: 15 },
        { id: 8, name: "Tea Powder 250g", category: "Beverages", barcode: "8901030812352", price: 180.00, cost: 160.00, stock: 35, unit: "packet", tax_rate: 5, supplier: "Tea Co", reorder_level: 8 }
    ];
    products = AppState.products;

    AppState.customers = [
        { id: 1, name: "Rajesh Kumar", phone: "9876543210", email: "rajesh@email.com", address: "123 Main Street, Delhi", loyalty_points: 150, total_purchases: 2500.00, last_visit: "2025-11-06", credit_limit: 5000, outstanding_balance: 178.50, available_credit: 4821.50, last_payment_date: "2025-11-05", credit_status: "active", account_status: "active" },
        { id: 2, name: "Priya Singh", phone: "9876543211", email: "priya@email.com", address: "456 Park Road, Delhi", loyalty_points: 85, total_purchases: 1200.00, last_visit: "2025-11-05", credit_limit: 3000, outstanding_balance: 0, available_credit: 3000, last_payment_date: "2025-11-04", credit_status: "active", account_status: "active" },
        { id: 3, name: "Aman Verma", phone: "9876543212", email: "aman@email.com", address: "789 Ring Road, Delhi", loyalty_points: 0, total_purchases: 0.00, last_visit: null, credit_limit: 2000, outstanding_balance: 0, available_credit: 2000, last_payment_date: null, credit_status: "active", account_status: "active" }
    ];
    customers = AppState.customers;

    AppState.transactions = [
        { id: 1, date: "2025-11-06", time: "14:30", customer_id: 1, customer_name: "Rajesh Kumar", items: [{product_id: 1, name: "Basmati Rice 1kg", quantity: 2, price: 120.00, tax_rate: 5}, {product_id: 3, name: "Amul Milk 1L", quantity: 1, price: 60.00, tax_rate: 5}], subtotal: 300.00, tax: 15.00, total: 315.00, payment_method: "UPI", payment_status: "paid" },
        { id: 2, date: "2025-11-06", time: "15:45", customer_id: null, customer_name: "Walk-in", items: [{product_id: 4, name: "Onions", quantity: 2, price: 40.00, tax_rate: 0}], subtotal: 80.00, tax: 0, total: 80.00, payment_method: "Cash", payment_status: "paid" },
        { id: 3, date: "2025-11-05", time: "11:20", customer_id: 2, customer_name: "Priya Singh", items: [{product_id: 2, name: "Toor Dal 500g", quantity: 3, price: 85.00, tax_rate: 5}], subtotal: 255.00, tax: 12.75, total: 267.75, payment_method: "Card", payment_status: "paid" },
        { id: 4, date: "2025-11-06", time: "14:30", customer_id: 1, customer_name: "Rajesh Kumar", items: [{product_id: 1, name: "Basmati Rice 1kg", quantity: 2, price: 120.00, tax_rate: 5}], subtotal: 240.00, tax: 12.00, total: 252.00, payment_method: "Credit", payment_status: "outstanding" },
        { id: 5, date: "2025-11-05", time: "15:45", customer_id: 1, customer_name: "Rajesh Kumar", items: [{product_id: 2, name: "Toor Dal 500g", quantity: 1, price: 85.00, tax_rate: 5}], subtotal: 85.00, tax: 4.25, total: 89.25, payment_method: "Credit", payment_status: "outstanding" }
    ];
    transactions = AppState.transactions;

    // Initialize customer ledger
    AppState.customerLedger = [
        { id: 1, customer_id: 1, transaction_type: "credit_sale", date: "2025-11-06", time: "14:30", bill_id: 4, debit: 252.00, credit: 0, balance: 252.00, description: "Credit Sale - Bill #4", reference: "Invoice #4", payment_method: "" },
        { id: 2, customer_id: 1, transaction_type: "credit_sale", date: "2025-11-05", time: "15:45", bill_id: 5, debit: 89.25, credit: 0, balance: 341.25, description: "Credit Sale - Bill #5", reference: "Invoice #5", payment_method: "" },
        { id: 3, customer_id: 1, transaction_type: "payment", date: "2025-11-05", time: "10:00", bill_id: null, debit: 0, credit: 162.75, balance: 178.50, description: "Payment Received", reference: "Payment Receipt #1", payment_method: "Cash" }
    ];
    customerLedger = AppState.customerLedger;

    // Initialize ledger with transactions
    AppState.ledgerEntries = transactions.map((t, index) => ({
        id: index + 1,
        date: t.date,
        description: `Sale - Invoice #${t.id}`,
        type: 'income',
        category: 'Sales',
        amount: t.total
    }));
    ledgerEntries = AppState.ledgerEntries;

    // Add some expense entries
    ledgerEntries.push(
        { id: ledgerEntries.length + 1, date: "2025-11-05", description: "Electricity Bill", type: 'expense', category: 'Utilities', amount: 2500 },
        { id: ledgerEntries.length + 2, date: "2025-11-04", description: "Stock Purchase - Rice", type: 'expense', category: 'Inventory', amount: 12000 },
        { id: ledgerEntries.length + 3, date: "2025-11-03", description: "Staff Salary", type: 'expense', category: 'Salary', amount: 15000 }
    );
}

// Load Store Settings
function loadStoreSettings() {
    AppState.storeInfo = {
        name: "My Grocery Store",
        address: "123 Market Street, Delhi - 110001",
        phone: "011-12345678",
        email: "info@mystore.com",
        gst_number: "07ABCDE1234F1Z5",
        owner: "Store Owner",
        default_tax_rate: 5,
        currency_symbol: "₹",
        receipt_footer: "Thank you for shopping with us!",
        gst_mode: "exclusive"
    };
    storeInfo = AppState.storeInfo;
    
    // Initialize categories
    AppState.categories = [
        { id: 1, name: "Groceries", description: "Rice, flour, spices, etc" },
        { id: 2, name: "Pulses", description: "Daal, beans, legumes" },
        { id: 3, name: "Dairy", description: "Milk, yogurt, cheese" },
        { id: 4, name: "Vegetables", description: "Fresh vegetables" },
        { id: 5, name: "Fruits", description: "Fresh fruits" },
        { id: 6, name: "Household", description: "Household items and cleaning supplies" },
        { id: 7, name: "Personal Care", description: "Toiletries and personal care items" },
        { id: 8, name: "Beverages", description: "Tea, coffee, juices" }
    ];
    categories = AppState.categories;
    syncLegacyVariables();
    updateStoreNameDisplay();
}

// Update store name in sidebar
function updateStoreNameDisplay() {
    document.getElementById('sidebarStoreName').textContent = storeInfo.name;
}

// Setup Event Listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.getAttribute('data-page');
            navigateToPage(page);
        });
    });
}

// Navigate to Page
function navigateToPage(pageName) {
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-page') === pageName) {
            item.classList.add('active');
        }
    });

    // Show active page
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(`${pageName}-page`).classList.add('active');

    // Refresh page content
    if (pageName === 'dashboard') renderDashboard();
    if (pageName === 'inventory') renderInventory();
    if (pageName === 'customers') renderCustomers();
    if (pageName === 'bills') renderBills();
    if (pageName === 'customer-ledger') renderCustomerLedgerPage();
    if (pageName === 'credit-management') renderCreditManagement();
    if (pageName === 'ledger') renderLedger();
    if (pageName === 'settings') loadSettingsPage();
}

// Dashboard Functions
function renderDashboard() {
    const today = new Date().toISOString().split('T')[0];
    const todayTransactions = transactions.filter(t => t.date === today);
    const todaySales = todayTransactions.reduce((sum, t) => sum + t.total, 0);
    const totalCreditOutstanding = customers.reduce((sum, c) => sum + (c.outstanding_balance || 0), 0);
    const lowStockProducts = products.filter(p => p.stock <= p.reorder_level);

    document.getElementById('todaySales').textContent = `₹${todaySales.toFixed(2)}`;
    document.getElementById('totalProducts').textContent = products.length;
    document.getElementById('totalCustomers').textContent = customers.length;
    document.getElementById('lowStockCount').textContent = lowStockProducts.length;
    document.getElementById('totalCreditOutstanding').textContent = `₹${totalCreditOutstanding.toFixed(2)}`;

    // Render low stock alerts
    const lowStockList = document.getElementById('lowStockList');
    if (lowStockProducts.length === 0) {
        lowStockList.innerHTML = '<div class="alert-item">No low stock items</div>';
    } else {
        lowStockList.innerHTML = lowStockProducts.map(p => 
            `<div class="alert-item">${p.name} - Stock: ${p.stock} ${p.unit}</div>`
        ).join('');
    }

    // Render recent transactions
    const recentTransactions = document.getElementById('recentTransactions');
    const displayTransactions = transactions.slice(-10).reverse();
    recentTransactions.innerHTML = displayTransactions.map(t => `
        <tr>
            <td>#${t.id}</td>
            <td>${t.date} ${t.time}</td>
            <td>${t.customer_name}</td>
            <td>${t.items.length}</td>
            <td>₹${t.total.toFixed(2)}</td>
            <td>${t.payment_method}</td>
        </tr>
    `).join('');
}

function refreshDashboard() {
    renderDashboard();
}

// Billing Functions
function renderBillingProducts() {
    const productGrid = document.getElementById('productGrid');
    let filteredProducts = products;
    
    if (currentCategory !== 'all') {
        filteredProducts = products.filter(p => p.category === currentCategory);
    }

    productGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" onclick="addToBill(${product.id})">
            <div class="product-name">${product.name}</div>
            <div class="product-price">₹${product.price.toFixed(2)}</div>
            <div class="product-stock">Stock: ${product.stock} ${product.unit}</div>
        </div>
    `).join('');
}

function filterByCategory(category) {
    AppState.currentCategory = category;
    currentCategory = category;
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-category') === category) {
            btn.classList.add('active');
        }
    });
    renderBillingProducts();
}

function handleBarcodeSearch(event) {
    if (event.key === 'Enter') {
        const barcode = event.target.value.trim();
        if (barcode) {
            const product = products.find(p => p.barcode === barcode);
            if (product) {
                addToBill(product.id);
                event.target.value = '';
            } else {
                alert('Product not found!');
            }
        }
    }
}

function manualProductSearch() {
    const searchTerm = document.getElementById('barcodeInput').value.toLowerCase();
    const product = products.find(p => 
        p.barcode === searchTerm || 
        p.name.toLowerCase().includes(searchTerm)
    );
    
    if (product) {
        addToBill(product.id);
        document.getElementById('barcodeInput').value = '';
    } else {
        alert('Product not found!');
    }
}

function addToBill(productId) {
    const product = AppState.products.find(p => p.id === productId);
    if (!product) return;

    if (product.stock <= 0) {
        alert('❌ Product out of stock!');
        return;
    }

    const existingItem = currentBill.find(item => item.product_id === productId);
    if (existingItem) {
        if (existingItem.quantity < product.stock) {
            existingItem.quantity += 1;
        } else {
            alert(`❌ Insufficient stock!\n\nAvailable: ${product.stock} ${product.unit}\nIn Cart: ${existingItem.quantity}`);
            return;
        }
    } else {
        AppState.currentBill.push({
            product_id: productId,
            name: product.name,
            price: product.price,
            quantity: 1,
            tax_rate: product.tax_rate
        });
        currentBill = AppState.currentBill;
    }

    renderBillItems();
}

function renderBillItems() {
    const billItems = document.getElementById('billItems');
    
    if (!billItems) return;
    
    if (currentBill.length === 0) {
        billItems.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--color-text-secondary);">No items added</div>';
        
        // Hide credit info if no items
        const creditInfoDisplay = document.getElementById('creditInfoDisplay');
        if (creditInfoDisplay) {
            creditInfoDisplay.style.display = 'none';
        }
    } else {
        billItems.innerHTML = currentBill.map((item, index) => {
            const itemTotal = item.price * item.quantity;
            return `
                <div class="bill-item">
                    <div class="bill-item-info">
                        <div class="bill-item-name">${item.name}</div>
                        <div class="bill-item-details">₹${item.price.toFixed(2)} × ${item.quantity}</div>
                    </div>
                    <div class="bill-item-controls">
                        <button class="qty-btn" onclick="updateQuantity(${index}, -1)">-</button>
                        <span class="qty-display">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
                        <span style="margin-left: 12px; font-weight: 600;">₹${itemTotal.toFixed(2)}</span>
                        <span class="remove-btn" onclick="removeFromBill(${index})">✕</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateBillSummary();
    
    // Update credit info if credit payment is selected
    if (selectedPaymentMethod === 'credit') {
        selectPaymentMethod('credit');
    }
}

function updateQuantity(index, change) {
    const item = AppState.currentBill[index];
    const product = AppState.products.find(p => p.id === item.product_id);
    
    const newQuantity = item.quantity + change;
    if (newQuantity <= 0) {
        removeFromBill(index);
        return;
    }
    
    if (newQuantity > product.stock) {
        alert('Insufficient stock!');
        return;
    }
    
    AppState.currentBill[index].quantity = newQuantity;
    currentBill = AppState.currentBill;
    renderBillItems();
}

function removeFromBill(index) {
    AppState.currentBill.splice(index, 1);
    currentBill = AppState.currentBill;
    renderBillItems();
}

function updateBillSummary() {
    const billSubtotal = document.getElementById('billSubtotal');
    const billTax = document.getElementById('billTax');
    const billTotal = document.getElementById('billTotal');
    
    if (!billSubtotal || !billTax || !billTotal) return;
    
    let subtotal = 0;
    let tax = 0;
    let total = 0;

    if (storeInfo.gst_mode === 'inclusive') {
        // GST Inclusive: Extract tax from the price
        currentBill.forEach(item => {
            const inclusiveTotal = item.price * item.quantity;
            const basePrice = inclusiveTotal / (1 + (item.tax_rate / 100));
            const itemTax = inclusiveTotal - basePrice;
            
            subtotal += basePrice;
            tax += itemTax;
            total += inclusiveTotal;
        });
    } else {
        // GST Exclusive: Add tax on top of the price
        currentBill.forEach(item => {
            const itemSubtotal = item.price * item.quantity;
            const itemTax = itemSubtotal * (item.tax_rate / 100);
            
            subtotal += itemSubtotal;
            tax += itemTax;
        });
        total = subtotal + tax;
    }

    billSubtotal.textContent = `₹${subtotal.toFixed(2)}`;
    billTax.textContent = `₹${tax.toFixed(2)}`;
    billTotal.textContent = `₹${total.toFixed(2)}`;
}

function selectCustomer() {
    const select = document.getElementById('customerSelect');
    const customerId = parseInt(select.value);
    AppState.selectedCustomer = customerId ? customers.find(c => c.id === customerId) : null;
    selectedCustomer = AppState.selectedCustomer;
    
    // Update credit info display if credit payment is selected
    if (selectedPaymentMethod === 'credit') {
        selectPaymentMethod('credit');
    }
}

function selectPaymentMethod(method) {
    AppState.selectedPaymentMethod = method;
    selectedPaymentMethod = method;
    document.querySelectorAll('.payment-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-method') === method) {
            btn.classList.add('active');
        }
    });

    const creditInfoDisplay = document.getElementById('creditInfoDisplay');
    if (!creditInfoDisplay) return;

    // Show credit info if credit is selected
    if (method === 'credit') {
        if (!selectedCustomer) {
            creditInfoDisplay.style.display = 'block';
            creditInfoDisplay.style.background = 'var(--color-bg-4)';
            creditInfoDisplay.style.borderLeft = '4px solid var(--color-error)';
            creditInfoDisplay.innerHTML = '<strong style="color: var(--color-error);">❌ Please select a customer to use credit payment!</strong>';
            return;
        }
        
        if (!selectedCustomer.credit_limit || selectedCustomer.credit_limit === 0) {
            creditInfoDisplay.style.display = 'block';
            creditInfoDisplay.style.background = 'var(--color-bg-4)';
            creditInfoDisplay.style.borderLeft = '4px solid var(--color-error)';
            creditInfoDisplay.innerHTML = `<strong style="color: var(--color-error);">❌ Customer "${selectedCustomer.name}" does not have credit enabled!</strong><br><small>Please set a credit limit in customer settings first.</small>`;
            return;
        }

        // Calculate current bill total with proper GST calculation
        let total = calculateBillTotal(currentBill);

        const currentAvailableCredit = (selectedCustomer.credit_limit || 0) - (selectedCustomer.outstanding_balance || 0);
        selectedCustomer.available_credit = currentAvailableCredit;

        if (total > currentAvailableCredit) {
            creditInfoDisplay.style.display = 'block';
            creditInfoDisplay.style.background = 'var(--color-bg-4)';
            creditInfoDisplay.style.borderLeft = '4px solid var(--color-error)';
            creditInfoDisplay.innerHTML = `
                <strong style="color: var(--color-error);">❌ CREDIT LIMIT EXCEEDED!</strong><br>
                <div style="margin-top: 8px; font-size: 13px;">
                    Bill Amount: <strong>₹${total.toFixed(2)}</strong><br>
                    Available Credit: <strong style="color: var(--color-error);">₹${currentAvailableCredit.toFixed(2)}</strong><br>
                    Shortfall: <strong style="color: var(--color-error);">₹${(total - currentAvailableCredit).toFixed(2)}</strong><br><br>
                    Credit Limit: ₹${selectedCustomer.credit_limit.toFixed(2)}<br>
                    Outstanding: ₹${(selectedCustomer.outstanding_balance || 0).toFixed(2)}
                </div>
            `;
        } else {
            creditInfoDisplay.style.display = 'block';
            creditInfoDisplay.style.background = 'var(--color-bg-3)';
            creditInfoDisplay.style.borderLeft = '4px solid var(--color-success)';
            creditInfoDisplay.innerHTML = `
                <strong style="color: var(--color-success);">✓ Credit Payment Approved for ${selectedCustomer.name}</strong><br>
                <div style="margin-top: 8px; font-size: 13px;">
                    Bill Amount: <strong>₹${total.toFixed(2)}</strong><br>
                    Available Credit: <strong style="color: var(--color-success);">₹${currentAvailableCredit.toFixed(2)}</strong><br>
                    Remaining After Sale: <strong style="color: var(--color-success);">₹${(currentAvailableCredit - total).toFixed(2)}</strong><br><br>
                    Credit Limit: ₹${selectedCustomer.credit_limit.toFixed(2)}<br>
                    Outstanding: ₹${(selectedCustomer.outstanding_balance || 0).toFixed(2)}
                </div>
            `;
        }
    } else {
        creditInfoDisplay.style.display = 'none';
        creditInfoDisplay.innerHTML = '';
    }
}

function calculateBillTotal(billItems) {
    let total = 0;
    if (storeInfo.gst_mode === 'inclusive') {
        billItems.forEach(item => {
            total += item.price * item.quantity;
        });
    } else {
        billItems.forEach(item => {
            const itemSubtotal = item.price * item.quantity;
            const itemTax = itemSubtotal * (item.tax_rate / 100);
            total += itemSubtotal + itemTax;
        });
    }
    return total;
}

function completeSale() {
    if (currentBill.length === 0) {
        alert('Please add items to the bill!');
        return;
    }

    // Validate credit payment one more time
    if (selectedPaymentMethod === 'credit') {
        if (!selectedCustomer) {
            alert('❌ Please select a customer for credit payment!');
            return;
        }
        
        if (!selectedCustomer.credit_limit || selectedCustomer.credit_limit === 0) {
            alert('❌ This customer does not have credit enabled!\n\nPlease set a credit limit first or choose a different payment method.');
            return;
        }
        
        const total = calculateBillTotal(currentBill);
        const availableCredit = (selectedCustomer.credit_limit || 0) - (selectedCustomer.outstanding_balance || 0);
        
        if (total > availableCredit) {
            alert(`⚠️ Cannot complete sale!\n\nBill amount (₹${total.toFixed(2)}) exceeds available credit (₹${availableCredit.toFixed(2)}).\n\nShortfall: ₹${(total - availableCredit).toFixed(2)}\n\nPlease reduce the bill amount or choose a different payment method.`);
            return;
        }
    }

    let subtotal = 0;
    let tax = 0;
    let total = 0;

    if (storeInfo.gst_mode === 'inclusive') {
        currentBill.forEach(item => {
            const inclusiveTotal = item.price * item.quantity;
            const basePrice = inclusiveTotal / (1 + (item.tax_rate / 100));
            const itemTax = inclusiveTotal - basePrice;
            
            subtotal += basePrice;
            tax += itemTax;
            total += inclusiveTotal;
        });
    } else {
        currentBill.forEach(item => {
            const itemSubtotal = item.price * item.quantity;
            const itemTax = itemSubtotal * (item.tax_rate / 100);
            
            subtotal += itemSubtotal;
            tax += itemTax;
        });
        total = subtotal + tax;
    }

    // Create transaction
    const now = new Date();
    const transaction = {
        id: transactions.length + 1,
        date: now.toISOString().split('T')[0],
        time: now.toTimeString().split(' ')[0].substring(0, 5),
        customer_id: selectedCustomer ? selectedCustomer.id : null,
        customer_name: selectedCustomer ? selectedCustomer.name : 'Walk-in',
        items: JSON.parse(JSON.stringify(currentBill)),
        subtotal: subtotal,
        tax: tax,
        total: total,
        payment_method: selectedPaymentMethod.charAt(0).toUpperCase() + selectedPaymentMethod.slice(1)
    };

    // Set payment status
    if (selectedPaymentMethod === 'credit') {
        transaction.payment_status = 'outstanding';
    } else {
        transaction.payment_status = 'paid';
    }

    AppState.transactions.push(transaction);
    transactions = AppState.transactions;

    // Update inventory
    AppState.currentBill.forEach(item => {
        const product = AppState.products.find(p => p.id === item.product_id);
        if (product) {
            product.stock -= item.quantity;
        }
    });
    products = AppState.products;

    // Update customer data
    if (selectedCustomer) {
        selectedCustomer.total_purchases += total;
        selectedCustomer.loyalty_points += Math.floor(total / 10);
        selectedCustomer.last_visit = transaction.date;

        // If credit payment, update outstanding balance
        if (selectedPaymentMethod === 'credit') {
            selectedCustomer.outstanding_balance = (selectedCustomer.outstanding_balance || 0) + total;
            selectedCustomer.available_credit = selectedCustomer.credit_limit - selectedCustomer.outstanding_balance;
            selectedCustomer.last_payment_date = selectedCustomer.last_payment_date || transaction.date;

            // Add to customer ledger
            AppState.customerLedger.push({
                id: customerLedger.length + 1,
                customer_id: selectedCustomer.id,
                transaction_type: 'credit_sale',
                date: transaction.date,
                time: transaction.time,
                bill_id: transaction.id,
                debit: total,
                credit: 0,
                balance: selectedCustomer.outstanding_balance,
                description: `Credit Sale - Bill #${transaction.id}`,
                reference: `Invoice #${transaction.id}`,
                payment_method: ''
            });
            customerLedger = AppState.customerLedger;
            
            console.log(`✓ Credit sale completed for ${selectedCustomer.name} - Amount: ₹${total.toFixed(2)}, New Outstanding: ₹${selectedCustomer.outstanding_balance.toFixed(2)}`);
        }
        
        // Update customers array
        const customerIndex = AppState.customers.findIndex(c => c.id === selectedCustomer.id);
        if (customerIndex > -1) {
            AppState.customers[customerIndex] = selectedCustomer;
            customers = AppState.customers;
        }
    }

    // Add to ledger
    AppState.ledgerEntries.push({
        id: ledgerEntries.length + 1,
        date: transaction.date,
        description: `Sale - Invoice #${transaction.id}`,
        type: 'income',
        category: 'Sales',
        amount: total
    });
    ledgerEntries = AppState.ledgerEntries;

    // Save to storage
    saveToLocalStorage();

    // Show receipt
    showReceipt(transaction);

    // Clear bill and sync state
    clearBill();
    renderDashboard();
    renderInventory();
    renderCustomers();
    renderCreditManagement();
    
    console.log(`Sale #${transaction.id} completed successfully - Total: ₹${total.toFixed(2)}, Payment: ${transaction.payment_method}`);
}

function showReceipt(transaction) {
    const receiptContent = document.getElementById('receiptContent');
    const gstMode = storeInfo.gst_mode === 'inclusive' ? 'Inclusive' : 'Exclusive';
    receiptContent.innerHTML = `
        <div class="receipt-header">
            <div class="receipt-title">${storeInfo.name}</div>
            <div>${storeInfo.address}</div>
            <div>Phone: ${storeInfo.phone}</div>
            <div>GST: ${storeInfo.gst_number}</div>
        </div>
        <div style="text-align: center; margin: 16px 0;">
            <strong>INVOICE #${transaction.id}</strong><br>
            ${transaction.date} ${transaction.time}<br>
            Customer: ${transaction.customer_name}<br>
            <small>GST Mode: ${gstMode}</small>
        </div>
        <div class="receipt-items">
            ${transaction.items.map(item => `
                <div class="receipt-item">
                    <div>${item.name} (${item.quantity})</div>
                    <div>₹${(item.price * item.quantity).toFixed(2)}</div>
                </div>
            `).join('')}
        </div>
        <div class="receipt-summary">
            <div class="receipt-row">
                <span>Subtotal ${storeInfo.gst_mode === 'inclusive' ? '(Excl. GST)' : ''}:</span>
                <span>₹${transaction.subtotal.toFixed(2)}</span>
            </div>
            <div class="receipt-row">
                <span>Tax (GST ${gstMode}):</span>
                <span>₹${transaction.tax.toFixed(2)}</span>
            </div>
            <div class="receipt-row total">
                <span>TOTAL:</span>
                <span>₹${transaction.total.toFixed(2)}</span>
            </div>
            <div class="receipt-row" style="margin-top: 12px;">
                <span>Payment Method:</span>
                <span>${transaction.payment_method}</span>
            </div>
        </div>
        <div class="receipt-footer">
            ${storeInfo.receipt_footer}
        </div>
    `;
    
    openModal('receiptModal');
}

function printReceipt() {
    const receiptContent = document.getElementById('receiptContent');
    if (!receiptContent) return;

    const printWindow = window.open('', '', 'width=400,height=600');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Print Receipt</title>
            <style>
                body { 
                    font-family: 'Courier New', monospace; 
                    padding: 10px; 
                    background: white;
                    color: black;
                    max-width: 300px;
                    margin: 0 auto;
                }
                .receipt-header {
                    text-align: center;
                    margin-bottom: 16px;
                    border-bottom: 2px dashed #333;
                    padding-bottom: 16px;
                }
                .receipt-title {
                    font-size: 18px;
                    font-weight: bold;
                    margin-bottom: 8px;
                }
                .receipt-items {
                    margin: 16px 0;
                }
                .receipt-item {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 8px;
                }
                .receipt-summary {
                    border-top: 2px dashed #333;
                    padding-top: 12px;
                    margin-top: 12px;
                }
                .receipt-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 4px;
                }
                .receipt-row.total {
                    font-size: 16px;
                    font-weight: bold;
                    margin-top: 8px;
                }
                .receipt-footer {
                    text-align: center;
                    margin-top: 16px;
                    padding-top: 16px;
                    border-top: 2px dashed #333;
                    font-size: 11px;
                }
                @media print {
                    @page { margin: 0.5cm; size: 80mm auto; }
                    body { margin: 0; }
                }
            </style>
        </head>
        <body>
            ${receiptContent.innerHTML}
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 250);
}

function clearBill() {
    AppState.currentBill = [];
    AppState.selectedCustomer = null;
    AppState.selectedPaymentMethod = 'cash';
    currentBill = AppState.currentBill;
    selectedCustomer = AppState.selectedCustomer;
    selectedPaymentMethod = AppState.selectedPaymentMethod;
    document.getElementById('customerSelect').value = '';
    document.querySelectorAll('.payment-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.payment-btn[data-method="cash"]').classList.add('active');
    renderBillItems();
}

function holdBill() {
    if (currentBill.length === 0) {
        alert('No items to hold!');
        return;
    }
    alert('Bill held successfully! (This is a demo - in production, this would save the bill for later)');
}

// Inventory Functions
function renderInventory() {
    filterInventory();
}

function filterInventory() {
    const searchTerm = document.getElementById('inventorySearch').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const stockFilter = document.getElementById('stockFilter').value;

    let filtered = products;

    if (searchTerm) {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(searchTerm) ||
            p.barcode.includes(searchTerm)
        );
    }

    if (categoryFilter) {
        filtered = filtered.filter(p => p.category === categoryFilter);
    }

    if (stockFilter === 'low') {
        filtered = filtered.filter(p => p.stock <= p.reorder_level);
    } else if (stockFilter === 'out') {
        filtered = filtered.filter(p => p.stock === 0);
    }

    const inventoryTable = document.getElementById('inventoryTable');
    inventoryTable.innerHTML = filtered.map(product => {
        let statusClass = 'success';
        let statusText = 'In Stock';
        
        if (product.stock === 0) {
            statusClass = 'error';
            statusText = 'Out of Stock';
        } else if (product.stock <= product.reorder_level) {
            statusClass = 'warning';
            statusText = 'Low Stock';
        }

        return `
            <tr>
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${product.barcode || 'N/A'}</td>
                <td>₹${product.price.toFixed(2)}</td>
                <td>${product.stock} ${product.unit}</td>
                <td><span class="status status--${statusClass}">${statusText}</span></td>
                <td>
                    <button class="action-btn" onclick="editProduct(${product.id})">Edit</button>
                    <button class="action-btn" onclick="adjustStock(${product.id})">Adjust Stock</button>
                </td>
            </tr>
        `;
    }).join('');
}

function openAddProductModal() {
    AppState.editingProductId = null;
    editingProductId = null;
    document.getElementById('productModalTitle').textContent = 'Add Product';
    document.getElementById('productName').value = '';
    document.getElementById('productBarcode').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productCost').value = '';
    document.getElementById('productStock').value = '';
    document.getElementById('productUnit').value = '';
    document.getElementById('productTaxRate').value = '5';
    document.getElementById('productReorderLevel').value = '10';
    openModal('productModal');
}

function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    AppState.editingProductId = productId;
    editingProductId = productId;
    document.getElementById('productModalTitle').textContent = 'Edit Product';
    document.getElementById('productName').value = product.name;
    document.getElementById('productBarcode').value = product.barcode || '';
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productCost').value = product.cost;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productUnit').value = product.unit;
    document.getElementById('productTaxRate').value = product.tax_rate;
    document.getElementById('productReorderLevel').value = product.reorder_level;
    
    const categorySelect = document.getElementById('productCategory');
    categorySelect.value = product.category;
    
    openModal('productModal');
}

function saveProduct() {
    const name = document.getElementById('productName').value.trim();
    const category = document.getElementById('productCategory').value;
    const barcode = document.getElementById('productBarcode').value.trim();
    const price = parseFloat(document.getElementById('productPrice').value);
    const cost = parseFloat(document.getElementById('productCost').value) || price * 0.8;
    const stock = parseFloat(document.getElementById('productStock').value);
    const unit = document.getElementById('productUnit').value.trim();
    const taxRate = parseFloat(document.getElementById('productTaxRate').value);
    const reorderLevel = parseFloat(document.getElementById('productReorderLevel').value);

    if (!name || !category || isNaN(price) || isNaN(stock)) {
        alert('Please fill all required fields!');
        return;
    }

    if (AppState.editingProductId) {
        const product = AppState.products.find(p => p.id === AppState.editingProductId);
        if (product) {
            product.name = name;
            product.category = category;
            product.barcode = barcode || product.barcode || `AUTO${Date.now()}`;
            product.price = price;
            product.cost = cost;
            product.stock = stock;
            product.unit = unit;
            product.tax_rate = taxRate;
            product.reorder_level = reorderLevel;
            alert('✓ Product updated successfully!');
        }
        products = AppState.products;
    } else {
        AppState.products.push({
            id: products.length + 1,
            name,
            category,
            barcode: barcode || `AUTO${Date.now()}`,
            price,
            cost,
            stock,
            unit,
            tax_rate: taxRate,
            reorder_level: reorderLevel,
            supplier: 'Unknown'
        });
        products = AppState.products;
        alert('✓ Product added successfully!');
    }
    
    AppState.editingProductId = null;
    editingProductId = null;

    saveToLocalStorage();
    closeModal('productModal');
    renderInventory();
    renderBillingProducts();
    renderDashboard();
}

function adjustStock(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    AppState.adjustingProductId = productId;
    adjustingProductId = productId;
    document.getElementById('adjustmentProductInfo').innerHTML = `
        <strong>${product.name}</strong><br>
        Current Stock: <strong>${product.stock} ${product.unit}</strong>
    `;
    document.getElementById('adjustmentType').value = 'add';
    document.getElementById('adjustmentQuantity').value = '';
    document.getElementById('adjustmentReason').value = '';
    
    openModal('stockAdjustmentModal');
}

function saveStockAdjustment() {
    const product = products.find(p => p.id === adjustingProductId);
    if (!product) return;

    const type = document.getElementById('adjustmentType').value;
    const quantity = parseFloat(document.getElementById('adjustmentQuantity').value);
    const reason = document.getElementById('adjustmentReason').value.trim();

    if (isNaN(quantity) || quantity <= 0) {
        alert('Please enter a valid quantity!');
        return;
    }

    if (!reason) {
        alert('Please provide a reason for the adjustment!');
        return;
    }

    const previousStock = product.stock;
    let newStock = previousStock;
    let adjustmentQty = 0;

    if (type === 'add') {
        newStock = previousStock + quantity;
        adjustmentQty = quantity;
    } else if (type === 'remove') {
        newStock = previousStock - quantity;
        adjustmentQty = -quantity;
        if (newStock < 0) {
            alert('Stock cannot be negative!');
            return;
        }
    } else if (type === 'set') {
        newStock = quantity;
        adjustmentQty = quantity - previousStock;
    }

    // Log the adjustment
    const now = new Date();
    AppState.stockAdjustments.push({
        id: stockAdjustments.length + 1,
        id: stockAdjustments.length + 1,
        product_id: adjustingProductId,
        product_name: product.name,
        date: now.toISOString().split('T')[0],
        time: now.toTimeString().split(' ')[0].substring(0, 5),
        previous_stock: previousStock,
        adjustment_quantity: adjustmentQty,
        adjustment_type: type,
        reason: reason,
        new_stock: newStock,
        adjusted_by: 'Admin'
    });
    stockAdjustments = AppState.stockAdjustments;

    // Update product stock
    product.stock = newStock;
    products = AppState.products;

    saveToLocalStorage();
    closeModal('stockAdjustmentModal');
    alert(`✓ Stock adjusted successfully!\n\nProduct: ${product.name}\nPrevious: ${previousStock} ${product.unit}\nAdjustment: ${adjustmentQty > 0 ? '+' : ''}${adjustmentQty}\nNew Stock: ${newStock} ${product.unit}`);
    
    renderInventory();
    renderDashboard();
    renderBillingProducts();
}

function generateBarcodes() {
    openBarcodeModal();
}

function openBarcodeModal() {
    const barcodeProductList = document.getElementById('barcodeProductList');
    barcodeProductList.innerHTML = products.map(product => `
        <div class="barcode-product-item">
            <input type="checkbox" id="barcode-${product.id}" value="${product.id}" checked>
            <div class="barcode-product-info">
                <strong>${product.name}</strong><br>
                <small>Barcode: ${product.barcode} | Price: ₹${product.price.toFixed(2)}</small>
            </div>
        </div>
    `).join('');
    
    openModal('barcodeModal');
}

function generateBarcodePreview() {
    const selectedProducts = [];
    products.forEach(product => {
        const checkbox = document.getElementById(`barcode-${product.id}`);
        if (checkbox && checkbox.checked) {
            selectedProducts.push(product);
        }
    });

    if (selectedProducts.length === 0) {
        alert('Please select at least one product!');
        return;
    }

    const labelSize = document.getElementById('labelSize').value;
    const copies = parseInt(document.getElementById('barcodeCopies').value) || 1;
    const preview = document.getElementById('barcodePreview');
    
    let sizeClass = 'barcode-label-medium';
    if (labelSize === 'small') sizeClass = 'barcode-label-small';
    if (labelSize === 'large') sizeClass = 'barcode-label-large';

    let html = '<h4>Barcode Preview</h4><div style="display: flex; flex-wrap: wrap; gap: 8px;">';
    
    selectedProducts.forEach(product => {
        for (let i = 0; i < copies; i++) {
            html += `
                <div class="barcode-label ${sizeClass}">
                    <div style="font-weight: bold; font-size: 11px; margin-bottom: 4px;">${product.name}</div>
                    <div class="barcode-visual"></div>
                    <div class="barcode-text">${product.barcode}</div>
                    <div class="barcode-price">₹${product.price.toFixed(2)}</div>
                </div>
            `;
        }
    });
    
    html += '</div>';
    preview.innerHTML = html;
}

function printBarcodes() {
    generateBarcodePreview();
    setTimeout(() => {
        const printContent = document.getElementById('barcodePreview').innerHTML;
        const printWindow = window.open('', '', 'width=800,height=600');
        printWindow.document.write(`
            <html>
            <head>
                <title>Print Barcodes</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .barcode-label { display: inline-block; border: 2px solid #333; padding: 12px; margin: 8px; text-align: center; border-radius: 4px; background: white; }
                    .barcode-label-small { width: 150px; font-size: 10px; }
                    .barcode-label-medium { width: 200px; font-size: 11px; }
                    .barcode-label-large { width: 280px; font-size: 12px; }
                    .barcode-visual { height: 40px; background: repeating-linear-gradient(90deg, black, black 2px, white 2px, white 4px); margin: 8px 0; }
                    .barcode-text { font-family: monospace; font-weight: bold; margin: 4px 0; }
                    .barcode-price { font-size: 14px; font-weight: bold; margin: 4px 0; }
                    @media print { .barcode-label { page-break-inside: avoid; } }
                </style>
            </head>
            <body>${printContent}</body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    }, 100);
}

// Customer Functions
function renderCustomers() {
    const customersTable = document.getElementById('customersTable');
    customersTable.innerHTML = customers.map(customer => `
        <tr>
            <td>${customer.id}</td>
            <td>${customer.name}</td>
            <td>${customer.phone}</td>
            <td>${customer.email}</td>
            <td>${customer.loyalty_points}</td>
            <td>₹${customer.total_purchases.toFixed(2)}</td>
            <td>${customer.last_visit}</td>
            <td>
                <button class="action-btn" onclick="viewCustomerDetails(${customer.id})">View</button>
                <button class="action-btn" onclick="editCustomer(${customer.id})">Edit</button>
                <button class="action-btn" onclick="deleteCustomer(${customer.id})" style="color: var(--color-error);">Delete</button>
            </td>
        </tr>
    `).join('');
}

function openAddCustomerModal() {
    AppState.editingCustomerId = null;
    editingCustomerId = null;
    document.getElementById('customerModalTitle').textContent = 'Add Customer';
    document.getElementById('customerName').value = '';
    document.getElementById('customerPhone').value = '';
    document.getElementById('customerEmail').value = '';
    document.getElementById('customerAddress').value = '';
    document.getElementById('customerLoyaltyPoints').value = '0';
    openModal('customerModal');
}

function saveCustomer() {
    const name = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const email = document.getElementById('customerEmail').value.trim();
    const address = document.getElementById('customerAddress').value.trim();
    const loyaltyPoints = parseInt(document.getElementById('customerLoyaltyPoints').value) || 0;
    const creditLimit = parseFloat(document.getElementById('customerCreditLimit').value) || 0;

    if (!name || !phone) {
        alert('Name and phone are required!');
        return;
    }

    if (editingCustomerId) {
        const customer = customers.find(c => c.id === editingCustomerId);
        if (customer) {
            const oldCreditLimit = customer.credit_limit || 0;
            customer.name = name;
            customer.phone = phone;
            customer.email = email;
            customer.address = address;
            customer.loyalty_points = loyaltyPoints;
            customer.credit_limit = creditLimit;
            customer.outstanding_balance = customer.outstanding_balance || 0;
            customer.available_credit = creditLimit - customer.outstanding_balance;
            customer.credit_status = 'active';
            
            if (oldCreditLimit !== creditLimit) {
                alert(`✓ Customer updated successfully!\n\nCredit Limit changed from ₹${oldCreditLimit.toFixed(2)} to ₹${creditLimit.toFixed(2)}\nCurrent Outstanding: ₹${customer.outstanding_balance.toFixed(2)}\nAvailable Credit: ₹${customer.available_credit.toFixed(2)}`);
            } else {
                alert('✓ Customer updated successfully!');
            }
        }
    } else {
        customers.push({
            id: customers.length + 1,
            name,
            phone,
            email,
            address,
            loyalty_points: loyaltyPoints,
            total_purchases: 0,
            last_visit: new Date().toISOString().split('T')[0],
            credit_limit: creditLimit,
            outstanding_balance: 0,
            available_credit: creditLimit,
            last_payment_date: null,
            credit_status: 'active',
            account_status: 'active'
        });
        customers = AppState.customers;
        alert('✓ Customer added successfully!');
    }
    
    AppState.editingCustomerId = null;
    editingCustomerId = null;

    saveToLocalStorage();
    closeModal('customerModal');
    renderCustomers();
    updateCustomerSelect();
    updateLedgerCustomerSelect();
    renderDashboard();
    renderCreditManagement();
}

function viewCustomerDetails(customerId) {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;

    const customerTransactions = transactions.filter(t => t.customer_id === customerId);
    const totalSpent = customerTransactions.reduce((sum, t) => sum + t.total, 0);
    const lastTransaction = customerTransactions.length > 0 ? customerTransactions[customerTransactions.length - 1] : null;

    const detailsContent = document.getElementById('customerDetailsContent');
    detailsContent.innerHTML = `
        <div style="padding: 16px; background: var(--color-bg-1); border-radius: 8px; margin-bottom: 16px;">
            <h3 style="margin-bottom: 12px;">${customer.name}</h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                <div>
                    <strong>Phone:</strong> ${customer.phone}<br>
                    <strong>Email:</strong> ${customer.email || 'N/A'}<br>
                    <strong>Address:</strong> ${customer.address || 'N/A'}
                </div>
                <div>
                    <strong>Loyalty Points:</strong> ${customer.loyalty_points}<br>
                    <strong>Account Status:</strong> <span class="status status--success">Active</span><br>
                    <strong>Last Visit:</strong> ${customer.last_visit}
                </div>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 16px;">
            <div style="padding: 16px; background: var(--color-bg-3); border-radius: 8px;">
                <div style="font-size: 12px; color: var(--color-text-secondary); margin-bottom: 4px;">Total Purchases</div>
                <div style="font-size: 20px; font-weight: bold;">₹${customer.total_purchases.toFixed(2)}</div>
            </div>
            <div style="padding: 16px; background: var(--color-bg-2); border-radius: 8px;">
                <div style="font-size: 12px; color: var(--color-text-secondary); margin-bottom: 4px;">Total Transactions</div>
                <div style="font-size: 20px; font-weight: bold;">${customerTransactions.length}</div>
            </div>
            <div style="padding: 16px; background: var(--color-bg-4); border-radius: 8px;">
                <div style="font-size: 12px; color: var(--color-text-secondary); margin-bottom: 4px;">Average Order</div>
                <div style="font-size: 20px; font-weight: bold;">₹${customerTransactions.length > 0 ? (totalSpent / customerTransactions.length).toFixed(2) : '0.00'}</div>
            </div>
        </div>

        <h4>Recent Transactions</h4>
        ${customerTransactions.length === 0 ? 
            '<p style="text-align: center; color: var(--color-text-secondary); padding: 20px;">No transactions yet</p>' :
            `<table class="data-table">
                <thead>
                    <tr>
                        <th>Bill #</th>
                        <th>Date</th>
                        <th>Items</th>
                        <th>Amount</th>
                        <th>Payment</th>
                    </tr>
                </thead>
                <tbody>
                    ${customerTransactions.slice(-5).reverse().map(t => `
                        <tr>
                            <td>#${t.id}</td>
                            <td>${t.date}</td>
                            <td>${t.items.length}</td>
                            <td>₹${t.total.toFixed(2)}</td>
                            <td>${t.payment_method}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>`
        }
        
        <div style="margin-top: 20px; padding: 16px; background: var(--color-bg-8); border-radius: 8px; border-left: 4px solid var(--color-primary);">
            <strong>💡 Legend:</strong><br>
            <small>
            🛒 Sale = Credit purchase (amount owed)<br>
            💰 Payment = Payment received (amount paid)<br>
            ❌ Cancelled = Bill cancelled (credit reversed)
            </small>
        </div>
    `;
    
    openModal('customerDetailsModal');
}

function editCustomer(customerId) {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;

    AppState.editingCustomerId = customerId;
    editingCustomerId = customerId;
    document.getElementById('customerModalTitle').textContent = 'Edit Customer';
    document.getElementById('customerName').value = customer.name;
    document.getElementById('customerPhone').value = customer.phone;
    document.getElementById('customerEmail').value = customer.email || '';
    document.getElementById('customerAddress').value = customer.address || '';
    document.getElementById('customerLoyaltyPoints').value = customer.loyalty_points;
    document.getElementById('customerCreditLimit').value = customer.credit_limit || 0;
    openModal('customerModal');
}

function deleteCustomer(customerId) {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;

    if (!confirm(`Are you sure you want to delete customer "${customer.name}"?\n\nThis will mark them as deleted but their transaction history will be preserved.`)) {
        return;
    }

    // Mark customer as deleted instead of removing
    customer.deleted = true;
    customer.deleted_date = new Date().toISOString().split('T')[0];

    // Remove from active display
    const index = AppState.customers.findIndex(c => c.id === customerId);
    if (index > -1) {
        AppState.customers.splice(index, 1);
        customers = AppState.customers;
    }

    saveToLocalStorage();
    renderCustomers();
    updateCustomerSelect();
    updateLedgerCustomerSelect();
    renderDashboard();
    alert('✓ Customer deleted successfully!');
}

function updateCustomerSelect() {
    const select = document.getElementById('customerSelect');
    if (!select) return;
    
    const currentValue = select.value;
    select.innerHTML = '<option value="">Walk-in Customer</option>' +
        customers.map(c => {
            const creditInfo = c.credit_limit > 0 ? ` - Credit: ₹${c.available_credit.toFixed(0)}` : '';
            return `<option value="${c.id}">${c.name}${creditInfo}</option>`;
        }).join('');
    select.value = currentValue;
}

// Reports Functions
function setDefaultDates() {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    document.getElementById('reportStartDate').value = weekAgo.toISOString().split('T')[0];
    document.getElementById('reportEndDate').value = today.toISOString().split('T')[0];
}

function changeReportType() {
    // Report type changed, could update filters accordingly
}

function generateReport() {
    const reportType = document.getElementById('reportType').value;
    const startDate = document.getElementById('reportStartDate').value;
    const endDate = document.getElementById('reportEndDate').value;
    const reportContent = document.getElementById('reportContent');

    if (!startDate || !endDate) {
        alert('Please select date range!');
        return;
    }

    const filteredTransactions = transactions.filter(t => 
        t.date >= startDate && t.date <= endDate
    );

    let html = '';

    if (reportType === 'sales') {
        const totalSales = filteredTransactions.reduce((sum, t) => sum + t.total, 0);
        const totalTax = filteredTransactions.reduce((sum, t) => sum + t.tax, 0);
        
        html = `
            <h3>Sales Report</h3>
            <p>Period: ${startDate} to ${endDate}</p>
            <div style="margin: 20px 0;">
                <div style="padding: 12px; background: var(--color-bg-1); border-radius: 8px; margin-bottom: 8px;">
                    <strong>Total Sales:</strong> ₹${totalSales.toFixed(2)}
                </div>
                <div style="padding: 12px; background: var(--color-bg-2); border-radius: 8px; margin-bottom: 8px;">
                    <strong>Total Tax Collected:</strong> ₹${totalTax.toFixed(2)}
                </div>
                <div style="padding: 12px; background: var(--color-bg-3); border-radius: 8px; margin-bottom: 8px;">
                    <strong>Number of Transactions:</strong> ${filteredTransactions.length}
                </div>
                <div style="padding: 12px; background: var(--color-bg-4); border-radius: 8px;">
                    <strong>Average Transaction Value:</strong> ₹${(totalSales / filteredTransactions.length || 0).toFixed(2)}
                </div>
            </div>
            <h4>Transactions</h4>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Invoice #</th>
                        <th>Date</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Payment</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredTransactions.map(t => `
                        <tr>
                            <td>#${t.id}</td>
                            <td>${t.date}</td>
                            <td>${t.customer_name}</td>
                            <td>${t.items.length}</td>
                            <td>₹${t.total.toFixed(2)}</td>
                            <td>${t.payment_method}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } else if (reportType === 'inventory') {
        const totalValue = products.reduce((sum, p) => sum + (p.stock * p.cost), 0);
        const lowStock = products.filter(p => p.stock <= p.reorder_level);
        
        html = `
            <h3>Inventory Report</h3>
            <div style="margin: 20px 0;">
                <div style="padding: 12px; background: var(--color-bg-1); border-radius: 8px; margin-bottom: 8px;">
                    <strong>Total Products:</strong> ${products.length}
                </div>
                <div style="padding: 12px; background: var(--color-bg-2); border-radius: 8px; margin-bottom: 8px;">
                    <strong>Total Inventory Value:</strong> ₹${totalValue.toFixed(2)}
                </div>
                <div style="padding: 12px; background: var(--color-bg-4); border-radius: 8px;">
                    <strong>Low Stock Items:</strong> ${lowStock.length}
                </div>
            </div>
            <h4>Product Stock Levels</h4>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Stock</th>
                        <th>Reorder Level</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${products.map(p => {
                        let status = 'In Stock';
                        if (p.stock <= p.reorder_level) status = 'Low Stock';
                        if (p.stock === 0) status = 'Out of Stock';
                        return `
                        <tr>
                            <td>${p.name}</td>
                            <td>${p.category}</td>
                            <td>${p.stock} ${p.unit}</td>
                            <td>${p.reorder_level}</td>
                            <td>${status}</td>
                        </tr>
                    `;
                    }).join('')}
                </tbody>
            </table>
        `;
    } else if (reportType === 'customer') {
        const topCustomers = [...customers].sort((a, b) => b.total_purchases - a.total_purchases).slice(0, 10);
        
        html = `
            <h3>Customer Report</h3>
            <div style="margin: 20px 0;">
                <div style="padding: 12px; background: var(--color-bg-1); border-radius: 8px; margin-bottom: 8px;">
                    <strong>Total Customers:</strong> ${customers.length}
                </div>
                <div style="padding: 12px; background: var(--color-bg-3); border-radius: 8px;">
                    <strong>Total Loyalty Points Issued:</strong> ${customers.reduce((sum, c) => sum + c.loyalty_points, 0)}
                </div>
            </div>
            <h4>Top Customers</h4>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Total Purchases</th>
                        <th>Loyalty Points</th>
                        <th>Last Visit</th>
                    </tr>
                </thead>
                <tbody>
                    ${topCustomers.map(c => `
                        <tr>
                            <td>${c.name}</td>
                            <td>${c.phone}</td>
                            <td>₹${c.total_purchases.toFixed(2)}</td>
                            <td>${c.loyalty_points}</td>
                            <td>${c.last_visit}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } else if (reportType === 'tax') {
        const totalTax = filteredTransactions.reduce((sum, t) => sum + t.tax, 0);
        
        html = `
            <h3>Tax Report</h3>
            <p>Period: ${startDate} to ${endDate}</p>
            <div style="margin: 20px 0;">
                <div style="padding: 12px; background: var(--color-bg-2); border-radius: 8px; margin-bottom: 8px;">
                    <strong>Total Tax Collected:</strong> ₹${totalTax.toFixed(2)}
                </div>
                <div style="padding: 12px; background: var(--color-bg-1); border-radius: 8px; margin-bottom: 8px;">
                    <strong>Total Sales (with tax):</strong> ₹${filteredTransactions.reduce((sum, t) => sum + t.total, 0).toFixed(2)}
                </div>
                <div style="padding: 12px; background: var(--color-bg-3); border-radius: 8px;">
                    <strong>GST Number:</strong> ${storeInfo.gst_number}
                </div>
            </div>
        `;
    } else if (reportType === 'profit') {
        const revenue = filteredTransactions.reduce((sum, t) => sum + t.total, 0);
        const expenses = ledgerEntries.filter(e => 
            e.type === 'expense' && e.date >= startDate && e.date <= endDate
        ).reduce((sum, e) => sum + e.amount, 0);
        const profit = revenue - expenses;
        
        html = `
            <h3>Profit/Loss Report</h3>
            <p>Period: ${startDate} to ${endDate}</p>
            <div style="margin: 20px 0;">
                <div style="padding: 12px; background: var(--color-bg-3); border-radius: 8px; margin-bottom: 8px;">
                    <strong>Total Revenue:</strong> ₹${revenue.toFixed(2)}
                </div>
                <div style="padding: 12px; background: var(--color-bg-4); border-radius: 8px; margin-bottom: 8px;">
                    <strong>Total Expenses:</strong> ₹${expenses.toFixed(2)}
                </div>
                <div style="padding: 12px; background: ${profit >= 0 ? 'var(--color-bg-3)' : 'var(--color-bg-4)'}; border-radius: 8px;">
                    <strong>Net ${profit >= 0 ? 'Profit' : 'Loss'}:</strong> ₹${Math.abs(profit).toFixed(2)}
                </div>
            </div>
        `;
    }

    reportContent.innerHTML = html;
}

function printReport() {
    window.print();
}

// Ledger Functions
function renderLedger() {
    const revenue = ledgerEntries.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0);
    const expenses = ledgerEntries.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
    const profit = revenue - expenses;

    document.getElementById('totalRevenue').textContent = `₹${revenue.toFixed(2)}`;
    document.getElementById('totalExpenses').textContent = `₹${expenses.toFixed(2)}`;
    document.getElementById('netProfit').textContent = `₹${profit.toFixed(2)}`;

    const ledgerTable = document.getElementById('ledgerTable');
    let balance = 0;
    
    ledgerTable.innerHTML = ledgerEntries.map(entry => {
        if (entry.type === 'income') {
            balance += entry.amount;
        } else {
            balance -= entry.amount;
        }
        
        return `
            <tr>
                <td>${entry.date}</td>
                <td>${entry.description}</td>
                <td><span class="status status--${entry.type === 'income' ? 'success' : 'error'}">${entry.type}</span></td>
                <td>${entry.category}</td>
                <td style="color: ${entry.type === 'income' ? 'var(--color-success)' : 'var(--color-error)'};">
                    ${entry.type === 'income' ? '+' : '-'}₹${entry.amount.toFixed(2)}
                </td>
                <td>₹${balance.toFixed(2)}</td>
            </tr>
        `;
    }).join('');
}

function openAddTransactionModal() {
    alert('Add Transaction feature - In production, this would open a modal to add manual ledger entries.');
}

// Settings Functions
function loadSettingsPage() {
    document.getElementById('storeName').value = storeInfo.name;
    document.getElementById('storeAddress').value = storeInfo.address;
    document.getElementById('storePhone').value = storeInfo.phone;
    document.getElementById('storeEmail').value = storeInfo.email;
    document.getElementById('storeGST').value = storeInfo.gst_number;
    document.getElementById('storeOwner').value = storeInfo.owner;
    document.getElementById('gstMode').value = storeInfo.gst_mode || 'exclusive';
    document.getElementById('defaultTaxRate').value = storeInfo.default_tax_rate;
    document.getElementById('currencySymbol').value = storeInfo.currency_symbol;
    document.getElementById('receiptFooter').value = storeInfo.receipt_footer;
    
    renderCategoriesList();
}

function saveSettings() {
    AppState.storeInfo.name = document.getElementById('storeName').value;
    AppState.storeInfo.address = document.getElementById('storeAddress').value;
    AppState.storeInfo.phone = document.getElementById('storePhone').value;
    AppState.storeInfo.email = document.getElementById('storeEmail').value;
    AppState.storeInfo.gst_number = document.getElementById('storeGST').value;
    AppState.storeInfo.owner = document.getElementById('storeOwner').value;
    AppState.storeInfo.gst_mode = document.getElementById('gstMode').value;
    AppState.storeInfo.default_tax_rate = parseFloat(document.getElementById('defaultTaxRate').value);
    AppState.storeInfo.currency_symbol = document.getElementById('currencySymbol').value;
    AppState.storeInfo.receipt_footer = document.getElementById('receiptFooter').value;
    storeInfo = AppState.storeInfo;

    saveToLocalStorage();
    updateStoreNameDisplay();
    updateBillSummary();
    alert('✓ Settings saved successfully!\n\nGST mode is now: ' + (storeInfo.gst_mode === 'inclusive' ? 'GST Inclusive (tax included in price)' : 'GST Exclusive (tax added on top)'));
}

// Modal Functions
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Category Management Functions
function openCategoryModal() {
    AppState.editingCategoryId = null;
    editingCategoryId = null;
    document.getElementById('categoryModalTitle').textContent = 'Add Category';
    document.getElementById('categoryName').value = '';
    document.getElementById('categoryDescription').value = '';
    openModal('categoryModal');
}

function editCategory(categoryId) {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    AppState.editingCategoryId = categoryId;
    editingCategoryId = categoryId;
    document.getElementById('categoryModalTitle').textContent = 'Edit Category';
    document.getElementById('categoryName').value = category.name;
    document.getElementById('categoryDescription').value = category.description;
    openModal('categoryModal');
}

function saveCategory() {
    const name = document.getElementById('categoryName').value.trim();
    const description = document.getElementById('categoryDescription').value.trim();

    if (!name) {
        alert('Category name is required!');
        return;
    }

    if (AppState.editingCategoryId) {
        const category = AppState.categories.find(c => c.id === AppState.editingCategoryId);
        const oldName = category.name;
        category.name = name;
        category.description = description;
        
        // Update all products with this category
        AppState.products.forEach(p => {
            if (p.category === oldName) {
                p.category = name;
            }
        });
        categories = AppState.categories;
        products = AppState.products;
    } else {
        AppState.categories.push({
            id: AppState.categories.length + 1,
            name,
            description
        });
        categories = AppState.categories;
    }
    
    AppState.editingCategoryId = null;
    editingCategoryId = null;

    saveToLocalStorage();
    closeModal('categoryModal');
    renderCategoriesList();
    populateCategoryFilters();
    renderBillingProducts();
    renderInventory();
    alert('✓ Category saved successfully!');
}

function deleteCategory(categoryId) {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    const productsInCategory = products.filter(p => p.category === category.name);
    if (productsInCategory.length > 0) {
        alert(`Cannot delete category "${category.name}" because it has ${productsInCategory.length} products. Please reassign or delete the products first.`);
        return;
    }

    if (!confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
        return;
    }

    const index = AppState.categories.findIndex(c => c.id === categoryId);
    if (index > -1) {
        AppState.categories.splice(index, 1);
        categories = AppState.categories;
    }

    saveToLocalStorage();
    renderCategoriesList();
    populateCategoryFilters();
    alert('✓ Category deleted successfully!');
}

function renderCategoriesList() {
    const categoriesList = document.getElementById('categoriesList');
    if (!categoriesList) return;

    if (categories.length === 0) {
        categoriesList.innerHTML = '<p style="color: var(--color-text-secondary);">No categories yet. Add one to get started!</p>';
        return;
    }

    categoriesList.innerHTML = categories.map(category => {
        const productCount = products.filter(p => p.category === category.name).length;
        return `
            <div class="category-item">
                <div class="category-info">
                    <div class="category-item-name">${category.name}</div>
                    <div class="category-item-desc">${category.description} (${productCount} products)</div>
                </div>
                <div class="category-actions">
                    <button class="action-btn" onclick="editCategory(${category.id})">Edit</button>
                    <button class="action-btn" onclick="deleteCategory(${category.id})">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

// Populate Category Filters
function populateCategoryFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.innerHTML = '<option value="">All Categories</option>' +
            categories.map(cat => `<option value="${cat.name}">${cat.name}</option>`).join('');
    }
    
    const productCategory = document.getElementById('productCategory');
    if (productCategory) {
        productCategory.innerHTML = categories.map(cat => `<option value="${cat.name}">${cat.name}</option>`).join('');
    }
}

// Bills History Functions
function renderBills() {
    filterBills();
}

function filterBills() {
    const searchTerm = document.getElementById('billSearch').value.toLowerCase();
    let filtered = transactions;

    if (searchTerm) {
        filtered = filtered.filter(t => 
            t.id.toString().includes(searchTerm) ||
            t.customer_name.toLowerCase().includes(searchTerm)
        );
    }

    const billsTable = document.getElementById('billsTable');
    billsTable.innerHTML = filtered.slice().reverse().map(bill => {
        const statusClass = bill.status === 'cancelled' ? 'error' : 'success';
        const statusText = bill.status === 'cancelled' ? 'Cancelled' : (bill.edited ? 'Edited' : 'Completed');
        
        return `
            <tr>
                <td>#${bill.id}</td>
                <td>${bill.date} ${bill.time}</td>
                <td>${bill.customer_name}</td>
                <td>${bill.items.length}</td>
                <td>₹${bill.total.toFixed(2)}</td>
                <td>${bill.payment_method}</td>
                <td><span class="status status--${statusClass}">${statusText}</span></td>
                <td>
                    <button class="action-btn" onclick="viewBillDetails(${bill.id})">View</button>
                    ${bill.status !== 'cancelled' ? `
                        <button class="action-btn" onclick="editBill(${bill.id})">Edit</button>
                        <button class="action-btn" onclick="cancelBill(${bill.id})" style="color: var(--color-error);">Cancel</button>
                    ` : ''}
                </td>
            </tr>
        `;
    }).join('');
}

function viewBillDetails(billId) {
    const bill = transactions.find(t => t.id === billId);
    if (!bill) return;

    const gstMode = storeInfo.gst_mode === 'inclusive' ? 'Inclusive' : 'Exclusive';
    const billDetailsContent = document.getElementById('billDetailsContent');
    
    billDetailsContent.innerHTML = `
        <div style="padding: 16px; background: var(--color-bg-1); border-radius: 8px; margin-bottom: 16px;">
            <strong>Bill #${bill.id}</strong> | ${bill.date} ${bill.time}<br>
            Customer: ${bill.customer_name}<br>
            Payment: ${bill.payment_method} | Status: ${bill.status === 'cancelled' ? '<span style="color: var(--color-error); font-weight: bold;">CANCELLED</span>' : (bill.payment_status === 'outstanding' ? '<span style="color: var(--color-warning); font-weight: bold;">Outstanding</span>' : (bill.edited ? '<span style="color: var(--color-info);">Edited</span>' : '<span style="color: var(--color-success);">Completed</span>'))}<br>
            ${bill.edited ? `<small>Last edited: ${bill.edited_date} ${bill.edited_time}</small><br>` : ''}
            ${bill.status === 'cancelled' ? `<small style="color: var(--color-error); font-weight: bold;">Cancelled on: ${bill.cancelled_date} ${bill.cancelled_time || ''}<br>Cancelled by: ${bill.cancelled_by || 'Admin'}<br>Reason: ${bill.cancel_reason}</small>` : ''}
        </div>
        
        <h4>Items</h4>
        <table class="data-table" style="margin-bottom: 16px;">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Tax Rate</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${bill.items.map(item => `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>₹${item.price.toFixed(2)}</td>
                        <td>${item.tax_rate}%</td>
                        <td>₹${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        
        <div style="padding: 16px; background: var(--color-bg-3); border-radius: 8px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>Subtotal ${gstMode === 'Inclusive' ? '(Excl. GST)' : ''}:</span>
                <strong>₹${bill.subtotal.toFixed(2)}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>Tax (GST ${gstMode}):</span>
                <strong>₹${bill.tax.toFixed(2)}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 18px; padding-top: 12px; border-top: 2px solid var(--color-border);">
                <strong>TOTAL:</strong>
                <strong>₹${bill.total.toFixed(2)}</strong>
            </div>
        </div>
    `;
    
    openModal('billDetailsModal');
}

function printBillFromModal() {
    const billDetailsContent = document.getElementById('billDetailsContent');
    if (!billDetailsContent) return;

    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Print Bill</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    padding: 20px; 
                    background: white;
                    color: black;
                }
                table { 
                    width: 100%; 
                    border-collapse: collapse; 
                    margin: 20px 0;
                }
                th, td { 
                    padding: 12px; 
                    text-align: left; 
                    border-bottom: 1px solid #ddd; 
                }
                th { 
                    background: #f5f5f5; 
                    font-weight: bold;
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                    border-bottom: 2px solid #333;
                    padding-bottom: 20px;
                }
                .summary {
                    margin-top: 20px;
                    padding: 16px;
                    background: #f9f9f9;
                    border-radius: 8px;
                }
                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 8px;
                }
                .total {
                    font-size: 18px;
                    font-weight: bold;
                    padding-top: 12px;
                    border-top: 2px solid #333;
                    margin-top: 8px;
                }
                @media print {
                    @page { margin: 1cm; }
                    body { margin: 0; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h2>${storeInfo.name}</h2>
                <p>${storeInfo.address}</p>
                <p>Phone: ${storeInfo.phone} | GST: ${storeInfo.gst_number}</p>
            </div>
            ${billDetailsContent.innerHTML}
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 250);
}

function editBill(billId) {
    const bill = transactions.find(t => t.id === billId);
    if (!bill) return;

    AppState.editingBillId = billId;
    AppState.editBillItems = JSON.parse(JSON.stringify(bill.items));
    editingBillId = billId;
    editBillItems = AppState.editBillItems;

    const editBillInfo = document.getElementById('editBillInfo');
    editBillInfo.innerHTML = `
        <strong>Editing Bill #${bill.id}</strong><br>
        Date: ${bill.date} ${bill.time} | Customer: ${bill.customer_name}<br>
        Original Total: ₹${bill.total.toFixed(2)}
    `;

    // Populate product select
    const productSelect = document.getElementById('editBillProductSelect');
    productSelect.innerHTML = '<option value="">-- Select Product --</option>' +
        products.map(p => `<option value="${p.id}">${p.name} - ₹${p.price.toFixed(2)}</option>`).join('');

    renderEditBillItems();
    openModal('editBillModal');
}

function renderEditBillItems() {
    const editBillItemsDiv = document.getElementById('editBillItems');
    
    if (editBillItems.length === 0) {
        editBillItemsDiv.innerHTML = '<p style="text-align: center; color: var(--color-text-secondary); padding: 20px;">No items in bill</p>';
    } else {
        editBillItemsDiv.innerHTML = `
            <h4>Bill Items</h4>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${editBillItems.map((item, index) => `
                        <tr>
                            <td>${item.name}</td>
                            <td>
                                <button class="qty-btn" onclick="updateEditBillQuantity(${index}, -1)">-</button>
                                <span style="margin: 0 8px;">${item.quantity}</span>
                                <button class="qty-btn" onclick="updateEditBillQuantity(${index}, 1)">+</button>
                            </td>
                            <td>₹${item.price.toFixed(2)}</td>
                            <td>₹${(item.price * item.quantity).toFixed(2)}</td>
                            <td>
                                <button class="action-btn" onclick="removeEditBillItem(${index})" style="color: var(--color-error);">Remove</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    updateEditBillSummary();
}

function updateEditBillQuantity(index, change) {
    const item = editBillItems[index];
    const newQuantity = item.quantity + change;
    
    if (newQuantity <= 0) {
        removeEditBillItem(index);
        return;
    }
    
    AppState.editBillItems[index].quantity = newQuantity;
    editBillItems = AppState.editBillItems;
    renderEditBillItems();
}

function removeEditBillItem(index) {
    if (editBillItems.length === 1) {
        alert('❌ Cannot remove the last item. Cancel the bill instead if needed.');
        return;
    }
    AppState.editBillItems.splice(index, 1);
    editBillItems = AppState.editBillItems;
    renderEditBillItems();
}

function addItemToEditBill() {
    const productId = parseInt(document.getElementById('editBillProductSelect').value);
    if (!productId) {
        alert('Please select a product!');
        return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = editBillItems.find(item => item.product_id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        AppState.editBillItems.push({
            product_id: productId,
            name: product.name,
            price: product.price,
            quantity: 1,
            tax_rate: product.tax_rate
        });
        editBillItems = AppState.editBillItems;
    }

    document.getElementById('editBillProductSelect').value = '';
    renderEditBillItems();
}

function updateEditBillSummary() {
    let subtotal = 0;
    let tax = 0;
    let total = 0;

    if (storeInfo.gst_mode === 'inclusive') {
        editBillItems.forEach(item => {
            const inclusiveTotal = item.price * item.quantity;
            const basePrice = inclusiveTotal / (1 + (item.tax_rate / 100));
            const itemTax = inclusiveTotal - basePrice;
            subtotal += basePrice;
            tax += itemTax;
            total += inclusiveTotal;
        });
    } else {
        editBillItems.forEach(item => {
            const itemSubtotal = item.price * item.quantity;
            const itemTax = itemSubtotal * (item.tax_rate / 100);
            subtotal += itemSubtotal;
            tax += itemTax;
        });
        total = subtotal + tax;
    }

    const bill = transactions.find(t => t.id === editingBillId);
    const editBillSummary = document.getElementById('editBillSummary');
    editBillSummary.innerHTML = `
        <h4>Bill Summary</h4>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>Subtotal:</span>
            <strong>₹${subtotal.toFixed(2)}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>Tax:</span>
            <strong>₹${tax.toFixed(2)}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 18px; padding-top: 12px; border-top: 2px solid var(--color-border);">
            <strong>New Total:</strong>
            <strong>₹${total.toFixed(2)}</strong>
        </div>
        <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--color-border);">
            <div style="display: flex; justify-content: space-between;">
                <span>Original Total:</span>
                <span>₹${bill.total.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; color: ${total > bill.total ? 'var(--color-error)' : 'var(--color-success)'}; font-weight: bold;">
                <span>Difference:</span>
                <span>${total > bill.total ? '+' : ''}₹${(total - bill.total).toFixed(2)}</span>
            </div>
        </div>
    `;
}

function saveEditedBill() {
    const bill = transactions.find(t => t.id === editingBillId);
    if (!bill) return;

    if (editBillItems.length === 0) {
        alert('Bill must have at least one item!');
        return;
    }

    if (!confirm('Are you sure you want to save these changes to the bill?')) {
        return;
    }

    // Restore inventory from original bill
    bill.items.forEach(item => {
        const product = products.find(p => p.id === item.product_id);
        if (product) {
            product.stock += item.quantity;
        }
    });

    // Calculate new totals
    let subtotal = 0;
    let tax = 0;
    let total = 0;

    if (storeInfo.gst_mode === 'inclusive') {
        editBillItems.forEach(item => {
            const inclusiveTotal = item.price * item.quantity;
            const basePrice = inclusiveTotal / (1 + (item.tax_rate / 100));
            const itemTax = inclusiveTotal - basePrice;
            subtotal += basePrice;
            tax += itemTax;
            total += inclusiveTotal;
        });
    } else {
        editBillItems.forEach(item => {
            const itemSubtotal = item.price * item.quantity;
            const itemTax = itemSubtotal * (item.tax_rate / 100);
            subtotal += itemSubtotal;
            tax += itemTax;
        });
        total = subtotal + tax;
    }

    // Update bill
    const now = new Date();
    bill.items = JSON.parse(JSON.stringify(AppState.editBillItems));
    bill.subtotal = subtotal;
    bill.tax = tax;
    bill.total = total;
    bill.edited = true;
    bill.edited_date = now.toISOString().split('T')[0];
    bill.edited_time = now.toTimeString().split(' ')[0].substring(0, 5);

    // Deduct inventory for edited bill
    bill.items.forEach(item => {
        const product = AppState.products.find(p => p.id === item.product_id);
        if (product) {
            product.stock -= item.quantity;
        }
    });

    // Update customer purchases if applicable
    if (bill.customer_id) {
        const customer = AppState.customers.find(c => c.id === bill.customer_id);
        if (customer) {
            // Recalculate total purchases
            const customerTransactions = AppState.transactions.filter(t => t.customer_id === bill.customer_id && t.status !== 'cancelled');
            customer.total_purchases = customerTransactions.reduce((sum, t) => sum + t.total, 0);
        }
    }

    // Update ledger
    const ledgerEntry = AppState.ledgerEntries.find(e => e.description.includes(`Invoice #${bill.id}`));
    if (ledgerEntry) {
        ledgerEntry.amount = total;
        ledgerEntry.description = `Sale - Invoice #${bill.id} (Edited)`;
    }

    AppState.editingBillId = null;
    AppState.editBillItems = [];
    editingBillId = null;
    editBillItems = [];
    products = AppState.products;
    customers = AppState.customers;
    transactions = AppState.transactions;
    ledgerEntries = AppState.ledgerEntries;
    
    saveToLocalStorage();
    closeModal('editBillModal');
    renderBills();
    renderInventory();
    renderDashboard();
    alert('✓ Bill updated successfully!\n\nInventory has been adjusted accordingly.');
}

function cancelBill(billId) {
    const bill = transactions.find(t => t.id === billId);
    if (!bill) {
        alert('❌ Bill not found!');
        return;
    }

    if (bill.status === 'cancelled') {
        alert('❌ This bill is already cancelled!');
        return;
    }

    const reason = prompt('Please enter the reason for cancelling this bill:');
    if (!reason || reason.trim() === '') {
        alert('❌ Cancellation reason is required!');
        return;
    }

    const isCredit = bill.payment_method === 'Credit' && bill.payment_status === 'outstanding';
    const confirmMessage = `Are you sure you want to cancel Bill #${billId}?\n\nBill Details:\n- Date: ${bill.date} ${bill.time}\n- Customer: ${bill.customer_name}\n- Amount: ₹${bill.total.toFixed(2)}\n- Payment: ${bill.payment_method}\n\nThis will:\n✓ Restore inventory for all items\n✓ Mark the bill as cancelled${isCredit ? `\n✓ Reduce customer outstanding balance by ₹${bill.total.toFixed(2)}\n✓ Update customer credit ledger` : ''}\n\nThis action cannot be undone.`;
    
    if (!confirm(confirmMessage)) {
        return;
    }

    const now = new Date();
    const cancelDate = now.toISOString().split('T')[0];
    const cancelTime = now.toTimeString().split(' ')[0].substring(0, 5);

    // Restore inventory
    let inventoryRestored = [];
    bill.items.forEach(item => {
        const product = AppState.products.find(p => p.id === item.product_id);
        if (product) {
            const oldStock = product.stock;
            product.stock += item.quantity;
            inventoryRestored.push(`${item.name}: ${oldStock} → ${product.stock}`);
            console.log(`✓ Restored ${item.quantity} units of ${item.name} (${oldStock} → ${product.stock})`);
        }
    });

    // Mark bill as cancelled
    bill.status = 'cancelled';
    bill.cancelled_date = cancelDate;
    bill.cancelled_time = cancelTime;
    bill.cancel_reason = reason.trim();
    bill.cancelled_by = 'Admin';

    // Update customer data
    let creditReversed = false;
    let customerName = bill.customer_name;
    if (bill.customer_id) {
        const customer = AppState.customers.find(c => c.id === bill.customer_id);
        if (customer) {
            // Update total purchases
            customer.total_purchases = Math.max(0, customer.total_purchases - bill.total);
            customer.loyalty_points = Math.max(0, customer.loyalty_points - Math.floor(bill.total / 10));
            
            // If this was a credit sale, reduce outstanding balance
            if (bill.payment_method === 'Credit' && bill.payment_status === 'outstanding') {
                const oldBalance = customer.outstanding_balance || 0;
                customer.outstanding_balance = Math.max(0, oldBalance - bill.total);
                customer.available_credit = (customer.credit_limit || 0) - customer.outstanding_balance;
                creditReversed = true;
                
                // Add cancellation entry to customer ledger
                AppState.customerLedger.push({
                    id: AppState.customerLedger.length + 1,
                    customer_id: customer.id,
                    transaction_type: 'cancellation',
                    date: cancelDate,
                    time: cancelTime,
                    bill_id: bill.id,
                    debit: 0,
                    credit: bill.total,
                    balance: customer.outstanding_balance,
                    description: `Bill #${bill.id} Cancelled - ${reason.trim()}`,
                    reference: `Cancellation #${bill.id}`,
                    payment_method: ''
                });
                customerLedger = AppState.customerLedger;
                
                // Update bill payment status
                bill.payment_status = 'cancelled';
                
                console.log(`✓ Credit reversed for ${customer.name}: ₹${oldBalance.toFixed(2)} → ₹${customer.outstanding_balance.toFixed(2)}`);
            }
        }
    }

    // Update general ledger
    AppState.ledgerEntries.push({
        id: AppState.ledgerEntries.length + 1,
        date: cancelDate,
        description: `Bill #${bill.id} Cancelled - ${reason}`,
        type: 'expense',
        category: 'Refund/Cancellation',
        amount: bill.total
    });
    ledgerEntries = AppState.ledgerEntries;
    customers = AppState.customers;
    products = AppState.products;
    transactions = AppState.transactions;
    customerLedger = AppState.customerLedger;

    saveToLocalStorage();
    renderBills();
    renderInventory();
    renderDashboard();
    renderLedger();
    renderCreditManagement();
    
    // Reload customer ledger if on that page
    const ledgerCustomerSelect = document.getElementById('ledgerCustomerSelect');
    if (ledgerCustomerSelect && ledgerCustomerSelect.value) {
        loadCustomerLedger();
    }
    
    // Build success message
    let successMsg = `✓ Bill #${billId} CANCELLED SUCCESSFULLY!\n\nBill Details:\n- Customer: ${customerName}\n- Amount: ₹${bill.total.toFixed(2)}\n- Date: ${bill.date} ${bill.time}\n\nReason: ${reason}\n\nActions Completed:`;
    successMsg += `\n✓ Inventory restored for ${bill.items.length} items`;
    
    if (creditReversed) {
        const customer = AppState.customers.find(c => c.id === bill.customer_id);
        successMsg += `\n✓ Customer outstanding reduced by ₹${bill.total.toFixed(2)}`;
        if (customer) {
            successMsg += `\n✓ New outstanding balance: ₹${customer.outstanding_balance.toFixed(2)}`;
            successMsg += `\n✓ Available credit: ₹${customer.available_credit.toFixed(2)}`;
        }
        successMsg += `\n✓ Ledger entry created`;
    }
    successMsg += `\n✓ Bill marked as cancelled`;
    
    alert(successMsg);
    
    console.log(`✓ Bill #${billId} cancelled successfully by Admin at ${cancelDate} ${cancelTime}`);
}

// Customer Ledger Functions
function renderCustomerLedgerPage() {
    updateLedgerCustomerSelect();
    setLedgerDefaultDates();
}

function updateLedgerCustomerSelect() {
    const select = document.getElementById('ledgerCustomerSelect');
    if (!select) return;
    
    select.innerHTML = '<option value="">-- Select a Customer --</option>' +
        customers.map(c => {
            const outstanding = c.outstanding_balance > 0 ? ` - Owes: ₹${c.outstanding_balance.toFixed(0)}` : '';
            return `<option value="${c.id}">${c.name}${outstanding}</option>`;
        }).join('');
}

function setLedgerDefaultDates() {
    const today = new Date();
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    const startDateInput = document.getElementById('ledgerStartDate');
    const endDateInput = document.getElementById('ledgerEndDate');
    
    if (startDateInput) startDateInput.value = monthAgo.toISOString().split('T')[0];
    if (endDateInput) endDateInput.value = today.toISOString().split('T')[0];
}

function loadCustomerLedger() {
    const ledgerCustomerSelect = document.getElementById('ledgerCustomerSelect');
    if (!ledgerCustomerSelect) return;
    
    const customerId = parseInt(ledgerCustomerSelect.value);
    if (!customerId) {
        const customerLedgerContent = document.getElementById('customerLedgerContent');
        if (customerLedgerContent) {
            customerLedgerContent.innerHTML = '<p style="text-align: center; color: var(--color-text-secondary); padding: 40px;">Please select a customer to view their ledger</p>';
        }
        return;
    }

    const customer = customers.find(c => c.id === customerId);
    if (!customer) {
        document.getElementById('customerLedgerContent').innerHTML = '<p style="text-align: center; color: var(--color-error); padding: 40px;">Customer not found</p>';
        return;
    }

    const startDate = document.getElementById('ledgerStartDate').value;
    const endDate = document.getElementById('ledgerEndDate').value;
    
    if (!startDate || !endDate) {
        alert('Please select both start and end dates');
        return;
    }

    // Get customer ledger entries
    const customerLedgerEntries = customerLedger.filter(l => 
        l.customer_id === customerId &&
        l.date >= startDate &&
        l.date <= endDate
    );

    // Build ledger rows with running balance
    const ledgerRows = customerLedgerEntries.map(entry => ({
        date: entry.date,
        time: entry.time,
        type: entry.transaction_type,
        description: entry.description,
        reference: entry.reference,
        bill_id: entry.bill_id,
        debit: entry.debit || 0,
        credit: entry.credit || 0,
        balance: entry.balance,
        payment_method: entry.payment_method
    }));

    const totalDebit = ledgerRows.reduce((sum, row) => sum + row.debit, 0);
    const totalCredit = ledgerRows.reduce((sum, row) => sum + row.credit, 0);
    const outstandingBalance = customer.outstanding_balance || 0;

    const content = document.getElementById('customerLedgerContent');
    if (!content) return;
    
    content.innerHTML = `
        <div style="padding: 16px; background: var(--color-bg-1); border-radius: 8px; margin-bottom: 16px;">
            <h3 style="margin-bottom: 12px;">${customer.name}</h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                <div>
                    <strong>Phone:</strong> ${customer.phone}<br>
                    <strong>Email:</strong> ${customer.email || 'N/A'}<br>
                    <strong>Address:</strong> ${customer.address || 'N/A'}
                </div>
                <div>
                    <strong>Loyalty Points:</strong> ${customer.loyalty_points}<br>
                    <strong>Total Purchases:</strong> ₹${customer.total_purchases.toFixed(2)}<br>
                    <strong>Last Visit:</strong> ${customer.last_visit}
                </div>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin-bottom: 16px;">
            <div style="padding: 16px; background: var(--color-bg-3); border-radius: 8px;">
                <div style="font-size: 12px; color: var(--color-text-secondary); margin-bottom: 4px;">Total Sales Amount</div>
                <div style="font-size: 18px; font-weight: bold;">₹${totalDebit.toFixed(2)}</div>
            </div>
            <div style="padding: 16px; background: var(--color-bg-1); border-radius: 8px;">
                <div style="font-size: 12px; color: var(--color-text-secondary); margin-bottom: 4px;">Total Payments</div>
                <div style="font-size: 18px; font-weight: bold;">₹${totalCredit.toFixed(2)}</div>
            </div>
            <div style="padding: 16px; background: var(--color-bg-4); border-radius: 8px;">
                <div style="font-size: 12px; color: var(--color-text-secondary); margin-bottom: 4px;">Outstanding Balance</div>
                <div style="font-size: 18px; font-weight: bold; color: var(--color-error);">₹${outstandingBalance.toFixed(2)}</div>
            </div>
            <div style="padding: 16px; background: var(--color-bg-2); border-radius: 8px;">
                <div style="font-size: 12px; color: var(--color-text-secondary); margin-bottom: 4px;">Credit Limit</div>
                <div style="font-size: 18px; font-weight: bold;">₹${(customer.credit_limit || 0).toFixed(2)}</div>
            </div>
            <div style="padding: 16px; background: var(--color-bg-5); border-radius: 8px;">
                <div style="font-size: 12px; color: var(--color-text-secondary); margin-bottom: 4px;">Available Credit</div>
                <div style="font-size: 18px; font-weight: bold; color: var(--color-success);">₹${(customer.available_credit || 0).toFixed(2)}</div>
            </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h4 style="margin: 0;">Transaction History (${startDate} to ${endDate})</h4>
            ${outstandingBalance > 0 ? `<button class="btn btn--primary" onclick="openReceivePayment(${customerId})">💰 Receive Payment</button>` : '<span class="status status--success">✓ No Outstanding Balance</span>'}
        </div>
        ${ledgerRows.length === 0 ? 
            '<p style="text-align: center; color: var(--color-text-secondary); padding: 20px;">No transactions found for this period</p>' :
            `<table class="data-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Type</th>
                        <th>Description</th>
                        <th>Reference</th>
                        <th>Debit (Owed)</th>
                        <th>Credit (Payment)</th>
                        <th>Balance</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${ledgerRows.map(row => `
                        <tr>
                            <td>${row.date}</td>
                            <td>${row.time}</td>
                            <td><span class="status status--${row.type === 'credit_sale' ? 'warning' : row.type === 'payment' ? 'success' : 'error'}">${row.type === 'credit_sale' ? 'Credit Sale' : row.type === 'payment' ? 'Payment' : row.type}</span></td>
                            <td>${row.description}</td>
                            <td>${row.reference || '-'}</td>
                            <td style="color: var(--color-error); font-weight: ${row.debit > 0 ? 'bold' : 'normal'};">${row.debit > 0 ? '₹' + row.debit.toFixed(2) : '-'}</td>
                            <td style="color: var(--color-success); font-weight: ${row.credit > 0 ? 'bold' : 'normal'};">${row.credit > 0 ? '₹' + row.credit.toFixed(2) : '-'}</td>
                            <td><strong>₹${row.balance.toFixed(2)}</strong></td>
                            <td>
                                ${row.bill_id ? `<button class="action-btn" onclick="viewBillDetails(${row.bill_id})">View Bill</button>` : '-'}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>`
        }
    `;
}

function printCustomerLedger() {
    const customerId = parseInt(document.getElementById('ledgerCustomerSelect').value);
    if (!customerId) {
        alert('Please select a customer first!');
        return;
    }

    const customer = customers.find(c => c.id === customerId);
    const ledgerContent = document.getElementById('customerLedgerContent');
    if (!customer || !ledgerContent) return;

    const printWindow = window.open('', '', 'width=900,height=700');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Customer Ledger - ${customer.name}</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    padding: 20px; 
                    background: white;
                    color: black;
                }
                h3, h4 { margin-top: 20px; }
                table { 
                    width: 100%; 
                    border-collapse: collapse; 
                    margin: 20px 0;
                }
                th, td { 
                    padding: 10px; 
                    text-align: left; 
                    border-bottom: 1px solid #ddd; 
                }
                th { 
                    background: #f5f5f5; 
                    font-weight: bold;
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                    border-bottom: 2px solid #333;
                    padding-bottom: 20px;
                }
                @media print {
                    @page { margin: 1cm; }
                    body { margin: 0; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h2>${storeInfo.name}</h2>
                <p>${storeInfo.address}</p>
                <h3>Customer Ledger</h3>
            </div>
            ${ledgerContent.innerHTML}
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 12px;">
                <p>Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 250);
}

// Credit Management Functions
function renderCreditManagement() {
    const customersWithCredit = customers.filter(c => c.credit_limit > 0);
    const totalCreditExtended = customersWithCredit.reduce((sum, c) => sum + c.credit_limit, 0);
    const totalOutstanding = customersWithCredit.reduce((sum, c) => sum + (c.outstanding_balance || 0), 0);

    document.getElementById('totalCreditExtended').textContent = `₹${totalCreditExtended.toFixed(2)}`;
    document.getElementById('totalOutstanding').textContent = `₹${totalOutstanding.toFixed(2)}`;
    document.getElementById('customersOnCredit').textContent = customersWithCredit.filter(c => c.outstanding_balance > 0).length;

    const creditTable = document.getElementById('creditManagementTable');
    if (customersWithCredit.length === 0) {
        creditTable.innerHTML = '<tr><td colspan="8" style="text-align: center; color: var(--color-text-secondary); padding: 40px;">No customers with credit enabled</td></tr>';
        return;
    }

    creditTable.innerHTML = customersWithCredit.map(customer => {
        let statusClass = 'success';
        let statusText = 'Good';
        const utilization = customer.credit_limit > 0 ? (customer.outstanding_balance / customer.credit_limit) * 100 : 0;

        if (utilization > 90) {
            statusClass = 'error';
            statusText = 'Exceeded';
        } else if (utilization > 70) {
            statusClass = 'warning';
            statusText = 'Caution';
        }

        return `
            <tr>
                <td>${customer.name}</td>
                <td>${customer.phone}</td>
                <td style="font-weight: bold; color: ${customer.outstanding_balance > 0 ? 'var(--color-error)' : 'var(--color-text)'}">₹${(customer.outstanding_balance || 0).toFixed(2)}</td>
                <td>₹${customer.credit_limit.toFixed(2)}</td>
                <td>₹${(customer.available_credit || 0).toFixed(2)}</td>
                <td>${customer.last_payment_date || 'Never'}</td>
                <td><span class="status status--${statusClass}">${statusText}</span></td>
                <td>
                    ${customer.outstanding_balance > 0 ? `<button class="action-btn" onclick="openReceivePayment(${customer.id})">Receive Payment</button>` : ''}
                    <button class="action-btn" onclick="viewCustomerDetails(${customer.id})">View</button>
                    <button class="action-btn" onclick="editCustomer(${customer.id})">Edit Limit</button>
                </td>
            </tr>
        `;
    }).join('');
}

function openReceivePayment(customerId) {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;

    AppState.receivingPaymentForCustomerId = customerId;
    receivingPaymentForCustomerId = customerId;
    document.getElementById('paymentCustomerInfo').innerHTML = `
        <strong>${customer.name}</strong> (${customer.phone})<br>
        Outstanding Balance: <strong style="color: var(--color-error);">₹${(customer.outstanding_balance || 0).toFixed(2)}</strong><br>
        Credit Limit: ₹${customer.credit_limit.toFixed(2)}
    `;
    document.getElementById('paymentAmount').value = (customer.outstanding_balance || 0).toFixed(2);
    document.getElementById('paymentMethodSelect').value = 'Cash';
    document.getElementById('paymentRemarks').value = '';
    openModal('receivePaymentModal');
}

function savePayment() {
    const customer = customers.find(c => c.id === receivingPaymentForCustomerId);
    if (!customer) return;

    const amount = parseFloat(document.getElementById('paymentAmount').value);
    const paymentMethod = document.getElementById('paymentMethodSelect').value;
    const remarks = document.getElementById('paymentRemarks').value.trim();

    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid payment amount!');
        return;
    }

    if (amount > (customer.outstanding_balance || 0)) {
        if (!confirm(`Payment amount (₹${amount.toFixed(2)}) exceeds outstanding balance (₹${(customer.outstanding_balance || 0).toFixed(2)}).\n\nDo you want to proceed?`)) {
            return;
        }
    }

    const now = new Date();
    const paymentDate = now.toISOString().split('T')[0];
    const paymentTime = now.toTimeString().split(' ')[0].substring(0, 5);

    // Update customer balance
    const previousBalance = customer.outstanding_balance || 0;
    customer.outstanding_balance = Math.max(0, previousBalance - amount);
    customer.available_credit = (customer.credit_limit || 0) - customer.outstanding_balance;
    customer.last_payment_date = paymentDate;
    customers = AppState.customers;

    // Add to customer ledger
    const receiptNumber = AppState.customerLedger.filter(l => l.transaction_type === 'payment').length + 1;
    AppState.customerLedger.push({
        id: customerLedger.length + 1,
        customer_id: customer.id,
        transaction_type: 'payment',
        date: paymentDate,
        time: paymentTime,
        bill_id: null,
        debit: 0,
        credit: amount,
        balance: customer.outstanding_balance,
        description: remarks || 'Payment Received',
        reference: `Payment Receipt #${receiptNumber}`,
        payment_method: paymentMethod
    });
    customerLedger = AppState.customerLedger;

    // Add to general ledger
    AppState.ledgerEntries.push({
        id: ledgerEntries.length + 1,
        date: paymentDate,
        description: `Payment from ${customer.name} - ${remarks || 'Credit payment'}`,
        type: 'income',
        category: 'Payment Received',
        amount: amount
    });
    ledgerEntries = AppState.ledgerEntries;

    // Update bill statuses if applicable
    const customerCreditBills = AppState.transactions.filter(t => t.customer_id === customer.id && t.payment_status === 'outstanding');
    if (customer.outstanding_balance === 0 && customerCreditBills.length > 0) {
        customerCreditBills.forEach(bill => {
            bill.payment_status = 'paid';
        });
    }

    AppState.receivingPaymentForCustomerId = null;
    receivingPaymentForCustomerId = null;
    
    saveToLocalStorage();
    closeModal('receivePaymentModal');
    alert(`✓ Payment received successfully!\n\nCustomer: ${customer.name}\nAmount Received: ₹${amount.toFixed(2)}\nPayment Method: ${paymentMethod}\n\nPrevious Balance: ₹${previousBalance.toFixed(2)}\nNew Balance: ₹${customer.outstanding_balance.toFixed(2)}\nAvailable Credit: ₹${customer.available_credit.toFixed(2)}`);
    
    renderCreditManagement();
    renderDashboard();
    renderCustomers();
    renderBills();
    loadCustomerLedger();
}

function generateCreditReport() {
    const customersWithCredit = customers.filter(c => c.credit_limit > 0);
    const totalCreditExtended = customersWithCredit.reduce((sum, c) => sum + c.credit_limit, 0);
    const totalOutstanding = customersWithCredit.reduce((sum, c) => sum + (c.outstanding_balance || 0), 0);
    const creditSales = transactions.filter(t => t.payment_method === 'Credit');
    const totalCreditSales = creditSales.reduce((sum, t) => sum + t.total, 0);

    const reportWindow = window.open('', '', 'width=900,height=700');
    reportWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Credit Report</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h2 { text-align: center; margin-bottom: 30px; }
                .summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; }
                .summary-card { padding: 20px; background: #f5f5f5; border-radius: 8px; }
                .summary-card h3 { margin: 0 0 10px 0; font-size: 14px; color: #666; }
                .summary-card .value { font-size: 24px; font-weight: bold; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
                th { background: #f5f5f5; font-weight: bold; }
                @media print { @page { margin: 1cm; } }
            </style>
        </head>
        <body>
            <h2>${storeInfo.name} - Credit Management Report</h2>
            <p style="text-align: center; margin-bottom: 30px;">Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
            
            <div class="summary">
                <div class="summary-card">
                    <h3>Total Credit Extended</h3>
                    <div class="value">₹${totalCreditExtended.toFixed(2)}</div>
                </div>
                <div class="summary-card">
                    <h3>Total Outstanding</h3>
                    <div class="value" style="color: #c0152f;">₹${totalOutstanding.toFixed(2)}</div>
                </div>
                <div class="summary-card">
                    <h3>Total Credit Sales</h3>
                    <div class="value">₹${totalCreditSales.toFixed(2)}</div>
                </div>
            </div>

            <h3>Customers with Outstanding Credit</h3>
            <table>
                <thead>
                    <tr>
                        <th>Customer</th>
                        <th>Credit Limit</th>
                        <th>Outstanding</th>
                        <th>Available</th>
                        <th>Utilization</th>
                    </tr>
                </thead>
                <tbody>
                    ${customersWithCredit.filter(c => c.outstanding_balance > 0).map(c => `
                        <tr>
                            <td>${c.name}</td>
                            <td>₹${c.credit_limit.toFixed(2)}</td>
                            <td>₹${c.outstanding_balance.toFixed(2)}</td>
                            <td>₹${c.available_credit.toFixed(2)}</td>
                            <td>${((c.outstanding_balance / c.credit_limit) * 100).toFixed(1)}%</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <h3>Credit Sales</h3>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Bill #</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${creditSales.slice().reverse().map(t => `
                        <tr>
                            <td>${t.date}</td>
                            <td>#${t.id}</td>
                            <td>${t.customer_name}</td>
                            <td>₹${t.total.toFixed(2)}</td>
                            <td>${t.payment_status === 'outstanding' ? 'Outstanding' : 'Paid'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <button onclick="window.print()" style="margin-top: 20px; padding: 10px 20px; background: #21808d; color: white; border: none; border-radius: 6px; cursor: pointer;">Print Report</button>
        </body>
        </html>
    `);
    reportWindow.document.close();
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);