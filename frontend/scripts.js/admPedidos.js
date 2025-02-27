async function carregarPedidos() {
    try {
        const resposta = await fetch("http://localhost:1337/api/pedidos?populate=*");
        const dados = await resposta.json();

        if (!dados.data || !Array.isArray(dados.data)) {
            console.warn("Nenhum pedido encontrado.");
            return;
        }

        const pedidos = dados.data;
        const tabela = document.getElementById("pedidoTableBody");
        tabela.innerHTML = "";

        pedidos.forEach(pedido => {
            const linha = document.createElement("tr");
            linha.innerHTML = `
                <td>${pedido.id}</td>
                <td>${pedido.pedido_items ? pedido.pedido_items.length : 0}</td>
                <td id="status-${pedido.documentId}">${pedido.estatus}</td>
                <td><button class="update-status-button" data-document-id="${pedido.documentId}">Atualizar Status</button></td>
            `;
            tabela.appendChild(linha);
        });

        // Adicionar evento de clique para abrir o modal
        document.querySelectorAll(".update-status-button").forEach(button => {
            button.addEventListener("click", function () {
                const documentId = this.getAttribute("data-document-id");
                document.getElementById("confirmStatusUpdate").setAttribute("data-document-id", documentId);
                document.getElementById("statusModal").style.display = "block";
            });
        });

    } catch (erro) {
        console.error("Erro ao carregar pedidos:", erro);
    }
}

// Fechar o modal ao clicar no botão de fechar
document.querySelector(".close").addEventListener("click", function () {
    document.getElementById("statusModal").style.display = "none";
});

// Fechar o modal ao clicar fora do conteúdo
window.addEventListener("click", function (event) {
    const modal = document.getElementById("statusModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

// Atualizar o status do pedido
document.getElementById("confirmStatusUpdate").addEventListener("click", async function () {
    const token = localStorage.getItem("jwt");
    const documentId = this.getAttribute("data-document-id");
    const novoStatus = document.getElementById("statusSelect").value;
    
    try {
        // Buscar o ID real baseado no documentId
        const resposta = await fetch(`http://localhost:1337/api/pedidos?filters[documentId][$eq]=${documentId}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const dados = await resposta.json();
        
        if (!dados.data || dados.data.length === 0) {
            throw new Error("Pedido não encontrado.");
        }

        const pedidoId = dados.data[0].documentId;

        // Atualizar o pedido com o ID real
        const respostaAtualizacao = await fetch(`http://localhost:1337/api/pedidos/${pedidoId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
             },
            body: JSON.stringify({ data: { estatus: novoStatus } })
        });

        const dadosAtualizacao = await respostaAtualizacao.json();
        if (!respostaAtualizacao.ok) throw new Error(dadosAtualizacao.message || "Erro ao atualizar status.");

        // Atualizar a tabela com o novo status
        document.getElementById(`status-${documentId}`).textContent = novoStatus;
        document.getElementById("statusModal").style.display = "none";
    } catch (erro) {
        console.error("Erro ao atualizar status:", erro);
        alert("Erro ao atualizar status. Verifique o console.");
    }
});

carregarPedidos();