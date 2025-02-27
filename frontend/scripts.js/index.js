// document.addEventListener("DOMContentLoaded", async function () {
//   const productContainer = document.querySelector("#product-list");
//   const searchInput = document.querySelector('input[type="text"]');
//   const cartIcon = document.querySelector(".bi-cart-check");
//   const categorySelect = document.querySelector("#category-select");

//   // Função para buscar as categorias
//   async function fetchCategories() {
//     try {
//       const response = await fetch(
//         "http://localhost:1337/api/categorias?populate=*"
//       );
//       if (!response.ok) {
//         throw new Error(`Erro na requisição de categorias: ${response.status}`);
//       }
//       const result = await response.json();
//       if (!result || !result.data) {
//         throw new Error("Dados inválidos recebidos do Strapi");
//       }
//       return result.data;
//     } catch (error) {
//       console.error("Erro ao buscar categorias:", error);
//       return [];
//     }
//   }

//   // Função para buscar os produtos filtrados pela categoria
//   async function fetchProducts(categoryId = "") {
//     let url = "http://localhost:1337/api/produtos?populate=*";

//     if (categoryId) {
//       // Filtra os produtos pela categoria selecionada usando o ID da categoria
//       url = `http://localhost:1337/api/produtos?filters[categoria][id][$eq]=${categoryId}&populate=*`;
//     }

//     try {
//       const response = await fetch(url);
//       if (!response.ok) {
//         throw new Error(`Erro na requisição de produtos: ${response.status}`);
//       }
//       const result = await response.json();
//       if (!result || !result.data) {
//         throw new Error("Dados inválidos recebidos do Strapi");
//       }
//       return result.data;
//     } catch (error) {
//       console.error("Erro ao buscar produtos:", error);
//       return [];
//     }
//   }

//   // Função para renderizar os produtos na tela
//   async function renderProducts(categoryId = "") {
//     const products = await fetchProducts(categoryId);
//     productContainer.innerHTML = "";

//     if (products.length === 0) {
//       productContainer.innerHTML = "<p>Nenhum produto encontrado.</p>";
//       return;
//     }

//     products.forEach((product) => {
//       const imageUrl =
//         product.image &&
//         product.image.formats &&
//         product.image.formats.thumbnail
//           ? `http://localhost:1337${product.image.formats.thumbnail.url}`
//           : "https://via.placeholder.com/150"; // Imagem padrão

//       const productCard = document.createElement("div");
//       productCard.classList.add("product-card");
//       productCard.innerHTML = `
//           <img src="${imageUrl}" alt="${product.name}">
//           <h3><a href="#">${product.name}</a></h3>
//           <p>${product.description}</p>
//           <p><strong>R$ ${product.price}</strong></p>
//           <button class="button-car" data-id="${product.id}">Adicionar ao Carrinho</button>
//           <button class="button-buy" data-id="${product.id}">Comprar Agora</button>
//         `;
//       productContainer.appendChild(productCard);
//     });

//     attachEventListeners();
//   }

//   // Função para carregar categorias no select
//   async function loadCategories() {
//     const categories = await fetchCategories();
//     categories.forEach((category) => {
//       const option = document.createElement("option");
//       option.value = category.id;
//       option.textContent = category.name;
//       categorySelect.appendChild(option);
//     });
//   }

//   // Carrega as categorias no select
//   loadCategories();

//   // Evento para filtrar produtos com base na categoria selecionada
//   categorySelect.addEventListener("change", function () {
//     const selectedCategoryId = categorySelect.value;
//     renderProducts(selectedCategoryId);
//   });

//   // Função que verifica se o usuário está logado
//     function checkLogin() {
//       return JSON.parse(localStorage.getItem("loggedUser"));
//     }
  
//     // Função para adicionar o produto ao carrinho
//     function addToCart(product) {
//       let cart = JSON.parse(localStorage.getItem("cart")) || [];
//       cart.push(product);
//       localStorage.setItem("cart", JSON.stringify(cart));
//       updateCartIcon(cart.length);
//     }
  
//     //Função para atualizar o ícone do carrinho
//       function updateCartIcon(count) {
//           if (cartIcon) {
//               cartIcon.setAttribute("data-count", count);
//           }
//       }
  
