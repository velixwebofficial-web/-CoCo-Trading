(function () {
  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str ?? "";
    return div.innerHTML;
  }

  async function fetchJSON(url) {
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      return null;
    }
  }

  function renderSingle(product) {
    const heroTitle = document.querySelector("[data-detail-title]");
    const mainImage = document.querySelector("[data-main-product-image]");
    const thumbs = document.querySelector(".product-thumbs");
    const nameEl = document.querySelector("[data-product-name]");
    const descEl = document.querySelector("[data-product-description]");
    const moqEl = document.querySelector("[data-spec-moq]");
    const leadEl = document.querySelector("[data-spec-leadtime]");
    const packEl = document.querySelector("[data-spec-packaging]");
    const shipEl = document.querySelector("[data-spec-shipping]");
    const backLink = document.querySelector("[data-back-link]");

    if (heroTitle) heroTitle.textContent = product.name;
    if (mainImage) {
      mainImage.src = product.image;
      mainImage.alt = product.name;
    }
    if (thumbs) thumbs.style.display = "none";
    if (nameEl) nameEl.textContent = product.name;
    if (descEl && product.description) descEl.textContent = product.description;
    if (moqEl) moqEl.textContent = product.moq || "By quotation";
    if (leadEl) leadEl.textContent = product.leadTime || "By order";
    if (packEl) packEl.textContent = product.packaging || "Standard / Custom";
    if (shipEl) shipEl.textContent = product.shipping || "Worldwide";
    if (backLink) backLink.href = `product-details.html?category=${product.category}`;
  }

  function renderGrid(products) {
    const grid = document.getElementById("categoryProductsGrid");
    const countLabel = document.querySelector("[data-products-count]");
    if (!grid) return;

    grid.innerHTML = products
      .map(
        (p) => `
        <article class="category-card reveal is-visible" data-search-card>
          <div class="category-card__copy">
            <h3>${escapeHtml(p.name)}</h3>
            <a class="circle-link" href="product-details.html?id=${p.id}" aria-label="View ${escapeHtml(p.name)}">
              <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
            </a>
          </div>
          <img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy" width="420" height="420"
               onerror="this.onerror=null;this.src='assets/optimized/categories/${p.category}.webp'">
        </article>
      `
      )
      .join("");

    if (countLabel) {
      countLabel.textContent = `${products.length} ${products.length === 1 ? "product" : "products"} in this category`;
    }
  }

  async function init() {
    const gridSection = document.getElementById("productsGridSection");
    const singleSection = document.getElementById("singleProductSection");
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const category = params.get("category");

    if (id) {
      const product = await fetchJSON(`/api/products/${encodeURIComponent(id)}`);
      if (product) {
        if (gridSection) gridSection.hidden = true;
        if (singleSection) singleSection.hidden = false;
        renderSingle(product);
      }
      return;
    }

    if (category) {
      const list = await fetchJSON(`/api/products?category=${encodeURIComponent(category)}`);
      if (list && list.length > 1) {
        if (gridSection) gridSection.hidden = false;
        if (singleSection) singleSection.hidden = true;
        renderGrid(list);
        return;
      }
      if (list && list.length === 1) {
        if (gridSection) gridSection.hidden = true;
        if (singleSection) singleSection.hidden = false;
        renderSingle(list[0]);
        return;
      }
      // No products added by the admin yet for this category (or API unreachable):
      // keep the built-in default category preview already in the page.
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
