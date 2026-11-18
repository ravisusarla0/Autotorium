/* Autotorium — JDM Customs & Build Management
   Single-page frontend for the Spring Boot API. No build step. */

const API = '/api';
const DRAFT_KEY = 'autotorium.draft.v1';
const ROUTES = ['vehicles', 'build', 'garage', 'tickets'];

const state = {
  vehicles: [],
  categories: [],
  garage: [],
  tickets: [],
  parts: [],
  partsVehicleId: null,
};

const draft = { vehicleId: null, categoryId: null, selection: {}, buildName: '' };

let garageSelectionId = null;
let customerName = '';
let removeArmed = false;
let removeTimer = null;
let partsRequestVehicleId = null;
let lastRoute = null;
let toastTimer = null;

/* ------------------------------ helpers ------------------------------ */

const money = (value) =>
  '$' + Number(value || 0).toLocaleString('en-US', { maximumFractionDigits: 0 });

const esc = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

/* Real photography per chassis. The dark studio placeholder sits underneath and
   shows through when the photo is missing or fails to load (see `is-broken`). */
const vehiclePhoto = (vehicle) => `
  <span class="art-fallback" aria-hidden="true">
    <span class="art-fallback-mark">A</span>
    <span class="art-fallback-name">${esc(vehicle.name)}</span>
  </span>
  ${vehicle.imageUrl
    ? `<img class="vehicle-photo" src="${esc(vehicle.imageUrl)}" alt="${esc(vehicle.name)}"
            loading="lazy" decoding="async" />`
    : ''}`;

function categoryName(categoryId) {
  return state.categories.find((c) => c.categoryId === categoryId)?.name ?? 'Part';
}

function wheelsCategoryId() {
  return state.categories.find((c) => c.name.toLowerCase() === 'wheels')?.categoryId ?? null;
}

function currentVehicle() {
  return state.vehicles.find((v) => v.vehicleId === draft.vehicleId) ?? null;
}

function currentGarageBuild() {
  return state.garage.find((b) => b.buildId === garageSelectionId) ?? state.garage[0] ?? null;
}

function selectedParts() {
  const ids = new Set(Object.values(draft.selection).flat());
  return state.parts.filter((p) => ids.has(p.partId));
}

function liveTotal() {
  const vehicle = currentVehicle();
  if (!vehicle) return 0;
  return vehicle.basePrice + selectedParts().reduce((sum, p) => sum + p.priceModifier, 0);
}