//       // Função para manipular o evento de adicionar ao carrinho
//       function handleAddToCart(event) {
//           const loggedUser = checkLogin();
//           if (!loggedUser) {
//               alert("Você precisa estar logado para adicionar produtos ao carrinho.");
//               localStorage.setItem("redirectTo", "index.html");
//               window.location.href = "login.html";
//               return;
//           }
  
//           const productCard = event.target.closest(".product-card");
//           const product = {
//               name: productCard.querySelector("h3 a").innerText,
//               price: productCard.querySelector("p strong").innerText.replace("R$ ", ""),
//               image: productCard.querySelector("img").src
//           };
  
//           addToCart(product);
//       }
  
//       // Função para manipular o evento de compra imediata
//       function handleBuyNow(event) {
//           const loggedUser = checkLogin();
//           if (!loggedUser) {
//               alert("Você precisa estar logado para comprar.");
//               localStorage.setItem("redirectTo", "index.html");
//               window.location.href = "login.html";
//               return;
//           }
  
//           const productCard = event.target.closest(".product-card");
//           const product = {
//               name: productCard.querySelector("h3 a").innerText,
//               price: productCard.querySelector("p strong").innerText.replace("R$ ", ""),
//               image: productCard.querySelector("img").src
//           };
  
//           addToCart(product);
//           window.location.href = "realizarPag.html";
//       }
  
//     // Função para filtrar produtos
//     function filterProducts(event) {
//       const searchTerm = event.target.value.toLowerCase();
//       const productCards = document.querySelectorAll(".product-card");
  
//       productCards.forEach((card) => {
//         const productName = card.querySelector("h3 a").innerText.toLowerCase();
//         if (productName.includes(searchTerm)) {
//           card.style.display = "";
//         } else {
//           card.style.display = "none";
//         }
//       });
//     }
  
//     // Adiciona event listeners aos botões
//     function attachEventListeners() {
//       document.querySelectorAll(".button-car").forEach((button) => {
//         button.addEventListener("click", handleAddToCart);
//       });
  
//       document.querySelectorAll(".button-buy").forEach((button) => {
//         button.addEventListener("click", handleBuyNow);
//       });
//     }
  
//     // Event listener para filtro
//     searchInput.addEventListener("input", filterProducts);
  
//     // Renderiza os produtos e atualiza o ícone do carrinho ao carregar a página
//     renderProducts();
//     const cart = JSON.parse(localStorage.getItem("cart")) || [];
//     updateCartIcon(cart.length);
//   });








