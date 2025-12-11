    const nick = localStorage.getItem("playerNick");

    if (!nick) {
        window.location.href = "index.html";
    }

    // Exemplo: mostrar o nome na barra superior
    document.querySelector("#nickArea").innerText = nick;
        // ====== ABRIR E FECHAR JANELA ======
        function openWindow() {
            document.getElementById("janela").style.display = "block";
        }

        function closeWindow() {
            document.getElementById("janela").style.display = "none";
        }

        // ====== MENU INICIAR ======
        const startBtn = document.getElementById("startBtn");
        const startMenu = document.getElementById("startMenu");

        startBtn.onclick = () => {
            startMenu.style.display = startMenu.style.display === "block" ? "none" : "block";
        };

        // ====== JANELA ARRASTÁVEL ======
        dragElement(document.getElementById("janela"));

        function dragElement(elmnt) {
            var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            if (document.getElementById("drag")) {
                document.getElementById("drag").onmousedown = dragMouseDown;
            } else {
                elmnt.onmousedown = dragMouseDown;
            }

            function dragMouseDown(e) {
                e = e || window.event;
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;
            }

            function elementDrag(e) {
                e = e || window.event;
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
                elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
            }

            function closeDragElement() {
                document.onmouseup = null;
                document.onmousemove = null;
            }
        }

