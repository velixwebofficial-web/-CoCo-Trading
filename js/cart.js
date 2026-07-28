(function () {
  const CART_KEY = "coco_cart_v1";

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str ?? "";
    return div.innerHTML;
  }

  function getCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    renderCart();
    updateBadge();
  }

  function addToCart(product, qty) {
    const cart = getCart();
    const existing = cart.find((it) => String(it.productId) === String(product.id));
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        image: product.image,
        price: product.price ?? 0,
        qty,
      });
    }
    saveCart(cart);
    showToast(`${product.name} added to cart.`);
    openDrawer();
  }

  function updateLineQty(productId, qty) {
    const cart = getCart();
    const line = cart.find((it) => String(it.productId) === String(productId));
    if (!line) return;
    line.qty = Math.max(1, qty);
    saveCart(cart);
  }

  function removeLine(productId) {
    const cart = getCart().filter((it) => String(it.productId) !== String(productId));
    saveCart(cart);
  }

  function cartCount() {
    return getCart().reduce((sum, it) => sum + it.qty, 0);
  }

  function cartTotal() {
    return Math.round(getCart().reduce((sum, it) => sum + it.price * it.qty, 0) * 100) / 100;
  }

  function money(n) {
    return `${Number(n || 0).toFixed(2)} JD`;
  }

  // ---------- Toast ----------
  function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `site-toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("show"));
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // ---------- Badge ----------
  function updateBadge() {
    const badge = document.querySelector("[data-cart-badge]");
    if (!badge) return;
    const count = cartCount();
    badge.textContent = count > 99 ? "99+" : String(count);
    badge.classList.toggle("show", count > 0);
  }

  // ---------- Drawer injection ----------
  function injectCartUI() {
    const navActions = document.querySelector(".nav-actions");
    if (navActions && !document.querySelector("[data-cart-toggle]")) {
      const btn = document.createElement("button");
      btn.className = "nav-icon cart-icon-btn";
      btn.type = "button";
      btn.setAttribute("data-cart-toggle", "");
      btn.setAttribute("aria-label", "Open cart");
      btn.innerHTML = `<i class="fa-solid fa-bag-shopping" aria-hidden="true"></i><span class="cart-badge" data-cart-badge>0</span>`;
      const searchToggle = navActions.querySelector(".search-toggle");
      if (searchToggle) {
        searchToggle.after(btn);
      } else {
        navActions.prepend(btn);
      }
    }

    if (!document.getElementById("cartOverlay")) {
      const overlay = document.createElement("div");
      overlay.className = "cart-overlay";
      overlay.id = "cartOverlay";
      document.body.appendChild(overlay);
    }

    if (!document.getElementById("cartDrawer")) {
      const drawer = document.createElement("aside");
      drawer.className = "cart-drawer";
      drawer.id = "cartDrawer";
      drawer.innerHTML = `
        <div class="cart-drawer__header">
          <h2>Your Cart</h2>
          <button class="cart-drawer__close" type="button" aria-label="Close cart">&times;</button>
        </div>
        <div class="cart-drawer__body" id="cartDrawerBody"></div>
        <div class="cart-drawer__footer" id="cartDrawerFooter"></div>
      `;
      document.body.appendChild(drawer);
    }

    if (!document.getElementById("checkoutOverlay")) {
      const co = document.createElement("div");
      co.className = "checkout-modal-overlay";
      co.id = "checkoutOverlay";
      co.innerHTML = `
        <div class="checkout-modal">
          <button class="checkout-modal__close" type="button" aria-label="Close">&times;</button>
          <div id="checkoutContent"></div>
        </div>
      `;
      document.body.appendChild(co);
    }

    document.querySelector("[data-cart-toggle]")?.addEventListener("click", openDrawer);
    document.querySelector(".cart-drawer__close")?.addEventListener("click", closeDrawer);
    document.getElementById("cartOverlay")?.addEventListener("click", closeDrawer);
    document.querySelector(".checkout-modal__close")?.addEventListener("click", closeCheckout);
    document.getElementById("checkoutOverlay")?.addEventListener("click", (e) => {
      if (e.target.id === "checkoutOverlay") closeCheckout();
    });
  }

  function openDrawer() {
    document.getElementById("cartDrawer")?.classList.add("active");
    document.getElementById("cartOverlay")?.classList.add("active");
  }
  function closeDrawer() {
    document.getElementById("cartDrawer")?.classList.remove("active");
    document.getElementById("cartOverlay")?.classList.remove("active");
  }
  function openCheckout() {
    document.getElementById("checkoutOverlay")?.classList.add("active");
  }
  function closeCheckout() {
    document.getElementById("checkoutOverlay")?.classList.remove("active");
  }

  function renderCart() {
    const body = document.getElementById("cartDrawerBody");
    const footer = document.getElementById("cartDrawerFooter");
    if (!body || !footer) return;
    const cart = getCart();

    if (cart.length === 0) {
      body.innerHTML = `<div class="cart-empty"><i class="fa-solid fa-bag-shopping" style="font-size:32px;margin-bottom:12px;display:block;"></i>Your cart is empty.</div>`;
      footer.innerHTML = "";
      return;
    }

    body.innerHTML = cart
      .map(
        (it) => `
      <div class="cart-line" data-line="${it.productId}">
        <img src="${it.image}" alt="${escapeHtml(it.name)}" onerror="this.style.visibility='hidden'">
        <div class="cart-line__info">
          <h4>${escapeHtml(it.name)}</h4>
          <span class="price-tag">${money(it.price)}</span>
          <div class="cart-line__row">
            <div class="qty-stepper">
              <button type="button" data-qty-minus>&minus;</button>
              <input type="number" min="1" value="${it.qty}" data-qty-input>
              <button type="button" data-qty-plus>&plus;</button>
            </div>
            <button class="cart-remove-btn" type="button" data-remove-line aria-label="Remove"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
      </div>
    `
      )
      .join("");

    footer.innerHTML = `
      <div class="cart-subtotal-row"><span>Total</span><span>${money(cartTotal())}</span></div>
      <button class="button" style="width:100%;" id="goToCheckoutBtn">Checkout <i class="fa-solid fa-arrow-right"></i></button>
    `;

    body.querySelectorAll("[data-line]").forEach((row) => {
      const id = row.dataset.line;
      row.querySelector("[data-qty-minus]").addEventListener("click", () => {
        const input = row.querySelector("[data-qty-input]");
        updateLineQty(id, Number(input.value) - 1);
      });
      row.querySelector("[data-qty-plus]").addEventListener("click", () => {
        const input = row.querySelector("[data-qty-input]");
        updateLineQty(id, Number(input.value) + 1);
      });
      row.querySelector("[data-qty-input]").addEventListener("change", (e) => {
        updateLineQty(id, Number(e.target.value) || 1);
      });
      row.querySelector("[data-remove-line]").addEventListener("click", () => removeLine(id));
    });

    document.getElementById("goToCheckoutBtn")?.addEventListener("click", () => {
      closeDrawer();
      renderCheckoutForm();
      openCheckout();
    });
  }

  function renderCheckoutForm() {
    const content = document.getElementById("checkoutContent");
    const cart = getCart();
    const itemsHtml = cart
      .map((it) => `<div style="display:flex;justify-content:space-between;padding:4px 0;"><span>${escapeHtml(it.name)} × ${it.qty}</span><span>${money(it.price * it.qty)}</span></div>`)
      .join("");

    content.innerHTML = `
      <h2>Checkout</h2>
      <div class="checkout-summary">
        ${itemsHtml}
        <div class="cart-subtotal-row" style="margin-top:8px;"><span>Total</span><span>${money(cartTotal())}</span></div>
      </div>
      <form class="checkout-form" id="checkoutForm">
        <div>
          <label for="chkName">Full Name *</label>
          <input type="text" id="chkName" required>
        </div>
        <div class="form-row">
          <div>
            <label for="chkPhone">Phone *</label>
            <input type="tel" id="chkPhone" required placeholder="+962 7X XXX XXXX">
          </div>
          <div>
            <label for="chkEmail">Email</label>
            <input type="email" id="chkEmail" placeholder="optional">
          </div>
        </div>
        <div>
          <label for="chkAddress">Address *</label>
          <input type="text" id="chkAddress" required placeholder="Street, building, area">
        </div>
        <div class="form-row">
          <div>
            <label for="chkCity">City *</label>
            <input type="text" id="chkCity" required placeholder="e.g. Aqaba">
          </div>
          <div>
            <label for="chkCountry">Country</label>
            <input type="text" id="chkCountry" value="Jordan">
          </div>
        </div>
        <div>
          <label for="chkNotes">Order Notes</label>
          <textarea id="chkNotes" rows="2" placeholder="Colors, sizes, delivery preferences..."></textarea>
        </div>
        <button class="button" type="submit" style="width:100%;" id="placeOrderBtn">Place Order <i class="fa-solid fa-check"></i></button>
      </form>
    `;

    document.getElementById("checkoutForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = document.getElementById("placeOrderBtn");
      btn.disabled = true;
      btn.textContent = "Placing order...";

      const payload = {
        customer: {
          name: document.getElementById("chkName").value.trim(),
          phone: document.getElementById("chkPhone").value.trim(),
          email: document.getElementById("chkEmail").value.trim(),
          address: document.getElementById("chkAddress").value.trim(),
          city: document.getElementById("chkCity").value.trim(),
          country: document.getElementById("chkCountry").value.trim(),
          notes: document.getElementById("chkNotes").value.trim(),
        },
        items: cart.map((it) => ({ productId: it.productId, qty: it.qty })),
      };

      try {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "Could not place order");

        localStorage.removeItem(CART_KEY);
        renderCart();
        updateBadge();

        content.innerHTML = `
          <div class="order-success">
            <i class="fa-solid fa-circle-check"></i>
            <h2>Order Placed!</h2>
            <p>Your order <strong>#${data.id}</strong> has been received. Our team will contact you shortly on <strong>${escapeHtml(payload.customer.phone)}</strong> to confirm details.</p>
            <button class="button" id="closeCheckoutSuccess">Done</button>
          </div>
        `;
        document.getElementById("closeCheckoutSuccess").addEventListener("click", closeCheckout);
      } catch (err) {
        showToast(err.message || "Could not place your order. Please try again.", "error");
        btn.disabled = false;
        btn.textContent = "Place Order";
      }
    });
  }

  // Public API used by product pages
  window.CoCoCart = {
    addToCart,
    money,
    cartCount,
  };

  function init() {
    injectCartUI();
    renderCart();
    updateBadge();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