function formatDate(value) {
  if (!value) return '';
  const [date, time] = value.split(' ');
  const [year, month, day] = (date || '').split('-').map(Number);
  if (!year || !month || !day) return value;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[month - 1]} ${day} · ${time ?? ''}`;
}

function currentRoute() {
  const route = location.hash.replace(/^#\/?/, '').trim();
  return ROUTES.includes(route) ? route : 'vehicles';
}

async function api(path, options = {}) {
  const response = await fetch(API + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      message = body.message || body.error || message;
    } catch {
      /* keep the status message */
    }
    throw new Error(message);
  }
  return response.status === 204 ? null : response.json();
}

function toast(message) {
  const node = document.getElementById('toast');
  node.textContent = message;
  node.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { node.hidden = true; }, 2800);
}

function persistDraft() {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({
      vehicleId: draft.vehicleId,
      buildName: draft.buildName,
      selection: draft.selection,
    }));
  } catch {
    /* storage can be unavailable; the draft then lives for this page only */
  }
}

function restoreDraft() {
  try {
    const saved = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null');
    if (!saved || !saved.vehicleId) return;
    draft.vehicleId = saved.vehicleId;
    draft.buildName = saved.buildName || '';
    draft.selection = saved.selection || {};
  } catch {
    /* ignore unreadable drafts */
  }
}

/* ------------------------------- data -------------------------------- */

async function loadParts() {
  const vehicleId = draft.vehicleId;
  try {
    const parts = await api(`/vehicles/${vehicleId}/parts`);
    if (draft.vehicleId !== vehicleId) return;
    state.parts = parts;
    state.partsVehicleId = vehicleId;
    defaultWheels();
  } catch (error) {
    state.parts = [];
    state.partsVehicleId = vehicleId;
    toast(error.message);
  }
}

function ensurePartsLoaded() {
  if (partsRequestVehicleId === draft.vehicleId) return;
  partsRequestVehicleId = draft.vehicleId;
  loadParts().then(() => {
    partsRequestVehicleId = null;
    render();
  });
}

function defaultWheels() {
  const wheelCat = wheelsCategoryId();
  if (!wheelCat) return;
  if ((draft.selection[wheelCat] || []).length) return;
  const oem = state.parts.find((p) => p.categoryId === wheelCat && p.priceModifier === 0);
  if (oem) draft.selection[wheelCat] = [oem.partId];
}

/* ------------------------------ actions ------------------------------ */

async function chooseVehicle(vehicleId) {
  if (draft.vehicleId !== vehicleId) {
    draft.vehicleId = vehicleId;
    draft.selection = {};
    draft.buildName = '';
    state.parts = [];
    state.partsVehicleId = null;
  }
  persistDraft();
  if (currentRoute() !== 'build') location.hash = '#/build';
  await loadParts();
  persistDraft();
  render();
}

function togglePart(partId) {
  const part = state.parts.find((p) => p.partId === partId);
  if (!part) return;
  const categoryId = part.categoryId;
  const current = new Set(draft.selection[categoryId] || []);

  if (categoryId === wheelsCategoryId()) {
    current.clear();
    current.add(partId);
  } else if (current.has(partId)) {
    current.delete(partId);
  } else {
    current.add(partId);
  }

  if (current.size) {
    draft.selection[categoryId] = [...current];
  } else {
    delete draft.selection[categoryId];
  }
  persistDraft();
  render();
}

function removePart(partId) {
  for (const [categoryId, ids] of Object.entries(draft.selection)) {
    const next = ids.filter((id) => id !== partId);
    if (next.length) draft.selection[categoryId] = next;
    else delete draft.selection[categoryId];
  }
  persistDraft();
  render();
}

async function saveBuild() {
  if (!draft.vehicleId) return;
  const partIds = Object.values(draft.selection).flat();
  try {
    const build = await api('/garage', {
      method: 'POST',
      body: JSON.stringify({ buildName: draft.buildName, vehicleId: draft.vehicleId, partIds }),
    });
    state.garage = await api('/garage');
    garageSelectionId = build.buildId;
    draft.selection = {};
    draft.buildName = '';
    state.parts = [];
    state.partsVehicleId = null;
    persistDraft();
    location.hash = '#/garage';
    render();
    toast(`Saved “${build.buildName}” to the garage`);
  } catch (error) {
    toast(error.message);
  }
}

function armRemoveBuild() {
  removeArmed = true;
  clearTimeout(removeTimer);
  removeTimer = setTimeout(() => {
    removeArmed = false;
    render();
  }, 5000);
  render();
}

async function removeBuild() {
  const build = currentGarageBuild();
  if (!build) return;
  removeArmed = false;
  clearTimeout(removeTimer);
  try {
    await api(`/garage/${build.buildId}`, { method: 'DELETE' });
    state.garage = await api('/garage');
    garageSelectionId = null;
    render();
    toast('Build removed from the garage');
  } catch (error) {
    render();
    toast(error.message);
  }
}

async function checkoutBuild() {
  const build = currentGarageBuild();
  if (!build) return;
  try {
    const ticket = await api(`/garage/${build.buildId}/checkout`, {
      method: 'POST',
      body: JSON.stringify({ customerName }),
    });
    state.garage = await api('/garage');
    state.tickets = await api('/tickets');
    garageSelectionId = null;
    customerName = '';
    location.hash = '#/tickets';
    render();
    toast(`Ticket #${ticket.ticketId} submitted to the shop`);
  } catch (error) {
    toast(error.message);
  }
}

async function advanceTicket(ticketId) {
  const ticket = state.tickets.find((t) => t.ticketId === ticketId);
  if (!ticket) return;
  const next = ticket.status === 'PENDING' ? 'IN_PROGRESS' : 'COMPLETED';
  try {
    await api(`/tickets/${ticketId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: next }),
    });
    state.tickets = await api('/tickets');
    render();
    toast(next === 'IN_PROGRESS'
      ? `Ticket #${ticketId} moved into the bay`
      : `Ticket #${ticketId} is ready for pickup`);
  } catch (error) {
    toast(error.message);
  }
}

/* ------------------------------- views ------------------------------- */

