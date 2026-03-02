// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBApkyl2-OrfwDBBI46sLecPQkTAR_x6qw",
  authDomain: "elite-cards-bd3a0.firebaseapp.com",
  projectId: "elite-cards-bd3a0",
  storageBucket: "elite-cards-bd3a0.firebasestorage.app",
  messagingSenderId: "577170723227",
  appId: "1:577170723227:web:7f5aa565da91cc1316113e"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Generate 50 products
const cardTypes = [
    { name: "American Express", count: 10, folder: "AMERICAN EXPRESS CARDS PREVIEW", prefix: "AMERICAN EXPRESS CARDS PREVIEW ", actualFolder: "VISA INFINITE PREVIEW CARDS/AMERCAN EXPRESS ACTUAL ", actualPrefix: "AMERCAN EXPRESS ACTUAL " },
    { name: "Visa Infinite", count: 10, folder: "VISA INFINITE PREVIEW CARDS", prefix: "VISA INFINITE PREVIEW CARDS ", actualFolder: "VISA INFINITE ACTUAL", actualPrefix: "VISA INFINITE ACTUAL " },
    { name: "Visa Gold", count: 10, folder: "VISA GOLD PREVIEW CARDS", prefix: "VISA GOLD PREVIEW CARDS ", actualFolder: "VISA GOLD ACTUAL CARDS", actualPrefix: "VISA GOLD ACTUAL CARDS " },
    { name: "Platinum Mastercard", count: 10, folder: "PLATINUM MASTERCARD PREVIEW CARDS", prefix: "PLATINUM MASTERCARD PREVIEW CARDS ", actualFolder: "VISA INFINITE PREVIEW CARDS/PLATINUM MASTERCARD ACTUAL", actualPrefix: "PLATINUM MASTERCARD ACTUAL " },
    { name: "Discover", count: 10, folder: "DISCOVER PREVIEW CARDS", prefix: "DISCOVER PREVIEW ", actualFolder: "DISCOVER ACTUAL ", actualPrefix: "DISCOVER ACTUAL  " }
];

const products = [];
let productId = 1;
cardTypes.forEach(type => {
    for (let i = 1; i <= type.count; i++) {
        products.push({
            id: productId++,
            name: type.name,
            image: encodeURIComponent(`${type.folder}/${type.prefix}${i}.jpg`),
            actualImage: encodeURIComponent(`${type.actualFolder}/${type.actualPrefix}${i}.jpg`),
            rating: 5,
            reviews: Math.floor(Math.random() * 401) + 100, // 100-500
            price: [35, 50, 100][Math.floor(Math.random() * 3)] // 35, 50, or 100
        });
    }
});

// Shuffle array function
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to create star rating HTML
function createStars(rating) {
    return '<span style="color: #FACC15;">⭐⭐⭐⭐⭐</span>';
}

// Function to create card HTML
function createCard(product) {
    return `
        <div class="bg-black p-4 shadow-lg hover:shadow-xl transition-shadow rounded-[10px] min-h-[400px] flex flex-col">
            <!-- Product Image -->
            <div class="w-full h-48 bg-gray-700 rounded-lg mb-4 border border-gray-600 flex items-center justify-center">
                <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover rounded-lg" onerror="this.src='https://via.placeholder.com/300x200/666/fff?text=No+Image'">
            </div>

            <!-- Product Name -->
            <h3 class="text-xl font-bold mb-2" style="color: #00C7C7;">${product.name}</h3>

            <!-- Rating and Reviews -->
            <div class="flex items-center mb-4">
                <div class="flex space-x-1">
                    ${createStars(product.rating)}
                </div>
                <span class="text-sm ml-2" style="color: #00C7C7;">(${product.reviews} reviews)</span>
            </div>

            <!-- Price -->
            <p class="text-white font-bold text-lg mb-4">$${product.price}</p>

            <!-- Buy Now Button -->
            <button class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition-colors buy-now-btn" data-product-id="${product.id}">
                Buy Now
            </button>
        </div>
    `;
}

// State for view all
let showingAll = false;

