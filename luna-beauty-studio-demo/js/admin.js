/* ============================================================
   Demo Admin — app logic
   Pages: dashboard | bookings | services | availability | settings
   ============================================================ */

let state = LunaData.loadState();
const $ = id => document.getElementById(id);

const PAGE_TITLES = {
  dashboard: ['Dashboard', 'Overview of today\'s schedule and recent activity'],
  bookings: ['Bookings', 'View and manage every appointment request'],
  services: ['Services', 'Manage your service menu, prices, variations, and add-ons'],
  availability: ['Availability', 'Set operating hours, blocked dates, and unavailable slots'],
  settings: ['Business Settings', 'Basic business information and booking policy']
};

let currentPage = 'dashboard';
let bookingFilter = 'All';
let bookingSearch = '';

/* ---------- Boot ---------- */
function boot() {
  if (sessionStorage.getItem('luna_demo_admin') !== '1') {
    location.replace('admin-login.html');
    return;
  }
  renderChrome();
  bindNav();

  const params = new URLSearchParams(location.search);
  const ref = params.get('ref');
  if (ref) {
    go('bookings');
    setTimeout(() => openBooking(ref), 260);
  } else {
    go('dashboard');
  }
}

function renderChrome() {
  document.querySelectorAll('[data-brand-name]').forEach(el => el.textContent = state.settings.businessName);
  document.querySelectorAll('[data-brand-sub]').forEach(el => el.textContent = state.settings.tagline);
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
}

function bindNav() {
  document.querySelectorAll('.side-link').forEach(b => b.addEventListener('click', () => go(b.dataset.page)));
  $('resetDemoBtn')?.addEventListener('click', () => openModal('resetModal'));
  $('logoutBtn')?.addEventListener('click', () => {
    sessionStorage.removeItem('luna_demo_admin');
    location.href = 'index.html';
  });
}

function go(page) {
  currentPage = page;
  document.querySelectorAll('.side-link').forEach(b => b.classList.toggle('active', b.dataset.page === page));
  const [title, sub] = PAGE_TITLES[page];
  $('pageTitle').textContent = title;
  $('pageSub').textContent = sub;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  ({ dashboard: renderDashboard, bookings: renderBookings, services: renderServices,
     availability: renderAvailability, settings: renderSettings })[page]();
}

/* ---------- Derived ---------- */
function stats() {
  const today = LunaData.todayISO(0);
  const active = state.bookings.filter(b => b.status !== 'Canceled');
  return {
    today: state.bookings.filter(b => b.date === today && b.status !== 'Canceled').length,
    pending: state.bookings.filter(b => b.status === 'Pending').length,
    confirmed: state.bookings.filter(b => b.status === 'Confirmed').length,
    completed: state.bookings.filter(b => b.status === 'Completed').length,
    todayList: state.bookings.filter(b => b.date === today && b.status !== 'Canceled')
      .sort((a, b) => LunaData.toMinutes(a.time) - LunaData.toMinutes(b.time)),
    recent: [...state.bookings].sort((a, b) => {
      if (a.createdAt !== b.createdAt) return a.createdAt < b.createdAt ? 1 : -1;
      return String(b.ref).localeCompare(String(a.ref));
    }).slice(0, 6)
  };
}

function badge(status) {
  const m = LunaData.STATUS_META[status] || { cls: 'badge-pending', icon: '⏳' };
  return `<span class="badge ${m.cls}">${m.icon} ${status}</span>`;
}

