const navbarNav = document.querySelector(".navbar-nav");
document.querySelector("#hamburger-menu").onclick = () => {
  navbarNav.classList.toggle("active");
  document.querySelectorAll.onclick = () => {
    navbarNav.classList.toggle("");
  };
};

// sidebar klik untuk menghilangkan menu

const hamburger = document.querySelector("#hamburger-menu");

document.addEventListener("click", function (e) {
  if (!hamburger.contains(e.target) && !navbarNav.contains(e.target)) {
    navbarNav.classList.remove("active");
  }
  if (!sb.contains(e.target) && !searchForm.contains(e.target)) {
    searchForm.classList.remove("active");
  }
});

let listProductHTML = document.querySelector(".listproduct");
let listcartHTML = document.querySelector(".listcart");
let iconCart = document.querySelector(".shopping-cart");
let iconCartSpan = document.querySelector(".shopping-cart span");
let body = document.querySelector("body");
let closeCart = document.querySelector(".close");

let products = [];
let cart = [];

iconCart.addEventListener("click", () => {
  body.classList.toggle("showcart");
});
closeCart.addEventListener("click", () => {
  body.classList.toggle("showcart");
});

const addDataToHTML = () => {
  // remove datas default from HTML

  // add new datas
  if (products.length > 0) {
    // if has data
    products.forEach((product) => {
      let newProduct = document.createElement("div");
      newProduct.dataset.id = product.id;
      newProduct.classList.add("product-card");
      newProduct.innerHTML = `<div class="product-image">
      <img src="${product.image}" alt="">
      <p>Brand New</p></div>
      <div class="product-content"><p>${product.name}</p></div>
      <div class="product-price"><div class="price">Rp. ${product.price}</div></div>
      <button class="addcart">Add To Cart</button>`;
      listProductHTML.appendChild(newProduct);
    });
  }
};
listProductHTML.addEventListener("click", (event) => {
  let positionClick = event.target;
  if (positionClick.classList.contains("addcart")) {
    let id_product = positionClick.parentElement.dataset.id;
    addToCart(id_product);
  }
});
const addToCart = (product_id) => {
  let positionThisProductInCart = cart.findIndex(
    (value) => value.product_id == product_id
  );
  if (cart.length <= 0) {
    cart = [
      {
        product_id: product_id,
        quantity: 1,
      },
    ];
  } else if (positionThisProductInCart < 0) {
    cart.push({
      product_id: product_id,
      quantity: 1,
    });
  } else {
    cart[positionThisProductInCart].quantity =
      cart[positionThisProductInCart].quantity + 1;
  }
  addCartToHTML();
  addCartToMemory();
};
const addCartToMemory = () => {
  localStorage.setItem("cart", JSON.stringify(cart));
};
const addCartToHTML = () => {
  listcartHTML.innerHTML = "";
  let totalQuantity = 0;
  if (cart.length > 0) {
    cart.forEach((item) => {
      totalQuantity = totalQuantity + item.quantity;
      let newItem = document.createElement("div");
      newItem.classList.add("item");
      newItem.dataset.id = item.product_id;

      let positionProduct = products.findIndex(
        (value) => value.id == item.product_id
      );
      let info = products[positionProduct];
      listcartHTML.appendChild(newItem);
      newItem.innerHTML = `
          <div class="image">
                  <img src="${info.image}">
              </div>
              <div class="name">
              ${info.name}
              </div>
              <div class="totalprice">Rp. ${info.price * item.quantity}</div>
              <div class="quantity">
                  <span class="minus"><</span>
                  <span>${item.quantity}</span>
                  <span class="plus">></span>
              </div>
          `;
    });
  }
  iconCartSpan.innerText = totalQuantity;
};
listcartHTML.addEventListener("click", (event) => {
  let positionClick = event.target;
  if (
    positionClick.classList.contains("minus") ||
    positionClick.classList.contains("plus")
  ) {
    let product_id = positionClick.parentElement.parentElement.dataset.id;
    let type = "minus";
    if (positionClick.classList.contains("plus")) {
      type = "plus";
    }
    changeQuantityCart(product_id, type);
  }
});
const changeQuantityCart = (product_id, type) => {
  let positionItemInCart = cart.findIndex(
    (value) => value.product_id == product_id
  );
  if (positionItemInCart >= 0) {
    let info = cart[positionItemInCart];
    switch (type) {
      case "plus":
        cart[positionItemInCart].quantity =
          cart[positionItemInCart].quantity + 1;
        break;

      default:
        let changeQuantity = cart[positionItemInCart].quantity - 1;
        if (changeQuantity > 0) {
          cart[positionItemInCart].quantity = changeQuantity;
        } else {
          cart.splice(positionItemInCart, 1);
        }
        break;
    }
  }
  addCartToHTML();
  addCartToMemory();
};

const initApp = () => {
  // get data product
  fetch("products.json")
    .then((response) => response.json())
    .then((data) => {
      products = data;
      addDataToHTML();

      // get data cart from memory
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
        addCartToHTML();
      }
    });
};
initApp();
