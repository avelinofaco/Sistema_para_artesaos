document.addEventListener("DOMContentLoaded", carregarPedidos);

async function carregarPedidos() {
    const token = localStorage.getItem("jwt");
    if (!token) {
        console.error("Usuário não autenticado.");
        return;
    }
    try {
        // Obter usuário logado
        const userResponse = await fetch("http://localhost:1337/api/users/me", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!userResponse.ok) throw new Error("Erro ao obter usuário.");
        const usuario = await userResponse.json();

        // Buscar pedidos do usuário logado
        const pedidosResponse = await fetch(`http://localhost:1337/api/pedidos?populate=pedido_items&filters[usuario][id]=${usuario.id}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!pedidosResponse.ok) throw new Error("Erro ao carregar pedidos.");
        const pedidosData = await pedidosResponse.json();

        // Referências dos containers de status
        const containers = {
            pago: document.getElementById("pago-container"),
            pendente: document.getElementById("pendente-container"),
            enviado: document.getElementById("enviado-container"),
            cancelado: document.getElementById("cancelado-container"),
        };

        // Limpa os containers antes de exibir novos pedidos
        Object.values(containers).forEach(container => container.innerHTML = "");

        if (!pedidosData.data.length) {
            Object.values(containers).forEach(container => {
                container.innerHTML = "<p>Nenhum pedido encontrado.</p>";
            });
            return;
        }

        // Criar os elementos na tela e organizar por status
        pedidosData.data.forEach((pedido) => {
            const pedidoElement = document.createElement("div");
            pedidoElement.classList.add("pedido-card");

            let itensHtml = "";
            pedido.pedido_items.forEach((item) => {
                itensHtml += `
                    <div class="pedido-item">
                        <img src="${item.image || "https://via.placeholder.com/100"}" alt="${item.name}">
                        <p><strong>${item.name}</strong> - R$ ${item.price.toFixed(2)}</p>
                    </div>
                `;
            });

            pedidoElement.innerHTML = `
                <p><strong>Status:</strong> ${pedido.estatus}</p>
                <div class="itens-pedido">${itensHtml}</div>
                <p><strong>Total:</strong> R$ ${pedido.totalCompra.toFixed(2)}</p>
            `;

            // Adiciona o pedido no container correto
            if (containers[pedido.estatus]) {
                containers[pedido.estatus].appendChild(pedidoElement);
            }
        });

        // Eventos para exibir/esconder os pedidos
        document.querySelectorAll(".status-button").forEach(button => {
            button.addEventListener("click", function () {
                const status = this.id.replace("-btn", "-container");
                const container = document.getElementById(status);
                
                if (container.style.display === "none" || container.style.display === "") {
                    container.style.display = "block";
                } else {
                    container.style.display = "none";
                }
            });
        });

    } catch (error) {
        console.error("Erro ao carregar pedidos:", error);
    }
}
