async function loadGallery() {
  const grid = document.getElementById('pinGrid');

  try {
    const res = await fetch('products.json');
    if (!res.ok) throw new Error('products.json not found');

    const products = await res.json();

    products.forEach(item => {
      const a = document.createElement('a');
      a.className = 'pin';
      a.href = item.link || 'https://www.etsy.com/shop/TheRestingPine';
      a.target = '_blank';
      a.rel = 'noopener';

      const img = document.createElement('img');
      img.src = 'images/' + item.image;
      img.alt = item.alt || item.title || 'Wood slice ornament';

      const caption = document.createElement('div');
      caption.className = 'pin-caption';

      const titleSpan = document.createElement('span');
      titleSpan.textContent = item.title || 'Wood slice ornament';

      const tag = document.createElement('small');
      tag.textContent = 'etsy →';

      caption.appendChild(titleSpan);
      caption.appendChild(tag);

      a.appendChild(img);
      a.appendChild(caption);
      grid.appendChild(a);
    });

  } catch (err) {
    console.error(err);
    grid.innerHTML =
      '<p style="color:#b0b5c0;font-size:0.85rem;">Unable to load products.</p>';
  }
}

loadGallery();
