const mySwiper = new Swiper(".swiper-container", {
  loop: true,

  // Navigation arrows
  navigation: {
    nextEl: ".slider-button-next",
    prevEl: ".slider-button-prev",
  },
});

// Cart

const buttonCart = document.querySelector(".button-cart"); // button cart
const modalCart = document.querySelector("#modal-cart"); //modal dialog cart
// Goods

const viewAll = document.querySelectorAll(".view-all"); // button 'view all'
const navigationLink = document.querySelectorAll(
  ".navigation-link:not(.view-all)"
); // buttons header menu
const longGoodsList = document.querySelector(".long-goods-list"); //product output block
const showAcsessories = document.querySelectorAll(".show-acsessories"); //Show accessories list
const showClothing = document.querySelectorAll(".show-clothing"); //Show clothing list
const cartTableGoods = document.querySelector(".cart-table__goods"); //number of goods
const cardTableTotal = document.querySelector(".card-table__total"); //total price
const cartCount = document.querySelector(".cart-count");
const btnDanger = document.querySelector(".btn-danger");
// Receiving data from the server
const getGoods = async () => {
  const result = await fetch("db/db.json");
  if (!result.ok) {
    throw "Ошибка: " + result.status;
  }
  return await result.json();
};

// Basket management function
const cart = {
  // Parameters of individual products
  cartGoods: [],
  // Counter near the basket
  countQuantity() {
    cartCount.textContent = this.cartGoods.reduce((sum, item) => {
      return sum + item.count;
    }, 0);
  },
  clearCart() {
    this.cartGoods.length = 0;
    this.countQuantity();
    this.renderCart();
  },
  // Creating a table with a product
  renderCart() {
    cartTableGoods.textContent = "";
    this.cartGoods.forEach(({ id, name, price, count }) => {
      const trGood = document.createElement("tr");
      trGood.className = "cart-item";
      trGood.dataset.id = id;

      trGood.innerHTML = `
        <td>${name}</td>
        <td>${price}$</td>
        <td><button class="cart-btn-minus">-</button></td>
        <td>${count}</td>
        <td><button class="cart-btn-plus">+</button></td>
        <td>${price * count}$</td>
        <td>
        <button class="cart-btn-delete">x</button></td>
      `;
      cartTableGoods.append(trGood);
    });

    // Calculating the final price
    const totalPrice = this.cartGoods.reduce((sum, item) => {
      return sum + item.price * item.count;
    }, 0);
    cardTableTotal.textContent = totalPrice + "$";
  },

  // Removing an item
  deleteGood(id) {
    this.cartGoods = this.cartGoods.filter((item) => id !== item.id);
    this.renderCart();
    this.countQuantity();
  },

  // Decrease the quantity of goods
  minusGood(id) {
    for (const item of this.cartGoods) {
      if (item.id === id) {
        if (item.count <= 1) {
          this.deleteGood(id);
        } else {
          item.count--;
        }
        break;
      }
    }
    this.renderCart();
    this.countQuantity();
  },

  // Increase the quantity of goods
  plusGood(id) {
    for (const item of this.cartGoods) {
      if (item.id === id) {
        item.count++;
        break;
      }
    }
    this.renderCart();
    this.countQuantity();
  },

  // Add an item
  addCartGoods(id) {
    const goodItem = this.cartGoods.find((item) => item.id === id);
    if (goodItem) {
      this.plusGood(id);
    } else {
      getGoods()
        .then((data) => data.find((item) => item.id === id))
        .then(({ id, name, price }) => {
          this.cartGoods.push({
            id,
            name,
            price,
            count: 1,
          });
          this.countQuantity();
        });
    }
  },
};

btnDanger.addEventListener("click", () => {
  cart.clearCart();
});

// Add items to cart from store by button
document.body.addEventListener("click", (event) => {
  const addToCart = event.target.closest(".add-to-cart");

  if (addToCart) {
    cart.addCartGoods(addToCart.dataset.id);
  }
});

// Button click tracking
cartTableGoods.addEventListener("click", (event) => {
  const target = event.target;

  if (target.tagName === "BUTTON") {
    const id = target.closest(".cart-item").dataset.id;

    // Checking for hitting delete
    if (target.classList.contains("cart-btn-delete")) {
      cart.deleteGood(id);
    }

    // Checking for hitting minus
    if (target.classList.contains("cart-btn-minus")) {
      cart.minusGood(id);
    }

    // Checking for hitting plus
    if (target.classList.contains("cart-btn-plus")) {
      cart.plusGood(id);
    }
  }
});

// Add show class for modal window
const openModal = () => {
  cart.renderCart();
  modalCart.classList.add("show");
};

//Remove show class for modal window
const closeModal = () => {
  modalCart.classList.remove("show");
};

// Listener Click
buttonCart.addEventListener("click", openModal);

// overlay click test
modalCart.addEventListener("click", function (event) {
  const target = event.target;

  // Close the window via overlay or by button
  if (
    target.classList.contains("overlay") ||
    target.classList.contains("modal-close")
  ) {
    closeModal();
  }
});

// Scroll smooth
(function () {
  const scrollLinks = document.querySelectorAll("a.scroll-link");

  for (const scrollLink of scrollLinks) {
    scrollLink.addEventListener("click", (event) => {
      event.preventDefault();
      const id = scrollLink.getAttribute("href");
      document.querySelector(id).scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }
})();

// function create card

const createCard = function ({ label, name, img, description, id, price }) {
  const card = document.createElement("div");
  card.className = "col-lg-3 col-sm-6";

  card.innerHTML = `
    <div class="goods-card">
    ${label ? `<span class="label">${label}</span>` : ""}
      
      <img src='db/${img}' alt='${name}' class="goods-image"/>
      <h3 class="goods-title">${name}</h3>
      <p class="goods-description">${description}</p>
      <button class="button goods-card-btn add-to-cart" data-id='${id}'>
        <span class="button-price">$${price}</span>
      </button>
    </div>
  `;
  return card;
};

//Show cards on page
const renderCards = (data) => {
  longGoodsList.textContent = "";
  const cards = data.map(createCard);
  longGoodsList.append(...cards);
  document.body.classList.add("show-goods");
};

const showAll = (event) => {
  event.preventDefault();
  getGoods().then(renderCards);
};

viewAll.forEach((elem) => {
  elem.addEventListener("click", showAll);
});

const filterCards = function (field, value) {
  getGoods()
    .then((data) => data.filter((good) => good[field] === value))
    .then(renderCards);
};

//Links in the header

navigationLink.forEach(function (link) {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const field = link.dataset.field;
    const value = link.textContent;
    filterCards(field, value);
  });
});

showAcsessories.forEach((item) => {
  item.addEventListener("click", (event) => {
    event.preventDefault();
    filterCards("category", "Accessories");
  });
});
showClothing.forEach((item) => {
  item.addEventListener("click", (event) => {
    event.preventDefault();
    filterCards("category", "Clothing");
  });
});
