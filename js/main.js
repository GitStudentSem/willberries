const mySwiper = new Swiper(".swiper-container", {
  loop: true,

  // Navigation arrows
  navigation: {
    nextEl: ".slider-button-next",
    prevEl: ".slider-button-prev",
  },
});

// Cart

const buttonCart = document.querySelector(".button-cart");
const modalCart = document.querySelector("#modal-cart");

const openModal = function () {
  modalCart.classList.add("show");
};

const closeModal = function () {
  modalCart.classList.remove("show");
};

// Listener Click
buttonCart.addEventListener("click", openModal);

modalCart.addEventListener("click", function (event) {
  const target = event.target;

  // Close modal
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
    scrollLink.addEventListener("click", function (event) {
      event.preventDefault();
      const id = scrollLink.getAttribute("href");
      document.querySelector(id).scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }
})();

// Goods

const more = document.querySelector(".more"); // button 'view all'
const navigationLink = document.querySelectorAll(".navigation-link"); // buttons header menu
const longGoodsList = document.querySelector(".long-goods-list"); //product output block

// Receiving data from the server
const getGoods = async function () {
  const result = await fetch("db/db.json");
  if (!result.ok) {
    throw "Ошибка: " + result.status;
  }
  return await result.json();
};

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
const renderCards = function (data) {
  longGoodsList.textContent = "";
  const cards = data.map(createCard);
  longGoodsList.append(...cards);
  document.body.classList.add("show-goods");
};

more.addEventListener("click", function (event) {
  event.preventDefault();
  getGoods().then(renderCards);
});

const filterCards = function (field, value) {
  getGoods()
    .then(function (data) {
      const filteredGoods = data.filter(function (good) {
        return good[field] === value;
      });
      return filteredGoods;
    })
    .then(renderCards);
};

//Links in the header

navigationLink.forEach(function (link) {
  link.addEventListener("click", function (event) {
    event.preventDefault();
    const field = link.dataset.field;
    const value = link.textContent;
    filterCards(field, value);
  });
});

// Кусок кода
const fashion = document.querySelector(".fashion");
fashion.addEventListener("click", function (event) {
  event.preventDefault();
  const field = "category";
  const value = "Accessories";
  filterCards(field, value);
});

const shoeses = document.querySelector(".shoeses");
shoeses.addEventListener("click", function (event) {
  event.preventDefault();
  const field = "category";
  const value = "Shoes";
  filterCards(field, value);
});

kana.addEventListener("click", function (event) {
  event.preventDefault();
  getGoods().then(renderCards);
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});
