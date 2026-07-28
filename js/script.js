document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".primary-nav");
  const searchToggle = document.querySelector(".search-toggle");
  const searchPanel = document.querySelector("[data-search-panel]");
  const searchClose = document.querySelector(".search-close");
  const searchForm = document.querySelector(".search-form");
  const searchInput = document.querySelector("#site-search");

  const closeMenu = () => {
    if (!menuButton || !nav) return;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", window.WQI18n?.t("Open navigation") || "Open navigation");
    nav.classList.remove("open");
    body.classList.remove("menu-open");
  };

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      menuButton.setAttribute("aria-label", window.WQI18n?.t(isOpen ? "Open navigation" : "Close navigation") || (isOpen ? "Open navigation" : "Close navigation"));
      nav.classList.toggle("open", !isOpen);
      body.classList.toggle("menu-open", !isOpen);
    });

    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("click", (event) => {
      if (window.innerWidth <= 900 && nav.classList.contains("open") && !nav.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
    });
  }

  const setSearchOpen = (open) => {
    if (!searchPanel || !searchToggle) return;
    searchPanel.hidden = !open;
    searchToggle.setAttribute("aria-expanded", String(open));
    searchToggle.setAttribute("aria-label", window.WQI18n?.t(open ? "Close search" : "Open search") || (open ? "Close search" : "Open search"));
    if (open) window.setTimeout(() => searchInput?.focus(), 30);
  };

  searchToggle?.addEventListener("click", () => setSearchOpen(searchPanel?.hidden ?? true));
  searchClose?.addEventListener("click", () => setSearchOpen(false));

  searchForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = searchInput?.value.trim() || "";
    const localFilter = document.querySelector("[data-product-filter]");
    if (localFilter) {
      localFilter.value = query;
      localFilter.dispatchEvent(new Event("input", { bubbles: true }));
      setSearchOpen(false);
      document.querySelector(".catalog-toolbar")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.location.href = `products.html${query ? `?q=${encodeURIComponent(query)}` : ""}`;
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      setSearchOpen(false);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeMenu();
  });

  const cards = [...document.querySelectorAll("[data-search-card]")];
  const productFilter = document.querySelector("[data-product-filter]");
  const resultStatus = document.querySelector("[data-results-status]");
  const emptyState = document.querySelector("[data-empty-state]");
  const filterCards = (query) => {
    const normalized = query.trim().toLowerCase();
    let visible = 0;
    cards.forEach((card) => {
      const categoryAliases = window.WQI18n?.categorySearchTerms(card.id) || "";
      const searchable = `${card.dataset.search || ""} ${categoryAliases}`.toLowerCase();
      const match = !normalized || searchable.includes(normalized);
      card.hidden = !match;
      if (match) visible += 1;
    });
    if (resultStatus) {
      const language = window.WQI18n?.getLanguage() || "en";
      resultStatus.textContent = language === "ar"
        ? `${visible} ${visible === 1 ? "تصنيف متاح" : "تصنيفات متاحة"}`
        : language === "zh"
          ? `共有 ${visible} 个分类`
          : `${visible} ${visible === 1 ? "category" : "categories"} available`;
    }
    if (emptyState) emptyState.hidden = visible !== 0;
  };
  if (productFilter) {
    const initialQuery = new URLSearchParams(window.location.search).get("q") || "";
    productFilter.value = initialQuery;
    filterCards(initialQuery);
    productFilter.addEventListener("input", () => filterCards(productFilter.value));
  }

  const form = document.querySelector("[data-contact-form]");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const fields = [...form.querySelectorAll("[required]")];
      let valid = true;
      fields.forEach((field) => {
        const fieldValid = field.checkValidity();
        field.classList.toggle("invalid", !fieldValid);
        if (!fieldValid) valid = false;
      });
      const message = form.querySelector("[data-form-message]");
      if (!valid) {
        if (message) message.textContent = window.WQI18n?.getLanguage() === "ar"
          ? "يرجى تعبئة جميع الحقول المطلوبة بشكل صحيح."
          : window.WQI18n?.getLanguage() === "zh"
            ? "请正确填写所有必填字段。"
            : "Please complete all required fields correctly.";
        fields.find((field) => !field.checkValidity())?.focus();
        return;
      }
      if (message) message.textContent = window.WQI18n?.getLanguage() === "ar"
        ? "طلبك جاهز. اربط النموذج بالبريد الإلكتروني أو بخدمة خلفية قبل نشر الموقع."
        : window.WQI18n?.getLanguage() === "zh"
          ? "您的请求已准备就绪。发布网站前，请将表单连接到邮箱或后端服务。"
          : "Your request is ready. Connect this form to your email or backend service before publishing.";
      form.reset();
    });
    form.querySelectorAll("input, select, textarea").forEach((field) => field.addEventListener("input", () => field.classList.remove("invalid")));
  }

  const mainImage = document.querySelector("[data-main-product-image]");
  const productName = document.querySelector("[data-product-name]");
  document.querySelectorAll(".product-thumb").forEach((thumb) => {
    thumb.addEventListener("click", () => {
      document.querySelectorAll(".product-thumb").forEach((item) => item.classList.remove("active"));
      thumb.classList.add("active");
      if (mainImage) {
        mainImage.src = thumb.dataset.productImage;
        const rawName = thumb.dataset.productName || "Wholesale product";
        mainImage.alt = window.WQI18n?.t(rawName) || rawName;
      }
      if (productName) {
        const rawName = thumb.dataset.productName || "Wholesale Product";
        productName.textContent = window.WQI18n?.t(rawName) || rawName;
      }
    });
  });

  // Select a matching product when arriving from a category card.
  const selectedCategory = new URLSearchParams(window.location.search).get("category");
  const categoryIds = new Set(["mens-underwear", "womens-underwear", "womens-socks", "mens-socks", "bras", "boys-socks", "girls-socks"]);
  const updateSelectedCategory = () => {
    if (!selectedCategory || !categoryIds.has(selectedCategory)) return;
    const file = `${selectedCategory}.webp`;
    const translatedName = window.WQI18n?.categoryName(selectedCategory) || selectedCategory;
    if (mainImage) {
      mainImage.src = `assets/optimized/categories/${file}`;
      mainImage.alt = translatedName;
    }
    if (productName) productName.textContent = translatedName;
    const detailTitle = document.querySelector("[data-detail-title]");
    if (detailTitle) detailTitle.textContent = window.WQI18n?.collectionTitle(selectedCategory) || `${translatedName} Wholesale Collection`;
  };
  updateSelectedCategory();

  document.querySelectorAll("[data-year]").forEach((node) => node.textContent = String(new Date().getFullYear()));

  window.addEventListener("wq:languagechange", () => {
    if (productFilter) filterCards(productFilter.value);
    updateSelectedCategory();
    const activeThumb = document.querySelector(".product-thumb.active");
    if (!selectedCategory && activeThumb) {
      const rawName = activeThumb.dataset.productName || "Wholesale Product";
      const translatedName = window.WQI18n?.t(rawName) || rawName;
      if (productName) productName.textContent = translatedName;
      if (mainImage) mainImage.alt = translatedName;
    }
    if (menuButton?.getAttribute("aria-expanded") !== "true") menuButton?.setAttribute("aria-label", window.WQI18n?.t("Open navigation") || "Open navigation");
    if (searchToggle?.getAttribute("aria-expanded") !== "true") searchToggle?.setAttribute("aria-label", window.WQI18n?.t("Open search") || "Open search");
  });

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px" });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }
});