document.addEventListener("DOMContentLoaded", async function () {
  const productContainer = document.querySelector("#product-list");
  const searchInput = document.querySelector('input[type="text"]');
  const cartIcon = document.querySelector(".bi-cart-check");
  const categorySelect = document.querySelector("#category-select");

  async function fetchCategories() {
    try {
      const response = await fetch("http://localhost:1337/api/categorias?populate=*");
      if (!response.ok) {
        throw new Error(`Erro na requisição de categorias: ${response.status}`);
      }
      const result = await response.json();
      if (!result || !result.data) {
        throw new Error("Dados inválidos recebidos do Strapi");
      }
      return result.data;
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      return [];
    }
  }

  async function fetchProducts(categoryId = "") {
    let url = "http://localhost:1337/api/produtos?populate=*";
    if (categoryId) {
      url = `http://localhost:1337/api/produtos?filters[categoria][id][$eq]=${categoryId}&populate=*`;
    }
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Erro na requisição de produtos: ${response.status}`);
      }
      const result = await response.json();
      if (!result || !result.data) {
        throw new Error("Dados inválidos recebidos do Strapi");
      }
      return result.data;
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      return [];
    }
  console.log("Resposta do servidor:", response);

  }

  

  async function checkUserAuth() {
    const token = localStorage.getItem("jwt");
    if (!token) {
      return null;
    }
    try {
      const response = await fetch("http://localhost:1337/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Token inválido ou expirado");
      }
      return await response.json();
    } catch (error) {
      console.error("Erro ao verificar usuário autenticado:", error);
      return null;
    }
  }

  async function renderProducts(categoryId = "") {
    const products = await fetchProducts(categoryId);
    productContainer.innerHTML = "";
    if (products.length === 0) {
      productContainer.innerHTML = "<p>Nenhum produto encontrado.</p>";
      return;
    }
    products.forEach((product) => {
      const imageUrl = product.image?.formats?.thumbnail?.url
        ? `http://localhost:1337${product.image.formats.thumbnail.url}`
        : "https://via.placeholder.com/150";
      const productCard = document.createElement("div");
      productCard.classList.add("product-card");
      productCard.innerHTML = `
          <img src="${imageUrl}" alt="${product.name}">
          <h3><a href="#">${product.name}</a></h3>
          <p>${product.description}</p>
          <p><strong>R$ ${product.price}</strong></p>
          <button class="button-car" data-id="${product.id}">Adicionar ao Carrinho</button>
          <button class="button-buy" data-id="${product.id}">Comprar Agora</button>
        `;
      productContainer.appendChild(productCard);
    });
    attachEventListeners();
  }
   //Função para carregar categorias no select
  async function loadCategories() {
    const categories = await fetchCategories();
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      categorySelect.appendChild(option);
    });
  }
  loadCategories();

  // Evento para filtrar produtos com base na categoria selecionada
  categorySelect.addEventListener("change", function () {
    const selectedCategoryId = categorySelect.value;
    renderProducts(selectedCategoryId);
  });



  async function handleAddToCart(event) {
    const loggedUser = await checkUserAuth();
    if (!loggedUser) {
      alert("Você precisa estar logado para adicionar produtos ao carrinho.");
      localStorage.setItem("redirectTo", "index.html");
      // window.location.href = "login.html";
      return;
    }
    const productCard = event.target.closest(".product-card");
    const product = {
      name: productCard.querySelector("h3 a").innerText,
      price: productCard.querySelector("p strong").innerText.replace("R$ ", ""),
      image: productCard.querySelector("img").src,
    };
    addToCart(product);
  }

  async function handleBuyNow(event) {
    const loggedUser = await checkUserAuth();
    if (!loggedUser) {
      alert("Você precisa estar logado para comprar.");
      localStorage.setItem("redirectTo", "index.html");
      // window.location.href = "login.html";
      return;
    }
    const productCard = event.target.closest(".product-card");
    const product = {
      name: productCard.querySelector("h3 a").innerText,
      price: productCard.querySelector("p strong").innerText.replace("R$ ", ""),
      image: productCard.querySelector("img").src,
    };
    addToCart(product);
    window.location.href = "realizarPag.html";
  }

  function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartIcon(cart.length);
  }
  if (cartIcon) {
    cartIcon.addEventListener("click", async (event) => {
      event.preventDefault();
      
      const user = await checkUserAuth();
      if (user) {
        window.location.href = "carrinho.html";
      } else {
        alert("Você precisa estar logado para acessar o carrinho.");
        // window.location.href = "login.html";
      }
    });

  }

  function updateCartIcon(count) {
    if (cartIcon) {
      cartIcon.setAttribute("data-count", count);
    }
  }
  cartIcon.addEventListener("click", () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
      alert("Seu carrinho está vazio!");
    } else {
      window.location.href = "carrinho.html";
    }
  });
  

  function attachEventListeners() {
    document.querySelectorAll(".button-car").forEach((button) => {
      button.addEventListener("click", handleAddToCart);
    });
    document.querySelectorAll(".button-buy").forEach((button) => {
      button.addEventListener("click", handleBuyNow);
    });
  }

  function filterProducts(event) {
    const searchTerm = event.target.value.toLowerCase();
    document.querySelectorAll(".product-card").forEach((card) => {
      card.style.display = card.querySelector("h3 a").innerText.toLowerCase().includes(searchTerm) ? "" : "none";
    });
  }

  searchInput.addEventListener("input", filterProducts);
  renderProducts();
  updateCartIcon((JSON.parse(localStorage.getItem("cart")) || []).length);

  const loggedUser = await checkUserAuth();
  console.log(loggedUser ? "Usuário logado" : "Nenhum usuário logado");
});

