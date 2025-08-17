const coloriQD = [
    "Cromo", "Acciaio Spazzolato", "Nickel Spazzolato", "Ottone Lucido",
    "Ottone Spazzolato", "Rame Lucido", "Rame Spazzolato", "Oro Lucido",
    "Oro Satinato", "Nero Opaco", "Bianco Opaco", "Bronzo Spazzolato",
    "Bronzo Antico", "Antracite", "Grigio Scuro", "Champagne",
    "Titanio", "Blu Metallizzato", "Rosso Metallizzato", "Verde Metallizzato"
];

const selectColore = document.getElementById("colore");
const tabella = document.getElementById("tabellaInventario").querySelector("tbody");

function caricaColori() {
    selectColore.innerHTML = "";
    const savedColors = JSON.parse(localStorage.getItem("customColors")) || [];
    [...coloriQD, ...savedColors.map(c => c.name)].forEach(colore => {
        const option = document.createElement("option");
        option.value = colore;
        option.textContent = colore;
        selectColore.appendChild(option);
    });
}

function aggiungiArticolo() {
    const codice = document.getElementById("codice").value.trim();
    const quantita = document.getElementById("quantita").value;
    const colore = selectColore.value;
    const fuori = document.getElementById("fuoriTerzisti").checked;

    if (!codice || quantita === "") {
        alert("Inserisci codice e quantità!");
        return;
    }

    const articoli = JSON.parse(localStorage.getItem("inventario")) || [];
    articoli.push({ codice, quantita, colore, fuori });
    localStorage.setItem("inventario", JSON.stringify(articoli));
    mostraInventario();
    document.getElementById("codice").value = "";
    document.getElementById("quantita").value = "";
    document.getElementById("fuoriTerzisti").checked = false;
}

function mostraInventario() {
    tabella.innerHTML = "";
    const articoli = JSON.parse(localStorage.getItem("inventario")) || [];
    articoli.forEach(a => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${a.codice}</td><td>${a.quantita}</td><td>${a.colore}</td><td>${a.fuori ? "✅" : ""}</td>`;
        tabella.appendChild(tr);
    });
}

function aggiungiColore() {
    const name = document.getElementById("customName").value.trim();
    const hex = document.getElementById("customColor").value;
    if (!name) {
        alert("Inserisci un nome per il colore");
        return;
    }
    const savedColors = JSON.parse(localStorage.getItem("customColors")) || [];
    savedColors.push({ name, hex });
    localStorage.setItem("customColors", JSON.stringify(savedColors));
    caricaColori();
    document.getElementById("customName").value = "";
}

window.onload = () => {
    caricaColori();
    mostraInventario();
};
