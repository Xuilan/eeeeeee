// Initialize Telegram Web App (basic)
if (typeof WebApp !== 'undefined') {
    WebApp.ready();
    // WebApp.expand(); // Optional: expand the app to fullscreen
    // WebApp.MainButton.setText("Upgrade!"); // Example: set main button text
    // WebApp.MainButton.onClick(performUpgrade); // Example: connect button click
    // WebApp.MainButton.show(); // Example: show the main button
} else {
    console.warn("Telegram Web App script not found or not running in Telegram.");
}


// --- DOM Elements ---
const userBalanceSpan = document.querySelector('.user-balance');
const inventoryListDiv = document.getElementById('inventory-list');
const marketplaceListDiv = document.getElementById('marketplace-list');
const inventoryCountSpan = document.getElementById('inventory-count');

const selectedInputItemDiv = document.querySelector('.selected-input-item');
const selectedOutputItemDiv = document.querySelector('.selected-output-item');

const chancePercentageSpan = document.querySelector('.chance-meter .percentage');
const chanceTextSpan = document.querySelector('.chance-meter .chance-text');
const upgradeButton = document.querySelector('.upgrade-button');

// --- State ---
let userBalance = 54.00; // Initial balance
let inventoryItems = []; // User's items
let marketplaceItems = []; // Items available for target (market)
let selectedInputItem = null; // Currently selected item to upgrade from
let selectedOutputItem = null; // Currently selected item to upgrade to


