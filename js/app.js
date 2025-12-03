const GRID_GAP = 14;
let currentImages = [];

function getColumnCount() {
  const w = window.innerWidth;
  if (w <= 480) return 1;
  if (w <= 650) return 2;
  if (w <= 900) return 3;
  if (w <= 1100) return 4;
  return 5;
}

function layoutMasonry() {
  const grid = document.getElementById("pinGrid");
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll(".pin"));
  if (!cards.length) return;

  const columnCount = getColumnCount();
  const containerWidth = grid.clientWidth;
  const columnWidth =
    (containerWidth - (columnCount - 1) * GRID_GAP) / columnCount;

  // track column heights
  const columnHeights = new Array(columnCount).fill(0);

  cards.forEach((card) => {
    card.style.width = `${columnWidth}px`;

    // choose the column with the smallest height
    const colIndex = columnHeights.indexOf(Math.min(...columnHeights));
    const x = colIndex * (columnWidth + GRID_GAP);
    const y = columnHeights[colIndex];

    // use left/top for layout (not transform)
    card.style.left = `${x}px`;
    card.style.top = `${y}px`;

    const cardHeight = card.offsetHeight;
    columnHeights[colIndex] = y + cardHeight + GRID_GAP;
  });

  // set container height so it wraps absolutely positioned cards
  const maxHeight = Math.max(...columnHeights);
  grid.style.height = `${maxHeight}px`;
}

async function loadGallery() {
  const grid = document.getElementById("pinGrid");
  if (!grid) return;

  grid.innerHTML = "";

  const owner = "AmesGate";
  const repo = "therestingpinegallery";
  const folder = "images";

  const apiURL = `https://api.github.com/repos/${owner}/${repo}/contents/${folder}`;

  try {
    const res = await fetch(apiURL);

    if (!res.ok) {
      throw new Error(`GitHub API request failed: ${res.status}`);
    }

    const files = await res.json();

    let images = files.filter((file) =>
      /^IMG_\d+\.(jpe?g)$/i.test(file.name)
    );

    if (!images.length) {
      grid.innerHTML =
        "<p style='color:#b0b5c0; text-align:center;'>No images found in /images.</p>";
      return;
    }

    // shuffle
    images.sort(() => Math.random() - 0.5);

    // limit to 20
    images = images.slice(0, 20);
    currentImages = images;

    let loadedCount = 0;
    const total = images.length;

    function handleLoadOrError() {
      loadedCount++;
      if (loadedCount === total) {
        layoutMasonry();
      }
    }

    images.forEach((file, index) => {
      const card = document.createElement("a");
      card.className = "pin";
      card.href = "https://www.etsy.com/shop/TheRestingPine";
      card.target = "_blank";
      card.rel = "noopener";

      // staggered fade-in
      card.style.animationDelay = `${index * 60}ms`;

      const img = document.createElement("img");
      img.src = file.download_url;
      img.alt = "Handmade wood slice ornament";

      img.addEventListener("load", handleLoadOrError);
      img.addEventListener("error", handleLoadOrError);

      const caption = document.createElement("div");
      caption.className = "pin-caption";

      const pill = document.createElement("small");
      pill.textContent = "ETSY →";

      caption.appendChild(pill);
      card.appendChild(img);
      card.appendChild(caption);
      grid.appendChild(card);
    });
  } catch (err) {
    console.error("Error loading gallery:", err);
    grid.innerHTML =
      "<p style='color:#b0b5c0; text-align:center;'>Unable to load images.</p>";
  }
}

// parallax background: update CSS variable on scroll
function handleParallax() {
  const offset = window.scrollY * 0.03;
  document.body.style.setProperty("--parallax-offset", `${offset}px`);
}

// debounce resize for masonry recalculation
let resizeTimeout;
function handleResize() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(layoutMasonry, 150);
}

// init
window.addEventListener("scroll", handleParallax);
window.addEventListener("resize", handleResize);
window.addEventListener("load", () => {
  handleParallax();
  loadGallery();
});
