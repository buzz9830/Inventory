// Inizializza colori QD ufficiali
let defaultColors = [
  "Cromo",
  "Oro",
  "Rame",
  "Nero opaco",
  "Bianco opaco",
  "Nickel spazzolato",
  "Acciaio inox",
  "Bronzo",
  "Ottone antico"
];

// Recupera da LocalStorage
let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
let colors = JSON.parse(localStorage.getItem("colors")) || defaultColors;

const colorSelect = document.getElementById("color");
const colorList = document.getElementById("color-list");
const articleForm = document.getElementById("article-form");
const colorForm = document.getElementById("color-form");
const inventoryTable = document.querySelector("#inventory-table tbody");

function saveData() {
  localStorage.setItem("inventory", JSON.stringify(inventory));
  localStorage.setItem("colors", JSON.stringify(colors));
}

function renderColors() {
  colorSelect.innerHTML = "";
  colors.forEach(color => {
    let option = document.createElement("option");
    option.value = color;
    option.textContent = color;
    colorSelect.appendChild(option);
  });

  colorList.innerHTML = "";
  colors.forEach((color, index) => {
    let li = document.createElement("li");
    li.textContent = color + " ";
    let delBtn = document.createElement("button");
    delBtn.textContent = "🗑️";
    delBtn.onclick = () => {
      colors.splice(index, 1);
      saveData();
      renderColors();
    };
    li.appendChild(delBtn);
    colorList.appendChild(li);
  });
}

function renderInventory() {
  inventoryTable.innerHTML = "";
  inventory.forEach((item, index) => {
    let row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.code}</td>
      <td>${item.quantity}</td>
      <td>${item.color}</td>
      <td>${item.terzisti ? "✔️" : ""}</td>
      <td>
        <button class="action-btn edit-btn" onclick="editItem(${index})">✏️</button>
        <button class="action-btn delete-btn" onclick="deleteItem(${index})">🗑️</button>
      </td>
    `;
    inventoryTable.appendChild(row);
  });
}

articleForm.addEventListener("submit", e => {
  e.preventDefault();
  const code = document.getElementById("code").value;
  const quantity = document.getElementById("quantity").value;
  const color = document.getElementById("color").value;
  const terzisti = document.getElementById("terzisti").checked;
  const editIndex = document.getElementById("edit-index").value;

  if (editIndex) {
    inventory[editIndex] = { code, quantity, color, terzisti };
  } else {
    inventory.push({ code, quantity, color, terzisti });
  }

  saveData();
  renderInventory();
  articleForm.reset();
  document.getElementById("edit-index").value = "";
});

colorForm.addEventListener("submit", e => {
  e.preventDefault();
  const newColor = document.getElementById("new-color").value.trim();
  if (newColor && !colors.includes(newColor)) {
    colors.push(newColor);
    saveData();
    renderColors();
  }
  colorForm.reset();
});

function editItem(index) {
  const item = inventory[index];
  document.getElementById("code").value = item.code;
  document.getElementById("quantity").value = item.quantity;
  document.getElementById("color").value = item.color;
  document.getElementById("terzisti").checked = item.terzisti;
  document.getElementById("edit-index").value = index;
}

function deleteItem(index) {
  inventory.splice(index, 1);
  saveData();
  renderInventory();
}

// Prima render
renderColors();
renderInventory();
