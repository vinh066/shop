import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCaEHKwE2QRsSJty6oRfXmM18j-nRwLPjU",
    authDomain: "shop-fcdee.firebaseapp.com",
    projectId: "shop-fcdee",
    storageBucket: "shop-fcdee.appspot.com",
    messagingSenderId: "1091011809170",
    appId: "1:1091011809170:web:cc73d4a7d4428b5d4a3b4b",
    measurementId: "G-X3MX9C9Z15"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
// Google provider
const provider = new GoogleAuthProvider();
//Login logout
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

onAuthStateChanged(auth, (user) => {
    updateUI(user);
    if (user) {
        // Điền thông tin email vào input khi đã đăng nhập
        document.getElementById('customer-email').value = user.email;
        document.getElementById('user-user').value = user.displayName;
    } else {
        // Xóa thông tin email khỏi input khi không đăng nhập
        document.getElementById('customer-email').value = '';
        document.getElementById('user-user').value = '';
    }
});

const products = [
    {
        name: "Top White Cleanser",
        price: "500,000 VND",
        image: "images/cleanser.jpg",
        description: "This cleanser gently removes impurities and leaves your skin feeling fresh and clean.",
        sold: 120,
        rating: 4.5,
        comments: []
    },
    {
        name: "Top White Moisturizer",
        price: "600,000 VND",
        image: "images/moisturizer.jpg",
        description: "Our moisturizer hydrates and nourishes your skin, giving it a healthy glow.",
        sold: 85,
        rating: 4.0,
        comments: []
    },
    {
        name: "Top White Serum",
        price: "800,000 VND",
        image: "images/serum.jpg",
        description: "This serum is packed with powerful ingredients to rejuvenate your skin and reduce signs of aging.",
        sold: 150,
        rating: 4.8,
        comments: []
    },
    {
        name: "Top White Serum1",
        price: "700,000 VND",
        image: "images/serum.jpg",
        description: "This serum is packed with powerful ingredients to rejuvenate your skin and reduce signs of aging.",
        sold: 95,
        rating: 4.3,
        comments: []
    }
];

function getProductIndexFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('index');
}
// Lấy thông tin rating firebase và hiển thị
async function fetchComments(product) {
    const productId = getProductIndexFromURL();
    const commentsQuery = query(collection(db, "comments"), where("productId", "==", productId));
    const querySnapshot = await getDocs(commentsQuery);

    let totalRating = 0;
    let commentsCount = 0;
    const commentsDiv = document.getElementById('comments');
    commentsDiv.innerHTML = ''; // Clear existing comments

    querySnapshot.forEach(doc => {
        const comment = doc.data();
        const commentDiv = document.createElement('div');

        // Create star rating elements
        let starsHTML = '';
        for (let i = 1; i <= 5; i++) {
            starsHTML += `<span class="star non-clickable ${i <= comment.rating ? 'filled' : ''}" data-value="${i}">&#9733;</span>`;
        }

        commentDiv.innerHTML = `
            <p><strong>${comment.user}:</strong> ${comment.text}</p>
            <div class="star-rating">${starsHTML}</div>
        `;
        commentsDiv.appendChild(commentDiv);

        totalRating += comment.rating;
        commentsCount++;
    });

    // Update product rating
    if (commentsCount > 0) {
        const averageRating = totalRating / commentsCount;
        const starRatingDiv = document.getElementById('star-rating');
        starRatingDiv.innerHTML = `<p>Đánh giá: <strong>${averageRating.toFixed(1)} <span class="starTotal" >&#9733;</span></strong></p>`;
    }
    // Update comments count
    const commentsCountDiv = document.getElementById('comments-count');
    commentsCountDiv.innerHTML = `<p>Bình luận:<strong> ${commentsCount}</strong></p>`;
}
async function fetchSoldCount(productName) {
    const soldQuery = query(collection(db, 'soldProducts'), where('name', '==', productName));
    const querySnapshot = await getDocs(soldQuery);
    let soldCount = 0;
    querySnapshot.forEach(doc => {
        soldCount += doc.data().quantity;
    });
    return soldCount;
}
async function displayProductDescription() {
    const index = getProductIndexFromURL();
    if (index !== null && products[index]) {
        const product = products[index];
        const soldCount = await fetchSoldCount(product.name);
        const descriptionDiv = document.getElementById('product-description');
        descriptionDiv.innerHTML = `
               <div class="image-product">
                    <img src="${product.image}" alt="${product.name}">
               </div>
               <div class="buy">
                    <h3>${product.name}</h3>
                    <div class="info-product">
                         <div id="star-rating"></div>
                         <div id="sold-count">Đã bán: <strong>${soldCount} </strong></div>
                         <div id="comments-count"></div>
                    </div>
                    <div>
                         <p>Giá:<strong> ${product.price}</strong></p>
                    </div>
                    <div>
                         <button id="add-to-cart">Thêm vào giỏ hàng</button>
                         <button id="buy-now">Mua ngay</button>
                    </div>
               </div>
        `;
        const description = document.getElementById('description');
        description.innerHTML = `
            <h3>Mô tả sản phẩm</h3>
            <p>${product.description}</p>
        `;

        document.getElementById('add-to-cart').addEventListener('click', () => {
            addToCart(index)
            alert('Đã thêm sản phẩm vào giỏ hàng')
        });
        document.getElementById('buy-now').addEventListener('click', () => {

            displayOrderForm();
            //Modal
            var modal = document.getElementById("myModal");
            modal.style.display = "block";
            document.getElementById("order-sp").innerHTML = product.name;
            document.getElementById("order-price").innerHTML = product.price;
        });
        var span = document.getElementsByClassName("close")[0];
        var modal = document.getElementById("myModal");
        span.onclick = function () {
            modal.style.display = "none";
        }
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
        displayProductDetails(product);
    } else {
        const descriptionDiv = document.getElementById('product-description');
        descriptionDiv.innerHTML = `<p>Product not found.</p>`;
    }
}
function displayProductDetails(product) {

    const starRatingDiv = document.getElementById('star-rating');
    const soldCountDiv = document.getElementById('sold-count');
    const commentsDiv = document.getElementById('comments');

    commentsDiv.innerHTML = '';
    fetchComments(product);

    document.getElementById('submit-comment').addEventListener('click', () => {
        const commentInput = document.getElementById('comment-input');
        const ratingValue = document.getElementById('rating-input').value;
        if (ratingValue == 0) {
            alert('Vui lòng đánh giá')
        } else {
            const user = document.getElementById('user-user').value;
            //const rate1 = event.target.getAttribute('data-value');;
            const newComment = {
                productId: getProductIndexFromURL(),
                user: user,
                text: commentInput.value,
                rating: parseInt(ratingValue)
            };
            saveComment(newComment);
            commentInput.value = '';
            document.getElementById('rating-input').value = '0'; // Reset rating
            updateStars(0); // Reset star display
        }

    });
    commentsDiv.addEventListener('click', (event) => {
        if (event.target.classList.contains('star')) {
            const rating = event.target.getAttribute('data-value');
            document.getElementById('rating-input').value = rating;
            updateStars(rating);
        }
    });
}

function updateStars(rating) {
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
        if (parseInt(star.getAttribute('data-value')) <= rating) {
            star.classList.add('filled');
        } else {
            star.classList.remove('filled');
        }
    });
}

function saveComment(comment) {

    if (document.getElementById('user-user').value !== '') {
        addDoc(collection(db, 'comments'), comment)
            .then(() => {
                fetchComments(products[getProductIndexFromURL()]);
            })
            .catch(error => console.error('Error saving comment:', error));
            alert('Cám ơn bạn đã đánh giá sản phẩm')
    } else {
        addDoc(collection(db, 'comments'), comment)
            .then(() => {
                fetchComments(products[getProductIndexFromURL()]);
            })
            .catch(error => console.error('Error saving comment:', error));
        alert('Vui lòng đăng nhập')
        // Nhớ clear star chổ đánh giá fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    }

}
async function saveSoldProduct(soldProduct) {
    try {
        await addDoc(collection(db, 'soldProducts'), soldProduct);
        console.log('Sold product saved:', soldProduct);
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error saving sold product:', error);
    }
}
function addToCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find(product => product.name === products[index].name);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        const productToAdd = { ...products[index], quantity: parseInt(document.getElementById('number').value) };
        cart.push(productToAdd);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalCount = cart.reduce((sum, product) => sum + product.quantity, 0);
    document.getElementById('cart-count').innerText = totalCount;
}


