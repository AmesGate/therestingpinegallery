async function loadGallery() {
  const grid = document.getElementById("pinGrid");

  // CHANGE THESE THREE VALUES TO MATCH YOUR REPO
  const owner = "AmesGate";
  const repo = "therestingpinegallery";
  const folder = "images";

  // GitHub API URL for listing folder contents
  const apiURL = `https://api.github.com/repos/${owner}/${repo}/contents/${folder}`;

  try {
    const res = await fetch(apiURL);
    const files = await res.json();

    // Filter only IMG_XXXX.JPEG (case-insensitive)
    const images = files.filter(file =>
      /^IMG_\d+\.jpe?g$/i.test(file.name)
    );

    images.forEach(file => {
      const url = file.download_url;

      const a = document.createElement("a");
      a.className = "pin";
      a.href = "https://www.etsy.com/shop/TheRestingPine";
      a.target = "_blank";

      const img = document.createElement("img");
      img.src = url;
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
    console.error("Error loading images:", error);
    grid.innerHTML = "<p style='color:#b0b5c0;'>Unable to load images.</p>";
  }
}

loadGallery();
