async function loadGallery() {
  const grid = document.getElementById("pinGrid");

  const owner = "AmesGate";
  const repo = "therestingpinegallery";
  const folder = "images";

  const apiURL = `https://api.github.com/repos/${owner}/${repo}/contents/${folder}`;

  try {
    const res = await fetch(apiURL);
    if (!res.ok) {
      throw new Error("GitHub API request failed");
    }

    const files = await res.json();

    // Keep only IMG_<number>.JPG / JPEG
    let images = files.filter(file =>
      /^IMG_\d+\.(jpe?g)$/i.test(file.name)
    );

    if (!images.length) {
      grid.innerHTML = "<p style='color:#b0b5c0;'>No images found in /images.</p>";
      return;
    }

    // Shuffle images
    shuffle(images);

    // Limit to 16 images
    images = images.slice(0, 16);

    images.forEach(file => {
      const a = document.createElement("a");
      a.className = "pin";
      a.href = "https://www.etsy.com/shop/TheRestingPine";
      a.target = "_blank";

      const img = document.createElement("img");
      img.src = file.download_url;
      img.alt = "Handmade wood slice ornament";

      const caption = document.createElement("div");
      caption.className = "pin-caption";

      // Only show Etsy button, no filename
      const tag = document.createElement("small");
      tag.textContent = "ETSY →";

      caption.appendChild(tag);

      a.appendChild(img);
      a.appendChild(caption);
      grid.appendChild(a);
    });

  } catch (error) {
    console.error("Error loading gallery:", error);
    grid.innerHTML = "<p style='color:#b0b5c0;'>Unable to load images.</p>";
  }
}

// Fisher–Yates shuffle
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math
