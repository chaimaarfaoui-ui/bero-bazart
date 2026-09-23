// =========================================================
// Admin panel: staff login (accounts are created in Supabase dashboard), orders, product CRUD
// =========================================================

// Escapes text before it goes into innerHTML (orders come from the public, so never trust them)
function escapeHTML(str) {
  return String(str == null ? "" : str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

let CURRENT_TAB = "orders";
let EDITING_PRODUCT = null;
let PENDING_IMAGES = []; // {file, previewUrl} or {url} for already-uploaded images

// ---------- AUTH ----------

async function getSession() {
  const { data } = await supabaseClient.auth.getSession();
  return data.session;
}

async function checkAuth() {
  const session = await getSession();
  if (session) {
    showAdminShell();
  } else {
    showAuthBox();
  }
}

function showAuthBox() {
  document.getElementById("authBox").style.display = "block";
  document.getElementById("adminShell").style.display = "none";
}

function showAdminShell() {
  document.getElementById("authBox").style.display = "none";
  document.getElementById("adminShell").style.display = "block";
  loadOrders();
  loadProductsAdmin();
  loadSettingsIntoForm();
}

async function handleAuthSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const email = form.email.value.trim();
  const password = form.password.value;
  const errorEl = document.getElementById("authError");
  errorEl.textContent = "";

  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) {
    errorEl.textContent = error.message;
    return;
  }
  checkAuth();
}

async function logout() {
  await supabaseClient.auth.signOut();
  showAuthBox();
}

// ---------- TABS ----------

function switchTab(tab) {
  CURRENT_TAB = tab;
  document.querySelectorAll(".admin-tab").forEach((b) => b.classList.toggle("active", b.getAttribute("data-tab") === tab));
  document.getElementById("ordersPanel").style.display = tab === "orders" ? "block" : "none";
  document.getElementById("productsPanel").style.display = tab === "products" ? "block" : "none";
}

// ---------- ORDERS ----------

async function loadOrders() {
  const list = document.getElementById("ordersList");
  list.innerHTML = `<p>${t("loading")}</p>`;
  const { data, error } = await supabaseClient.from("orders").select("*").order("created_at", { ascending: false });
  if (error || !data || data.length === 0) {
    list.innerHTML = `<p>${t("admin_no_orders")}</p>`;
    return;
  }
  list.innerHTML = data.map(orderRowHTML).join("");
  list.querySelectorAll(".order-row-head").forEach((head) => {
    head.addEventListener("click", () => head.closest(".order-row").classList.toggle("open"));
  });
}