// Function to populate cards
function populateCards() {
    console.log('Starting to populate cards');
    const grid = document.getElementById('cards-grid');
    const viewAllBtn = document.getElementById('view-all-btn');

    if (!grid) {
        console.error('Cards grid element not found');
        return;
    }

    console.log('Grid found, proceeding with population');

    // Check if we're on the cards.html page (Popular Cards page)
    const isCardsPage = window.location.pathname.includes('cards.html');

    if (isCardsPage) {
        // On cards.html, always show all 50 cards
        console.log('On cards page, showing all cards');
        const shuffled = shuffleArray([...products]);
        grid.innerHTML = shuffled.map(card => createCard(card)).join('');
        // Hide or remove view all button on cards page
        if (viewAllBtn) {
            viewAllBtn.style.display = 'none';
        }
    } else {
        // On other pages (like index.html), show limited cards with view all functionality
        if (!viewAllBtn) {
            console.error('View all button not found');
            return;
        }

        if (!showingAll) {
            // Show 5 random cards
            const shuffled = shuffleArray([...products]);
            const selected = shuffled.slice(0, 5);
            grid.innerHTML = selected.map(card => createCard(card)).join('');
            viewAllBtn.textContent = 'View All Credit Cards';
        } else {
            // Show all 50 cards shuffled
            const shuffled = shuffleArray([...products]);
            grid.innerHTML = shuffled.map(card => createCard(card)).join('');
            viewAllBtn.textContent = 'Show Less';
        }
    }

    // Attach event listeners to the Buy Now buttons after populating cards
    attachBuyNowListeners();
}

// Function to toggle view all
function toggleViewAll() {
    console.log('Toggle view all called, current showingAll:', showingAll);
    showingAll = !showingAll;
    console.log('New showingAll:', showingAll);
    populateCards();
}

// Function to handle buy now
function buyNow(productId) {
    console.log('Buying product id:', productId);
    // Check if user is logged in
    const currentUser = firebase.auth().currentUser;
    console.log('Is logged in:', !!currentUser);
    if (!currentUser) {
        // Redirect to login if not logged in
        console.log('Redirecting to login');
        window.location.href = 'login.html';
        return;
    }
    // Find the product data
    const product = products.find(p => p.id === productId);
    console.log('Found product:', product);
    if (product) {
        // Redirect to card details page
        console.log('Redirecting to card details');
        const params = new URLSearchParams({
            name: product.name,
            price: product.price,
            reviews: product.reviews
        });
        window.location.href = `card-details.html?${params.toString()}`;
    } else {
        console.log('Product not found');
        alert('Product not found.');
    }
}

// Function to attach event listeners to Buy Now buttons
function attachBuyNowListeners() {
    const buyNowButtons = document.querySelectorAll('.buy-now-btn');
    buyNowButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = parseInt(event.target.getAttribute('data-product-id'));
            buyNow(productId);
        });
    });
}

// Show order confirmation modal
function showOrderModal(product) {
    console.log('Showing order modal for product:', product);
    const modal = document.getElementById('order-modal');
    const orderDetails = document.getElementById('order-details');

    if (!modal) {
        console.error('Order modal element not found');
        return;
    }

    if (orderDetails) {
        orderDetails.innerHTML = `
            <div class="text-center">
                <img src="${product.image}" alt="${product.name}" class="w-32 h-20 object-cover rounded mx-auto mb-4">
                <h4 class="font-semibold text-lg">${product.name}</h4>
                <p class="text-gray-600">Price: $${product.price}</p>
                <p class="text-sm text-gray-500 mt-2">You will be redirected to complete your purchase securely.</p>
            </div>
        `;
    }

    modal.classList.remove('hidden');
    document.body.classList.add('modal-open');
    // Store product data for later use
    window.selectedProduct = product;
    console.log('Order modal shown successfully');
}

// Hide order confirmation modal
function hideOrderModal() {
    document.getElementById('order-modal').classList.add('hidden');
    document.body.classList.remove('modal-open');
}

// Copy email to clipboard
function copyEmail() {
    const email = document.getElementById('email-text').textContent;
    navigator.clipboard.writeText(email).then(() => {
        // Show feedback (optional)
        const btn = document.getElementById('copy-email-btn');
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy email: ', err);
    });
}

