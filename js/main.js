// =========================================================
// Homepage: loads products from Supabase, renders rails + filterable grid
// =========================================================

let ALL_PRODUCTS = [];
let ACTIVE_CATEGORY = "all";

// Escapes a value so it can be safely dropped inside an HTML attribute
// (prevents broken markup when an image URL or name contains quotes).
function escapeAttr(str) {
  return String(str == null ? "" : str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function loadProducts() {
  const { data, error } = await supabaseClient
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    ALL_PRODUCTS = [];
  } else {
    ALL_PRODUCTS = data || [];
  }
  renderCategoryChips();
  renderNewInRail();
  renderGrid();
}

function productName(p) {
  return getLang() === "en" ? p.name_en || p.name_fr : p.name_fr;
}

function categories() {
  const set = new Set(ALL_PRODUCTS.map((p) => p.category).filter(Boolean));
  return Array.from(set);
}

function renderCategoryChips() {
  const rail = document.getElementById("categoryChips");
  if (!rail) return;
  const cats = categories();
  rail.innerHTML =
    `<button class="chip ${ACTIVE_CATEGORY === "all" ? "active" : ""}" data-cat="all">${t("nav_all")}</button>` +
    cats.map((c) => `<button class="chip ${ACTIVE_CATEGORY === c ? "active" : ""}" data-cat="${escapeAttr(c)}">${c}</button>`).join("");

  rail.querySelectorAll(".chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      ACTIVE_CATEGORY = btn.getAttribute("data-cat");
      renderCategoryChips();
      renderGrid();
      document.getElementById("shopGrid")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function productCardHTML(p) {
  const img = escapeAttr((p.images && p.images[0]) || placeholderImg());
  const img2 = escapeAttr((p.images && p.images[1]) || (p.images && p.images[0]) || placeholderImg());
  const name = escapeAttr(productName(p));
  const hasSale = p.sale_price && p.sale_price < p.price;
  const singleVariant = (p.sizes || []).length <= 1 && (p.colors || []).length <= 1;

  return `
  <div class="product-card">
    <a href="product.html?id=${p.id}">
      <div class="product-card-media">
        <img src="${img}" alt="${name}" />
        <img src="${img2}" alt="" class="hover-img" />
        ${hasSale ? `<span class="badge-sale">${t("price")} -${Math.round((1 - p.sale_price / p.price) * 100)}%</span>` : ""}
      </div>
    </a>
    <button class="product-card-quickadd" data-id="${p.id}">
      ${singleVariant ? t("add_to_cart") : t("choose_options")}
    </button>
    <div class="product-card-info">
      <div class="product-card-name">${name}</div>
      <div class="product-card-price">
        ${hasSale
          ? `<span class="price-sale">${fmtPrice(p.sale_price)}</span><span class="price-strike">${fmtPrice(p.price)}</span>`
          : `<span>${fmtPrice(p.price)}</span>`}
      </div>
    </div>
  </div>`;
}

function bindQuickAdd(container) {
  container.querySelectorAll(".product-card-quickadd").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const p = ALL_PRODUCTS.find((x) => x.id === btn.getAttribute("data-id"));
      if (!p) return;
      const singleVariant = (p.sizes || []).length <= 1 && (p.colors || []).length <= 1;
      if (!singleVariant) {
        window.location.href = `product.html?id=${p.id}`;
        return;
      }
      addToCart({
        id: p.id,
        name_fr: p.name_fr,
        name_en: p.name_en,
        price: p.sale_price && p.sale_price < p.price ? p.sale_price : p.price,
        size: (p.sizes || [])[0] || "",
        color: (p.colors || [])[0] || "",
        qty: 1,
        image: (p.images || [])[0] || "",
      });
      const original = btn.textContent;
      btn.textContent = t("added");
      setTimeout(() => (btn.textContent = original), 1200);
    });
  });
}

function renderNewInRail() {
  const rail = document.getElementById("newInRail");
  if (!rail) return;
  const items = ALL_PRODUCTS.slice(0, 10);
  rail.innerHTML = items.map(productCardHTML).join("");
  bindQuickAdd(rail);
}

function renderGrid() {
  const grid = document.getElementById("shopGrid");
  const empty = document.getElementById("emptyState");
  if (!grid) return;
  const items = ACTIVE_CATEGORY === "all" ? ALL_PRODUCTS : ALL_PRODUCTS.filter((p) => p.category === ACTIVE_CATEGORY);

  if (ALL_PRODUCTS.length === 0) {
    grid.innerHTML = "";
    if (empty) empty.style.display = "block";
    return;
  }
  if (empty) empty.style.display = "none";
  grid.innerHTML = items.map(productCardHTML).join("");
  bindQuickAdd(grid);
}

document.addEventListener("DOMContentLoaded", loadProducts);

const _prevLangChangeMain = window.onLangChange || function () {};
window.onLangChange = function () {
  _prevLangChangeMain();
  renderCategoryChips();
  renderNewInRail();
  renderGrid();
};