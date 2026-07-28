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

  function money(n) {
    return `${Number(n || 0).toFixed(2)} JD`;
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
    const priceEl = document.querySelector("[data-product-price]");
    const actionsEl = document.querySelector(".product-actions");

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

    if (priceEl) {
      priceEl.textContent = typeof product.price === "number" ? money(product.price) : "Contact for price";
    }

    const outOfStock = typeof product.stock === "number" && product.stock <= 0;

    if (actionsEl && !actionsEl.querySelector("[data-add-to-cart]")) {
      const cartBlock = document.createElement("div");
      cartBlock.style.display = "flex";
      cartBlock.style.alignItems = "center";
      cartBlock.style.gap = "12px";
      cartBlock.innerHTML = `
        <div class="qty-stepper">
          <button type="button" data-qty-minus>&minus;</button>
          <input type="number" min="1" value="1" data-qty-input>
          <button type="button" data-qty-plus>&plus;</button>
        </div>
        <button class="button" type="button" data-add-to-cart ${outOfStock ? "disabled" : ""}>
          ${outOfStock ? "Out of Stock" : "Add to Cart"} <i class="fa-solid fa-bag-shopping" aria-hidden="true"></i>
        </button>
      `;
      actionsEl.prepend(cartBlock);

      const qtyInput = cartBlock.querySelector("[data-qty-input]");
      cartBlock.querySelector("[data-qty-minus]").addEventListener("click", () => {
        qtyInput.value = Math.max(1, Number(qtyInput.value) - 1);
      });
      cartBlock.querySelector("[data-qty-plus]").addEventListener("click", () => {
        qtyInput.value = Number(qtyInput.value) + 1;
      });
      cartBlock.querySelector("[data-add-to-cart]").addEventListener("click", () => {
        if (window.CoCoCart) {
          window.CoCoCart.addToCart(product, Math.max(1, Number(qtyInput.value) || 1));
        }
      });
    }

    const stockNoteHost = document.querySelector(".product-summary");
    if (stockNoteHost && typeof product.stock === "number" && !stockNoteHost.querySelector(".stock-note, .out-of-stock-note")) {
      const note = document.createElement("p");
      note.className = outOfStock ? "out-of-stock-note" : "stock-note";
      note.textContent = outOfStock ? "Currently out of stock." : `${product.stock} in stock`;
      const specGrid = stockNoteHost.querySelector(".spec-grid");
      if (specGrid) specGrid.after(note);
    }
  }

  function renderGrid(products) {
    const grid = document.getElementById("categoryProductsGrid");
    const countLabel = document.querySelector("[data-products-count]");
    if (!grid) return;

    grid.innerHTML = products
      .map((p) => {
        const outOfStock = typeof p.stock === "number" && p.stock <= 0;
        return `
        <article class="category-card reveal is-visible" data-search-card>
          <div class="category-card__copy">
            <h3>${escapeHtml(p.name)}</h3>
            <span class="category-card__price">${typeof p.price === "number" ? money(p.price) : "Contact for price"}</span>
            <a class="circle-link" href="product-details.html?id=${p.id}" aria-label="View ${escapeHtml(p.name)}">
              <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
            </a>
          </div>
          <img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy" width="420" height="420"
               onerror="this.onerror=null;this.src='assets/optimized/categories/${p.category}.webp'">
          <button class="button button--small" type="button" style="margin:0 16px 16px;" data-quick-add="${p.id}" ${outOfStock ? "disabled" : ""}>
            ${outOfStock ? "Out of Stock" : "Add to Cart"}
          </button>
        </article>
      `;
      })
      .join("");

    grid.querySelectorAll("[data-quick-add]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const product = products.find((p) => String(p.id) === btn.dataset.quickAdd);
        if (product && window.CoCoCart) window.CoCoCart.addToCart(product, 1);
      });
    });

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
