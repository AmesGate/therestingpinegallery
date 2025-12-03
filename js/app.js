async function loadGallery() {
  const grid = document.getElementById("pinGrid");
  if (!grid) return;

  // Clear anything existing
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

    // Keep only IMG_<number>.JPG or JPEG
    let images = files.filter((file) =>
      /^IMG_\d+\.(jpe?g)$/i.test(file.name)
    );

    if (!images.length) {
      grid.innerHTML =
        "<p style='color:#b0b5c0; text-align:center;'>No images found in /images.</p>";
      return;
    }

    // Randomize order
    images.sort(() => Math.random() - 0.5);

    // Limit to 16 images
    images = images.slice(0, 20);

    images.forEach((file) => {
      // Outer link → Etsy shop
      const a = document.createElement("a");
      a.className = "pin";
      a.href = "https://www.etsy.com/shop/TheRestingPine";
      a.target = "_blank";
      a.rel = "noopener";

      // Image
      const img = document.createElement("img");
      img.src = file.download_url;
      img.alt = "Handmade wood slice ornament";

      // Caption (only ETSY pill, no filename)
      const caption = document.createElement("div");
      caption.className = "pin-caption";

      const pill = document.createElement("small");
      pill.textContent = "ETSY →";

      caption.appendChild(pill);

      a.appendChild(img);
      a.appendChild(caption);
      grid.appendChild(a);
    });
  } catch (err) {
    console.error("Error loading gallery:", err);
    grid.innerHTML =
      "<p style='color:#b0b5c0; text-align:center;'>Unable to load images.</p>";
  }
}

// Kick it off
loadGallery();
