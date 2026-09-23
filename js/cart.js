// =========================================================
// Cart — stored in localStorage, shared across all storefront pages.
// Each line item: { id, name_fr, name_en, price, size, color, qty, image }
// =========================================================

const CART_KEY = "bero_cart";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function lineKey(item) {
  return [item.id, item.size, item.color].join("::");
}

function addToCart(item) {
  const cart = getCart();
  const key = lineKey(item);
  const existing = cart.find((l) => lineKey(l) === key);
  if (existing) {
    existing.qty += item.qty;
  } else {
    cart.push(item);
  }
  saveCart(cart);
  renderCartDrawer();
  openCart();
}

function removeFromCart(key) {
  const cart = getCart().filter((l) => lineKey(l) !== key);
  saveCart(cart);
  renderCartDrawer();
}

function updateCartQty(key, qty) {
  const cart = getCart();
  const line = cart.find((l) => lineKey(l) === key);
  if (line) {
    line.qty = Math.max(1, qty);
    saveCart(cart);
    renderCartDrawer();
  }
}

function cartSubtotal() {
  return getCart().reduce((sum, l) => sum + l.price * l.qty, 0);
}

function cartCount() {
  return getCart().reduce((sum, l) => sum + l.qty, 0);
}

function fmtPrice(n) {
  return n.toFixed(2) + " DT";
}

function updateCartBadge() {
  document.querySelectorAll(".cart-count").forEach((el) => {
    const count = cartCount();
    el.textContent = count;
    el.style.display = count > 0 ? "flex" : "none";
  });
}

function productDisplayName(item) {
  return getLang() === "en" ? item.name_en || item.name_fr : item.name_fr;
}

function renderCartDrawer() {
  const body = document.getElementById("cartDrawerBody");
  const footer = document.getElementById("cartDrawerFooter");
  if (!body) return;
  const cart = getCart();

  if (cart.length === 0) {
    body.innerHTML = `<div class="cart-empty">
        <p>${t("cart_empty")}</p>
        <a href="index.html" class="btn btn-outline">${t("cart_continue")}</a>
      </div>`;
    if (footer) footer.style.display = "none";
    return;
  }

  body.innerHTML = cart
    .map((item) => {
      const key = lineKey(item);
      return `
      <div class="cart-line">
        <img src="${item.image || placeholderImg()}" alt="" class="cart-line-img" />
        <div class="cart-line-info">
          <div class="cart-line-name">${productDisplayName(item)}</div>
          <div class="cart-line-meta">${[item.size, item.color].filter(Boolean).join(" / ")}</div>
          <div class="cart-line-row">
            <input type="number" min="1" value="${item.qty}" class="qty-input"
              onchange="updateCartQty('${key}', parseInt(this.value)||1)" />
            <span class="cart-line-price">${fmtPrice(item.price * item.qty)}</span>
          </div>
          <button class="cart-line-remove" onclick="removeFromCart('${key}')">${t("cart_remove")}</button>
        </div>
      </div>`;
    })
    .join("");

  if (footer) {
    footer.style.display = "block";
    document.getElementById("cartSubtotal").textContent = fmtPrice(cartSubtotal());
  }
}

function placeholderImg() {
  return "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='260'><rect width='100%25' height='100%25' fill='%23EEE3D3'/></svg>";
}

function openCart() {
  document.getElementById("cartDrawer")?.classList.add("open");
  document.getElementById("cartOverlay")?.classList.add("open");
}

function closeCart() {
  document.getElementById("cartDrawer")?.classList.remove("open");
  document.getElementById("cartOverlay")?.classList.remove("open");
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  renderCartDrawer();
  document.getElementById("cartToggle")?.addEventListener("click", () => {
    renderCartDrawer();
    openCart();
  });
  document.getElementById("cartClose")?.addEventListener("click", closeCart);
  document.getElementById("cartOverlay")?.addEventListener("click", closeCart);
});

window.onLangChange = window.onLangChange || function () {};
const _prevLangChange = window.onLangChange;
window.onLangChange = function () {
  _prevLangChange();
  renderCartDrawer();
};
