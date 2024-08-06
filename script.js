import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getFirestore, collection, addDoc, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
    apiKey: "AIzaSyCaEHKwE2QRsSJty6oRfXmM18j-nRwLPjU",
    authDomain: "shop-fcdee.firebaseapp.com",
    projectId: "shop-fcdee",
    storageBucket: "shop-fcdee.appspot.com",
    messagingSenderId: "1091011809170",
    appId: "1:1091011809170:web:cc73d4a7d4428b5d4a3b4b",
    measurementId: "G-X3MX9C9Z15"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
// Google provider
// Google provider
const provider = new GoogleAuthProvider();

document.getElementById('login-button').addEventListener('click', () => {
    signInWithPopup(auth, provider).then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        updateUI(user);
    }).catch((error) => {
        console.error('Error during sign-in:', error.message);
    });
});
document.getElementById('logout-button').addEventListener('click', () => {
    signOut(auth).then(() => {
        console.log('User signed out');
        updateUI(null);
    }).catch((error) => {
        console.error('Error during sign-out:', error.message);
    });
});
function updateUI(user) {
    if (user) {
        document.getElementById('login-button').style.display = 'none';
        document.getElementById('logout-button').style.display = 'inline';
        console.log('Logged in user:', user.displayName);
    } else {
        document.getElementById('login-button').style.display = 'inline';
        document.getElementById('logout-button').style.display = 'none';
    }
}

const products = [
    {
        name: "Top White Cleanser",
        price: "500,000 VND",
        image: "images/cleanser.jpg",
        description: "This cleanser gently removes impurities and leaves your skin feeling fresh and clean."
    },
    {
        name: "Top White Moisturizer",
        price: "600,000 VND",
        image: "images/moisturizer.jpg",
        description: "Our moisturizer hydrates and nourishes your skin, giving it a healthy glow."
    },
    {
        name: "Top White Serum",
        price: "800,000 VND",
        image: "images/serum.jpg",
        description: "This serum is packed with powerful ingredients to rejuvenate your skin and reduce signs of aging."
    },
    {
        name: "Top White Serum1",
        price: "700,000 VND",
        image: "images/serum.jpg",
        description: "This serum is packed with powerful ingredients to rejuvenate your skin and reduce signs of aging."
    },
    {
        name: "Top White Serum2",
        price: "700,000 VND",
        image: "images/serum.jpg",
        description: "This serum is packed with powerful ingredients to rejuvenate your skin and reduce signs of aging."
    }
];

let currentIndex = 0;

function displayProducts(productList = products) {
    const carousel = document.getElementById('carousel');
    //carousel.innerHTML = ''; // Clear existing products
    productList.forEach((product, index) => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product-hot';
        productDiv.setAttribute('data-index', index);

        const productImage = document.createElement('img');
        productImage.src = product.image;
        productDiv.appendChild(productImage);

        const productName = document.createElement('h3');
        productName.innerText = product.name;
        productDiv.appendChild(productName);

        const productPrice = document.createElement('p');
        productPrice.innerText = product.price;
        productDiv.appendChild(productPrice);

        carousel.appendChild(productDiv);

        productDiv.addEventListener('click', function () {
            window.location.href = `product.html?index=${index}`;
        });
    });

    // Clone first 5 products and append them to the end for infinite loop
    for (let i = 0; i < 500; i++) {
        const clone = carousel.children[i].cloneNode(true);
        carousel.appendChild(clone);
    }
}


function getVisibleProductsCount() {
    const width = window.innerWidth;
    if (width >= 1200) return 5;
    if (width >= 992) return 4;
    if (width >= 768) return 3;
    if (width >= 568) return 2;
    return 1;
}

function startCarousel() {
    const carousel = document.getElementById('carousel');
    const productDivs = carousel.children;
    const visibleProductsCount = getVisibleProductsCount();
    setInterval(() => {
        currentIndex++;
        const productWidth = carousel.offsetWidth/visibleProductsCount; // Assuming 5 products are shown at a time on larger screens
        carousel.style.transition = 'transform 0.5s ease-in-out';
        carousel.style.transform = `translateX(-${currentIndex * productWidth}px)`;

        // Allow interaction by resetting the click events on visible products
        if (currentIndex >= products.length + 500) {
            setTimeout(() => {
                carousel.style.transition = 'none';
                carousel.style.transform = 'translateX(0)';
                currentIndex = 0;
            }, 500); // Delay to match the transition duration
        }

        // Reset the click events
        for (let i = currentIndex; i < currentIndex + 5; i++) {
            productDivs[i].addEventListener('click', function () {
                window.location.href = `product.html?index=${i % products.length}`;
            });
        }
    }, 3000); // 3 seconds interval for sliding
}

function filterProducts(query) {
    return products.filter(product => product.name.toLowerCase().includes(query.toLowerCase()));
}
function displayList(productList = products) {
    const productListContainer = document.getElementById('product-list');
    //productListContainer.innerHTML = ''; // Clear existing products
    productList.forEach((product, index) => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.setAttribute('data-index', index);

        const productImage = document.createElement('img');
        productImage.src = product.image;
        productDiv.appendChild(productImage);

        const productName = document.createElement('h3');
        productName.innerText = product.name;
        productDiv.appendChild(productName);

        const productPrice = document.createElement('p');
        productPrice.innerText = product.price;
        productDiv.appendChild(productPrice);

        productListContainer.appendChild(productDiv);

        productDiv.addEventListener('click', function () {
            window.location.href = `product.html?index=${index}`;
        });
    });
}
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalCount = cart.reduce((sum, product) => sum + product.quantity, 0);
    document.getElementById('cart-count').innerText = totalCount;
}

document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    displayList();
    startCarousel();
    updateCartCount();
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', function () {
        const query = searchInput.value;
        const filteredProducts = filterProducts(query);
        const carouselContainer = document.getElementById('carousel-container');
        const productContainer = document.getElementById('product-container');
        const searchContainer = document.getElementById('search-container');
        const productSearch = document.getElementById('product-search');
        if (query) {
            carouselContainer.style.display = 'none';// Clear displayProducts();
            productContainer.style.display = 'none';// Clear displayList();
            searchContainer.style.display = 'block'
            productSearch.innerHTML = ''; // Clear existing products

            const totalProducts = filteredProducts.length;

            const descriptionDiv1 = document.getElementById('ketquatimkiem');
            descriptionDiv1.innerHTML = `Kết quả tìm kiếm: ${totalProducts} sản phẩm`;



            filteredProducts.forEach((product, index) => {
                const productDiv = document.createElement('div');
                productDiv.className = 'product';
                productDiv.setAttribute('data-index', index);

                const productImage = document.createElement('img');
                productImage.src = product.image;
                productDiv.appendChild(productImage);

                const productName = document.createElement('h3');
                productName.innerText = product.name;
                productDiv.appendChild(productName);

                const productPrice = document.createElement('p');
                productPrice.innerText = product.price;
                productDiv.appendChild(productPrice);

                productSearch.appendChild(productDiv);

                productDiv.addEventListener('click', function () {
                    window.location.href = `product.html?index=${index}`;
                });
            });
            productSearch.style.display = 'flex';
        } else {
            carousel.style.display = 'flex';
            carouselContainer.style.display = 'block';// Clear displayProducts();
            productContainer.style.display = 'block';// Clear displayList();
            searchContainer.style.display = 'none'
            displayProducts();
            //displayList();
        }
    });
});

