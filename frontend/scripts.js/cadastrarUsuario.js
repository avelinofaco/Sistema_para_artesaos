

const API_URL = 'http://localhost:1337/api/users'; // URL do endpoint Strapi
const ROLE_ID = 1; // ID da role de usuário autenticado (ajuste conforme necessário)
const TOKEN = localStorage.getItem('jwt'); // Token do administrador

// Capturar o formulário e adicionar evento de submit
document.getElementById('user-form').addEventListener('submit', function(event) {
    event.preventDefault();
    if (!isAdmin()) {
        return;
    }
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    createUser(username, email, password);
    this.reset();
});

// Função para verificar se o usuário é administrador
function isAdmin() {
    return TOKEN !== null; // Simples verificação de autenticação
}

// Função para carregar usuários e exibir na tabela
async function fetchUsers() {
    try {
        const response = await fetch(API_URL, {
            headers: { 'Authorization': `Bearer ${TOKEN}` }
        });
        const users = await response.json();
        
        if (!users || !Array.isArray(users)) {
            console.error('Formato inesperado de resposta da API:', users);
            return;
        }

        const userList = document.getElementById('user-list');
        userList.innerHTML = '';

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>
                    ${isAdmin() ? `<button onclick="editUser(${user.id})">Editar</button>
                    <button onclick="deleteUser(${user.id})">Deletar</button>` : ''}
                </td>
            `;
            userList.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
    }
}

// Função para cadastrar usuário
async function createUser(username, email, password) {
    if (!isAdmin()) return;
    try {
        const response = await fetch('http://localhost:1337/api/auth/local/register'
            , {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TOKEN}`
            },
            body: JSON.stringify({
                username,
                email,
                password
            })
        });
        const result = await response.json();
        if (response.ok) fetchUsers();
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
    }
}

// // Função para editar usuário
// async function editUser(id) {
//     if (!isAdmin()) return;
//     const newUsername = prompt('Novo nome de usuário:');
//     const newEmail = prompt('Novo email:');
//     if (!newUsername || !newEmail) return;

//     try {
//         const response = await fetch(`${API_URL}/${id}`, {
//             method: 'PUT',
//             headers: { 
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${TOKEN}`
//             },
//             body: JSON.stringify({ username: newUsername, email: newEmail })
//         });
//         if (response.ok) fetchUsers();
//     } catch (error) {
//         console.error('Erro ao editar usuário:', error);
//     }
// }

// // Função para deletar usuário
// async function deleteUser(id) {
//     if (!isAdmin()) return;
//     if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

//     try {
//         const response = await fetch(`http://localhost:1337/api/users/${id}`, {
//             method: 'DELETE',
//             headers: {
//                 'Authorization': `Bearer ${TOKEN}`,
//                 'Content-Type': 'application/json'
//             }
//         });

//         const result = await response.json();

//         if (response.ok) {
//             fetchUsers();
//         } else {
//             alert(`Erro ao deletar usuário: ${result.error.message}`);
//         }
//     } catch (error) {
//         console.error('Erro ao deletar usuário:', error);
//     }
// }


// // Carregar usuários ao carregar a página
// document.addEventListener('DOMContentLoaded', fetchUsers);

let userIdToDelete;

        function openEditModal(id, username, email) {
            document.getElementById('editUserId').value = id;
            document.getElementById('editUsername').value = username;
            document.getElementById('editEmail').value = email;
            document.getElementById('editModal').style.display = 'flex';
        }

        function openDeleteModal(id) {
            userIdToDelete = id;
            document.getElementById('deleteModal').style.display = 'flex';
        }

        function closeModal(modalId) {
            document.getElementById(modalId).style.display = 'none';
        }

        async function confirmEditUser() {
            const id = document.getElementById('editUserId').value;
            const username = document.getElementById('editUsername').value;
            const email = document.getElementById('editEmail').value;
            await editUser(id, username, email);
            closeModal('editModal');
        }

        async function confirmDeleteUser() {
            await deleteUser(userIdToDelete);
            closeModal('deleteModal');
        }

        async function fetchUsers() {
            const response = await fetch('http://localhost:1337/api/users', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt')}` }
            });
            const users = await response.json();
            
            const userList = document.getElementById('user-list');
            userList.innerHTML = '';
            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>
                        <button onclick="openEditModal(${user.id}, '${user.username}', '${user.email}')">Editar</button>
                        <button onclick="openDeleteModal(${user.id})">Deletar</button>
                    </td>
                `;
                userList.appendChild(row);
            });
        }

        async function editUser(id, username, email) {
            await fetch(`http://localhost:1337/api/users/${id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                },
                body: JSON.stringify({ username, email })
            });
            fetchUsers();
        }

        async function deleteUser(id) {
            await fetch(`http://localhost:1337/api/users/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt')}` }
            });
            fetchUsers();
        }

        document.addEventListener('DOMContentLoaded', fetchUsers);