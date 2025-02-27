document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm-password");

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Evita o envio padrão do formulário

        if (!validateInputs()) {
            return;
        }

        const userData = {
            username: nameInput.value.trim(),
            email: emailInput.value.trim(),
            password: passwordInput.value.trim()
        };

        try {
            const response = await fetch("http://localhost:1337/api/auth/local/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (response.ok) {
                form.reset(); // Limpa o formulário após cadastro
            } else {
                alert("Erro no cadastro: " + (data.error?.message || "Tente novamente."));
            }
        } catch (error) {
            console.error("Erro:", error);
        }
    });

    function validateInputs() {
        const nameValue = nameInput.value.trim();
        const emailValue = emailInput.value.trim();
        const passwordValue = passwordInput.value.trim();
        const confirmPasswordValue = confirmPasswordInput.value.trim();

        if (nameValue === "") {
            alert("Por favor, preencha o nome completo.");
            return false;
        }

        if (!validateEmail(emailValue)) {
            return false;
        }

        if (passwordValue.length < 6) {
            alert("A senha deve ter pelo menos 6 caracteres.");
            return false;
        }

        if (passwordValue !== confirmPasswordValue) {
            alert("As senhas não coincidem.");
            return false;
        }

        return true;
    }

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});
