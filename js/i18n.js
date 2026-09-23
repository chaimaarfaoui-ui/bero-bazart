// =========================================================
// Bilingual UI text — every button, label, and message on the site.
// Product names/descriptions live in the database (name_fr/name_en etc.),
// this file is only for site chrome: nav, buttons, checkout, messages.
// =========================================================

const TRANSLATIONS = {
  fr: {
    brand_tagline: "Mode & Élégance",
    nav_shop: "Boutique",
    nav_all: "Tout",
    nav_about: "À propos",
    nav_contact: "Contact",
    nav_cart: "Panier",
    nav_admin: "Espace équipe",
    hero_cta: "Découvrir la collection",
    section_new: "Nouveautés",
    section_shop_by_category: "Par catégorie",
    view_all: "Voir tout",
    add_to_cart: "Ajouter au panier",
    added: "Ajouté !",
    choose_options: "Choisir les options",
    sold_out: "Épuisé",
    size: "Taille",
    color: "Couleur",
    quantity: "Quantité",
    price: "Prix",
    description: "Description",
    related_products: "Vous aimerez aussi",
    cart_title: "Votre panier",
    cart_empty: "Votre panier est vide.",
    cart_continue: "Continuer mes achats",
    cart_subtotal: "Sous-total",
    cart_delivery: "Livraison",
    cart_total: "Total",
    cart_checkout: "Passer la commande",
    cart_remove: "Retirer",
    checkout_title: "Finaliser la commande",
    checkout_name: "Nom complet",
    checkout_phone: "Téléphone",
    checkout_address: "Adresse",
    checkout_city: "Ville",
    checkout_note: "Note (optionnel)",
    checkout_note_placeholder: "Instructions de livraison, préférences…",
    checkout_submit: "Confirmer la commande",
    checkout_success_title: "Merci pour votre commande !",
    checkout_success_body: "Nous vous contacterons bientôt pour confirmer la livraison.",
    checkout_back_home: "Retour à la boutique",
    checkout_required: "Ce champ est obligatoire.",
    checkout_order_summary: "Récapitulatif",
    footer_newsletter_title: "Restez informée",
    footer_newsletter_body: "Nouveautés, promotions et inspirations directement dans votre boîte mail.",
    footer_newsletter_placeholder: "Votre e-mail",
    footer_newsletter_btn: "S'inscrire",
    footer_rights: "Tous droits réservés.",
    footer_shop: "Boutique",
    footer_help: "Aide",
    footer_follow: "Suivez-nous",
    empty_catalog_title: "Aucun produit pour le moment",
    empty_catalog_body: "La boutique ouvre bientôt — revenez vite !",
    loading: "Chargement…",
    trust_delivery: "Livraison rapide et soignée",
    trust_returns: "Retours faciles",
    trust_service: "Service client attentif",
    wishlist_title: "Ma liste d'envies",
    wishlist_empty: "Votre liste d'envies est vide.",
    add_to_wishlist: "Ajouter à ma liste",
    remove_from_wishlist: "Retirer de ma liste",
    search_placeholder: "Rechercher…",
    // admin
    admin_login_title: "Connexion",
    admin_signup_title: "Créer un compte",
    admin_email: "E-mail",
    admin_password: "Mot de passe",
    admin_invite_code: "Code d'invitation",
    admin_login_btn: "Se connecter",
    admin_signup_btn: "Créer le compte",
    admin_switch_to_signup: "Nouveau membre de l'équipe ? Créer un compte",
    admin_switch_to_login: "Déjà un compte ? Se connecter",
    admin_logout: "Se déconnecter",
    admin_orders_tab: "Commandes",
    admin_products_tab: "Produits",
    admin_no_orders: "Aucune commande pour le moment.",
    admin_order_items: "Articles",
    admin_add_product: "Ajouter un produit",
    admin_edit_product: "Modifier",
    admin_delete_product: "Supprimer",
    admin_delete_confirm: "Supprimer ce produit ?",
    admin_save: "Enregistrer",
    admin_cancel: "Annuler",
    admin_name_fr: "Nom (Français)",
    admin_name_en: "Nom (Anglais)",
    admin_desc_fr: "Description (Français)",
    admin_desc_en: "Description (Anglais)",
    admin_category: "Catégorie",
    admin_sizes: "Tailles (séparées par une virgule)",
    admin_colors: "Couleurs (séparées par une virgule)",
    admin_images: "Photos",
    admin_upload_images: "Téléverser des photos",
    admin_uploading: "Envoi en cours…",
    admin_invite_settings: "Code d'invitation actuel",
    admin_delivery_settings: "Frais de livraison",
    admin_update: "Mettre à jour",
    admin_invalid_code: "Code d'invitation invalide.",
    admin_error_generic: "Une erreur est survenue. Réessayez.",
  },
  en: {
    brand_tagline: "Fashion & Elegance",
    nav_shop: "Shop",
    nav_all: "All",
    nav_about: "About",
    nav_contact: "Contact",
    nav_cart: "Cart",
    nav_admin: "Staff",
    hero_cta: "Shop the collection",
    section_new: "New In",
    section_shop_by_category: "Shop by Category",
    view_all: "View all",
    add_to_cart: "Add to cart",
    added: "Added!",
    choose_options: "Choose options",
    sold_out: "Sold out",
    size: "Size",
    color: "Color",
    quantity: "Quantity",
    price: "Price",
    description: "Description",
    related_products: "You may also like",
    cart_title: "Your cart",
    cart_empty: "Your cart is empty.",
    cart_continue: "Continue shopping",
    cart_subtotal: "Subtotal",
    cart_delivery: "Delivery",
    cart_total: "Total",
    cart_checkout: "Checkout",
    cart_remove: "Remove",
    checkout_title: "Checkout",
    checkout_name: "Full name",
    checkout_phone: "Phone",
    checkout_address: "Address",
    checkout_city: "City",
    checkout_note: "Note (optional)",
    checkout_note_placeholder: "Delivery instructions, preferences…",
    checkout_submit: "Confirm order",
    checkout_success_title: "Thank you for your order!",
    checkout_success_body: "We'll reach out soon to confirm delivery.",
    checkout_back_home: "Back to shop",
    checkout_required: "This field is required.",
    checkout_order_summary: "Order summary",
    footer_newsletter_title: "Stay in the loop",
    footer_newsletter_body: "New arrivals, promotions and inspiration straight to your inbox.",
    footer_newsletter_placeholder: "Your email",
    footer_newsletter_btn: "Subscribe",
    footer_rights: "All rights reserved.",
    footer_shop: "Shop",
    footer_help: "Help",
    footer_follow: "Follow us",
    empty_catalog_title: "No products yet",
    empty_catalog_body: "The shop is opening soon — check back!",
    loading: "Loading…",
    trust_delivery: "Fast, careful delivery",
    trust_returns: "Easy returns",
    trust_service: "Attentive customer service",
    wishlist_title: "My wishlist",
    wishlist_empty: "Your wishlist is empty.",
    add_to_wishlist: "Add to wishlist",
    remove_from_wishlist: "Remove from wishlist",
    search_placeholder: "Search…",
    // admin
    admin_login_title: "Log in",
    admin_signup_title: "Create account",
    admin_email: "Email",
    admin_password: "Password",
    admin_invite_code: "Invite code",
    admin_login_btn: "Log in",
    admin_signup_btn: "Create account",
    admin_switch_to_signup: "New team member? Create an account",
    admin_switch_to_login: "Already have an account? Log in",
    admin_logout: "Log out",
    admin_orders_tab: "Orders",
    admin_products_tab: "Products",
    admin_no_orders: "No orders yet.",
    admin_order_items: "Items",
    admin_add_product: "Add product",
    admin_edit_product: "Edit",
    admin_delete_product: "Delete",
    admin_delete_confirm: "Delete this product?",
    admin_save: "Save",
    admin_cancel: "Cancel",
    admin_name_fr: "Name (French)",
    admin_name_en: "Name (English)",
    admin_desc_fr: "Description (French)",
    admin_desc_en: "Description (English)",
    admin_category: "Category",
    admin_sizes: "Sizes (comma-separated)",
    admin_colors: "Colors (comma-separated)",
    admin_images: "Photos",
    admin_upload_images: "Upload photos",
    admin_uploading: "Uploading…",
    admin_invite_settings: "Current invite code",
    admin_delivery_settings: "Delivery fee",
    admin_update: "Update",
    admin_invalid_code: "Invalid invite code.",
    admin_error_generic: "Something went wrong. Please try again.",
  },
};

function getLang() {
  return localStorage.getItem("bero_lang") || "fr";
}

function setLang(lang) {
  localStorage.setItem("bero_lang", lang);
  document.documentElement.lang = lang;
  applyTranslations();
}

function t(key) {
  const lang = getLang();
  return (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) || TRANSLATIONS.fr[key] || key;
}

// Applies translations to every element with data-i18n / data-i18n-placeholder
function applyTranslations() {
  const lang = getLang();
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.getAttribute("data-i18n"));
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder")));
  });
  document.querySelectorAll(".lang-toggle [data-lang]").forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
  });
  // re-render dynamic content if a page defines this hook
  if (typeof window.onLangChange === "function") window.onLangChange();
}

document.addEventListener("DOMContentLoaded", () => {
  applyTranslations();
  document.querySelectorAll(".lang-toggle [data-lang]").forEach((btn) => {
    btn.addEventListener("click", () => setLang(btn.getAttribute("data-lang")));
  });
});