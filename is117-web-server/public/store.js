// Keep this classroom bag on this browser only; no payment or order is sent.
const bagDialog = document.querySelector('#bag-dialog');
const fitDialog = document.querySelector('#fit-dialog');
let bag = [];
try {
  const saved = JSON.parse(localStorage.getItem('roam-bag') || '[]');
  if (Array.isArray(saved)) bag = saved.filter(item => ['XS', 'S', 'M', 'L', 'XL', 'XXL'].includes(item.size) && Number.isInteger(item.quantity) && item.quantity > 0);
} catch { /* The store still works when browser storage is unavailable. */ }

function renderBag() {
  const items = document.querySelector('#bag-items');
  items.replaceChildren();
  if (!bag.length) {
    const empty = document.createElement('p');
    empty.className = 'empty-bag';
    empty.textContent = 'Your next step starts here. Choose your everyday tee.';
    items.append(empty);
  }
  bag.forEach((item, index) => {
    const row = document.createElement('div');
    row.className = 'bag-item';
    const description = document.createElement('div');
    const title = document.createElement('strong');
    title.textContent = 'The Everyday Tee';
    const detail = document.createElement('small');
    detail.textContent = `Chalk white / ${item.size} / Qty ${item.quantity}`;
    const remove = document.createElement('button');
    remove.className = 'remove-item';
    remove.textContent = 'Remove';
    remove.setAttribute('aria-label', `Remove size ${item.size} tee`);
    remove.addEventListener('click', () => { bag.splice(index, 1); renderBag(); });
    description.append(title, detail, remove);
    const price = document.createElement('span');
    price.textContent = `$${28 * item.quantity}`;
    row.append(description, price);
    items.append(row);
  });
  const count = bag.reduce((total, item) => total + item.quantity, 0);
  document.querySelector('#bag-count').textContent = count;
  document.querySelector('#bag-total').textContent = `$${count * 28}`;
  try { localStorage.setItem('roam-bag', JSON.stringify(bag)); } catch { /* Optional persistence. */ }
}

// A relevant, voluntary first step: choose a size before adding a tee.
document.querySelector('#add-to-bag').addEventListener('click', () => {
  const selected = document.querySelector('input[name="size"]:checked');
  const status = document.querySelector('#product-status');
  if (!selected) {
    status.textContent = 'Choose a size first — the fit guide can help.';
    document.querySelector('input[name="size"]').focus();
    return;
  }
  const existing = bag.find(item => item.size === selected.value);
  if (existing) existing.quantity += 1;
  else bag.push({ size: selected.value, quantity: 1 });
  renderBag();
  status.textContent = `Size ${selected.value} added to your bag.`;
  bagDialog.showModal();
});
document.querySelector('#open-bag').addEventListener('click', () => bagDialog.showModal());
document.querySelector('#open-fit').addEventListener('click', () => fitDialog.showModal());
document.querySelector('#keep-going').addEventListener('click', () => bagDialog.close());
document.querySelectorAll('.close-dialog').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('click', event => {
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
}));
document.querySelector('#year').textContent = new Date().getFullYear();
renderBag();
