const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

menuToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.nav a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

document.querySelectorAll('.step').forEach((button) => {
  button.addEventListener('click', () => {
    const item = button.closest('li');
    const wasOpen = item.classList.contains('is-open');

    document.querySelectorAll('.steps li').forEach((step) => step.classList.remove('is-open'));
    if (!wasOpen) item.classList.add('is-open');
  });
});

// Keep the first guide item open on initial load.
document.querySelector('.steps li').classList.add('is-open');

document.querySelector('.back-top').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const cartPanel = document.querySelector('.cart-panel');
const cartOverlay = document.querySelector('.cart-overlay');
const cartToggle = document.querySelector('.cart-toggle');
const cartClose = document.querySelector('.cart-close');
const cartItemsContainer = document.querySelector('.cart-items');
const cartCount = document.querySelector('.cart-count');
const cartTotal = document.querySelector('.cart-total strong');
const checkoutButton = document.querySelector('.checkout-button');

let cart = JSON.parse(localStorage.getItem('roam-cart') || '[]');

const saveCart = () => localStorage.setItem('roam-cart', JSON.stringify(cart));

const setCartOpen = (isOpen) => {
  cartPanel.classList.toggle('is-open', isOpen);
  cartOverlay.classList.toggle('is-open', isOpen);
  cartPanel.setAttribute('aria-hidden', String(!isOpen));
  cartOverlay.setAttribute('aria-hidden', String(!isOpen));
  cartToggle.setAttribute('aria-expanded', String(isOpen));
  if (isOpen) cartClose.focus();
};

const renderCart = () => {
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartCount.textContent = itemCount;
  cartTotal.textContent = `NT$ ${total.toLocaleString()}`;
  checkoutButton.disabled = cart.length === 0;

  if (!cart.length) {
    cartItemsContainer.innerHTML = '<p class="cart-empty">購物車是空的</p>';
    return;
  }

  cartItemsContainer.innerHTML = cart.map((item) => `
    <div class="cart-item" data-id="${item.id}">
      <strong>${item.name}</strong>
      <span class="cart-item-price">NT$ ${item.price.toLocaleString()}</span>
      <div class="cart-item-controls">
        <button type="button" data-action="decrease" aria-label="減少 ${item.name} 數量">−</button>
        <span>${item.quantity}</span>
        <button type="button" data-action="increase" aria-label="增加 ${item.name} 數量">+</button>
        <button type="button" data-action="remove" aria-label="移除 ${item.name}">移除</button>
      </div>
    </div>
  `).join('');
};

document.querySelectorAll('.add-to-cart').forEach((button) => {
  button.addEventListener('click', () => {
    const { id, name } = button.dataset;
    const price = Number(button.dataset.price);
    const existingItem = cart.find((item) => item.id === id);

    if (existingItem) existingItem.quantity += 1;
    else cart.push({ id, name, price, quantity: 1 });

    saveCart();
    renderCart();
    button.classList.remove('is-added');
    cartCount.classList.remove('is-bouncing');
    void button.offsetWidth;
    void cartCount.offsetWidth;
    button.classList.add('is-added');
    cartCount.classList.add('is-bouncing');
    button.textContent = '已加入';
    window.setTimeout(() => {
      button.textContent = '加入購物車';
      button.classList.remove('is-added');
      cartCount.classList.remove('is-bouncing');
    }, 900);
  });
});

cartItemsContainer.addEventListener('click', (event) => {
  const control = event.target.closest('button[data-action]');
  if (!control) return;

  const cartItem = control.closest('.cart-item');
  const item = cart.find((entry) => entry.id === cartItem.dataset.id);
  if (!item) return;

  if (control.dataset.action === 'increase') item.quantity += 1;
  if (control.dataset.action === 'decrease') item.quantity -= 1;
  if (control.dataset.action === 'remove' || item.quantity <= 0) {
    cart = cart.filter((entry) => entry.id !== item.id);
  }

  saveCart();
  renderCart();
});

cartToggle.addEventListener('click', () => setCartOpen(true));
cartClose.addEventListener('click', () => setCartOpen(false));
cartOverlay.addEventListener('click', () => setCartOpen(false));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setCartOpen(false);
});
checkoutButton.addEventListener('click', () => {
  alert('結帳功能準備中，購物車內容已保留。');
});
renderCart();

const revealTargets = document.querySelectorAll('.manifesto, .gallery-card, .guide-image, .guide-content');
revealTargets.forEach((target) => target.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealTargets.forEach((target) => observer.observe(target));