function emptyState(title, copy, ctaLabel, route) {
  return `
    <div class="empty-state">
      <span class="empty-mark">A</span>
      <h2>${esc(title)}</h2>
      <p>${esc(copy)}</p>
      ${ctaLabel ? `<button type="button" class="btn btn-primary" data-goto="${route}">${esc(ctaLabel)}</button>` : ''}
    </div>`;
}

function loadingState(message) {
  return `
    <div class="empty-state">
      <span class="empty-mark">A</span>
      <h2>${esc(message)}</h2>
      <p>Fetching the verified fitment list for this chassis.</p>
    </div>`;
}

function vehiclesView() {
  const cards = state.vehicles.map((vehicle, index) => `
    <button type="button" class="vehicle-card${draft.vehicleId === vehicle.vehicleId ? ' is-selected' : ''}"
            data-vehicle="${vehicle.vehicleId}">
      <span class="vehicle-art palette-${index % 5}">
        ${vehiclePhoto(vehicle)}
        <span class="vehicle-price">${money(vehicle.basePrice)}</span>
      </span>
      <span class="vehicle-body">
        <span class="vehicle-name">${esc(vehicle.name)}</span>
        <span class="vehicle-meta">
          <span class="chip">${esc(vehicle.type)}</span>
          <span class="vehicle-cta">${draft.vehicleId === vehicle.vehicleId ? 'Selected ✓' : 'Start build →'}</span>
        </span>
      </span>
    </button>`).join('');

  return `
    <section class="page">
      <div class="page-head">
        <p class="eyebrow">Step 1 of 4 — Select chassis</p>
        <h1>Choose your vehicle</h1>
        <p class="lede">Twelve JDM legends, each with its own verified parts catalogue. Pick a chassis to open the configurator.</p>
      </div>
      <div class="vehicle-grid">${cards}</div>
    </section>`;
}