/* ---------- DASHBOARD ---------- */
function renderDashboard() {
  const s = stats();
  const svcCount = state.services.filter(x => x.active).length;

  const schedHTML = s.todayList.length ? s.todayList.map(b => {
    const meta = LunaData.STATUS_META[b.status];
    return `<li class="sched-item">
      <span class="sched-time">${LunaData.fmtTime(b.time)}<small>${LunaData.fmtDuration(b.duration)}</small></span>
      <span class="sched-main">
        <b>${b.name}</b>
        <small>${b.serviceName}${b.variationName && b.variationName !== 'Standard' ? ' · ' + b.variationName : ''} · ${b.ref}</small>
      </span>
      <span>${badge(b.status)}</span>
    </li>`;
  }).join('') : `<li class="empty-state"><div class="es-ico">🌤️</div><b>No appointments today</b>Your schedule is clear — a good day for walk-ins.</li>`;

  $('adminContent').innerHTML = `
    <div class="stat-grid">
      <div class="stat accent-amber">
        <span class="st-ico">📅</span>
        <span class="st-label">Today's Bookings</span>
        <span class="st-value">${s.today}</span>
        <span class="st-sub">${LunaData.dayName(LunaData.todayISO(0))}, ${LunaData.fmtDateShort(LunaData.todayISO(0))}</span>
      </div>
      <div class="stat">
        <span class="st-ico">⏳</span>
        <span class="st-label">Pending</span>
        <span class="st-value">${s.pending}</span>
        <span class="st-sub">Awaiting your confirmation</span>
      </div>
      <div class="stat accent-green">
        <span class="st-ico">✅</span>
        <span class="st-label">Confirmed</span>
        <span class="st-value">${s.confirmed}</span>
        <span class="st-sub">Upcoming confirmed visits</span>
      </div>
      <div class="stat accent-blue">
        <span class="st-ico">★</span>
        <span class="st-label">Completed</span>
        <span class="st-value">${s.completed}</span>
        <span class="st-sub">Services delivered</span>
      </div>
    </div>

    <div class="two-col">
      <div>
        <div class="panel">
          <div class="panel-head">
            <h3>Today's Schedule</h3>
            <span class="ph-sub">${s.todayList.length} appointment${s.todayList.length === 1 ? '' : 's'}</span>
          </div>
          <div class="panel-body flush">
            <div class="sched-now">Live demo view · today</div>
            <ul class="sched-list">${schedHTML}</ul>
          </div>
        </div>

        <div class="panel">
          <div class="panel-head">
            <h3>Recent Bookings</h3>
            <button class="btn btn-soft btn-sm" data-goto="bookings">Manage all →</button>
          </div>
          <div class="panel-body flush table-scroll">
            <table class="data">
              <thead><tr><th>Reference</th><th>Customer</th><th>Service</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                ${s.recent.map(b => `<tr>
                  <td class="ref">${b.ref}</td>
                  <td class="cust"><b>${b.name}</b><small>${LunaData.fmtTime(b.time)}</small></td>
                  <td>${b.serviceName}</td>
                  <td class="tabular">${LunaData.fmtDateShort(b.date)}</td>
                  <td class="amt">${LunaData.peso(b.total)}</td>
                  <td>${badge(b.status)}</td>
                </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div>
        <div class="panel">
          <div class="panel-head"><h3>Booking Status Overview</h3></div>
          <div class="panel-body">
            ${['Pending','Confirmed','Completed','Canceled'].map(st => {
              const n = state.bookings.filter(b => b.status === st).length;
              const tot = state.bookings.length || 1;
              const pct = Math.round(n / tot * 100);
              const colors = { Pending:'var(--amber)', Confirmed:'var(--green)', Completed:'var(--blue)', Canceled:'var(--red)' };
              return `<div style="margin-bottom:16px;">
                <div class="flex between items-center mb-0" style="font-size:.85rem;margin-bottom:6px;">
                  <span style="font-weight:600;">${st}</span><span class="text-soft">${n} · ${pct}%</span>
                </div>
                <div style="height:8px;border-radius:999px;background:var(--cream-2);overflow:hidden;">
                  <div style="height:100%;width:${pct}%;background:${colors[st]};border-radius:999px;transition:width .4s;"></div>
                </div>
              </div>`;
            }).join('')}
            <hr class="divider">
            <div class="flex between items-center"><span class="text-soft small">Total bookings on record</span><b>${state.bookings.length}</b></div>
            <div class="flex between items-center mt-1"><span class="text-soft small">Active services</span><b>${svcCount}</b></div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-head"><h3>Quick Actions</h3></div>
          <div class="panel-body" style="display:grid;gap:10px;">
            <button class="btn btn-soft btn-block" data-goto="bookings">Manage Bookings</button>
            <button class="btn btn-soft btn-block" data-goto="services">Edit Services</button>
            <button class="btn btn-soft btn-block" data-goto="availability">Set Availability</button>
            <button class="btn btn-ghost btn-block" id="resetDemoBtn">↺ Reset Demo Data</button>
          </div>
        </div>

        <div class="panel">
          <div class="panel-head"><h3>Package Note</h3></div>
          <div class="panel-body">
            <p class="small text-soft" style="margin:0;">
              This dashboard is part of the <strong>₱7,999 Standard Booking Website/System</strong> —
              customer website, online booking, and this admin panel. Advanced analytics, payment
              gateways, staff calendars, and memberships are available as a <strong>Custom quotation</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>`;

  bindGoto();
  $('resetDemoBtn')?.addEventListener('click', () => openModal('resetModal'));
}

function bindGoto() {
  document.querySelectorAll('[data-goto]').forEach(b => b.addEventListener('click', () => go(b.dataset.goto)));
}

/* ---------- BOOKINGS ---------- */
function renderBookings() {
  const counts = { All: state.bookings.length };
  ['Pending','Confirmed','Completed','Canceled'].forEach(st => counts[st] = state.bookings.filter(b => b.status === st).length);

  const rows = state.bookings
    .filter(b => bookingFilter === 'All' || b.status === bookingFilter)
    .filter(b => {
      if (!bookingSearch) return true;
      const q = bookingSearch.toLowerCase();
      return [b.ref, b.name, b.email, b.mobile, b.serviceName].join(' ').toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (a.date !== b.date) return a.date < b.date ? 1 : -1;
      return LunaData.toMinutes(b.time) - LunaData.toMinutes(a.time);
    });

  $('adminContent').innerHTML = `
    <div class="panel">
      <div class="panel-head">
        <div class="filters">
          <div class="filter-chips" id="statusChips">
            ${['All','Pending','Confirmed','Completed','Canceled'].map(st =>
              `<button class="chip ${bookingFilter === st ? 'active' : ''}" data-status="${st}">${st} (${counts[st]})</button>`).join('')}
          </div>
        </div>
        <div class="filters">
          <input type="search" id="bookSearch" placeholder="Search name, ref, or service…" value="${bookingSearch.replace(/"/g,'&quot;')}" style="min-width:220px;">
          <button class="btn btn-soft btn-sm" id="resetFilter">Clear</button>
        </div>
      </div>
      <div class="panel-body flush table-scroll">
        ${rows.length ? `<table class="data">
          <thead><tr>
            <th>Reference</th><th>Customer</th><th>Service</th><th>Date</th><th>Time</th><th>Amount</th><th>Status</th><th>Actions</th>
          </tr></thead>
          <tbody>
            ${rows.map(b => `<tr data-row="${b.ref}">
              <td class="ref">${b.ref}</td>
              <td class="cust"><b>${b.name}</b><small>${b.mobile}</small></td>
              <td>${b.serviceName}${b.variationName && b.variationName !== 'Standard' ? '<br><small class="text-soft">' + b.variationName + '</small>' : ''}</td>
              <td class="tabular">${LunaData.fmtDateShort(b.date)}</td>
              <td class="tabular">${LunaData.fmtTime(b.time)}</td>
              <td class="amt">${LunaData.peso(b.total)}</td>
              <td>${badge(b.status)}</td>
              <td>
                <div class="row-actions">
                  <button class="icon-btn" data-view="${b.ref}">View</button>
                  ${b.status === 'Pending' ? `<button class="icon-btn ok" data-act="Confirmed" data-ref="${b.ref}">Confirm</button>` : ''}
                  ${b.status === 'Confirmed' ? `<button class="icon-btn done" data-act="Completed" data-ref="${b.ref}">Complete</button>` : ''}
                  ${(b.status === 'Pending' || b.status === 'Confirmed') ? `<button class="icon-btn warn" data-act="Canceled" data-ref="${b.ref}">Cancel</button>` : ''}
                  ${b.status === 'Canceled' ? `<button class="icon-btn ok" data-act="Pending" data-ref="${b.ref}">Reopen</button>` : ''}
                  ${b.status === 'Completed' ? `<button class="icon-btn" data-act="Confirmed" data-ref="${b.ref}">Re-mark</button>` : ''}
                </div>
              </td>
            </tr>`).join('')}
          </tbody>
        </table>` : `<div class="empty-state"><div class="es-ico">📭</div><b>No bookings match</b>Try a different status or clear your search.</div>`}
      </div>
    </div>`;

  $('statusChips').addEventListener('click', e => {
    const c = e.target.closest('.chip'); if (!c) return;
    bookingFilter = c.dataset.status; renderBookings();
  });
  $('bookSearch').addEventListener('input', e => { bookingSearch = e.target.value; renderBookings(); });
  $('resetFilter').addEventListener('click', () => { bookingFilter = 'All'; bookingSearch = ''; renderBookings(); });

  document.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => openBooking(b.dataset.view)));
  document.querySelectorAll('[data-act]').forEach(b => b.addEventListener('click', () => setStatus(b.dataset.ref, b.dataset.act)));
}

function setStatus(ref, status) {
  state = LunaData.loadState();
  const b = state.bookings.find(x => x.ref === ref);
  if (!b) return;
  const prev = b.status;
  b.status = status;
  LunaData.saveState(state);

  const verb = { Confirmed: 'confirmed', Completed: 'marked as completed', Canceled: 'canceled', Pending: 'reopened as pending' }[status] || 'updated';
  LunaUI.toast(`${ref} ${verb}.`, status === 'Canceled' ? 'warn' : status === 'Confirmed' ? 'ok' : '');
  refreshCurrent();
  if ($('bookingModal')?.classList.contains('open')) openBooking(ref);
}

function refreshCurrent() { go(currentPage); }

/* ---------- Booking detail modal ---------- */
function openBooking(ref) {
  state = LunaData.loadState();
  const b = state.bookings.find(x => x.ref === ref);
  if (!b) return;
  const s = state.services.find(x => x.id === b.serviceId);

  $('bookingModalBody').innerHTML = `
    <div class="flex between items-center wrap-flex gap-1 mb-2">
      <div>
        <div class="ref-pill" style="margin:0;padding:10px 22px;">
          <small>Booking Reference</small><b style="font-size:1.3rem;">${b.ref}</b>
        </div>
      </div>
      <div style="text-align:right;">${badge(b.status)}<div class="small text-soft mt-1">Requested ${LunaData.fmtDateShort(b.createdAt)}</div></div>
    </div>

    <div class="review-block mb-2">
      <div class="rb-head">Appointment</div>
      <div class="rb-body">
        <div class="rb-row"><span class="k">Service</span><span class="v">${s ? s.icon : '✨'} ${b.serviceName}</span></div>
        <div class="rb-row"><span class="k">Variation</span><span class="v">${b.variationName || 'Standard'}</span></div>
        <div class="rb-row"><span class="k">Add-ons</span><span class="v">${b.addons && b.addons.length ? b.addons.map(a => a.name + ' (+' + LunaData.peso(a.price) + ')').join('<br>') : 'None'}</span></div>
        <div class="rb-row"><span class="k">Date</span><span class="v">${LunaData.dayName(b.date)}, ${LunaData.fmtDate(b.date)}</span></div>
        <div class="rb-row"><span class="k">Time</span><span class="v">${LunaData.fmtTime(b.time)}</span></div>
        <div class="rb-row"><span class="k">Duration</span><span class="v">${LunaData.fmtDuration(b.duration)}</span></div>
        <div class="rb-row total"><span class="k" style="font-weight:600;color:var(--ink);">Total</span><span class="v">${LunaData.peso(b.total)}</span></div>
      </div>
    </div>

    <div class="review-block">
      <div class="rb-head">Customer Information</div>
      <div class="rb-body">
        <div class="rb-row"><span class="k">Full Name</span><span class="v">${b.name}</span></div>
        <div class="rb-row"><span class="k">Email</span><span class="v" style="word-break:break-all;">${b.email}</span></div>
        <div class="rb-row"><span class="k">Mobile</span><span class="v">${b.mobile}</span></div>
        <div class="rb-row"><span class="k">Notes</span><span class="v" style="font-weight:500;">${b.notes ? b.notes : '—'}</span></div>
      </div>
    </div>

    <div class="demo-note" style="margin-top:18px;">
      <span class="dn-ico">🧪</span>
      <span>Demo record. Status changes here are simulated and stored only in this browser session.</span>
    </div>`;

  const actions = [];
  if (b.status === 'Pending') actions.push(`<button class="btn btn-primary" data-mact="Confirmed">✓ Confirm Booking</button>`);
  if (b.status === 'Confirmed') actions.push(`<button class="btn btn-primary" data-mact="Completed">★ Mark Completed</button>`);
  if (b.status === 'Pending' || b.status === 'Confirmed') actions.push(`<button class="btn btn-ghost" data-mact="Canceled">✕ Cancel Booking</button>`);
  if (b.status === 'Canceled') actions.push(`<button class="btn btn-ghost" data-mact="Pending">↺ Reopen as Pending</button>`);
  if (b.status === 'Completed') actions.push(`<button class="btn btn-ghost" data-mact="Confirmed">↺ Revert to Confirmed</button>`);
  actions.push(`<button class="btn btn-soft" data-close="1">Close</button>`);
  $('bookingModalFoot').innerHTML = actions.join('');

  $('bookingModalFoot').querySelectorAll('[data-mact]').forEach(btn =>
    btn.addEventListener('click', () => setStatus(ref, btn.dataset.mact)));
  $('bookingModalFoot').querySelector('[data-close]')?.addEventListener('click', () => closeModal('bookingModal'));

  openModal('bookingModal');
}

/* ---------- SERVICES ---------- */
function renderServices() {
  $('adminContent').innerHTML = `
    <div class="flex between items-center wrap-flex gap-1 mb-2">
      <div class="filter-chips">
        <button class="chip active">All Services (${state.services.length})</button>
        <button class="chip">Active (${state.services.filter(s => s.active).length})</button>
      </div>
      <button class="btn btn-primary btn-sm" id="addSvcBtn">+ Add Service</button>
    </div>
    <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:16px;">
      ${state.services.map(s => `
        <div class="svc-admin">
          <span class="sa-ico">${s.icon}</span>
          <div class="sa-main">
            <h4>${s.name} ${s.active ? '<span class="pill-active">Active</span>' : '<span class="pill-inactive">Inactive</span>'}</h4>
            <p class="sa-desc">${s.description}</p>
            <div class="sa-meta">
              <span><b>${LunaData.peso(s.price)}</b> base</span>
              <span><b>${LunaData.fmtDuration(s.duration)}</b></span>
              <span>${s.category}</span>
            </div>
            ${s.variations && s.variations.length ? `<div class="sub-chips">${s.variations.map(v => `<span class="sub-chip">${v.name} · <b>${LunaData.peso(v.price)}</b></span>`).join('')}</div>` : ''}
            ${s.addons && s.addons.length ? `<div class="sub-chips">${s.addons.map(a => `<span class="sub-chip">+ ${a.name} · <b>${LunaData.peso(a.price)}</b></span>`).join('')}</div>` : ''}
            <div class="sa-actions" style="flex-direction:row;margin-top:14px;">
              <button class="icon-btn" data-edit="${s.id}">Edit</button>
              <button class="icon-btn ${s.active ? 'warn' : 'ok'}" data-toggle="${s.id}">${s.active ? 'Deactivate' : 'Activate'}</button>
            </div>
          </div>
        </div>`).join('')}
    </div>`;

  $('addSvcBtn').addEventListener('click', () => openServiceEditor(null));
  document.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => openServiceEditor(b.dataset.edit)));
  document.querySelectorAll('[data-toggle]').forEach(b => b.addEventListener('click', () => toggleService(b.dataset.toggle)));
}

function toggleService(id) {
  state = LunaData.loadState();
  const s = state.services.find(x => x.id === id);
  if (!s) return;
  s.active = !s.active;
  LunaData.saveState(state);
  LunaUI.toast(`${s.name} ${s.active ? 'activated' : 'deactivated'}.`, s.active ? 'ok' : 'warn');
  renderServices();
}

function openServiceEditor(id) {
  state = LunaData.loadState();
  const s = id ? state.services.find(x => x.id === id) : null;
  const isNew = !s;
  const svc = s || { id: '', name: '', tagline: '', description: '', price: 0, duration: 45, icon: '✨', category: 'Nails', active: true, variations: [], addons: [] };

  $('svcModalTitle').textContent = isNew ? 'Add Service' : 'Edit Service';
  $('svcModalBody').innerHTML = `
    <div class="form-grid">
      <div class="field full"><label>Service Name</label><input id="sName" value="${esc(svc.name)}" placeholder="e.g. Classic Manicure"></div>
      <div class="field full"><label>Short Tagline</label><input id="sTagline" value="${esc(svc.tagline)}" placeholder="One-line summary shown in cards"></div>
      <div class="field full"><label>Description</label><textarea id="sDesc" placeholder="What's included in this service...">${esc(svc.description)}</textarea></div>
      <div class="field"><label>Base Price (₱)</label><input id="sPrice" type="number" min="0" step="50" value="${svc.price}"></div>
      <div class="field"><label>Duration (minutes)</label><input id="sDuration" type="number" min="15" step="15" value="${svc.duration}"></div>
      <div class="field"><label>Category</label>
        <select id="sCategory">${['Nails','Lashes','Brows','Skin','Other'].map(c => `<option ${c === svc.category ? 'selected' : ''}>${c}</option>`).join('')}</select>
      </div>
      <div class="field"><label>Icon (emoji)</label><input id="sIcon" value="${esc(svc.icon)}" maxlength="4"></div>
      <div class="field full" id="varBlock">
        <label>Variations <span style="color:var(--ink-faint);font-weight:500;">(optional)</span></label>
        <div id="varList" class="grid" style="gap:8px;"></div>
        <button type="button" class="btn btn-soft btn-sm" id="addVar" style="align-self:flex-start;margin-top:6px;">+ Add Variation</button>
        <span class="hint">e.g. Solid Colour · ₱650 · 60 min</span>
      </div>
      <div class="field full">
        <label>Add-ons <span style="color:var(--ink-faint);font-weight:500;">(optional)</span></label>
        <div id="aoList" class="grid" style="gap:8px;"></div>
        <button type="button" class="btn btn-soft btn-sm" id="addAo" style="align-self:flex-start;margin-top:6px;">+ Add Add-on</button>
        <span class="hint">e.g. French Tip Finish · ₱120 · 15 min</span>
      </div>
      <div class="field full">
        <label>Status</label>
        <select id="sActive"><option value="true" ${svc.active ? 'selected' : ''}>Active — visible &amp; bookable</option><option value="false" ${!svc.active ? 'selected' : ''}>Inactive — hidden from customers</option></select>
      </div>
    </div>`;

  let variations = LunaData.clone(svc.variations || []);
  let addons = LunaData.clone(svc.addons || []);

  function drawVars() {
    $('varList').innerHTML = variations.length ? variations.map((v, i) => rowHTML(v, i, 'v', ['name','price','duration'])).join('') : '<span class="small text-soft">No variations yet.</span>';
    bindRow('varList', variations);
  }
  function drawAos() {
    $('aoList').innerHTML = addons.length ? addons.map((a, i) => rowHTML(a, i, 'a', ['name','price','duration'])).join('') : '<span class="small text-soft">No add-ons yet.</span>';
    bindRow('aoList', addons);
  }
  function rowHTML(o, i, kind, fields) {
    return `<div class="flex gap-1 items-center wrap-flex" data-row="${kind}-${i}" style="background:var(--cream-2);border:1px solid var(--line);border-radius:10px;padding:8px 10px;">
      <input value="${esc(o.name)}" data-f="name" placeholder="Name" style="flex:2;min-width:120px;padding:7px 10px;border:1px solid var(--line);border-radius:8px;font-family:inherit;font-size:.86rem;">
      <input value="${o.price}" data-f="price" type="number" placeholder="₱" style="width:86px;padding:7px 10px;border:1px solid var(--line);border-radius:8px;font-family:inherit;font-size:.86rem;">
      <input value="${o.duration}" data-f="duration" type="number" placeholder="min" style="width:74px;padding:7px 10px;border:1px solid var(--line);border-radius:8px;font-family:inherit;font-size:.86rem;">
      <button type="button" class="icon-btn warn" data-del="${kind}-${i}">✕</button>
    </div>`;
  }
  function bindRow(containerId, arr) {
    $(containerId).querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => {
      const kind = b.dataset.del.split('-')[0];
      const idx = parseInt(b.dataset.del.split('-')[1], 10);
      if (kind === 'v') { variations.splice(idx, 1); drawVars(); } else { addons.splice(idx, 1); drawAos(); }
    }));
    $(containerId).querySelectorAll('input[data-f]').forEach(inp => inp.addEventListener('input', () => {
      const parts = inp.closest('[data-row]').dataset.row.split('-');
      const kind = parts[0], idx = parseInt(parts[1], 10);
      const arr = kind === 'v' ? variations : addons;
      const f = inp.dataset.f;
      arr[idx][f] = f === 'name' ? inp.value : (parseInt(inp.value, 10) || 0);
    }));
  }

  $('addVar').addEventListener('click', () => { variations.push({ id: 'v-' + Date.now(), name: '', price: svc.price, duration: svc.duration }); drawVars(); });
  $('addAo').addEventListener('click', () => { addons.push({ id: 'ao-' + Date.now(), name: '', price: 100, duration: 10 }); drawAos(); });
  drawVars(); drawAos();

  $('svcModalFoot').innerHTML = `
    <button class="btn btn-ghost" data-close="1">Cancel</button>
    ${!isNew ? `<button class="btn btn-soft" id="delSvc" style="color:var(--red);">Delete Service</button>` : ''}
    <button class="btn btn-primary" id="saveSvc">${isNew ? 'Add Service' : 'Save Changes'}</button>`;
  $('svcModalFoot').querySelector('[data-close]').addEventListener('click', () => closeModal('svcModal'));

  if (!isNew) {
    $('delSvc').addEventListener('click', () => {
      state = LunaData.loadState();
      state.services = state.services.filter(x => x.id !== svc.id);
      LunaData.saveState(state);
      closeModal('svcModal');
      LunaUI.toast(`${svc.name} removed from the menu.`, 'warn');
      renderServices();
    });
  }

  $('saveSvc').addEventListener('click', () => {
    const name = $('sName').value.trim();
    if (!name) { LunaUI.toast('Please enter a service name.', 'bad'); $('sName').focus(); return; }
    state = LunaData.loadState();
    const payload = {
      id: svc.id || 'svc-' + Date.now(),
      name,
      tagline: $('sTagline').value.trim() || 'A service at ' + state.settings.businessName,
      description: $('sDesc').value.trim() || 'Service description.',
      price: parseInt($('sPrice').value, 10) || 0,
      duration: parseInt($('sDuration').value, 10) || 45,
      category: $('sCategory').value,
      icon: $('sIcon').value.trim() || '✨',
      active: $('sActive').value === 'true',
      image: svc.image || 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=80',
      variations: variations.filter(v => v.name.trim()).map(v => ({ id: v.id || 'v-' + Math.random().toString(36).slice(2, 8), name: v.name, price: v.price, duration: v.duration })),
      addons: addons.filter(a => a.name.trim()).map(a => ({ id: a.id || 'ao-' + Math.random().toString(36).slice(2, 8), name: a.name, price: a.price, duration: a.duration }))
    };
    if (isNew) state.services.push(payload);
    else {
      const i = state.services.findIndex(x => x.id === svc.id);
      state.services[i] = payload;
    }
    LunaData.saveState(state);
    closeModal('svcModal');
    LunaUI.toast(isNew ? `${name} added to the menu.` : `${name} updated.`, 'ok');
    renderServices();
  });

  openModal('svcModal');
}
function esc(s) { return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;'); }

/* ---------- AVAILABILITY ---------- */
function renderAvailability() {
  state = LunaData.loadState();
  const a = state.availability;

  $('adminContent').innerHTML = `
    <div class="two-col">
      <div>
        <div class="panel">
          <div class="panel-head"><h3>Operating Days &amp; Hours</h3><span class="ph-sub">Toggle a day off to mark it closed</span></div>
          <div class="panel-body">
            <ul class="hours-editor" id="hoursEditor">
              ${state.settings.hours.map((h, i) => `
                <li class="hours-row" data-i="${i}">
                  <span class="day-name">${h.day}</span>
                  <label class="switch"><input type="checkbox" ${h.open ? 'checked' : ''} data-open="${i}"><span class="slider"></span></label>
                  <input type="time" value="${h.from}" data-from="${i}" ${h.open ? '' : 'disabled'}>
                  <span class="to-dash">to</span>
                  <input type="time" value="${h.to}" data-to="${i}" ${h.open ? '' : 'disabled'}>
                </li>`).join('')}
            </ul>
            <div class="field mt-2" style="max-width:240px;">
              <label>Slot interval</label>
              <select id="slotMinutes">
                ${[15,30,45,60].map(m => `<option value="${m}" ${a.slotMinutes === m ? 'selected' : ''}>Every ${m} minutes</option>`).join('')}
              </select>
            </div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-head"><h3>Blocked Dates</h3><span class="ph-sub">Full days the studio is unavailable</span></div>
          <div class="panel-body">
            <div class="flex gap-1 wrap-flex items-center mb-2">
              <input type="date" id="blockDate" style="font-family:inherit;font-size:.86rem;padding:9px 12px;border:1.5px solid var(--line);border-radius:10px;">
              <input type="text" id="blockNote" placeholder="Reason (optional)" style="font-family:inherit;font-size:.86rem;padding:9px 12px;border:1.5px solid var(--line);border-radius:10px;flex:1;min-width:150px;">
              <button class="btn btn-primary btn-sm" id="addBlock">Block Date</button>
            </div>
            <div id="blockedList"></div>
          </div>
        </div>
      </div>

      <div>
        <div class="panel">
          <div class="panel-head"><h3>Unavailable Time Slots</h3></div>
          <div class="panel-body">
            <p class="small text-soft">Block individual slots on a specific date — for breaks, personal errands, or a held chair. Blocked slots appear as unavailable to customers.</p>
            <div class="field mb-2"><label>Date</label><input type="date" id="slotDate" value="${LunaData.todayISO(0)}" style="font-family:inherit;font-size:.86rem;padding:9px 12px;border:1.5px solid var(--line);border-radius:10px;"></div>
            <div id="slotPicker" class="chips-board mb-2"></div>
            <div id="blockedSlotsList"></div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-head"><h3>How this affects customers</h3></div>
          <div class="panel-body">
            <p class="small text-soft" style="margin:0;">
              The booking calendar automatically greys out closed days and blocked dates, and the time-step
              hides any slot you block here. Existing bookings are never broken by a change — you'll simply
              see fewer new slots offered on that day.
            </p>
          </div>
        </div>
      </div>
    </div>`;

  // Hours
  document.querySelectorAll('[data-open]').forEach(cb => cb.addEventListener('change', () => {
    const i = +cb.dataset.open;
    state = LunaData.loadState();
    state.settings.hours[i].open = cb.checked;
    LunaData.saveState(state);
    renderAvailability();
    LunaUI.toast(`${state.settings.hours[i].day} ${cb.checked ? 'opened' : 'marked closed'}.`, cb.checked ? 'ok' : 'warn');
  }));
  document.querySelectorAll('[data-from],[data-to]').forEach(inp => inp.addEventListener('change', () => {
    state = LunaData.loadState();
    const isFrom = inp.dataset.from != null;
    const i = +(isFrom ? inp.dataset.from : inp.dataset.to);
    if (isFrom) state.settings.hours[i].from = inp.value; else state.settings.hours[i].to = inp.value;
    LunaData.saveState(state);
    LunaUI.toast('Opening hours updated.', 'ok');
  }));
  $('slotMinutes').addEventListener('change', e => {
    state = LunaData.loadState();
    state.availability.slotMinutes = +e.target.value;
    LunaData.saveState(state);
    LunaUI.toast('Slot interval updated.', 'ok');
  });

  // Blocked dates
  function drawBlocked() {
    state = LunaData.loadState();
    const list = state.availability.blockedDates;
    $('blockedList').innerHTML = list.length ? list.slice().sort().map(d => `
      <div class="blocked-date-card">
        <div><b>${LunaData.dayName(d)}, ${LunaData.fmtDate(d)}</b>
        <small>${state.availability.blockedDatesNote?.[d] || 'Blocked by studio'}</small></div>
        <button class="icon-btn warn" data-unblock="${d}">Remove</button>
      </div>`).join('') : '<p class="small text-soft" style="margin:0;">No blocked dates.</p>';
    $('blockedList').querySelectorAll('[data-unblock]').forEach(b => b.addEventListener('click', () => {
      state = LunaData.loadState();
      state.availability.blockedDates = state.availability.blockedDates.filter(x => x !== b.dataset.unblock);
      LunaData.saveState(state);
      drawBlocked();
      LunaUI.toast('Date unblocked.', 'ok');
    }));
  }
  drawBlocked();

  $('addBlock').addEventListener('click', () => {
    const d = $('blockDate').value;
    if (!d) { LunaUI.toast('Pick a date to block.', 'bad'); return; }
    state = LunaData.loadState();
    if (!state.availability.blockedDates.includes(d)) state.availability.blockedDates.push(d);
    state.availability.blockedDatesNote = state.availability.blockedDatesNote || {};
    state.availability.blockedDatesNote[d] = $('blockNote').value.trim() || 'Blocked by studio';
    LunaData.saveState(state);
    $('blockNote').value = '';
    drawBlocked();
    LunaUI.toast(`${LunaData.fmtDateShort(d)} blocked.`, 'warn');
  });

  // Slot picker
  function drawSlotPicker() {
    state = LunaData.loadState();
    const d = $('slotDate').value;
    const dn = LunaData.dayName(d);
    const hours = state.settings.hours.find(h => h.day === dn);
    if (!hours || !hours.open) {
      $('slotPicker').innerHTML = '<span class="small text-soft">Studio is closed on this day — no slots to manage.</span>';
      $('blockedSlotsList').innerHTML = '';
      return;
    }
    const step = state.availability.slotMinutes || 30;
    const blocked = state.availability.blockedSlots[d] || [];
    const cells = [];
    for (let t = LunaData.toMinutes(hours.from); t < LunaData.toMinutes(hours.to); t += step) {
      const label = LunaData.fromMinutes(t);
      const isB = blocked.includes(label);
      cells.push(`<button class="chip ${isB ? 'active' : ''}" data-slot="${label}" style="${isB ? 'background:var(--red);border-color:var(--red);' : ''}">${LunaData.fmtTime(label)}</button>`);
    }
    $('slotPicker').innerHTML = cells.join('') || '<span class="small text-soft">No slots.</span>';

    $('slotPicker').querySelectorAll('[data-slot]').forEach(b => b.addEventListener('click', () => {
      state = LunaData.loadState();
      const dd = $('slotDate').value;
      state.availability.blockedSlots[dd] = state.availability.blockedSlots[dd] || [];
      const lbl = b.dataset.slot;
      if (state.availability.blockedSlots[dd].includes(lbl)) {
        state.availability.blockedSlots[dd] = state.availability.blockedSlots[dd].filter(x => x !== lbl);
        LunaUI.toast(`${LunaData.fmtTime(lbl)} reopened on ${LunaData.fmtDateShort(dd)}.`, 'ok');
      } else {
        state.availability.blockedSlots[dd].push(lbl);
        LunaUI.toast(`${LunaData.fmtTime(lbl)} blocked on ${LunaData.fmtDateShort(dd)}.`, 'warn');
      }
      LunaData.saveState(state);
      drawSlotPicker();
    }));

    const list = state.availability.blockedSlots[d] || [];
    $('blockedSlotsList').innerHTML = list.length ? `
      <div class="small text-soft mb-0" style="margin-bottom:8px;">Blocked on ${LunaData.fmtDateShort(d)}:</div>
      <div class="chips-board">${list.slice().sort().map(s => `
        <span class="slot-block-chip">${LunaData.fmtTime(s)}<button data-rm="${s}">✕</button></span>`).join('')}</div>` : '';
    $('blockedSlotsList').querySelectorAll('[data-rm]').forEach(b => b.addEventListener('click', () => {
      state = LunaData.loadState();
      state.availability.blockedSlots[d] = (state.availability.blockedSlots[d] || []).filter(x => x !== b.dataset.rm);
      LunaData.saveState(state);
      drawSlotPicker();
    }));
  }
  $('slotDate').addEventListener('change', drawSlotPicker);
  drawSlotPicker();
}

/* ---------- SETTINGS ---------- */
function renderSettings() {
  state = LunaData.loadState();
  const s = state.settings;

  $('adminContent').innerHTML = `
    <div class="settings-grid">
      <div>
        <div class="panel">
          <div class="panel-head"><h3>Business Information</h3></div>
          <div class="panel-body">
            <div class="form-grid">
              <div class="field full"><label>Business Name</label><input id="setName" value="${esc(s.businessName)}"></div>
              <div class="field full"><label>Tagline</label><input id="setTagline" value="${esc(s.tagline)}"></div>
              <div class="field"><label>Mobile</label><input id="setMobile" value="${esc(s.mobile)}"></div>
              <div class="field"><label>Landline</label><input id="setLandline" value="${esc(s.landline)}"></div>
              <div class="field full"><label>Email</label><input id="setEmail" value="${esc(s.email)}"></div>
              <div class="field full"><label>Address</label><textarea id="setAddress">${esc(s.address)}</textarea></div>
            </div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-head"><h3>Basic Booking Policy</h3></div>
          <div class="panel-body">
            <div class="field"><label>Policy text shown to customers</label><textarea id="setPolicy" style="min-height:130px;">${esc(s.policy)}</textarea></div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-body">
            <button class="btn btn-primary" id="saveSettings">Save Settings</button>
          </div>
        </div>
      </div>

      <div>
        <div class="panel">
          <div class="panel-head"><h3>Social Links</h3></div>
          <div class="panel-body">
            <div class="field mb-2"><label>Facebook</label><input id="setFb" value="${esc(s.facebook)}"></div>
            <div class="field mb-2"><label>Instagram</label><input id="setIg" value="${esc(s.instagram)}"></div>
            <div class="field"><label>TikTok</label><input id="setTt" value="${esc(s.tiktok)}"></div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-head"><h3>Business Hours</h3><span class="ph-sub">Edit in Availability</span></div>
          <div class="panel-body">
            <ul class="hours-list">${s.hours.map(h => `
              <li class="${!h.open ? 'closed' : ''}"><span class="day">${h.day}</span>
              <span class="time">${h.open ? LunaData.fmtTime(h.from) + ' – ' + LunaData.fmtTime(h.to) : 'Closed'}</span></li>`).join('')}
            </ul>
            <button class="btn btn-soft btn-block mt-2" data-goto="availability">Manage Hours →</button>
          </div>
        </div>

        <div class="panel">
          <div class="panel-head"><h3>Demo Data</h3></div>
          <div class="panel-body">
            <p class="small text-soft">Restore all bookings, services, availability, and settings to the original sample data. Any demo bookings you created will be removed.</p>
            <button class="btn btn-ghost btn-block" id="resetDemoBtn2">↺ Reset Demo Data</button>
          </div>
        </div>

        <div class="panel">
          <div class="panel-head"><h3>Package Scope</h3></div>
          <div class="panel-body">
            <p class="small text-soft" style="margin:0 0 10px;"><strong>Included in the ₱7,999 Standard package:</strong> customer website, online booking with variations &amp; add-ons, booking references, four statuses, admin dashboard, booking management, service management, availability management, and basic settings.</p>
            <p class="small text-soft" style="margin:0;"><strong>Not included</strong> (Custom quotation): payment gateways, memberships, loyalty points, subscriptions, staff calendars, multi-branch management, automated SMS, advanced analytics, and custom roles.</p>
          </div>
        </div>
      </div>
    </div>`;

  document.querySelectorAll('[data-goto]').forEach(b => b.addEventListener('click', () => go(b.dataset.goto)));
  $('resetDemoBtn2').addEventListener('click', () => openModal('resetModal'));

  $('saveSettings').addEventListener('click', () => {
    state = LunaData.loadState();
    const name = $('setName').value.trim() || state.settings.businessName;
    state.settings.businessName = name;
    state.settings.tagline = $('setTagline').value.trim();
    state.settings.mobile = $('setMobile').value.trim();
    state.settings.landline = $('setLandline').value.trim();
    state.settings.email = $('setEmail').value.trim();
    state.settings.address = $('setAddress').value.trim();
    state.settings.policy = $('setPolicy').value.trim();
    state.settings.facebook = $('setFb').value.trim();
    state.settings.instagram = $('setIg').value.trim();
    state.settings.tiktok = $('setTt').value.trim();
    LunaData.saveState(state);
    renderChrome();
    LunaUI.toast('Business settings saved.', 'ok');
  });
}

/* ---------- Reset demo ---------- */
$('resetModal')?.addEventListener('click', e => {});
function confirmReset() {
  LunaData.resetState(true);
  state = LunaData.loadState();
  closeModal('resetModal');
  renderChrome();
  LunaUI.toast('Demo data reset to the original sample set.', 'ok');
  go(currentPage);
}
document.addEventListener('click', e => {
  if (e.target.id === 'doReset') confirmReset();
});

/* ---------- Start ---------- */
document.addEventListener('DOMContentLoaded', boot);
