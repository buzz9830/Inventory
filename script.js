const defaultColors = [
    "Cromo", "Bianco", "Nero", "Oro", "Ottone", "Nickel spazzolato",
    "Rame", "Acciaio inox", "Bronzo", "Antracite"
];

let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
let customColors = JSON.parse(localStorage.getItem("customColors")) || [];

const colorSelect = document.getElementById("color");
const inventoryForm = document.getElementById("inventoryForm");
const colorForm = document.getElementById("colorForm");
const magazzinoTable = document.getElementById("magazzinoTable").querySelector("tbody");
const terzistiTable = document.getElementById("terzistiTable").querySelector("tbody");
const editIndexInput = document.getElementById("editIndex");

function updateColorOptions() {
    colorSelect.innerHTML = "";
    [...defaultColors, ...customColors].forEach(color => {
        const option = document.createElement("option");
        option.value = color;
        option.textContent = color;
        colorSelect.appendChild(option);
    });
}

function saveInventory() {
    localStorage.setItem("inventory", JSON.stringify(inventory));
}

function renderInventory() {
    magazzinoTable.innerHTML = "";
    terzistiTable.innerHTML = "";

    inventory.forEach((item, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.code}</td>
            <td>${item.quantity}</td>
            <td>${item.color}</td>
            <td class="actions">
                <button onclick="editItem(${index})">Modifica</button>
                <button onclick="deleteItem(${index})">Elimina</button>
            </td>
        `;

        if (item.status === "magazzino") {
            magazzinoTable.appendChild(row);
        } else {
            terzistiTable.appendChild(row);
        }
    });
}

inventoryForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const code = document.getElementById("code").value;
    const quantity = document.getElementById("quantity").value;
    const color = document.getElementById("color").value;
    const status = document.getElementById("status").value;
    const editIndex = editIndexInput.value;

    if (editIndex === "") {
        inventory.push({ code, quantity, color, status });
    } else {
        inventory[editIndex] = { code, quantity, color, status };
        editIndexInput.value = "";
    }

    saveInventory();
    renderInventory();
    inventoryForm.reset();
});

colorForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newColor = document.getElementById("newColor").value.trim();
    if (newColor && !customColors.includes(newColor)) {
        customColors.push(newColor);
        localStorage.setItem("customColors", JSON.stringify(customColors));
        updateColorOptions();
    }
    colorForm.reset();
});

function editItem(index) {
    const item = inventory[index];
    document.getElementById("code").value = item.code;
    document.getElementById("quantity").value = item.quantity;
    document.getElementById("color").value = item.color;
    document.getElementById("status").value = item.status;
    editIndexInput.value = index;
}

function deleteItem(index) {
    if (confirm("Sei sicuro di voler eliminare questo articolo?")) {
        inventory.splice(index, 1);
        saveInventory();
        renderInventory();
    }
}

updateColorOptions();
renderInventory();