function buildView() {
  const vehicle = currentVehicle();
  if (!vehicle) {
    return `<section class="page">${emptyState(
      'No chassis selected',
      'Pick a vehicle first — the configurator only offers parts that are verified to fit it.',
      'Browse vehicles',
      'vehicles')}</section>`;
  }

  if (state.partsVehicleId !== vehicle.vehicleId) {
    ensurePartsLoaded();
    return `<section class="page">${loadingState('Loading compatible parts')}</section>`;
  }

  const activeCategory = state.categories.find((c) => c.categoryId === draft.categoryId)
    ?? state.categories[0];

  const sidebar = state.categories.map((category) => {
    const count = (draft.selection[category.categoryId] || []).length;
    return `
      <button type="button" class="cat-btn${category.categoryId === activeCategory?.categoryId ? ' is-active' : ''}"
              data-cat="${category.categoryId}">
        <span>${esc(category.name)}</span>
        <span class="cat-count">${count}</span>
      </button>`;
  }).join('');

  const selected = selectedParts();
  const partsSubtotal = selected.reduce((sum, p) => sum + p.priceModifier, 0);

  const summary = selected.length
    ? selected.map((part) => `
        <li class="summary-item">
          <span class="summary-left">
            <span class="summary-cat">${esc(categoryName(part.categoryId))}</span>
            <span class="summary-name">${esc(part.name)}</span>
          </span>
          <span class="summary-right">
            <span class="summary-price">${part.priceModifier === 0 ? 'Included' : '+' + money(part.priceModifier)}</span>
            <button type="button" class="icon-btn" data-remove-part="${part.partId}" aria-label="Remove ${esc(part.name)}">×</button>
          </span>
        </li>`).join('')
    : '<li class="summary-empty">No parts selected yet — this build is factory spec.</li>';

  const categoryParts = state.parts.filter((p) => p.categoryId === activeCategory?.categoryId);
  const selectedIds = new Set(draft.selection[activeCategory?.categoryId] || []);
  const isWheels = activeCategory?.categoryId === wheelsCategoryId();

  const partRows = categoryParts.map((part) => {
    const isSelected = selectedIds.has(part.partId);
    return `
      <li>
        <button type="button" class="part-row${isSelected ? ' is-selected' : ''}"
                data-part="${part.partId}" aria-pressed="${isSelected}">
          <span class="part-check${isWheels ? ' is-round' : ''}"></span>
          <span class="part-name">${esc(part.name)}</span>
          <span class="part-price">${part.priceModifier === 0 ? 'Included' : '+' + money(part.priceModifier)}</span>
        </button>
      </li>`;
  }).join('');

  const partsList = categoryParts.length
    ? `<ul class="part-list">${partRows}</ul>`
    : `<p class="parts-empty">No ${esc(activeCategory?.name ?? '')} options are verified for this chassis.</p>`;

  return `
    <section class="page">
      <div class="page-head">
        <p class="eyebrow">Step 2 of 4 — Customize</p>
        <h1>Build</h1>
        <p class="lede">Every part below is compatibility-checked against the ${esc(vehicle.name)}.</p>
      </div>

      <div class="build-layout">
        <aside class="build-sidebar">
          <p class="sidebar-label">Build</p>
          ${sidebar}
          <button type="button" class="link-btn" id="change-vehicle">← Change vehicle</button>
        </aside>

        <section class="card build-stage">
          <div class="stage-art">
            ${vehiclePhoto(vehicle)}
          </div>
          <div class="stage-body">
            <div class="stage-head">
              <div>
                <p class="eyebrow">Current chassis</p>
                <h2>${esc(vehicle.name)}</h2>
                <p class="muted">${esc(vehicle.type)} · Base ${money(vehicle.basePrice)}</p>
              </div>
              <span class="chip chip-blue">${selected.length} part${selected.length === 1 ? '' : 's'}</span>
            </div>

            <div class="summary">
              <h3>Selected parts</h3>
              <ul class="summary-list">${summary}</ul>
            </div>

            <div class="field">
              <label for="build-name">Build name</label>
              <input id="build-name" type="text" autocomplete="off" maxlength="100"
                     placeholder="e.g. Midnight R34 — Stage 2"
                     value="${esc(draft.buildName)}" />
            </div>

            <dl class="totals">
              <div class="totals-row"><dt>Base vehicle</dt><dd>${money(vehicle.basePrice)}</dd></div>
              <div class="totals-row"><dt>Parts &amp; labour</dt><dd>+${money(partsSubtotal)}</dd></div>
              <div class="totals-row is-grand"><dt>Build total</dt><dd>${money(vehicle.basePrice + partsSubtotal)}</dd></div>
            </dl>
          </div>
        </section>

        <aside class="build-parts">
          <div class="parts-head">
            <div>
              <p class="eyebrow">Compatible parts</p>
              <h3>${esc(activeCategory?.name ?? 'Parts')}</h3>
            </div>
            <span class="badge-compat">Fits ${esc(vehicle.name)}</span>
          </div>
          <p class="parts-hint">${isWheels
            ? 'Single-select — one wheel set per build.'
            : 'Multi-select — combine any parts that fit.'}</p>
          ${partsList}
          <div class="parts-footer">
            <div class="parts-subtotal">
              <span>Parts subtotal</span>
              <strong>${money(partsSubtotal)}</strong>
            </div>
            <button type="button" class="btn btn-primary btn-block" id="save-build">Save to Garage →</button>
          </div>
        </aside>
      </div>
    </section>`;
}