function displayOrderForm() {
    document.getElementById('order-form').style.display = 'block';
    document.getElementById('confirm-order').addEventListener('click', confirmOrder);
}

async function confirmOrder() {
    document.getElementById('myModal').style.display = 'none';

    const index = getProductIndexFromURL();
    addToCart(index);
    const product = products[index];
    const emaily = document.getElementById('customer-email').value;
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (emaily !== '') {

        var params = {
            ordersp: product.name,
            orderprice: product.price,
            quantity: document.getElementById('number').value,
            phone: document.getElementById('customer-sdt').value,
            name: document.getElementById('user-user').value, // Tên khách hàng
            email: document.getElementById('customer-email').value, //Email khách hàng
            message: document.getElementById('customer-name').value, //Thông tin từ khách hàng
        };

        const serviceID = "service_pb9rcvw";
        const templateID = "template_contact_form";


        emailjs.send(serviceID, templateID, params)
            .then(res => {
                document.getElementById("number").value = "";
                document.getElementById("customer-sdt").value = "";
                document.getElementById("customer-name").value = "";
                console.log(res);

                for (const item of cart) {
                    const soldProduct = {
                        name: item.name,
                        quantity: item.quantity,
                        userEmail: emaily
                    };
                    saveSoldProduct(soldProduct);
                }

                localStorage.removeItem('cart');
                updateCartCount();
                alert("Mua hàng thành công!!!")
                //window.location.href = 'index.html';
            })
            .catch(err => console.log(err));


    } else {
        alert('Vui lòng đăng nhập Gmail')
    }
}

document.addEventListener('DOMContentLoaded', () => {
    displayProductDescription();
    updateCartCount();
    setupStarRating()
});

function setupStarRating() {
    const ratingContainer = document.getElementById('rating-container');
    const stars = ratingContainer.querySelectorAll('.star');
    stars.forEach(star => {
        star.addEventListener('click', handleStarClick);
        star.addEventListener('mouseover', handleStarMouseOver);
        star.addEventListener('mouseout', handleStarMouseOut);
    });
}

function handleStarClick(event) {
    const value = event.target.getAttribute('data-value');
    console.log(value)
    document.getElementById('rating-input').value = value;
    highlightStars(value);
}

function handleStarMouseOver(event) {
    const value = event.target.getAttribute('data-value');
    highlightStars(value);
}

function handleStarMouseOut() {
    const value = document.getElementById('rating-input').value;
    highlightStars(value);
}

function highlightStars(value) {
    const ratingContainer = document.getElementById('rating-container');
    const stars = ratingContainer.querySelectorAll('.star');
    stars.forEach(star => {
        if (star.getAttribute('data-value') <= value) {
            star.classList.add('highlighted');
        } else {
            star.classList.remove('highlighted');
        }
    });
}



const decrementButton = document.getElementById('decrement');
const incrementButton = document.getElementById('increment');
const numberInput = document.getElementById('number');

decrementButton.addEventListener('click', () => {
    const currentValue = parseInt(numberInput.value);
    if (currentValue > parseInt(numberInput.min)) {
        numberInput.value = currentValue - 1;
        document.getElementById('number').value = numberInput.value
        console.log(document.getElementById('number').value)
    }
});

incrementButton.addEventListener('click', () => {
    const currentValue = parseInt(numberInput.value);
    numberInput.value = currentValue + 1;
    document.getElementById('number').value = numberInput.value
    console.log(document.getElementById('number').value)
});