// Proceed to payment
function proceedToPayment() {
    if (window.selectedProduct) {
        // Redirect to card details page instead of directly opening payment
        const product = window.selectedProduct;
        const params = new URLSearchParams({
            name: product.name,
            price: product.price,
            reviews: product.reviews
        });
        window.location.href = `card-details.html?${params.toString()}`;
    }
}

// Function to sign out
function signOut() {
    firebase.auth().signOut().then(() => {
        window.location.href = 'index.html';
    }).catch((error) => {
        console.error('Error signing out:', error);
    });
}

// Function to handle button clicks
function setupEventListeners() {
    console.log('Setting up event listeners');
    // Sign Up button
    const signUpBtn = document.querySelector('.btn-primary');
    console.log('Sign up button found:', signUpBtn);
    if (signUpBtn) {
        signUpBtn.addEventListener('click', () => {
            console.log('Sign up button clicked');
            window.location.href = 'signup.html';
        });
    }

    // Explore Now button
    const exploreBtn = document.querySelector('.btn-secondary');
    console.log('Explore now button found:', exploreBtn);
    if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
            console.log('Explore now button clicked');
            // Scroll to the cards section
            const cardsSection = document.querySelector('#cards-grid');
            console.log('Cards section found:', cardsSection);
            if (cardsSection) {
                cardsSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }


    // Navigation menu button - Side Drawer
    const navBtn = document.getElementById('nav-button');
    const sideDrawer = document.getElementById('side-drawer');
    const drawerContent = document.getElementById('drawer-content');
    const drawerBackdrop = document.getElementById('drawer-backdrop');
    const closeBtn = document.getElementById('close-drawer');

    console.log('Nav button found:', navBtn);
    console.log('Side drawer found:', sideDrawer);
    console.log('Drawer content found:', drawerContent);
    console.log('Drawer backdrop found:', drawerBackdrop);
    console.log('Close button found:', closeBtn);

    function openDrawer() {
        console.log('Opening drawer');
        sideDrawer.classList.remove('hidden');
        setTimeout(() => {
            drawerContent.classList.remove('-translate-x-full');
        }, 10);
    }

    function closeDrawer() {
        console.log('Closing drawer');
        drawerContent.classList.add('-translate-x-full');
        setTimeout(() => {
            sideDrawer.classList.add('hidden');
        }, 300);
    }

    if (navBtn) {
        navBtn.addEventListener('click', openDrawer);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeDrawer);
    }

    if (drawerBackdrop) {
        drawerBackdrop.addEventListener('click', closeDrawer);
    }

    // Close drawer on nav link click
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', closeDrawer);
    });

    // Close drawer on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !sideDrawer.classList.contains('hidden')) {
            closeDrawer();
        }
    });

    // Me button - check login status
    const meBtn = document.getElementById('me-button');
    if (meBtn) {
        console.log('Me button found:', meBtn);
        meBtn.addEventListener('click', () => {
            console.log('Me button clicked');
            const currentUser = firebase.auth().currentUser;
            console.log('Is logged in for me button:', !!currentUser);
            if (currentUser) {
                // Sign out
                console.log('Signing out');
                firebase.auth().signOut().then(() => {
                    window.location.href = 'index.html';
                }).catch((error) => {
                    console.error('Error signing out:', error);
                });
            } else {
                // Redirect to login
                console.log('Redirecting to login from me button');
                window.location.href = 'login.html';
            }
        });
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded, initializing page');
    populateCards();
    setupEventListeners();
});

// Handle authentication state changes
firebase.auth().onAuthStateChanged((user) => {
    console.log('Auth state changed:', !!user);
    const loginButtons = document.getElementById('login-buttons');
    const logoutButton = document.getElementById('logout-button');
    const meBtn = document.getElementById('me-button');
    if (user) {
        if (loginButtons) loginButtons.style.display = 'none';
        if (logoutButton) logoutButton.style.display = 'block';
        if (meBtn) {
            meBtn.style.display = 'flex';
            const span = meBtn.querySelector('span');
            if (span) span.textContent = 'Sign Out';
        }
    } else {
        if (loginButtons) loginButtons.style.display = 'block';
        if (logoutButton) logoutButton.style.display = 'none';
        if (meBtn) meBtn.style.display = 'none';
    }
});