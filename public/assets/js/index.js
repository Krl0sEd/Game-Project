    function entrar() {
        const nick = document.getElementById("nickname").value.trim();

        if (nick === "") {
            alert("Digite um nickname!");
            return;
        }

        localStorage.setItem("playerNick", nick);
        window.location.href = "game.html"; // vai para o “Windows Fake”
    }