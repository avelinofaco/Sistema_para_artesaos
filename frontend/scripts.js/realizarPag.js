
document.addEventListener("DOMContentLoaded", async () => {
    console.log("DOM totalmente carregado.");
    await carregarCartaoDoUsuario();
    loadCartItems();
});

async function carregarCartaoDoUsuario() {
    const token = localStorage.getItem("jwt");
    if (!token) {
        console.warn("Usuário não autenticado.");
        return;
    }

    try {
        const usuario = await buscarUsuario(token);
        if (!usuario) return;

        console.log("Buscando cartão do usuário...");
        const cartaoResponse = await fetch(
            `http://localhost:1337/api/cartaos?filters[usuario][id][$eq]=${usuario.id}&populate=*`,
            {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        if (!cartaoResponse.ok) throw new Error("Erro ao buscar cartão do usuário.");
        const data = await cartaoResponse.json();

        if (data.data.length > 0) {
            preencherCamposCartao(data.data[0]);
        } else {
            console.log("Nenhum cartão encontrado.");
        }
    } catch (error) {
        console.error("Erro ao carregar cartão do usuário:", error);
    }
}

function preencherCamposCartao(cartao) {
    document.getElementById("card-number").value = cartao.numero || "";
    document.getElementById("card-name").value = cartao.nome || "";
    document.getElementById("expiry-date").value = cartao.validade || "";
}

document.getElementById("pay-button").addEventListener("click", async function (event) {
    event.preventDefault();

    const token = localStorage.getItem("jwt");
    if (!token) {
        mostrarMensagem("Erro: Usuário não autenticado.", "red");
        return;
    }

    const cardNumber = document.getElementById("card-number").value.trim();
    const cardName = document.getElementById("card-name").value.trim();
    const expiryDate = document.getElementById("expiry-date").value.trim();
    const cvv = document.getElementById("cvv").value.trim();

    if (!cardNumber || !cardName || !expiryDate || !cvv) {
        mostrarMensagem("Por favor, preencha todos os campos.", "red");
        return;
    }

    try {
        const usuario = await buscarUsuario(token);
        if (!usuario) return;

        const response = await fetch(
            `http://localhost:1337/api/cartaos?filters[numero][$eq]=${encodeURIComponent(cardNumber)}&populate=*`,
            {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        if (!response.ok) throw new Error("Erro na requisição à API");

        const data = await response.json();

        let paymentSuccess = false;
        let cartaoExistente = false;

        if (data?.data?.length > 0) {
            for (const card of data.data) {
                if (
                    card.numero.trim() === cardNumber &&
                    card.nome.trim().toLowerCase() === cardName.toLowerCase() &&
                    card.validade.trim().replace(/\s/g, "") === expiryDate.replace(/\s/g, "")
                ) {
                    cartaoExistente = true;
                    
                    if (cvv.length === 3) {
                        paymentSuccess = true;
                    } else {
                        mostrarMensagem("Por favor, insira um CVV válido.", "red");
                        return;
                    }
                    break;
                }
            }
        }

        if (!cartaoExistente) {
            await salvarCartaoNoStrapi({ cardNumber, cardName, expiryDate, usuario });
            paymentSuccess = true;
        }

        if (paymentSuccess) {
            mostrarMensagem("Pagamento realizado com sucesso!", "green");
            await salvarPedidoNoStrapi();
        } else {
            mostrarMensagem("Erro no pagamento: Dados do cartão não correspondem.", "red");
        }
    } catch (error) {
        console.error("Erro ao processar pagamento:", error);
        mostrarMensagem("Erro ao processar o pagamento.", "red");
    }
});

async function buscarUsuario(token) {
    try {
        const response = await fetch("http://localhost:1337/api/users/me", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Erro ao obter usuário.");
        return await response.json();
    } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        return null;
    }
}

async function salvarCartaoNoStrapi({ cardNumber, cardName, expiryDate, cvv, usuario }) {
    const token = localStorage.getItem("jwt");

    const cartaoData = {
        data: {
            numero: cardNumber,
            nome: cardName,
            validade: expiryDate,
            cvv: cvv,
            usuario: usuario.id,
        },
    };

    try {
        const response = await fetch("http://localhost:1337/api/cartaos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(cartaoData),
        });

        if (!response.ok) {
            console.error("Erro ao salvar cartão:", await response.text());
            throw new Error("Erro ao salvar cartão no Strapi.");
        }

    } catch (error) {
        console.error("Erro ao salvar cartão no Strapi:", error);
    }
}

function mostrarMensagem(texto, cor) {
    document.getElementById("message").textContent = texto;
    document.getElementById("message").style.color = cor;
}

async function salvarPedidoNoStrapi() {
    const token = localStorage.getItem("jwt");
    if (!token) {
        console.error("Erro: Usuário não autenticado.");
        return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
        console.warn("Erro: Carrinho vazio.");
        return;
    }

    try {
        const userResponse = await fetch("http://localhost:1337/api/users/me", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!userResponse.ok) throw new Error("Erro ao obter usuário.");
        const usuario = await userResponse.json();

        // Criar os itens do pedido
        const pedidoItemsIds = await Promise.all(
            cart.map(async (item) => {
                const pedidoItemData = {
                    data: {
                        name: item.name,
                        price: parseFloat(item.price),
                        image: item.image,
                    },
                };

                const pedidoItemResponse = await fetch("http://localhost:1337/api/pedido-items", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(pedidoItemData),
                });

                if (!pedidoItemResponse.ok) {
                    console.error("Erro ao criar item do pedido:", await pedidoItemResponse.text());
                    throw new Error("Erro ao criar item do pedido.");
                }

                const pedidoItem = await pedidoItemResponse.json();
                return pedidoItem.data.id;
            })
        );

        // Criar o pedido
        function validarEstatus(estatus) {
            const valoresPermitidos = ["pago", "pendente", "enviado", "Cancelado"];
            return valoresPermitidos.includes(estatus) ? estatus : "pendente";
        }
        const pedidoData = {
            data: {
                estatus: validarEstatus("pendente"), // Aqui você pode passar um valor dinâmico
                totalCompra: cart.reduce((acc, item) => acc + parseFloat(item.price || 0), 0),
                usuario: usuario.id,
                pedido_items: pedidoItemsIds,
            },
        };
        
        
        const pedidoResponse = await fetch("http://localhost:1337/api/pedidos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(pedidoData),
        });

        if (!pedidoResponse.ok) {
            console.error("Erro ao salvar pedido:", await pedidoResponse.text());
            throw new Error("Erro ao salvar pedido no Strapi");
        }

        console.log("Pedido salvo com sucesso!");

        // Limpar carrinho
        localStorage.removeItem("cart");
        loadCartItems(); // Atualiza a exibição do carrinho

        // Redirecionamento sem recarregar a página
        console.log("Redirecionando para 'acompanharPedidos.html'...");
        setTimeout(() => {
            window.location.assign("acompanharPedidos.html");
        }, 1000);
    } catch (error) {
        console.error("Erro ao salvar pedido:", error);
    }
}

function loadCartItems() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const productContainer = document.querySelector(".product-details");
    productContainer.innerHTML = "<h3>Detalhes do Produto</h3>";

    let totalPrice = 0;

    if (!Array.isArray(cart) || cart.length === 0) {
        productContainer.innerHTML += "<p>Seu carrinho está vazio.</p>";
        return;
    }

    cart.forEach((item, index) => {
        const imageUrl = item.image || "https://via.placeholder.com/150";

        const productElement = document.createElement("div");
        productElement.classList.add("product-item");
        productElement.innerHTML = `
            <img src="${imageUrl}" alt="${item.name}">
            <p><strong>Nome:</strong> ${item.name || "Nome indisponível"}</p>
            <p><strong>Preço:</strong> R$ ${(item.price ? parseFloat(item.price).toFixed(2) : "0.00")}</p>
            <button class="remove-button" data-index="${index}">Remover</button>
        `;
        productContainer.appendChild(productElement);
        totalPrice += parseFloat(item.price || 0);
    });

    productContainer.innerHTML += `<p><strong>Total da Compra:</strong> R$ ${totalPrice.toFixed(2)}</p>`;

    document.querySelectorAll(".remove-button").forEach((button) => {
        button.addEventListener("click", function () {
            removeCartItem(button.getAttribute("data-index"));
        });
    });
    function removeCartItem(index) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
        if (index < 0 || index >= cart.length) {
            console.warn("Índice inválido para remoção.");
            return;
        }
    
        cart.splice(index, 1); 
        localStorage.setItem("cart", JSON.stringify(cart)); 
    
        loadCartItems(); 
    }
    

}
