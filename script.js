// ----- DATA: an array of objects -----
const products = [
  { id: 1, name: "Headphones",    emoji: "🎧", price: 4999,  discount: 10, category: "Electronics" },
  { id: 2, name: "Running Shoes", emoji: "👟", price: 6200,  discount: 0,  category: "Fashion" },
  { id: 3, name: "Plant Pot",     emoji: "🪴", price: 1150,  discount: 0,  category: "Home" },
  { id: 4, name: "Wrist Watch",   emoji: "⌚", price: 3450,  discount: 20, category: "Fashion" },
  { id: 5, name: "Leather Bag",   emoji: "🎒", price: 5800,  discount: 0,  category: "Handmade" },
  { id: 6, name: "Smartphone",    emoji: "📱", price: 42999, discount: 5,  category: "Electronics" },
  { id: 7, name: "Soy Candle",    emoji: "🕯️", price: 850,   discount: 0,  category: "Handmade" },
  { id: 8, name: "Book Set",      emoji: "📚", price: 2300,  discount: 15, category: "Books" }
];

// ----- Global variables (global scope) -----
const grid = document.getElementById("grid");
const search = document.getElementById("search");
const select = document.getElementById("category");
const cartLink = document.getElementById("cart");
const delivery = document.getElementById("delivery");
let cart = new Map(); // Map: product id -> quantity

// ----- Load saved cart (JSON + try/catch) -----
try {
  const saved = JSON.parse(localStorage.getItem("cart")) || [];
  cart = new Map(saved);
} catch (error) {
  console.log("Could not load cart:", error);
}

// ----- Functions + Math -----
function finalPrice(product) {
  return Math.round(product.price - (product.price * product.discount) / 100);
}

function showProducts(list) {
  let html = "";
  for (const p of list) {                                   // loop
    const oldPrice = p.discount > 0 ? `<s>Rs. ${p.price.toLocaleString()}</s>` : "";
    html += `<article>
      <p>${p.emoji}</p>
      <h3>${p.name}</h3>
      <span>Rs. ${finalPrice(p).toLocaleString()} ${oldPrice}</span>
      <button data-id="${p.id}">Add to cart</button>
    </article>`;
  }
  grid.innerHTML = html || "<p>No products found.</p>";    // output to the page
}

function getTotals() {
  let count = 0;       // local (function) scope
  let total = 0;
  for (const [id, qty] of cart) {                           // loop over a Map
    const product = products.find(p => p.id === id);
    count += qty;
    total += finalPrice(product) * qty;
  }
  return { count: count, total: total };
}

function updateCart() {
  const totals = getTotals();
  cartLink.textContent = `Cart (${totals.count})`;

  if (totals.total >= 3000) {                               // if / else
    delivery.textContent = "You get free delivery! 🎉";
  } else {
    delivery.textContent = `Add Rs. ${3000 - totals.total} more for free delivery`;
  }
  localStorage.setItem("cart", JSON.stringify([...cart]));  // save as JSON
}

function applyFilters() {
  const text = search.value.trim().toLowerCase();           // string methods
  const category = select.value;
  const result = products.filter(p =>
    p.name.toLowerCase().includes(text) &&
    (category === "All" || p.category === category)
  );
  showProducts(result);
}

// ----- Set: unique categories for the dropdown -----
const categories = new Set(products.map(p => p.category));
for (const c of categories) {
  select.innerHTML += `<option>${c}</option>`;
}

// ----- Events -----
document.getElementById("search-form").addEventListener("submit", function (e) {
  e.preventDefault();
  applyFilters();
});
search.addEventListener("input", applyFilters);
select.addEventListener("change", applyFilters);

grid.addEventListener("click", function (e) {
  if (e.target.tagName === "BUTTON") {
    const id = Number(e.target.dataset.id);
    cart.set(id, (cart.get(id) || 0) + 1);
    console.log("Cart now:", cart);                         // debugging
    updateCart();
  }
});

cartLink.addEventListener("click", function (e) {
  e.preventDefault();
  const totals = getTotals();
  alert(`Items: ${totals.count}\nTotal: Rs. ${totals.total.toLocaleString()}`);
});

// ----- RegExp: newsletter email check -----
document.getElementById("newsletter").addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  document.getElementById("message").textContent =
    pattern.test(email) ? "Thanks for subscribing!" : "Please enter a valid email.";
});

// ----- Timer: rotate the banner text every 3 seconds -----
const messages = [
  "Big season sale. Up to 50% off.",
  "Free delivery on orders over Rs. 3,000.",
  "New handmade items added daily."
];
let index = 0;
setInterval(function () {
  index = (index + 1) % messages.length;
  document.getElementById("hero-text").textContent = messages[index];
}, 3000);

// ----- Date: greeting and footer year -----
const now = new Date();
const hour = now.getHours();
let greeting = "Good evening";
if (hour < 12) {
  greeting = "Good morning";
} else if (hour < 18) {
  greeting = "Good afternoon";
}
document.getElementById("greeting").textContent = `${greeting}! Today is ${now.toDateString()}.`;
document.getElementById("year").textContent = now.getFullYear();

// ----- Start -----
showProducts(products);
updateCart();
