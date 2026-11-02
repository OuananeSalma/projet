// NAVIGATION
const navbar = `
<nav class="navbar navbar-expand-lg navbar-dark sticky-top">
    <div class="container">
        <a class="navbar-brand" href="index.html">TamarShop</a>

        <button class="navbar-toggler" type="button"
            data-bs-toggle="collapse" data-bs-target="#menu">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="menu">
            <ul class="navbar-nav ms-auto align-items-lg-center">
                <li class="nav-item"><a class="nav-link" href="index.html">Accueil</a></li>
                <li class="nav-item"><a class="nav-link" href="dattes.html">Nos dattes</a></li>
                <li class="nav-item"><a class="nav-link" href="fruits-secs.html">Fruits secs</a></li>
                <li class="nav-item"><a class="nav-link" href="coffrets.html">Coffrets</a></li>
                <li class="nav-item"><a class="nav-link" href="apropos.html">À propos</a></li>
                <li class="nav-item">
                    <a class="nav-link cart-link" href="panier.html">
                        🛒 Panier (<span id="cart-count">0</span>)
                    </a>
                </li>
            </ul>
        </div>
    </div>
</nav>
`;

const footer = `
<footer>
    <div class="container">
        <div class="row g-4">
            <div class="col-md-4">
                <h4> TamarShop</h4>
                <p>La qualité et le plaisir dans chaque sélection.</p>
            </div>
            <div class="col-md-4">
                <h4>Navigation</h4>
                <p><a href="index.html">Accueil</a></p>
                <p><a href="dattes.html">Nos dattes</a></p>
                <p><a href="fruits-secs.html">Nos fruits secs</a></p>
                <p><a href="coffrets.html">Nos coffrets</a></p>
            </div>
            <div class="col-md-4">
                <h4>Contact</h4>
                <p>Maroc</p>
                <p>Commandes disponibles par WhatsApp</p>
            </div>
        </div>
        <hr>
        <p class="text-center mb-0">
            © 2026 TamarShop - Tous droits réservés.
        </p>
    </div>
</footer>
`;

document.addEventListener("DOMContentLoaded", function () {

    document.getElementById("navbar").innerHTML = navbar;
    document.getElementById("footer").innerHTML = footer;

    updateCartCount();
    setActiveLink();
    displayProducts();
    displayCart();
    displayCheckout();

});

// LIEN ACTIF
function setActiveLink() {
    const currentPage = location.pathname.split("/").pop();

    document.querySelectorAll(".nav-link").forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        }
    });
}

// AFFICHER LES PRODUITS
function displayProducts() {

    const container = document.getElementById("products-container");

    if (!container) return;

    const category = container.dataset.category;

    let selectedProducts = products;

    if (category) {
        selectedProducts = products.filter(
            product => product.category === category
        );
    }

    container.innerHTML = selectedProducts.map(product => `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="card product-card">
                <img src="${product.image}" alt="${product.name}"
                    onerror="this.src='https://placehold.co/600x400/F8F3EB/70452E?text=TamarShop'">

                <div class="card-body">
                    <span class="badge badge-tamar mb-2">TamarShop</span>
                    <h5>${product.name}</h5>
                    <p class="text-muted">${product.description}</p>

                    <div class="d-flex justify-content-between align-items-center">
                        <span class="product-price">${product.price} DH</span>
                        <button class="btn btn-tamar"
                            onclick="addToCart(${product.id})">
                            Ajouter +
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join("");
}

// RÉCUPÉRER LE PANIER
function getCart() {
    return JSON.parse(localStorage.getItem("tamarCart")) || [];
}

// SAUVEGARDER LE PANIER
function saveCart(cart) {
    localStorage.setItem("tamarCart", JSON.stringify(cart));
    updateCartCount();
}

// AJOUTER AU PANIER
function addToCart(id) {

    let cart = getCart();

    let existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ id: id, quantity: 1 });
    }

    saveCart(cart);
    alert("Produit ajouté au panier !");
}

// COMPTER LES PRODUITS
function updateCartCount() {

    const cart = getCart();

    const count = cart.reduce(
        (total, item) => total + item.quantity, 0
    );

    const element = document.getElementById("cart-count");

    if (element) element.textContent = count;
}

// AFFICHER LE PANIER
function displayCart() {

    const container = document.getElementById("cart-container");

    if (!container) return;

    let cart = getCart();

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <h3>🛒 Votre panier est vide</h3>
                <p>Découvrez nos délicieux produits !</p>
                <a href="dattes.html" class="btn btn-tamar">
                    Découvrir nos produits
                </a>
            </div>
        `;
        return;
    }

    let total = 0;

    container.innerHTML = `
        <div class="row g-4">
            <div class="col-lg-8">
                <div class="cart-box">
                    ${cart.map(item => {

                        const product = products.find(
                            p => p.id === item.id
                        );

                        if (!product) return "";

                        const subtotal = product.price * item.quantity;
                        total += subtotal;

                        return `
                            <div class="cart-product d-flex align-items-center gap-3">
                                <img src="${product.image}" alt="${product.name}">
                                <div class="flex-grow-1">
                                    <h6>${product.name}</h6>
                                    <span>${product.price} DH</span>
                                </div>

                                <div class="d-flex align-items-center gap-2">
                                    <button class="quantity-btn"
                                        onclick="changeQuantity(${item.id}, -1)">-</button>

                                    <span>${item.quantity}</span>

                                    <button class="quantity-btn"
                                        onclick="changeQuantity(${item.id}, 1)">+</button>
                                </div>

                                <button class="remove-btn"
                                    onclick="removeProduct(${item.id})">
                                    Supprimer
                                </button>
                            </div>
                        `;
                    }).join("")}
                </div>
            </div>

            <div class="col-lg-4">
                <div class="cart-box">
                    <h4>Résumé de la commande</h4>
                    <hr>
                    <div class="d-flex justify-content-between">
                        <span>Total</span>
                        <strong>${total} DH</strong>
                    </div>
                    <p class="text-muted mt-2">Livraison à confirmer.</p>
                    <a href="commander.html"
                        class="btn btn-tamar w-100 mt-3">
                        Commander maintenant
                    </a>
                </div>
            </div>
        </div>
    `;
}

