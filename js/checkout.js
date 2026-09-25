// =========================================================
// Checkout — validates the form, saves the order to Supabase.
// Item names are always stored in French, regardless of the
// language the customer was browsing in.
// =========================================================

let DELIVERY_FEE = 0;

async function loadDeliveryFee() {
  const { data } = await supabaseClient.from("settings").select("value").eq("key", "delivery_fee").single();
  DELIVERY_FEE = data ? parseFloat(data.value) || 0 : 0;
  renderSummary();
}

function renderSummary() {
  const cart = getCart();
  const box = document.getElementById("orderSummary");
  if (!box) return;

  if (cart.length === 0) {
    box.innerHTML = `<p>${t("cart_empty")}</p>`;
    document.getElementById("checkoutForm").style.display = "none";
    return;
  }

  const subtotal = cartSubtotal();
  const total = subtotal + DELIVERY_FEE;

  box.innerHTML =
    cart
      .map(
        (l) => `<div class="order-summary-line">
        <span>${escapeHTML(productDisplayName(l))} ${l.size || l.color ? `(${escapeHTML([l.size, l.color].filter(Boolean).join(" / "))})` : ""} × ${Number(l.qty) || 1}</span>
        <span>${fmtPrice(l.price * l.qty)}</span>
      </div>`
      )
      .join("") +
    `<div class="order-summary-line">
      <span>${t("cart_subtotal")}</span><span>${fmtPrice(subtotal)}</span>
    </div>
    <div class="order-summary-line">
      <span>${t("cart_delivery")}</span><span>${fmtPrice(DELIVERY_FEE)}</span>
    </div>
    <div class="order-summary-line total">
      <span>${t("cart_total")}</span><span>${fmtPrice(total)}</span>
    </div>`;
}

function validateField(input) {
  const group = input.closest(".form-group");
  if (!group) return true;
  const errorEl = group.querySelector(".field-error");
  const valid = input.value.trim().length > 0;
  group.classList.toggle("invalid", !valid);
  if (errorEl) errorEl.classList.toggle("show", !valid);
  return valid;
}

async function submitOrder(e) {
  e.preventDefault();
  const form = e.target;
  const fields = ["name", "phone", "address", "city"];
  let allValid = true;
  fields.forEach((f) => {
    const input = form.querySelector(`[name=${f}]`);
    if (!validateField(input)) allValid = false;
  });
  if (!allValid) return;

  const cart = getCart();
  if (cart.length === 0) return;

  // hidden trap field: real people never fill it, bots do. Pretend success and drop the order.
  if (form.website && form.website.value) {
    localStorage.removeItem(CART_KEY);
    updateCartBadge();
    document.getElementById("checkoutPage").style.display = "none";
    document.getElementById("successPage").style.display = "block";
    return;
  }

  const submitBtn = form.querySelector("button[type=submit]");
  submitBtn.disabled = true;
  submitBtn.textContent = t("loading");

  const subtotal = cartSubtotal();
  const total = subtotal + DELIVERY_FEE;

  // items are always saved in French, regardless of the site's current language
  // (the database re-checks every price, so only the product id, options and quantity matter here)
  const itemsFr = cart.map((l) => ({
    id: l.id,
    name: l.name_fr,
    size: l.size,
    color: l.color,
    qty: l.qty,
    price: l.price,
  }));

  const order = {
    customer_name: form.name.value.trim(),
    phone: form.phone.value.trim(),
    address: form.address.value.trim(),
    city: form.city.value.trim(),
    note: form.note.value.trim(),
    items: itemsFr,
    delivery_fee: DELIVERY_FEE,
    total: total,
    language: getLang(),
  };

  const { error } = await supabaseClient.from("orders").insert(order);

  if (error) {
    console.error(error);
    alert(String(error.message).includes("rate_limited") ? t("order_rate_limited") : t("admin_error_generic"));
    submitBtn.disabled = false;
    submitBtn.textContent = t("checkout_submit");
    return;
  }

  localStorage.removeItem(CART_KEY);
  updateCartBadge();
  document.getElementById("checkoutPage").style.display = "none";
  document.getElementById("successPage").style.display = "block";
}

document.addEventListener("DOMContentLoaded", () => {
  loadDeliveryFee();
  document.getElementById("checkoutForm")?.addEventListener("submit", submitOrder);
  document.querySelectorAll("#checkoutForm input, #checkoutForm textarea").forEach((input) => {
    input.addEventListener("blur", () => validateField(input));
  });
});

const _prevLangChangeCheckout = window.onLangChange || function () {};
window.onLangChange = function () {
  _prevLangChangeCheckout();
  renderSummary();
};