function orderRowHTML(o) {
  const date = new Date(o.created_at).toLocaleString(getLang() === "en" ? "en-GB" : "fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  const items = Array.isArray(o.items) ? o.items : [];
  return `
  <div class="order-row">
    <div class="order-row-head">
      <div>
        <div class="oname">${escapeHTML(o.customer_name)} — ${escapeHTML(o.city)}</div>
        <div class="odate">${date}</div>
      </div>
      <div>${fmtPrice(Number(o.total) || 0)}</div>
    </div>
    <div class="order-row-body">
      <div class="order-detail-line"><span>${t("checkout_phone")}</span><span>${escapeHTML(o.phone)}</span></div>
      <div class="order-detail-line"><span>${t("checkout_address")}</span><span>${escapeHTML(o.address)}</span></div>
      ${o.note ? `<div class="order-detail-line"><span>${t("checkout_note")}</span><span>${escapeHTML(o.note)}</span></div>` : ""}
      <div class="order-items-list">
        <strong>${t("admin_order_items")}:</strong>
        ${items.map((it) => `<div>${escapeHTML(it.qty)} × ${escapeHTML(it.name)} ${it.size || it.color ? `(${escapeHTML([it.size, it.color].filter(Boolean).join(" / "))})` : ""} — ${fmtPrice(Number(it.price) * Number(it.qty) || 0)}</div>`).join("")}
      </div>
      <div class="order-detail-line"><span>${t("cart_delivery")}</span><span>${fmtPrice(Number(o.delivery_fee) || 0)}</span></div>
      <div class="order-detail-line" style="font-weight:600"><span>${t("cart_total")}</span><span>${fmtPrice(Number(o.total) || 0)}</span></div>
    </div>
  </div>`;
}

// ---------- PRODUCTS ----------

async function loadProductsAdmin() {
  const grid = document.getElementById("adminProductGrid");
  grid.innerHTML = `<p>${t("loading")}</p>`;
  const { data, error } = await supabaseClient.from("products").select("*").order("created_at", { ascending: false });
  if (error || !data) {
    grid.innerHTML = "";
    return;
  }
  grid.innerHTML = data.map(adminProductCardHTML).join("");
  grid.querySelectorAll("[data-edit]").forEach((btn) =>
    btn.addEventListener("click", () => openProductModal(data.find((p) => p.id === btn.getAttribute("data-edit"))))
  );
  grid.querySelectorAll("[data-delete]").forEach((btn) =>
    btn.addEventListener("click", () => deleteProduct(btn.getAttribute("data-delete")))
  );
}

function adminProductCardHTML(p) {
  const img = (p.images && p.images[0]) || placeholderImg();
  const name = getLang() === "en" ? p.name_en || p.name_fr : p.name_fr;
  return `
  <div class="admin-product-card">
    <img src="${escapeHTML(img)}" alt="" />
    <div class="admin-product-card-body">
      <div class="apname">${escapeHTML(name)}</div>
      <div class="apprice">${fmtPrice(p.price)}${p.sale_price ? ` → ${fmtPrice(p.sale_price)}` : ""} · ${escapeHTML(p.category) || "—"}</div>
      <div class="admin-product-actions">
        <button data-edit="${p.id}">${t("admin_edit_product")}</button>
        <button data-delete="${p.id}">${t("admin_delete_product")}</button>
      </div>
    </div>
  </div>`;
}

async function deleteProduct(id) {
  if (!confirm(t("admin_delete_confirm"))) return;
  await supabaseClient.from("products").delete().eq("id", id);
  loadProductsAdmin();
}

function openProductModal(product) {
  EDITING_PRODUCT = product || null;
  PENDING_IMAGES = product ? (product.images || []).map((url) => ({ url })) : [];
  const form = document.getElementById("productForm");
  form.reset();
  document.getElementById("modalTitle").textContent = product ? t("admin_edit_product") : t("admin_add_product");

  if (product) {
    form.name_fr.value = product.name_fr || "";
    form.name_en.value = product.name_en || "";
    form.description_fr.value = product.description_fr || "";
    form.description_en.value = product.description_en || "";
    form.category.value = product.category || "";
    form.price.value = product.price || "";
    form.sale_price.value = product.sale_price || "";
    form.sizes.value = (product.sizes || []).join(", ");
    form.colors.value = (product.colors || []).join(", ");
  }
  renderImagePreview();
  document.getElementById("productModal").classList.add("open");
}

function closeProductModal() {
  document.getElementById("productModal").classList.remove("open");
  EDITING_PRODUCT = null;
  PENDING_IMAGES = [];
}

function renderImagePreview() {
  const box = document.getElementById("uploadPreview");
  box.innerHTML = PENDING_IMAGES.map((img, i) => {
    const src = img.url || img.previewUrl;
    return `<div class="rm"><img src="${escapeHTML(src)}" /><button type="button" data-rm="${i}">&times;</button></div>`;
  }).join("");
  box.querySelectorAll("[data-rm]").forEach((btn) => {
    btn.addEventListener("click", () => {
      PENDING_IMAGES.splice(parseInt(btn.getAttribute("data-rm")), 1);
      renderImagePreview();
    });
  });
}

async function handleImageSelect(e) {
  const files = Array.from(e.target.files || []);
  files.forEach((file) => {
    PENDING_IMAGES.push({ file, previewUrl: URL.createObjectURL(file) });
  });
  renderImagePreview();
  e.target.value = "";
}

async function uploadPendingImages() {
  const finalUrls = [];
  for (const img of PENDING_IMAGES) {
    if (img.url) {
      finalUrls.push(img.url);
      continue;
    }
    const ext = img.file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabaseClient.storage.from("product-images").upload(path, img.file);
    if (error) {
      console.error(error);
      continue;
    }
    const { data } = supabaseClient.storage.from("product-images").getPublicUrl(path);
    finalUrls.push(data.publicUrl);
  }
  return finalUrls;
}

async function handleProductSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const saveBtn = document.getElementById("productSaveBtn");
  saveBtn.disabled = true;
  saveBtn.textContent = t("admin_uploading");

  const images = await uploadPendingImages();

  const payload = {
    name_fr: form.name_fr.value.trim(),
    name_en: form.name_en.value.trim(),
    description_fr: form.description_fr.value.trim(),
    description_en: form.description_en.value.trim(),
    category: form.category.value.trim(),
    price: parseFloat(form.price.value) || 0,
    sale_price: form.sale_price.value ? parseFloat(form.sale_price.value) : null,
    sizes: form.sizes.value.split(",").map((s) => s.trim()).filter(Boolean),
    colors: form.colors.value.split(",").map((s) => s.trim()).filter(Boolean),
    images,
  };

  if (EDITING_PRODUCT) {
    await supabaseClient.from("products").update(payload).eq("id", EDITING_PRODUCT.id);
  } else {
    await supabaseClient.from("products").insert(payload);
  }

  saveBtn.disabled = false;
  saveBtn.textContent = t("admin_save");
  closeProductModal();
  loadProductsAdmin();
}

// ---------- SETTINGS ----------

async function loadSettingsIntoForm() {
  const { data } = await supabaseClient.from("settings").select("*");
  if (!data) return;
  const fee = data.find((s) => s.key === "delivery_fee");
  if (fee) document.getElementById("deliveryFeeDisplay").value = fee.value;
}

async function updateSetting(key, value) {
  await supabaseClient.from("settings").update({ value: String(value) }).eq("key", key);
}

// ---------- INIT ----------

document.addEventListener("DOMContentLoaded", () => {
  checkAuth();

  document.getElementById("authForm").addEventListener("submit", handleAuthSubmit);
  document.getElementById("logoutBtn").addEventListener("click", logout);

  document.querySelectorAll(".admin-tab").forEach((btn) =>
    btn.addEventListener("click", () => switchTab(btn.getAttribute("data-tab")))
  );

  document.getElementById("addProductBtn").addEventListener("click", () => openProductModal(null));
  document.getElementById("productModalClose").addEventListener("click", closeProductModal);
  document.getElementById("productForm").addEventListener("submit", handleProductSubmit);
  document.getElementById("imageInput").addEventListener("change", handleImageSelect);

  document.getElementById("saveFeeBtn").addEventListener("click", () => {
    updateSetting("delivery_fee", parseFloat(document.getElementById("deliveryFeeDisplay").value) || 0);
  });
});

const _prevLangChangeAdmin = window.onLangChange || function () {};
window.onLangChange = function () {
  _prevLangChangeAdmin();
  if (document.getElementById("adminShell").style.display !== "none") {
    loadOrders();
    loadProductsAdmin();
  }
};