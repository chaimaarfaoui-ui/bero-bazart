// =========================================================
// Product detail page
// =========================================================

let CURRENT_PRODUCT = null;
let SELECTED = { size: "", color: "", qty: 1, imgIndex: 0 };

// Escapes a value so it can be safely dropped inside an HTML attribute
// (prevents broken markup when an image URL or name contains quotes).
function escapeAttr(str) {
  return String(str == null ? "" : str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function getProductId() {
  return new URLSearchParams(window.location.search).get("id");
}

async function loadProduct() {
  const id = getProductId();
  if (!id) {
    window.location.href = "index.html";
    return;
  }
  const { data, error } = await supabaseClient.from("products").select("*").eq("id", id).single();
  if (error || !data) {
    document.getElementById("pdpRoot").innerHTML = `<div class="empty-state"><h3>${t("empty_catalog_title")}</h3></div>`;
    return;
  }
  CURRENT_PRODUCT = data;
  SELECTED.size = (data.sizes || [])[0] || "";
  SELECTED.color = (data.colors || [])[0] || "";
  renderProduct();
  loadRelated();
}

function pName(p) {
  return getLang() === "en" ? p.name_en || p.name_fr : p.name_fr;
}
function pDesc(p) {
  return getLang() === "en" ? p.description_en || p.description_fr : p.description_fr;
}

function renderProduct() {
  const p = CURRENT_PRODUCT;
  const images = (p.images && p.images.length ? p.images : [placeholderImg()]).map(escapeAttr);
  const name = escapeAttr(pName(p));
  const hasSale = p.sale_price && p.sale_price < p.price;
  document.title = pName(p) + " — Bero Bazart";

  document.getElementById("pdpRoot").innerHTML = `
    <div class="pdp">
      <div class="pdp-gallery">
        <div class="pdp-gallery-main"><img id="pdpMainImg" src="${images[SELECTED.imgIndex]}" alt="${name}" /></div>
        <div class="pdp-thumbs">
          ${images.map((img, i) => `<img src="${img}" class="${i === SELECTED.imgIndex ? "active" : ""}" data-i="${i}" />`).join("")}
        </div>
      </div>
      <div class="pdp-info">
        <h1>${pName(p)}</h1>
        <div class="pdp-price">
          ${hasSale
            ? `<span class="price-sale">${fmtPrice(p.sale_price)}</span><span class="price-strike">${fmtPrice(p.price)}</span>`
            : `<span>${fmtPrice(p.price)}</span>`}
        </div>

        ${(p.sizes && p.sizes.length) ? `
        <div class="pdp-option-group">
          <div class="pdp-option-label">${t("size")}</div>
          <div class="option-pills" id="sizePills">
            ${p.sizes.map((s) => `<button class="option-pill ${s === SELECTED.size ? "active" : ""}" data-size="${escapeAttr(s)}">${s}</button>`).join("")}
          </div>
        </div>` : ""}

        ${(p.colors && p.colors.length) ? `
        <div class="pdp-option-group">
          <div class="pdp-option-label">${t("color")}</div>
          <div class="option-pills" id="colorPills">
            ${p.colors.map((c) => `<button class="option-pill ${c === SELECTED.color ? "active" : ""}" data-color="${escapeAttr(c)}">${c}</button>`).join("")}
          </div>
        </div>` : ""}

        <div class="pdp-option-label">${t("quantity")}</div>
        <div class="qty-stepper">
          <button id="qtyMinus">&minus;</button>
          <span id="qtyVal">${SELECTED.qty}</span>
          <button id="qtyPlus">&plus;</button>
        </div>

        <button class="btn btn-primary btn-block" id="pdpAddBtn" data-i18n="add_to_cart">${t("add_to_cart")}</button>

        <div class="pdp-desc">${pDesc(p)}</div>
      </div>
    </div>
    <section class="section">
      <div class="section-head"><h2 data-i18n="related_products">${t("related_products")}</h2></div>
      <div class="product-rail" id="relatedRail"></div>
    </section>
  `;

  bindPdpEvents();
}

function bindPdpEvents() {
  document.querySelectorAll("#sizePills .option-pill").forEach((btn) => {
    btn.addEventListener("click", () => {
      SELECTED.size = btn.getAttribute("data-size");
      document.querySelectorAll("#sizePills .option-pill").forEach((b) => b.classList.toggle("active", b === btn));
    });
  });
  document.querySelectorAll("#colorPills .option-pill").forEach((btn) => {
    btn.addEventListener("click", () => {
      SELECTED.color = btn.getAttribute("data-color");
      document.querySelectorAll("#colorPills .option-pill").forEach((b) => b.classList.toggle("active", b === btn));
    });
  });
  document.querySelectorAll(".pdp-thumbs img").forEach((img) => {
    img.addEventListener("click", () => {
      SELECTED.imgIndex = parseInt(img.getAttribute("data-i"));
      document.getElementById("pdpMainImg").src = img.src;
      document.querySelectorAll(".pdp-thumbs img").forEach((t2) => t2.classList.toggle("active", t2 === img));
    });
  });
  document.getElementById("qtyMinus").addEventListener("click", () => {
    SELECTED.qty = Math.max(1, SELECTED.qty - 1);
    document.getElementById("qtyVal").textContent = SELECTED.qty;
  });
  document.getElementById("qtyPlus").addEventListener("click", () => {
    SELECTED.qty += 1;
    document.getElementById("qtyVal").textContent = SELECTED.qty;
  });
  document.getElementById("pdpAddBtn").addEventListener("click", () => {
    const p = CURRENT_PRODUCT;
    addToCart({
      id: p.id,
      name_fr: p.name_fr,
      name_en: p.name_en,
      price: p.sale_price && p.sale_price < p.price ? p.sale_price : p.price,
      size: SELECTED.size,
      color: SELECTED.color,
      qty: SELECTED.qty,
      image: (p.images || [])[0] || "",
    });
  });
}

async function loadRelated() {
  const { data } = await supabaseClient
    .from("products")
    .select("*")
    .eq("category", CURRENT_PRODUCT.category)
    .neq("id", CURRENT_PRODUCT.id)
    .eq("is_active", true)
    .limit(8);
  const rail = document.getElementById("relatedRail");
  if (!rail) return;
  if (!data || data.length === 0) {
    document.querySelector("#relatedRail").closest("section").style.display = "none";
    return;
  }
  rail.innerHTML = data
    .map((p) => {
      const img = escapeAttr((p.images && p.images[0]) || placeholderImg());
      const name = escapeAttr(pName(p));
      return `<a href="product.html?id=${p.id}" class="product-card">
        <div class="product-card-media"><img src="${img}" alt="${name}" /></div>
        <div class="product-card-info">
          <div class="product-card-name">${name}</div>
          <div class="product-card-price">${fmtPrice(p.price)}</div>
        </div>
      </a>`;
    })
    .join("");
}

document.addEventListener("DOMContentLoaded", loadProduct);

const _prevLangChangePdp = window.onLangChange || function () {};
window.onLangChange = function () {
  _prevLangChangePdp();
  if (CURRENT_PRODUCT) renderProduct();
};