// MODIFIER QUANTITÉ
function changeQuantity(id, amount) {

    let cart = getCart();

    let item = cart.find(p => p.id === id);

    if (item) {
        item.quantity += amount;
    }

    cart = cart.filter(item => item.quantity > 0);

    saveCart(cart);
    displayCart();
}

// SUPPRIMER UN PRODUIT
function removeProduct(id) {

    let cart = getCart().filter(item => item.id !== id);

    saveCart(cart);
    displayCart();
}

// AFFICHER RÉSUMÉ COMMANDE
function displayCheckout() {

    const summary = document.getElementById("checkout-summary");

    if (!summary) return;

    const cart = getCart();

    let total = 0;

    if (cart.length === 0) {
        summary.innerHTML = `
            <p>Votre panier est vide.</p>
            <a href="dattes.html" class="btn btn-tamar">
                Voir les produits
            </a>
        `;
        return;
    }

    summary.innerHTML = cart.map(item => {

        const product = products.find(p => p.id === item.id);

        if (!product) return "";

        const subtotal = product.price * item.quantity;
        total += subtotal;

        return `
            <div class="d-flex justify-content-between mb-2">
                <span>${product.name} x ${item.quantity}</span>
                <strong>${subtotal} DH</strong>
            </div>
        `;
    }).join("") + `
        <hr>
        <div class="d-flex justify-content-between">
            <strong>Total</strong>
            <strong class="product-price">${total} DH</strong>
        </div>
    `;
}

// ENVOYER COMMANDE WHATSAPP
function sendOrder(event) {

    event.preventDefault();

    const cart = getCart();

    if (cart.length === 0) {
        alert("Votre panier est vide !");
        return;
    }

    const name = document.getElementById("customer-name").value.trim();
    const phone = document.getElementById("customer-phone").value.trim();
    const address = document.getElementById("customer-address").value.trim();
    const city = document.getElementById("customer-city").value.trim();

    let total = 0;

    let message = `Bonjour TamarShop ! Je souhaite commander :\n\n`;

    message += `Nom : ${name}\n`;
    message += `Téléphone : ${phone}\n`;
    message += `Adresse : ${address}\n`;
    message += `Ville : ${city}\n\n`;

    cart.forEach(item => {

        const product = products.find(p => p.id === item.id);

        if (!product) return;

        const subtotal = product.price * item.quantity;
        total += subtotal;

        message += `- ${product.name} x ${item.quantity} = ${subtotal} DH\n`;
    });

    message += `\nTotal : ${total} DH`;
    message += `\nMerci de confirmer ma commande.`;

    // REMPLACER PAR LE NUMÉRO WHATSAPP DE LA BOUTIQUE
    const whatsappNumber = "212600000000";

    const url = "https://wa.me/" + whatsappNumber +
        "?text=" + encodeURIComponent(message);

    window.open(url, "_blank");

}