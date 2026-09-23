// =========================================================
// Wishlist — stored in localStorage, shared across all storefront pages.
// Each line item: { id, name_fr, name_en, price, image }
// Mirrors cart.js's structure/conventions.
// =========================================================

const WISHLIST_KEY = "bero_wishlist";

function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
  } catch {
    return [];
  }
}

function saveWishlist(list) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
  updateWishlistBadge();
  refreshWishlistHearts();
}

function isInWishlist(id) {
  return getWishlist().some((l) => l.id === id);
}

function addToWishlist(item) {
  const list = getWishlist();
  if (list.some((l) => l.id === item.id)) return;
  list.push(item);
  saveWishlist(list);
  renderWishlistDrawer();
}

function removeFromWishlist(id) {
  const list = getWishlist().filter((l) => l.id !== id);
  saveWishlist(list);
  renderWishlistDrawer();
}

function toggleWishlist(item) {
  if (isInWishlist(item.id)) {
    removeFromWishlist(item.id);
  } else {
    addToWishlist(item);
  }
}

function wishlistCount() {
  return getWishlist().length;
}

function updateWishlistBadge() {
  document.querySelectorAll(".wishlist-count").forEach((el) => {
    const count = wishlistCount();
    el.textContent = count;
    el.style.display = count > 0 ? "flex" : "none";
  });
}

// Keeps every heart button on the page (product cards + PDP) in sync
// with the current wishlist contents. Heart buttons carry data-wishlist-id.
function refreshWishlistHearts() {
  document.querySelectorAll("[data-wishlist-id]").forEach((btn) => {
    btn.classList.toggle("active", isInWishlist(btn.getAttribute("data-wishlist-id")));
  });
}

function wishlistDisplayName(item) {
  return getLang() === "en" ? item.name_en || item.name_fr : item.name_fr;
}

function renderWishlistDrawer() {
  const body = document.getElementById("wishlistDrawerBody");
  if (!body) return;
  const list = getWishlist();

  if (list.length === 0) {
    body.innerHTML = `<div class="cart-empty">
        <p>${t("wishlist_empty")}</p>
        <a href="index.html" class="btn btn-outline">${t("cart_continue")}</a>
      </div>`;
    return;
  }

  body.innerHTML = list
    .map((item) => {
      return `
      <div class="cart-line">
        <img src="${item.image || placeholderImg()}" alt="" class="cart-line-img" />
        <div class="cart-line-info">
          <div class="cart-line-name">${wishlistDisplayName(item)}</div>
          <div class="cart-line-row">
            <span class="cart-line-price">${fmtPrice(item.price)}</span>
          </div>
          <button class="cart-line-remove" onclick="removeFromWishlist('${item.id}')">${t("remove_from_wishlist")}</button>
        </div>
      </div>`;
    })
    .join("");
}

function openWishlist() {
  renderWishlistDrawer();
  document.getElementById("wishlistDrawer")?.classList.add("open");
  document.getElementById("wishlistOverlay")?.classList.add("open");
}

function closeWishlist() {
  document.getElementById("wishlistDrawer")?.classList.remove("open");
  document.getElementById("wishlistOverlay")?.classList.remove("open");
}

document.addEventListener("DOMContentLoaded", () => {
  updateWishlistBadge();
  refreshWishlistHearts();
  document.getElementById("wishlistToggle")?.addEventListener("click", openWishlist);
  document.getElementById("wishlistClose")?.addEventListener("click", closeWishlist);
  document.getElementById("wishlistOverlay")?.addEventListener("click", closeWishlist);
});

const _prevLangChangeWishlist = window.onLangChange || function () {};
window.onLangChange = function () {
  _prevLangChangeWishlist();
  renderWishlistDrawer();
};