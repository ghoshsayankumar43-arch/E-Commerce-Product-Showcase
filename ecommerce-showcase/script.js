/***********************
 1. LOGIN SYSTEM
***********************/
const loginSection = document.getElementById("login-section");
const shopSection = document.getElementById("shop-section");
const loginBtn = document.getElementById("login-btn");
const loginError = document.getElementById("login-error");

loginBtn.addEventListener("click", () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username && password) { // accept any values
    loginSection.style.display = "none";
    shopSection.style.display = "block";
  } else {
    loginError.style.display = "block";
  }
});


/***********************
 2. PRODUCT FILTER
***********************/
const filterButtons = document.querySelectorAll(".filter-btn");
const productCards = document.querySelectorAll(".product-card");

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const category = btn.dataset.category;
    productCards.forEach(card => {
      if (category === "all" || card.dataset.category === category) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
});


/***********************
 3. PRODUCT MODAL VIEW
***********************/
const modal = document.getElementById("product-modal");
const modalImg = document.getElementById("modal-img");
const modalTitle = document.getElementById("modal-title");
const modalPrice = document.getElementById("modal-price");
const modalAddBtn = document.getElementById("modal-add-cart");
const closeModal = document.querySelector(".close-modal");

let selectedProduct = { name: "", price: 0 };

// Open modal on product click
document.querySelectorAll(".product-card").forEach(card => {
  card.addEventListener("click", () => {
    const imgSrc = card.querySelector("img").src;
    const name = card.querySelector("h3").innerText;
    const price = parseFloat(card.querySelector("p").innerText.replace("₹", ""));

    selectedProduct = { name, price };

    modalImg.src = imgSrc;
    modalTitle.innerText = name;
    modalPrice.innerText = "₹" + price.toFixed(2);

    modal.style.display = "flex";
  });
});

// Close modal
closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

// Add to cart from modal
modalAddBtn.addEventListener("click", () => {
  cart.push({ name: selectedProduct.name, price: selectedProduct.price });
  updateCart();
  modal.style.display = "none";
});

// Close modal if clicked outside
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});


/***********************
 4. CART LOGIC
***********************/
let cart = [];
const cartBtn = document.getElementById("cart-btn");
const cartSidebar = document.getElementById("cart-sidebar");
const closeCartBtn = document.getElementById("close-cart");
const cartItemsList = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");

function updateCart() {
  cartItemsList.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;
    const li = document.createElement("li");
    li.textContent = `${item.name} - ₹${item.price.toFixed(2)}`;
    
    // remove button
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "❌";
    removeBtn.style.marginLeft = "10px";
    removeBtn.addEventListener("click", () => {
      cart.splice(index, 1);
      updateCart();
    });

    li.appendChild(removeBtn);
    cartItemsList.appendChild(li);
  });

  cartCount.innerText = cart.length;
  cartTotal.innerText = total.toFixed(2);
}

cartBtn.addEventListener("click", () => {
  cartSidebar.classList.add("active");
});
closeCartBtn.addEventListener("click", () => {
  cartSidebar.classList.remove("active");
});


/***********************
 5. CHECKOUT LOGIC
***********************/
const proceedCheckoutBtn = document.getElementById("proceed-checkout");
const checkoutSection = document.getElementById("checkout-section");
const checkoutForm = document.getElementById("checkout-form");
const orderMessage = document.getElementById("order-message");

proceedCheckoutBtn.addEventListener("click", () => {
  cartSidebar.classList.remove("active");
  checkoutSection.style.display = "block";
});

checkoutForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("cust-name").value;
  const address = document.getElementById("cust-address").value;

  if (name && address) {
    const order = {
      customer: {
        name,
        address
      },
      items: [...cart],
      total: cart.reduce((sum, item) => sum + item.price, 0),
      date: new Date().toISOString()
    };

    // Save order to localStorage
    let storedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    storedOrders.push(order);
    localStorage.setItem("orders", JSON.stringify(storedOrders));

    // Confirmation
    orderMessage.style.display = "block";
    checkoutForm.reset();
    cart = []; // clear cart
    updateCart();
  }
});
