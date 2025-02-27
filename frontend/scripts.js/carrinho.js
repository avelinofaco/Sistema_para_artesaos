// document.addEventListener("DOMContentLoaded", function () {
//     const cartItemsContainer = document.getElementById("cart-items");
//     const totalPriceElement = document.getElementById("total-price");
//     const checkoutButton = document.querySelector(".checkout-button");

//     function checkLogin() {
//         return JSON.parse(localStorage.getItem("loggedUser"));
//     }

//     function redirectIfNotLoggedIn() {
//         if (!checkLogin()) {
//             alert("Você precisa estar logado para acessar o carrinho.");
//             localStorage.setItem("redirectTo", "carrinho.html");
//             window.location.href = "login.html";
//         }
//     }

//     function loadCartItems() {
//         const cart = JSON.parse(localStorage.getItem("cart")) || [];
//         cartItemsContainer.innerHTML = "";

//         let totalPrice = 0;

//         cart.forEach((item, index) => {
//             const itemElement = document.createElement("div");
//             itemElement.classList.add("cart-item");

//             itemElement.innerHTML = `
//                 <img src="${item.image}" alt="${item.name}">
//                 <div class="item-details">
//                     <h3>${item.name}</h3>
//                     <p>Preço: R$ ${item.price}</p>
//                 </div>
//                 <button class="remove-item" data-index="${index}">Remover</button>`;

//             cartItemsContainer.appendChild(itemElement);
//             totalPrice += parseFloat(item.price);
//         });

//         totalPriceElement.innerText = `R$ ${totalPrice.toFixed(2)}`;
//     }

//     function removeItemFromCart(index) {
//         let cart = JSON.parse(localStorage.getItem("cart")) || [];
//         cart.splice(index, 1);
//         localStorage.setItem("cart", JSON.stringify(cart));
//         loadCartItems();
//     }

//     cartItemsContainer.addEventListener("click", function (event) {
//         if (event.target.classList.contains("remove-item")) {
//             const index = event.target.getAttribute("data-index");
//             removeItemFromCart(index);
//         }
//     });

//     checkoutButton.addEventListener("click", function () {
//         localStorage.removeItem("cart");
//         window.location.href = "realizarPag.html";
//     });

//     redirectIfNotLoggedIn(); // Verifica se o usuário está logado antes de carregar a página
//     loadCartItems();
// });
document.addEventListener("DOMContentLoaded", function () {
    const cartItemsContainer = document.getElementById("cart-items");
    const totalPriceElement = document.getElementById("total-price");
    const checkoutButton = document.querySelector(".checkout-button");

    function checkLogin() {
        return JSON.parse(localStorage.getItem("loggedUser"));
    }

    function redirectIfNotLoggedIn() {
        if (!checkLogin()) {
            localStorage.setItem("redirectTo", "carrinho.html");
            window.location.href = "login.html";
        }
    }

    function loadCartItems() {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        cartItemsContainer.innerHTML = "";

        let totalPrice = 0;

        cart.forEach((item, index) => {
            const itemElement = document.createElement("div");
            itemElement.classList.add("cart-item");

            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p>Preço: R$ ${parseFloat(item.price).toFixed(2)}</p>
                </div>
                <button class="remove-item" data-index="${index}">Remover</button>`;

            cartItemsContainer.appendChild(itemElement);
            totalPrice += parseFloat(item.price);
        });

        totalPriceElement.innerText = `R$ ${totalPrice.toFixed(2)}`;
    }

    function removeItemFromCart(index) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        loadCartItems();
    }

    cartItemsContainer.addEventListener("click", function (event) {
        if (event.target.classList.contains("remove-item")) {
            const index = event.target.getAttribute("data-index");
            removeItemFromCart(index);
        }
    });

    checkoutButton.addEventListener("click", function () {
        loadCartItemsOnPaymentPage(); // Carregar itens antes de redirecionar
        window.location.href = "realizarPag.html";
    });

    function loadCartItemsOnPaymentPage() {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        localStorage.setItem("cartOnPayment", JSON.stringify(cart));
    }

    redirectIfNotLoggedIn(); // Verifica se o usuário está logado antes de carregar a página
    loadCartItems();
});

