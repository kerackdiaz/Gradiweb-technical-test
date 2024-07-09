import { store } from "./fetch.js";
const products = store.products.nodes;
console.log(products);

// //this function create a carrousell with the products
function Carousel() {
    if (products.length > 0) {
        const container = document.getElementById("productsContainer");
        const carousel = document.createElement("div");
        carousel.classList.add("carousel");
        container.appendChild(carousel);

        const leftButton = document.createElement("button");
        leftButton.id = 'scrollLeft';
        leftButton.innerHTML = `<svg width="18" height="18" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="m6.38,1.12L1.12,6.38l5.25,5.25" stroke="#75B3CB" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" />
                    </svg>`;
        const rightButton = document.createElement("button");
        rightButton.id = 'scrollRight';
        rightButton.innerHTML = `<svg width="18" height="18" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="m1.12,1.12l5.25,5.25L1.12,11.62" stroke="#75B3CB" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" />
                    </svg>`;
        carousel.appendChild(leftButton);
        carousel.appendChild(rightButton);

        const productsContainer = document.getElementById("productsWrapper");
        if (!productsContainer) {
            console.error("Elemento #productsWrapper no encontrado.");
            return; 
        }
        const productCard = productsContainer.querySelector(".productCard");
        const scrollDistance = productCard ? productCard.offsetWidth*2 : 200; 
        console.log(scrollDistance);

        leftButton.addEventListener('click', () => {
            if (productsContainer.scrollLeft <= 0) {
                productsContainer.scrollLeft = productsContainer.scrollWidth;
            } else {
                productsContainer.scrollBy({ left: -scrollDistance, behavior: 'smooth' });
            }
        });

        rightButton.addEventListener('click', () => {
            if (productsContainer.scrollLeft >= productsContainer.scrollWidth - productsContainer.clientWidth) {
                productsContainer.scrollLeft = 0;
            } else {
                productsContainer.scrollBy({ left: scrollDistance, behavior: 'smooth' });
            }
        });
    }
}


// This function will render the products in the store
    function renderProducts() {
        const productsContainer = document.getElementById("productsContainer");
        const productsWrapper = document.createElement("div");
        productsWrapper.id ="productsWrapper";
    
        products.forEach(product => {
            const productElement = document.createElement("article");
            productElement.classList.add("productCard");
            productElement.id = product.id;
            const priceText = product.prices.max.amount === product.prices.min.amount ? 
                `${product.prices.max.amount}` : 
                product.prices.max.amount > product.prices.min.amount ? 
                `${product.prices.min.amount} - <span class="priceHigher">${product.prices.max.amount}</span>` : 
                `${product.prices.min.amount} - ${product.prices.max.amount}`;
            const ratingValue = parseInt(product.tags[0]); 
            const ratingStars = Math.ceil(ratingValue / 100);
            const productId = product.id.match(/\d+$/)[0];
            productElement.id = productId;
        productElement.innerHTML = `
            <img src="${product.featuredImage.url}" alt="${product.title}">
            <h3>${product.title}</h3>
            <div class="productDetail">
                <div class="ratingContainer">
                    <svg class="rating" width="122" height="22" viewBox="0 0 122 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path class="star star-1" d="M11 0L13.4697 7.60081H21.4616L14.996 12.2984L17.4656 19.8992L11 15.2016L4.53436 19.8992L7.00402 12.2984L0.538379 7.60081H8.53035L11 0Z" fill="#FFD058" />
                        <path class="star star-2" d="M36 0L38.4697 7.60081H46.4616L39.996 12.2984L42.4656 19.8992L36 15.2016L29.5344 19.8992L32.004 12.2984L25.5384 7.60081H33.5303L36 0Z" fill="#FFD058" />
                        <path class="star star-3" d="M61 0L63.4697 7.60081H71.4616L64.996 12.2984L67.4656 19.8992L61 15.2016L54.5344 19.8992L57.004 12.2984L50.5384 7.60081H58.5303L61 0Z" fill="#FFD058" /> 
                        <path class="star star-4" d="M86 0L88.4697 7.60081H96.4616L89.996 12.2984L92.4656 19.8992L86 15.2016L79.5344 19.8992L82.004 12.2984L75.5384 7.60081H83.5303L86 0Z" fill="#FFD058" />
                        <path class="star star-5" d="M111 0L113.47 7.60081H121.462L114.996 12.2984L117.466 19.8992L111 15.2016L104.534 19.8992L107.004 12.2984L100.538 7.60081H108.53L111 0Z" fill="#FFD058" />
                    </svg>
                    <p class="starts">(${ratingValue})</p>
                </div>
                <p class="productPrice">€${priceText}</p>
            </div>
            <button id="${productId}" class="addCart">Add to cart</button>
        `;
        const stars = productElement.querySelectorAll('.star');
        stars.forEach((star, index) => {
            if (index < ratingStars) {
                star.style.fill = '#FFD058'; 
            } else {
                star.style.fill = '#DDDDDD'; 
            }
        });

        productsWrapper.appendChild(productElement);
    });
    

    productsContainer.appendChild(productsWrapper);
}


//this function add the products to the cart
function triggerPurchaseDetail() {
    const productCard = document.querySelectorAll('.productCard');
    productCard.forEach(product => {

        product.addEventListener('mouseenter', () => {
            createPurchaseDetail(product);
            const newDiv = product.querySelector('.productDetails');
            if(newDiv){
                newDiv.style.display = '';
            }
        });

        product.addEventListener('touchstart', () => {
            createPurchaseDetail(product);
        });
    });
}

function createPurchaseDetail(product) {
    const newDiv = document.createElement('div');
    const productPriceText = product.querySelector('.productPrice').textContent;
    const productPrice = parseFloat(productPriceText.replace('€', ''));
    newDiv.innerHTML = `
        <form>
            <span>
            <input type="checkbox" id="productOption1" name="productOption" value="option1">
            <label for="productOption1">One-time purchase <span>€${productPrice}</span></label>
            </span>
            <span>
            <input type="checkbox" id="productOption2" name="productOption" value="option2">
            <label for="productOption2">Subscribe for <span>€${(productPrice*0.8).toFixed(2)}</span> </label>
            <p>Save 20%</p>
            </span>
            <select id="dropdown">
                <option value="option1">1x per month</option>
                <option value="option2">3 months</option>
                <option value="option3">6 months</option>
                <option value="option4">12 months</option>
            </select>
            <button type="submit">ADD TO CARD - </button>
        </form>`;
    newDiv.classList.add('productDetails');

    if (!product.querySelector('.productDetails')) {
        product.appendChild(newDiv);
    }

    const checkboxes = newDiv.querySelectorAll('input[type="checkbox"][name="productOption"]');
    const submitButton = newDiv.querySelector('button[type="submit"]');

    document.addEventListener('mouseover', function(event) {
        if (!newDiv.contains(event.target) && !product.contains(event.target)) {
            newDiv.style.display = 'none';
        }
    });

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {

            if (this.checked) {
                checkboxes.forEach(box => {
                    if (box !== this) box.checked = false;
                });

                const priceText = this.nextElementSibling.querySelector('span').textContent;
                submitButton.textContent = `ADD TO CARD - ${priceText}`;
            }
        });
    });
}



renderProducts();

Carousel();

triggerPurchaseDetail();