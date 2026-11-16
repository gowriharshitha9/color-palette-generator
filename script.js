const container = document.getElementById("palette-container");
const generateBtn = document.getElementById("generate-btn");
const toast = document.getElementById("toast");

// State array for 5 colors
let palette = Array.from({ length: 5 }, () => ({
  hex: generateRandomHex(),
  locked: false,
}));

function generateRandomHex() {
  const chars = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += chars[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Calculate luminance to decide dark vs light text
function getContrastColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? "#111017" : "#FFFFFF";
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

function renderPalette() {
  container.innerHTML = "";

  palette.forEach((item, index) => {
    const col = document.createElement("div");
    col.className = "color-column";
    col.style.backgroundColor = item.hex;
    col.style.color = getContrastColor(item.hex);

    const hexLabel = document.createElement("span");
    hexLabel.className = "hex-text";
    hexLabel.textContent = item.hex;
    hexLabel.title = "Click to copy";
    hexLabel.addEventListener("click", () => {
      navigator.clipboard.writeText(item.hex);
      showToast(`Copied ${item.hex} to clipboard!`);
    });

    const lockBtn = document.createElement("button");
    lockBtn.className = "lock-btn";
    lockBtn.textContent = item.locked ? "Locked" : "Unlock";
    lockBtn.addEventListener("click", () => {
      palette[index].locked = !palette[index].locked;
      renderPalette();
    });

    col.append(hexLabel, lockBtn);
    container.appendChild(col);
  });
}

function updatePalette() {
  palette = palette.map((item) =>
    item.locked ? item : { ...item, hex: generateRandomHex() }
  );
  renderPalette();
}

generateBtn.addEventListener("click", updatePalette);

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && document.activeElement.tagName !== "BUTTON") {
    e.preventDefault();
    updatePalette();
  }
});

// Initial render
renderPalette();