function garageView() {
  if (!state.garage.length) {
    return `<section class="page">
      <div class="page-head">
        <p class="eyebrow">Step 3 of 4 — Pre-checkout storage</p>
        <h1>Garage</h1>
      </div>
      ${emptyState(
        'Your garage is empty',
        'Save a configuration to hold it here, then check it out to the shop when the customer is ready.',
        'Build a vehicle',
        'vehicles')}
    </section>`;
  }

  const active = currentGarageBuild();
  garageSelectionId = active.buildId;

  const list = state.garage.map((build) => `
    <button type="button" class="garage-item${build.buildId === active.buildId ? ' is-active' : ''}"
            data-garage-build="${build.buildId}">
      <span class="garage-item-top">
        <span class="garage-name">${esc(build.buildName)}</span>
        <span class="garage-total">${money(build.totalPrice)}</span>
      </span>
      <span class="small">${esc(build.vehicle.name)} · ${build.parts.length} part${build.parts.length === 1 ? '' : 's'}</span>
    </button>`).join('');

  const rows = [
    `<tr>
       <td class="item-name">${esc(active.vehicle.name)}</td>
       <td><span class="cat">Base vehicle · ${esc(active.vehicle.type)}</span></td>
       <td class="right">${money(active.vehicle.basePrice)}</td>
     </tr>`,
    ...active.parts.map((part) => `
      <tr>
        <td class="item-name">${esc(part.name)}</td>
        <td><span class="cat">${esc(categoryName(part.categoryId))}</span></td>
        <td class="right">${part.priceModifier === 0 ? 'Included' : '+' + money(part.priceModifier)}</td>
      </tr>`),
  ].join('');

  const partsSubtotal = active.parts.reduce((sum, p) => sum + p.priceModifier, 0);

  return `
    <section class="page">
      <div class="page-head">
        <p class="eyebrow">Step 3 of 4 — Pre-checkout storage</p>
        <h1>Garage</h1>
        <p class="lede">${state.garage.length} build${state.garage.length === 1 ? '' : 's'} waiting for checkout.</p>
      </div>

      <div class="garage-layout">
        <aside class="garage-list">${list}</aside>

        <section class="card garage-detail">
          <div class="detail-head">
            <div>
              <p class="eyebrow">Build sheet</p>
              <h2>${esc(active.buildName)}</h2>
              <p class="muted">${esc(active.vehicle.name)} · ${esc(active.vehicle.type)}</p>
            </div>
            <span class="chip chip-blue">IN GARAGE</span>
          </div>

          <table class="line-items">
            <thead>
              <tr><th>Item</th><th>Category</th><th class="right">Price</th></tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>

          <div class="estimate">
            <div>
              <span class="muted small">Total estimate</span>
              <strong class="estimate-value">${money(active.totalPrice)}</strong>
              <span class="muted small">${money(active.vehicle.basePrice)} vehicle + ${money(partsSubtotal)} parts</span>
            </div>
            <div class="field">
              <label for="customer-name">Customer name</label>
              <input id="customer-name" type="text" autocomplete="off" maxlength="100"
                     placeholder="Walk-In Customer" value="${esc(customerName)}" />
            </div>
          </div>

          <div class="detail-actions">
            <button type="button" class="btn btn-danger" id="remove-build">${removeArmed ? 'Confirm remove' : 'Remove Car'}</button>
            <button type="button" class="btn btn-primary" id="checkout-build">Checkout &amp; Submit Ticket →</button>
          </div>
        </section>
      </div>
    </section>`;
}

function ticketsView() {
  const columns = [
    { status: 'PENDING', number: '1', title: 'Queued', sub: 'Pending', empty: 'No cars waiting in line.' },
    { status: 'IN_PROGRESS', number: '2', title: 'In the Bay', sub: 'Building', empty: 'Nothing on the lift right now.' },
    { status: 'COMPLETED', number: '3', title: 'Ready for Pickup', sub: 'Completed', empty: 'No finished builds.' },
  ];

  const board = columns.map((column) => {
    const tickets = state.tickets.filter((t) => t.status === column.status);
    const cards = tickets.map((ticket) => {
      const build = ticket.build;
      const parts = build.parts.length
        ? build.parts.map((part) => `
            <li>${esc(part.name)}<span>${part.priceModifier === 0 ? 'Included' : '+' + money(part.priceModifier)}</span></li>`).join('')
        : '<li>Stock factory delivery<span>Included</span></li>';

      const action = ticket.status === 'PENDING'
        ? `<button type="button" class="btn btn-primary btn-block" data-advance-ticket="${ticket.ticketId}">Move to Bay →</button>`
        : ticket.status === 'IN_PROGRESS'
          ? `<button type="button" class="btn btn-primary btn-block" data-advance-ticket="${ticket.ticketId}">Mark Build Ready ✓</button>`
          : `<div class="ticket-done"><span class="chip chip-green">Completed ✓ Ready for pickup</span></div>`;

      return `
        <article class="ticket">
          <div class="ticket-top">
            <span class="ticket-id">TICKET #${ticket.ticketId}</span>
            <span class="ticket-date">${esc(formatDate(ticket.createdAt))}</span>
          </div>
          <h3 class="ticket-customer">${esc(ticket.customerName)}</h3>
          <p class="ticket-vehicle">${esc(build.vehicle.name)}</p>
          <p class="ticket-build">“${esc(build.buildName)}”</p>
          <ul class="ticket-parts">${parts}</ul>
          <div class="ticket-total">
            <span>Build estimate</span>
            <strong>${money(build.totalPrice)}</strong>
          </div>
          ${action}
        </article>`;
    }).join('');

    return `
      <section class="kanban-col" data-status="${column.status}">
        <div class="kanban-head">
          <h2>${column.number}. ${column.title}</h2>
          <span class="kanban-sub">${column.sub}</span>
          <span class="kanban-count">${tickets.length}</span>
        </div>
        <div class="kanban-body">
          ${cards || `<p class="kanban-empty">${column.empty}</p>`}
        </div>
      </section>`;
  }).join('');

  return `
    <section class="page">
      <div class="page-head">
        <p class="eyebrow">Step 4 of 4 — Workshop workflow</p>
        <h1>Shop tickets</h1>
        <p class="lede">Every checked-out build becomes a work order. Advance it across the bay board as the crew works.</p>
      </div>
      <div class="kanban">${board}</div>
    </section>`;
}