// --- Sample Data (replace with actual data fetching) ---
const allItems = [
    { id: 1, name: 'Glock-18', description: 'Дальний свет', price: 38.2, image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsrgSMKEz.zcolZlS4j_y0zJV2f0RTgqBAy2j41JEdW0X3c1B347F0c9P1I096H9-ESh4S_j68221Q_x-o4Y1y0gP1I086Hv7k7P1I086Ho3t--', rarity: 'common' },
    { id: 2, name: 'Glock-18', description: 'Карамельное яблоко', price: 50.0, image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsrgSMKEz.zcolZlS4j_y0zJV2f0RTgqBAy2j41JEdW0X3c1B347F0c9P1I096H9-ESh4S_j68221Q_x-o4Y1y0gP1I086Hv7k7P1I086H9-4s4P0I086Hv7k7P1I086Ho3t--', rarity: 'common' },
    { id: 3, name: 'Five-SeveN', description: 'Апельсиновая корка', price: 25.5, image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsrgSMKEz.zcolZlS4j_y0zJV2f0RTgqBAy2j41JEdW0X3c1B347F0c9P1I096H9-ESh4S_j68221Q_x-o4Y1y0gP1I086Hv7k7P1I086Ho3t--', rarity: 'common' },
    { id: 4, name: 'MP9', description: 'Воздушный шлюз', price: 115.8, image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsrgSMKEz.zcolZlS4j_y0zJV2f0RTgqBAy2j41JEdW0X3c1B347F0c9P1I096H9-ESh4S_j68221Q_x-o4Y1y0gP1I086Hv7k7P1I086Ho3t--', rarity: 'uncommon' },
    { id: 5, name: 'StatTrak™ P2000', description: 'Защитник империи', price: 220.0, image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsrgSMKEz.zcolZlS4j_y0zJV2f0RTgqBAy2j41JEdW0X3c1B347F0c9P1I096H9-ESh4S_j68221Q_x-o4Y1y0gP1I086Hv7k7P1I086Ho3t--', rarity: 'rare' },
    { id: 6, name: 'Galil AR', description: 'Эко', price: 95.0, image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsrgSMKEz.zcolZlS4j_y0zJV2f0RTgqBAy2j41JEdW0X3c1B347F0c9P1I096H9-ESh4S_j68221Q_x-o4Y1y0gP1I086Hv7k7P1I086Ho3t--', rarity: 'uncommon' },
    { id: 7, name: 'M4A1-S', description: 'Василиск', price: 350.0, image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsrgSMKEz.zcolZlS4j_y0zJV2f0RTgqBAy2j41JEdW0X3c1B347F0c9P1I096H9-ESh4S_j68221Q_x-o4Y1y0gP1I086Hv7k7P1I086Ho3t--', rarity: 'classified' },
    { id: 8, name: 'Five-SeveN', description: 'Городская опасность', price: 85.5, image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsrgSMKEz.zcolZlS4j_y0zJV2f0RTgqBAy2j41JEdW0X3c1B347F0c9P1I096H9-ESh4S_j68221Q_x-o4Y1y0gP1I086Hv7k7P1I086Ho3t--', rarity: 'uncommon' },
    { id: 9, name: 'AUG', description: 'Аристократ', price: 38.2, image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsrgSMKEz.zcolZlS4j_y0zJV2f0RTgqBAy2j41JEdW0X3c1B347F0c9P1I096H9-ESh4S_j68221Q_x-o4Y1y0gP1I086Hv7k7P1I086Ho3t--', rarity: 'common' },
    { id: 10, name: 'PP-19 Бизон', description: 'Эмбарго', price: 33.5, image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsrgSMKEz.zcolZlS4j_y0zJV2f0RTgqBAy2j41JEdW0X3c1B347F0c9P1I096H9-ESh4S_j68221Q_x-o4Y1y0gP1I086Hv7k7P1I086Ho3t--', rarity: 'common' },
    { id: 11, name: 'SSG 08', description: 'Лишайниковая ...', price: 117.3, image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsrgSMKEz.zcolZlS4j_y0zJV2f0RTgqBAy2j41JEdW0X3c1B347F0c9P1I096H9-ESh4S_j68221Q_x-o4Y1y0gP1I086Hv7k7P1I086Ho3t--', rarity: 'uncommon' },
    { id: 12, name: 'StatTrak™ AWP', description: 'Распространение', price: 4699.0, image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsrgSMKEz.zcolZlS4j_y0zJV2f0RTgqBAy2j41JEdW0X3c1B347F0c9P1I096H9-ESh4S_j68221Q_x-o4Y1y0gP1I086Hv7k7P1I086Ho3t--', rarity: 'restricted' },
    { id: 13, name: 'Сувенирный M...', description: 'Шедевр', price: 4704.3, image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsrgSMKEz.zcolZlS4j_y0zJV2f0RTgqBAy2j41JEdW0X3c1B347F0c9P1I096H9-ESh4S_j68221Q_x-o4Y1y0gP1I086Hv7k7P1I086Ho3t--', rarity: 'classified' },
     { id: 14, name: 'Водительские...', description: 'Гоночный зелёный', price: 4738.9, image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsrgSMKEz.zcolZlS4j_y0zJV2f0RTgqBAy2j41JEdW0X3c1B347F0c9P1I096H9-ESh4S_j68221Q_x-o4Y1y0gP1I086Hv7k7P1I086Ho3t--', rarity: 'rare_gloves' },
    { id: 15, name: 'P90', description: 'Астральный Ёр...', price: 4750.0, image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsrgSMKEz.zcolZlS4j_y0zJV2f0RTgqBAy2j41JEdW0X3c1B347F0c9P1I096H9-ESh4S_j68221Q_x-o4Y1y0gP1I086Hv7k7P1I086Ho3t--', rarity: 'classified' },
     { id: 16, name: '★ Нож с лезвие...', description: 'Городская маск...', price: 4754.0, image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsrgSMKEz.zcolZlS4j_y0zJV2f0RTgqBAy2j41JEdW0X3c1B347F0c9P1I096H9-ESh4S_j68221Q_x-o4Y1y0gP1I086Hv7k7P1I086Ho3t--', rarity: 'rare_knife' },
    // Add more items...
];

// Simulate user inventory initially (some random items from allItems)
inventoryItems = [
    {...allItems[8]}, // AUG
    {...allItems[3]}, // MP9
    {...allItems[9]}, // PP-19
    {...allItems[10]}, // SSG 08
    {...allItems[0]}, // Glock-18
     {...allItems[7]}, // Five-SeveN
];

// Simulate marketplace items (all items except those in inventory, or a selection)
marketplaceItems = allItems.filter(item => !inventoryItems.find(invItem => invItem.id === item.id));


// --- Helper Functions ---

// Get rarity color class (simplified)
function getRarityColorClass(rarity) {
    switch (rarity) {
        case 'common': return 'rarity-white';
        case 'uncommon': return 'rarity-light-blue';
        case 'rare': return 'rarity-blue';
        case 'restricted': return 'rarity-purple';
        case 'classified': return 'rarity-pink';
        case 'covert': return 'rarity-red';
        case 'rare_item': // Cases, etc.
        case 'rare_sticker':
        case 'rare_patch': return 'rarity-gold'; // Gold
        case 'rare_knife':
        case 'rare_gloves': return 'rarity-gold'; // Gold
        default: return '';
    }
}

// Create HTML for a small item card
function createSmallItemCardHTML(item) {
    const rarityClass = getRarityColorClass(item.rarity);
     const isSelectedInput = selectedInputItem && selectedInputItem.id === item.id;
    const isSelectedOutput = selectedOutputItem && selectedOutputItem.id === item.id;
    const selectedClass = isSelectedInput || isSelectedOutput ? 'selected' : '';

    return `
        <div class="item-card small ${selectedClass}" data-item-id="${item.id}" data-list-type="${inventoryItems.includes(item) ? 'inventory' : 'marketplace'}">
             ${item.rarity.includes('rare_') ? '<span class="rarity-star">★</span>' : ''}
            <img src="${item.image}" alt="${item.name}" class="item-image-small">
            <div class="item-details-small">
                <p class="item-name-small">${item.name}</p>
                <p class="item-description-small">${item.description}</p>
            </div>
            <span class="item-price-small">${item.price.toFixed(2)} ₽</span>
        </div>
    `;
}

// Create HTML for the large selected item card
function createSelectedItemCardHTML(item) {
     if (!item) {
         return ''; // Return empty if no item is selected
     }
     const rarityClass = getRarityColorClass(item.rarity);
     return `
        ${item.rarity.includes('rare_') ? '<span class="rarity-star">★</span>' : ''}
        <img src="${item.image}" alt="${item.name}" class="item-image">
        <div class="item-details">
            <p class="item-name">${item.name}</p>
            <p class="item-description">${item.description}</p>
        </div>
        <span class="item-price">${item.price.toFixed(2)} ₽</span>
     `;
}


// Render inventory list
function renderInventory() {
    inventoryListDiv.innerHTML = ''; // Clear current list
    inventoryItems.forEach(item => {
        inventoryListDiv.innerHTML += createSmallItemCardHTML(item);
    });
    inventoryCountSpan.textContent = inventoryItems.length;
}

// Render marketplace list
function renderMarketplace() {
    marketplaceListDiv.innerHTML = ''; // Clear current list
    marketplaceItems.forEach(item => {
        marketplaceListDiv.innerHTML += createSmallItemCardHTML(item);
    });
}

// Update the display of the selected input item
function updateSelectedInputItemDisplay() {
    if (selectedInputItem) {
        selectedInputItemDiv.innerHTML = createSelectedItemCardHTML(selectedInputItem);
        selectedInputItemDiv.classList.remove('placeholder');
        selectedInputItemDiv.classList.add('selected');
    } else {
        selectedInputItemDiv.innerHTML = '<p>Выберите предмет из инвентаря</p>';
         selectedInputItemDiv.classList.add('placeholder');
         selectedInputItemDiv.classList.remove('selected');
    }
}

// Update the display of the selected output item
function updateSelectedOutputItemDisplay() {
     if (selectedOutputItem) {
        selectedOutputItemDiv.innerHTML = createSelectedItemCardHTML(selectedOutputItem);
        selectedOutputItemDiv.classList.remove('placeholder');
        selectedOutputItemDiv.classList.add('selected');
     } else {
        selectedOutputItemDiv.innerHTML = '<p>Выберите предмет из магазина</p>';
        selectedOutputItemDiv.classList.add('placeholder');
        selectedOutputItemDiv.classList.remove('selected');
     }
}


// Calculate and update the chance display
function updateChance() {
    if (selectedInputItem && selectedOutputItem) {
        // Simple chance calculation: higher output price relative to input price = higher chance (up to a point)
        // This is a simplified example! Real chance logic is more complex.
        let chance = (selectedOutputItem.price / selectedInputItem.price) * 10; // Multiply by a factor

        // Cap chance at 100% and minimum at a small value
        chance = Math.max(0.01, Math.min(100, chance)); // Ensure min 0.01%

        chancePercentageSpan.textContent = `${chance.toFixed(2)}%`;
        chanceTextSpan.textContent = chance < 10 ? 'крайне низкий шанс' :
                                     chance < 30 ? 'низкий шанс' :
                                     chance < 60 ? 'средний шанс' :
                                     chance < 90 ? 'высокий шанс' : 'очень высокий шанс';

        upgradeButton.disabled = false; // Enable button
        upgradeButton.style.backgroundColor = '#3498db'; // Blue color
    } else {
        chancePercentageSpan.textContent = '0.00%';
        chanceTextSpan.textContent = 'выберите предметы';
        upgradeButton.disabled = true; // Disable button
         upgradeButton.style.backgroundColor = '#555'; // Grey color
    }
}

// Update user balance display
function updateBalanceDisplay() {
    userBalanceSpan.textContent = userBalance.toFixed(2) + ' ₽';
}

// --- Event Handlers ---

// Handle item click in inventory list
inventoryListDiv.addEventListener('click', (event) => {
    const card = event.target.closest('.item-card.small');
    if (!card || card.dataset.listType !== 'inventory') return;

    const itemId = parseInt(card.dataset.itemId);
    const item = inventoryItems.find(item => item.id === itemId);

    if (item) {
        // Deselect current input item if it's the same one
        if (selectedInputItem && selectedInputItem.id === item.id) {
             selectedInputItem = null;
        } else {
             selectedInputItem = item;
        }

        updateSelectedInputItemDisplay();
        renderInventory(); // Re-render to update selection highlight
        updateChance();
    }
});

// Handle item click in marketplace list
marketplaceListDiv.addEventListener('click', (event) => {
    const card = event.target.closest('.item-card.small');
     if (!card || card.dataset.listType !== 'marketplace') return;

    const itemId = parseInt(card.dataset.itemId);
    const item = marketplaceItems.find(item => item.id === itemId);

    if (item) {
         // Deselect current output item if it's the same one
         if (selectedOutputItem && selectedOutputItem.id === item.id) {
              selectedOutputItem = null;
         } else {
              selectedOutputItem = item;
         }
        updateSelectedOutputItemDisplay();
        renderMarketplace(); // Re-render to update selection highlight
        updateChance();
    }
});


// Handle upgrade button click
upgradeButton.addEventListener('click', performUpgrade);

function performUpgrade() {
    if (!selectedInputItem || !selectedOutputItem || upgradeButton.disabled) {
        // Should not happen if button is disabled correctly, but good check
        console.warn("Cannot perform upgrade: items not selected or button disabled.");
        return;
    }

    // Disable button during upgrade process
    upgradeButton.disabled = true;
    upgradeButton.textContent = 'КРУЧУ...';
    upgradeButton.style.backgroundColor = '#f1c40f'; // Yellow color

    // Get the current calculated chance
    const chance = parseFloat(chancePercentageSpan.textContent); // Parse from display

    // Simulate the roll
    const randomRoll = Math.random() * 100; // Random number between 0 and 100

    console.log(`Upgrade initiated: ${selectedInputItem.name} -> ${selectedOutputItem.name}. Chance: ${chance.toFixed(2)}%. Roll: ${randomRoll.toFixed(2)}`);

    // Simulate a delay for the "крутка" animation (remove for instant result)
    setTimeout(() => {
        let success = randomRoll <= chance;

        if (success) {
            console.log("Upgrade Successful!");
            // Remove input item from inventory
            inventoryItems = inventoryItems.filter(item => item.id !== selectedInputItem.id);

            // Add output item to inventory
            inventoryItems.push({...selectedOutputItem}); // Add a copy

            // Remove output item from marketplace (optional, depends on logic)
            marketplaceItems = marketplaceItems.filter(item => item.id !== selectedOutputItem.id);

            // Optional: Adjust balance (e.g., subtract a fee) - skipped for this basic example

             alert(`УСПЕХ! Вы получили ${selectedOutputItem.name} (${selectedOutputItem.description})`); // Basic feedback

        } else {
            console.log("Upgrade Failed!");
            // Remove input item from inventory
            inventoryItems = inventoryItems.filter(item => item.id !== selectedInputItem.id);

            // Optional: Add input item back to marketplace if it was unique - skipped

            // Optional: Adjust balance (e.g., refund partial value) - skipped

            alert(`НЕУДАЧА! Вы потеряли ${selectedInputItem.name} (${selectedInputItem.description})`); // Basic feedback
        }

        // Reset selections
        selectedInputItem = null;
        selectedOutputItem = null;

        // Update UI
        updateBalanceDisplay();
        updateSelectedInputItemDisplay();
        updateSelectedOutputItemDisplay();
        renderInventory();
        renderMarketplace();
        updateChance(); // This will disable the button and reset chance display

        // Reset button text
        upgradeButton.textContent = 'ПРОКАЧАТЬ!';
        // Button color will be reset by updateChance()

         // Provide Telegram Haptic feedback (optional)
         if (typeof WebApp !== 'undefined' && WebApp.HapticFeedback) {
             if (success) {
                 WebApp.HapticFeedback.notificationOccurred('success');
             } else {
                  WebApp.HapticFeedback.notificationOccurred('error');
             }
              // WebApp.HapticFeedback.impactOccurred('heavy'); // Or 'light', 'medium'
         }

    }, 1500); // Simulate 1.5 seconds delay
}


// --- Initialization ---
function initApp() {
    updateBalanceDisplay();
    renderInventory();
    renderMarketplace();
    updateSelectedInputItemDisplay(); // Show placeholders initially
    updateSelectedOutputItemDisplay(); // Show placeholders initially
    updateChance(); // Initialize chance and button state
}

// Run initialization when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initApp);
