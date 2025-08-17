const predefinedColors = [
    "Pink Blush", "Acquamarine", "Atlantic Blue", "London Sky", "Astral Night",
    "Tuscan Sun", "Paris Green", "Red", "Military Green", "Water Blue",
    "Black Matt", "White Matt", "Rose Copper Satin", "Avventurina", "Night"
];

const colorSelect = document.getElementById("colorSelect");
const colorBox = document.getElementById("colorBox");
const colorName = document.getElementById("selectedColorName");

function populateColors() {
    // Colori salvati in memoria
    const savedColors = JSON.parse(localStorage.getItem("customColors")) || [];
    
    // Predefiniti
    predefinedColors.forEach(color => {
        const option = document.createElement("option");
        option.value = color;
        option.textContent = color;
        colorSelect.appendChild(option);
    });

    // Personalizzati salvati
    savedColors.forEach(c => {
        const option = document.createElement("option");
        option.value = c.hex;
        option.textContent = c.name;
        colorSelect.appendChild(option);
    });
}

function updatePreview() {
    const selected = colorSelect.value;
    const selectedText = colorSelect.options[colorSelect.selectedIndex].text;
    colorName.textContent = selectedText;
    colorBox.style.backgroundColor = selected;
}

function addCustomColor() {
    const name = document.getElementById("customName").value.trim();
    const hex = document.getElementById("customColor").value;
    if (name && hex) {
        // Aggiungi all'elenco
        const option = document.createElement("option");
        option.value = hex;
        option.textContent = name;
        colorSelect.appendChild(option);

        // Salva su LocalStorage
        const savedColors = JSON.parse(localStorage.getItem("customColors")) || [];
        savedColors.push({ name: name, hex: hex });
        localStorage.setItem("customColors", JSON.stringify(savedColors));

        document.getElementById("customName").value = "";
    }
}

colorSelect.addEventListener("change", updatePreview);
window.onload = populateColors;