/* ------------------------------ render ------------------------------- */

function render() {
  const route = currentRoute();

  document.querySelectorAll('.tab').forEach((tab) => {
    tab.classList.toggle('is-active', tab.dataset.route === route);
  });
  document.getElementById('garage-count').textContent = String(state.garage.length);
  document.getElementById('ticket-count').textContent = String(state.tickets.length);
  document.getElementById('live-total').textContent = money(liveTotal());

  const view = document.getElementById('view');
  if (route === 'vehicles') view.innerHTML = vehiclesView();
  else if (route === 'build') view.innerHTML = buildView();
  else if (route === 'garage') view.innerHTML = garageView();
  else view.innerHTML = ticketsView();

  if (route !== lastRoute) {
    window.scrollTo(0, 0);
    lastRoute = route;
  }
}

/* ----------------------------- events -------------------------------- */

function onViewClick(event) {
  const trigger = event.target.closest(
    '[data-vehicle],[data-cat],[data-part],[data-remove-part],[data-garage-build],' +
    '[data-advance-ticket],#save-build,#change-vehicle,#remove-build,#checkout-build,[data-goto]');

  if (!trigger) return;

  if (trigger.dataset.vehicle) return chooseVehicle(Number(trigger.dataset.vehicle));
  if (trigger.dataset.cat) {
    draft.categoryId = Number(trigger.dataset.cat);
    return render();
  }
  if (trigger.dataset.part) return togglePart(Number(trigger.dataset.part));
  if (trigger.dataset.removePart) return removePart(Number(trigger.dataset.removePart));
  if (trigger.dataset.garageBuild) {
    garageSelectionId = Number(trigger.dataset.garageBuild);
    return render();
  }
  if (trigger.dataset.advanceTicket) return advanceTicket(Number(trigger.dataset.advanceTicket));
  if (trigger.dataset.goto) {
    location.hash = `#/${trigger.dataset.goto}`;
    return;
  }
  if (trigger.id === 'save-build') return saveBuild();
  if (trigger.id === 'change-vehicle') {
    location.hash = '#/vehicles';
    return;
  }
  if (trigger.id === 'remove-build') return removeArmed ? removeBuild() : armRemoveBuild();
  if (trigger.id === 'checkout-build') return checkoutBuild();
}

function onViewInput(event) {
  if (event.target.id === 'build-name') {
    draft.buildName = event.target.value;
    persistDraft();
  }
  if (event.target.id === 'customer-name') {
    customerName = event.target.value;
  }
}

/* ------------------------------- boot -------------------------------- */

async function boot() {
  restoreDraft();

  try {
    const [vehicles, categories, garage, tickets] = await Promise.all([
      api('/vehicles'),
      api('/categories'),
      api('/garage'),
      api('/tickets'),
    ]);
    state.vehicles = vehicles;
    state.categories = categories;
    state.garage = garage;
    state.tickets = tickets;
    if (!draft.categoryId) draft.categoryId = categories[0]?.categoryId ?? null;
    if (draft.vehicleId) await loadParts();
    if (!location.hash) location.replace('#/vehicles');
    render();
  } catch (error) {
    document.getElementById('view').innerHTML = `
      <section class="page">
        <div class="empty-state">
          <span class="empty-mark">A</span>
          <h2>Could not load Autotorium</h2>
          <p>${esc(error.message)}</p>
          <button type="button" class="btn btn-primary" onclick="location.reload()">Retry</button>
        </div>
      </section>`;
  }
}

document.getElementById('view').addEventListener('click', onViewClick);
document.getElementById('view').addEventListener('input', onViewInput);
window.addEventListener('hashchange', render);

/* A chassis photo that fails to load drops back to the studio placeholder. */
document.addEventListener('error', (event) => {
  const image = event.target;
  if (image instanceof HTMLImageElement && image.classList.contains('vehicle-photo')) {
    image.classList.add('is-broken');
  }
}, true);

boot();
