async function loadGallery() {
  const grid = document.getElementById("pinGrid");

  // GitHub repo info
  const owner = "AmesGate";
  const repo = "therestingpinegallery";
  const folder = "images";

  // GitHub API URL
  const apiURL = `https://api.github.com/repos/${owner}/${repo}/contents/${folder}`;

  try {
    const res = await fetch(apiURL);
    const files = await res.json();

    // Filter for files named IMG_<number>.JPEG or IMG_<number>.JPG
    const images = files.filter(file =>
      /^IMG_\d+\.(jpe?g)$/i.test(file.name)
    );

    images.forEach(file => {
      const a = document.createElement("a");
      a.className = "pin";
      a.href = "https://www.etsy.com/shop/TheRestingPine";
      a.target = "_blank";

      const img = document.createElement("img");
      img.src = file.download_url;
      img.alt = file.name;

      const caption = document.createElement("div");
      caption.className = "pin-caption";

      const titleSpan = document.createElement("span");
      titleSpan.textContent = file.name;

      const tag = document.createElement("small");
      tag.textContent = "etsy →";

      caption.appendChild(titleSpan);
      caption.appendChild(tag);

      a.appendChild(img);
      a.appendChild(caption);
      grid.appendChild(a);
    });

  } catch (error) {
    console.error("Error loading gallery:", error);
    grid.innerHTML = "<p style='color: #b0b5c0;'>Unable to load images.</p>";
  }
}

loadGallery();
