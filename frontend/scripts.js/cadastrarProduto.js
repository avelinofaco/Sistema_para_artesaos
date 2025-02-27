document.addEventListener("DOMContentLoaded", async function () {
    const productContainer = document.querySelector("#product-list");
    const editModal = document.getElementById("editModal");
    const deleteModal = document.getElementById("deleteModal");
    const editName = document.getElementById("editName");
    const editPrice = document.getElementById("editPrice");
    const saveChanges = document.getElementById("saveChanges");
    const closeModal = document.querySelectorAll(".closeModal");
    const confirmDelete = document.getElementById("confirmDelete");
    const productForm = document.getElementById("productForm");
  
    let currentProductId = null;
    let currentProductCard = null;
  

    // Busca produtos do Strapi
    async function fetchProducts() {
      let url = "http://localhost:1337/api/produtos?populate=*";
      try {
        const response = await fetch(url);
        if (!response.ok)
          throw new Error(`Erro ao buscar produtos: ${response.status}`);
        const result = await response.json();
        return result.data || [];
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        return [];
      }
    }
  

    // Cadastra um novo produto
    productForm.addEventListener("submit", async function (event) {
      event.preventDefault();
    
      const token = localStorage.getItem("jwt");
      if (!token) {
        return;
      }
    
      const name = document.getElementById("productName").value.trim();
      const price = parseFloat(document.getElementById("productPrice").value);
      const description = document.getElementById("productDescription").value.trim();
      const imageFile = document.getElementById("productImage").files[0];
    
      if (!name || !price || !description || !imageFile) {
        alert("Por favor, preencha todos os campos.");
        return;
      }
    
      try {
        // Enviar a imagem primeiro
        const imageFormData = new FormData();
        imageFormData.append("files", imageFile);

        const imageResponse = await fetch("http://localhost:1337/api/upload", {
          method: "POST",
          body: imageFormData,
        });
    
        if (!imageResponse.ok) {
          const errorText = await imageResponse.text();
          // throw new Error(`Erro ao enviar imagem: ${errorText}`);
        }
    
        const imageData = await imageResponse.json();
    
        if (!imageData || !imageData[0] || !imageData[0].id) {
          throw new Error("A resposta da API de upload não contém um ID válido.");
        }
    
        const imageId = imageData[0].id; // Pegando o ID correto da imagem
    
        // 2️⃣ Agora, cadastrar o produto com a imagem associada
        const productData = {
          data: {
            name: name,
            price: price,
            description: description,
            image: imageId, // Relaciona a imagem enviada ao produto
          },
        };
        const response = await fetch("http://localhost:1337/api/produtos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(productData),
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(`Erro ao cadastrar produto: ${errorResponse.error.message}`);
        }
    
        document.getElementById("productForm").reset();
      } catch (error) {
        console.error("Erro ao cadastrar produto:", error);
      }
    });
    

      //funcao editar
    async function editProduct(documentId, product) {
      currentProductId = documentId;
      editName.value = product.name;
      editPrice.value = product.price;
      editModal.style.display = "flex";
  }

  saveChanges.addEventListener("click", async () => {
    const token = localStorage.getItem("jwt"); 
      if (!currentProductId) return;

      const updatedProduct = {
          name: editName.value,
          price: parseFloat(editPrice.value)
      };

      try {
          const response = await fetch(`http://localhost:1337/api/produtos/${currentProductId}`, {
              method: "PUT",
              headers: { 
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
               },
              body: JSON.stringify({ data: updatedProduct })
          });

          if (!response.ok) {
              throw new Error(`Erro ao atualizar produto: ${response.status}`);
          }

          editModal.style.display = "none";
          renderProducts();
      } catch (error) {
          console.error("Erro ao editar produto:", error);
      }
  });

    
                  //funcao deletar
    async function deleteProduct() {
      const token = localStorage.getItem("jwt"); 
      if (!currentProductId) return;

        try {
            const response = await fetch(`http://localhost:1337/api/produtos/${currentProductId}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Erro ao deletar produto: ${response.status}`);
            }

            currentProductCard.remove();
        } catch (error) {
            console.error("Erro ao deletar produto:", error);
        }

        deleteModal.style.display = "none";
    }

    async function confirmDeleteProduct(documentId, productCard) {
        currentProductId = documentId;
        currentProductCard = productCard;
        deleteModal.style.display = "flex";
    }

    confirmDelete.addEventListener("click", deleteProduct);                   // chama a funcao deleteProduct


    // Fechar modais
    closeModal.forEach((button) => {
      button.addEventListener("click", () => {
        editModal.style.display = "none";
        deleteModal.style.display = "none";
      });
    });
  
    // Renderizar produtos
    async function renderProducts() {
      const products = await fetchProducts();
      productContainer.innerHTML = "";
  
      if (products.length === 0) {
        productContainer.innerHTML = "<p>Nenhum produto encontrado.</p>";
        return;
      }
  
      products.forEach((product) => {
        const imageUrl =
          product.image &&
          product.image.formats &&
          product.image.formats.thumbnail
            ? `http://localhost:1337${product.image.formats.thumbnail.url}`
            : "https://via.placeholder.com/150";
  
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");
        productCard.innerHTML = `
                  <img src="${imageUrl}" alt="${product.name}">
                  <h3>${product.name}</h3>
                  <p>${product.description}</p>
                  <p><strong>R$ ${product.price}</strong></p>
                  <button class="btn btn-primary edit-btn" data-id="${product.id}">Editar</button>
                  <button class="btn btn-danger delete-btn" data-id="${product.id}">Excluir</button>
              `;
        
              productCard.querySelector(".edit-btn").addEventListener("click", () => editProduct(product.documentId, product));
      productCard
        .querySelector(".delete-btn")
        .addEventListener("click", () =>
          confirmDeleteProduct(product.documentId, productCard)
        );
        productContainer.appendChild(productCard);
      });
    }
  
    renderProducts();
  });
  