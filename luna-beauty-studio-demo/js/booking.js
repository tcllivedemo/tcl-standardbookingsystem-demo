/* ============================================================
   Luna Beauty Studio — Booking Flow (9 steps)
   ============================================================ */

const state = LunaData.loadState();
const $ = id => document.getElementById(id);

let step = 1;
let calMonth = new Date();
calMonth.setDate(1);

const draft = {
  serviceId: null,
  variationId: null,
  addonIds: [],
  date: null,
  time: null,
  name: '', email: '', mobile: '', notes: ''
};

const STEPS = [
  { n: 1, label: 'Service' },
  { n: 2, label: 'Variation' },
  { n: 3, label: 'Add-ons' },
  { n: 4, label: 'Date' },
  { n: 5, label: 'Time' },
  { n: 6, label: 'Details' },
  { n: 7, label: 'Review' }
];

/* ---------- Pricing ---------- */
function currentVariation() {
  const s = getDraftService();
  if (!s) return null;
  if (!s.variations || !s.variations.length) return null;
  return s.variations.find(v => v.id === draft.variationId) || null;
}
function getDraftService() {
  return state.services.find(s => s.id === draft.serviceId) || null;
}
function currentAddons() {
  const s = getDraftService();
  if (!s) return [];
  return (s.addons || []).filter(a => draft.addonIds.includes(a.id));
}
function calcTotals() {
  const s = getDraftService();
  if (!s) return { price: 0, duration: 0 };
  const v = currentVariation();
  let price = v ? v.price : s.price;
  let duration = v ? v.duration : s.duration;
  currentAddons().forEach(a => { price += a.price; duration += a.duration || 0; });
  return { price, duration };
}

/* ---------- Stepper ---------- */
function renderStepper() {
  const el = $('stepper');
  const effective = step > 7 ? 7 : step;
  el.innerHTML = STEPS.map(st => {
    let cls = '';
    if (st.n < effective) cls = 'done';
    else if (st.n === effective) cls = 'active';
    const num = st.n < effective ? '✓' : st.n;
    return `<span class="step-dot ${cls}"><span class="num">${num}</span><span class="step-label">${st.label}</span></span>`;
  }).join('');
}

/* ---------- Summary bar ---------- */
function renderSummary() {
  const s = getDraftService();
  const bar = $('summaryBar');
  if (!s) { bar.classList.add('hide'); return; }
  bar.classList.remove('hide');
  const v = currentVariation();
  const t = calcTotals();
  const addonCount = currentAddons().length;
  bar.innerHTML = `
    <div class="sb-item"><b>Service</b>${s.icon} ${s.name}</div>
    ${v ? `<div class="sb-item"><b>Variation</b>${v.name}</div>` : ''}
    ${addonCount ? `<div class="sb-item"><b>Add-ons</b>${addonCount} selected</div>` : ''}
    ${draft.date ? `<div class="sb-item"><b>Date</b>${LunaData.fmtDateShort(draft.date)}</div>` : ''}
    ${draft.time ? `<div class="sb-item"><b>Time</b>${LunaData.fmtTime(draft.time)}</div>` : ''}
    <div class="sb-item"><b>Duration</b>${LunaData.fmtDuration(t.duration)}</div>
    <div class="sb-total">${LunaData.peso(t.price)}</div>`;
}

/* ---------- Router ---------- */
function go(n) {
  step = n;
  renderStepper();
  renderSummary();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  const renderers = {
    1: renderStepService,
    2: renderStepVariation,
    3: renderStepAddons,
    4: renderStepDate,
    5: renderStepTime,
    6: renderStepInfo,
    7: renderStepReview,
    9: renderStepConfirm
  };
  (renderers[n] || (() => {}))();
}

/* ---------- STEP 1 — Service ---------- */
function renderStepService() {
  const list = state.services.filter(s => s.active);
  $('bookBody').innerHTML = `
    <div class="book-head">
      <h2>Choose your service</h2>
      <p>Select the treatment you'd like. You can add a variation or add-on next.</p>
    </div>
    <div class="choice-grid">
      ${list.map(s => {
        const hasVar = s.variations && s.variations.length;
        const fromPrice = hasVar ? Math.min(...s.variations.map(v => v.price || s.price)) : s.price;
        return `<button class="choice ${draft.serviceId === s.id ? 'selected' : ''}" data-svc="${s.id}">
          <span class="tick">✓</span>
          <span class="c-ico">${s.icon}</span>
          <span class="c-main">
            <span class="c-name">${s.name}</span>
            <span class="c-desc">${s.tagline}</span>
            <span class="c-meta">
              <span class="c-price">${hasVar ? 'from ' + LunaData.peso(fromPrice) : LunaData.peso(s.price)}</span>
              <span>⏱️ ${LunaData.fmtDuration(s.duration)}</span>
              ${hasVar ? `<span>${s.variations.length} variations</span>` : ''}
            </span>
          </span>
        </button>`;
      }).join('')}
    </div>
    <div class="nav-row">
      <a class="btn btn-ghost" href="index.html">← Cancel</a>
      <button class="btn btn-primary" id="nextBtn" ${draft.serviceId ? '' : 'disabled'}>Continue</button>
    </div>`;

  document.querySelectorAll('[data-svc]').forEach(b => b.addEventListener('click', () => {
    const id = b.dataset.svc;
    if (draft.serviceId !== id) {
      draft.serviceId = id;
      draft.variationId = null;
      draft.addonIds = [];
      draft.time = null;
    }
    renderStepService(); renderSummary();
  }));
  $('nextBtn').addEventListener('click', () => {
    const s = getDraftService();
    if (s.variations && s.variations.length) go(2);
    else if (s.addons && s.addons.length) go(3);
    else go(4);
  });
}

/* ---------- STEP 2 — Variation ---------- */
function renderStepVariation() {
  const s = getDraftService();
  $('bookBody').innerHTML = `
    <div class="book-head">
      <h2>Choose a variation</h2>
      <p>${s.icon} <strong>${s.name}</strong> — pick the version you'd like. Prices and durations vary.</p>
    </div>
    <div class="choice-grid">
      ${s.variations.map(v => `
        <button class="choice ${draft.variationId === v.id ? 'selected' : ''}" data-var="${v.id}">
          <span class="tick">✓</span>
          <span class="c-ico">✦</span>
          <span class="c-main">
            <span class="c-name">${v.name}</span>
            <span class="c-desc">Duration ${LunaData.fmtDuration(v.duration)}</span>
            <span class="c-meta"><span class="c-price">${LunaData.peso(v.price)}</span></span>
          </span>
        </button>`).join('')}
    </div>
    <div class="nav-row">
      <button class="btn btn-ghost" id="backBtn">← Back</button>
      <button class="btn btn-primary" id="nextBtn" ${draft.variationId ? '' : 'disabled'}>Continue</button>
    </div>`;

  document.querySelectorAll('[data-var]').forEach(b => b.addEventListener('click', () => {
    draft.variationId = b.dataset.var;
    draft.time = null;
    renderStepVariation(); renderSummary();
  }));
  $('backBtn').addEventListener('click', () => go(1));
  $('nextBtn').addEventListener('click', () => {
    if (s.addons && s.addons.length) go(3); else go(4);
  });
}

/* ---------- STEP 3 — Add-ons ---------- */
function renderStepAddons() {
  const s = getDraftService();
  const addons = s.addons || [];
  $('bookBody').innerHTML = `
    <div class="book-head">
      <h2>Add anything extra?</h2>
      <p>Optional add-ons for <strong>${s.name}</strong>. Totals update as you choose — skip ahead if you don't need any.</p>
    </div>
    <div class="grid" style="gap:12px;">
      ${addons.map(a => `
        <label class="check-row ${draft.addonIds.includes(a.id) ? 'selected' : ''}" data-addon="${a.id}">
          <span class="check-box">✓</span>
          <span class="cr-main">
            <span class="cr-name">${a.name}</span>
            <span class="cr-meta">+${LunaData.fmtDuration(a.duration || 0)} added time</span>
          </span>
          <span class="cr-price">+${LunaData.peso(a.price)}</span>
        </label>`).join('')}
    </div>
    <div class="nav-row">
      <button class="btn btn-ghost" id="backBtn">← Back</button>
      <button class="btn btn-primary" id="nextBtn">Continue</button>
    </div>`;

  document.querySelectorAll('[data-addon]').forEach(row => row.addEventListener('click', e => {
    e.preventDefault();
    const id = row.dataset.addon;
    if (draft.addonIds.includes(id)) draft.addonIds = draft.addonIds.filter(x => x !== id);
    else draft.addonIds.push(id);
    draft.time = null;
    renderStepAddons(); renderSummary();
  }));
  $('backBtn').addEventListener('click', () => {
    if (s.variations && s.variations.length) go(2); else go(1);
  });
  $('nextBtn').addEventListener('click', () => go(4));
}

/* ---------- STEP 4 — Date ---------- */
function renderStepDate() {
  const t = calcTotals();
  const today = new Date(); today.setHours(0, 0, 0, 0);

  const y = calMonth.getFullYear(), m = calMonth.getMonth();
  const first = new Date(y, m, 1);
  const startDow = first.getDay();
  const daysIn = new Date(y, m + 1, 0).getDate();
  const monthLabel = calMonth.toLocaleDateString('en-PH', { month: 'long', year: 'numeric' });

  const atCurrentMonth = y === today.getFullYear() && m === today.getMonth();

  let cells = '';
  for (let i = 0; i < startDow; i++) cells += '<button class="cal-day empty" disabled></button>';
  for (let d = 1; d <= daysIn; d++) {
    const dt = new Date(y, m, d);
    const iso = LunaData.isoOf(dt);
    const isPast = dt < today;
    const hours = state.settings.hours.find(h => h.day === dt.toLocaleDateString('en-PH', { weekday: 'long' }));
    const closed = !hours || !hours.open;
    const blocked = state.availability.blockedDates.includes(iso);
    const avail = !isPast && !closed && !blocked ? LunaData.generateSlots(state, iso, t.duration) : { slots: [] };
    const noSlots = !isPast && !closed && !blocked && avail.slots.length === 0;
    const isToday = dt.getTime() === today.getTime();

    let cls = 'cal-day';
    let note = '';
    if (isPast) cls += ' disabled';
    else if (blocked) { cls += ' blocked'; note = '<span class="d-note">Blocked</span>'; }
    else if (closed) { cls += ' disabled'; note = '<span class="d-note">Closed</span>'; }
    else if (noSlots) { cls += ' disabled'; note = '<span class="d-note">Full</span>'; }
    if (draft.date === iso) cls += ' selected';
    if (isToday) cls += ' today';

    const disabled = isPast || closed || blocked || noSlots ? 'disabled' : '';
    cells += `<button class="${cls}" data-date="${iso}" ${disabled}>
      <span class="d-num">${d}</span>${note}</button>`;
  }

  $('bookBody').innerHTML = `
    <div class="book-head">
      <h2>Pick a date</h2>
      <p>Showing availability for <strong>${LunaData.fmtDuration(t.duration)}</strong>. Past dates, closed days, and fully booked days can't be selected.</p>
    </div>
    <div class="cal-head">
      <span class="cal-title">${monthLabel}</span>
      <div class="cal-nav">
        <button id="prevMonth" ${atCurrentMonth ? 'disabled' : ''} aria-label="Previous month">‹</button>
        <button id="nextMonth" aria-label="Next month">›</button>
      </div>
    </div>
    <div class="cal-dow">${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => `<span>${d}</span>`).join('')}</div>
    <div class="cal-grid">${cells}</div>
    <div class="cal-legend">
      <span><span class="legend-swatch" style="background:var(--rose);"></span> Selected</span>
      <span><span class="legend-swatch" style="background:var(--cream-2);"></span> Available</span>
      <span><span class="legend-swatch" style="background:var(--red-bg);border-color:#F1C6C1;"></span> Blocked by studio</span>
      <span><span class="legend-swatch" style="background:transparent;"></span> Closed / past</span>
    </div>
    <div class="nav-row">
      <button class="btn btn-ghost" id="backBtn">← Back</button>
      <button class="btn btn-primary" id="nextBtn" ${draft.date ? '' : 'disabled'}>Continue</button>
    </div>`;

  document.querySelectorAll('[data-date]:not([disabled])').forEach(b => b.addEventListener('click', () => {
    draft.date = b.dataset.date;
    draft.time = null;
    renderStepDate(); renderSummary();
  }));
  $('prevMonth').addEventListener('click', () => { calMonth.setMonth(calMonth.getMonth() - 1); renderStepDate(); });
  $('nextMonth').addEventListener('click', () => { calMonth.setMonth(calMonth.getMonth() + 1); renderStepDate(); });
  $('backBtn').addEventListener('click', () => {
    const s = getDraftService();
    if (s.addons && s.addons.length) go(3);
    else if (s.variations && s.variations.length) go(2);
    else go(1);
  });
  $('nextBtn').addEventListener('click', () => go(5));
}

/* ---------- STEP 5 — Time ---------- */
function renderStepTime() {
  const t = calcTotals();
  const { slots, reason } = LunaData.generateSlots(state, draft.date, t.duration);
  const taken = LunaData.bookedSlotsFor(state, draft.date, t.duration);

  let body;
  if (reason === 'closed') body = `<div class="empty-state"><div class="es-ico">🚪</div><b>Studio is closed</b>Please choose another date.</div>`;
  else if (reason === 'blocked') body = `<div class="empty-state"><div class="es-ico">🚫</div><b>This date is blocked</b>The studio is unavailable on this day. Please pick another date.</div>`;
  else if (!slots.length) body = `<div class="empty-state"><div class="es-ico">😔</div><b>No slots left</b>Everything on this date is booked. Try a different day.</div>`;
  else {
    body = `<div class="slot-grid">${slots.map(s => {
      const isTaken = taken.has(s);
      return `<button class="slot ${isTaken ? 'taken' : ''} ${draft.time === s ? 'selected' : ''}" data-slot="${s}" ${isTaken ? 'disabled' : ''}>
        ${LunaData.fmtTime(s)}${isTaken ? '<span class="s-note">Booked</span>' : ''}</button>`;
    }).join('')}</div>
    <p class="slot-tip">💡 Greyed slots are already booked or held. Your appointment runs for <strong>${LunaData.fmtDuration(t.duration)}</strong> from your chosen start time.</p>`;
  }

  $('bookBody').innerHTML = `
    <div class="book-head">
      <h2>Choose a time</h2>
      <p>${LunaData.dayName(draft.date)}, ${LunaData.fmtDate(draft.date)} · ${LunaData.fmtDuration(t.duration)} appointment</p>
    </div>
    ${body}
    <div class="nav-row">
      <button class="btn btn-ghost" id="backBtn">← Change date</button>
      <button class="btn btn-primary" id="nextBtn" ${draft.time ? '' : 'disabled'}>Continue</button>
    </div>`;

  document.querySelectorAll('[data-slot]:not([disabled])').forEach(b => b.addEventListener('click', () => {
    draft.time = b.dataset.slot;
    renderStepTime(); renderSummary();
  }));
  $('backBtn').addEventListener('click', () => go(4));
  $('nextBtn').addEventListener('click', () => go(6));
}

/* ---------- STEP 6 — Customer info ---------- */
function renderStepInfo() {
  $('bookBody').innerHTML = `
    <div class="book-head">
      <h2>Your details</h2>
      <p>We'll use these to confirm your appointment. Fields marked <span style="color:var(--rose)">*</span> are required.</p>
    </div>
    <div class="form-grid">
      <div class="field full" id="f-name">
        <label for="inName">Full Name <span class="req">*</span></label>
        <input id="inName" type="text" placeholder="e.g. Maria Santos" value="${escapeAttr(draft.name)}" autocomplete="name">
        <span class="err">Please enter your full name.</span>
      </div>
      <div class="field" id="f-email">
        <label for="inEmail">Email Address <span class="req">*</span></label>
        <input id="inEmail" type="email" placeholder="you@email.com" value="${escapeAttr(draft.email)}" autocomplete="email">
        <span class="err">Please enter a valid email address.</span>
      </div>
      <div class="field" id="f-mobile">
        <label for="inMobile">Mobile Number <span class="req">*</span></label>
        <input id="inMobile" type="tel" placeholder="0917 123 4567" value="${escapeAttr(draft.mobile)}" autocomplete="tel">
        <span class="err">Please enter your mobile number (10–13 digits).</span>
      </div>
      <div class="field full" id="f-notes">
        <label for="inNotes">Notes <span style="color:var(--ink-faint);font-weight:500;">(optional)</span></label>
        <textarea id="inNotes" placeholder="Anything we should know? Preferred shade, allergies, a special occasion...">${escapeText(draft.notes)}</textarea>
        <span class="hint">Shared with the studio only. Max 400 characters.</span>
      </div>
    </div>
    <div class="nav-row">
      <button class="btn btn-ghost" id="backBtn">← Back</button>
      <button class="btn btn-primary" id="nextBtn">Review Booking</button>
    </div>`;

  $('backBtn').addEventListener('click', () => go(5));
  $('nextBtn').addEventListener('click', () => {
    const name = $('inName').value.trim();
    const email = $('inEmail').value.trim();
    const mobile = $('inMobile').value.trim();
    const notes = $('inNotes').value.trim().slice(0, 400);

    let ok = true;
    setInvalid('f-name', !name); if (!name) ok = false;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setInvalid('f-email', !emailOk); if (!emailOk) ok = false;
    const digits = mobile.replace(/\D/g, '');
    const mobileOk = digits.length >= 10 && digits.length <= 13;
    setInvalid('f-mobile', !mobileOk); if (!mobileOk) ok = false;

    if (!ok) {
      LunaUI.toast('Please check the highlighted fields.', 'bad');
      document.querySelector('.field.invalid')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    draft.name = name; draft.email = email; draft.mobile = mobile; draft.notes = notes;
    go(7);
  });
}
function setInvalid(id, isInvalid) { $(id).classList.toggle('invalid', isInvalid); }
function escapeAttr(s) { return String(s || '').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }
function escapeText(s) { return String(s || '').replace(/</g, '&lt;'); }

/* ---------- STEP 7 — Review ---------- */
function renderStepReview() {
  const s = getDraftService();
  const v = currentVariation();
  const addons = currentAddons();
  const t = calcTotals();

  $('bookBody').innerHTML = `
    <div class="book-head">
      <h2>Review your booking</h2>
      <p>Please check everything below before submitting. You'll receive a booking reference next.</p>
    </div>
    <div class="review-grid">
      <div class="review-block">
        <div class="rb-head">Appointment <span style="color:var(--rose);">${s.category}</span></div>
        <div class="rb-body">
          <div class="rb-row"><span class="k">Service</span><span class="v">${s.icon} ${s.name}</span></div>
          ${v ? `<div class="rb-row"><span class="k">Variation</span><span class="v">${v.name}</span></div>` : ''}
          <div class="rb-row"><span class="k">Add-ons</span><span class="v">${addons.length ? addons.map(a => a.name).join(', ') : 'None'}</span></div>
          <div class="rb-row"><span class="k">Date</span><span class="v">${LunaData.dayName(draft.date)}, ${LunaData.fmtDate(draft.date)}</span></div>
          <div class="rb-row"><span class="k">Time</span><span class="v">${LunaData.fmtTime(draft.time)}</span></div>
          <div class="rb-row"><span class="k">Duration</span><span class="v">${LunaData.fmtDuration(t.duration)}</span></div>
          <div class="rb-row total"><span class="k" style="font-weight:600;color:var(--ink);">Total</span><span class="v">${LunaData.peso(t.price)}</span></div>
        </div>
      </div>
      <div class="review-block">
        <div class="rb-head">Your Details</div>
        <div class="rb-body">
          <div class="rb-row"><span class="k">Name</span><span class="v">${escapeText(draft.name)}</span></div>
          <div class="rb-row"><span class="k">Email</span><span class="v" style="word-break:break-all;">${escapeText(draft.email)}</span></div>
          <div class="rb-row"><span class="k">Mobile</span><span class="v">${escapeText(draft.mobile)}</span></div>
          <div class="rb-row"><span class="k">Notes</span><span class="v" style="font-weight:500;">${draft.notes ? escapeText(draft.notes) : '—'}</span></div>
        </div>
      </div>
    </div>
    <div class="demo-note">
      <span class="dn-ico">🧪</span>
      <span><strong>Demo booking.</strong> Submitting will add this appointment to the Demo Admin's bookings list. No real business is contacted and no payment is taken.</span>
    </div>
    <div class="nav-row">
      <button class="btn btn-ghost" id="backBtn">← Edit details</button>
      <button class="btn btn-primary" id="submitBtn">Submit Booking</button>
    </div>`;

  $('backBtn').addEventListener('click', () => go(6));
  $('submitBtn').addEventListener('click', submitBooking);
}

/* ---------- STEP 8 — Submit ---------- */
function submitBooking() {
  const s = getDraftService();
  const v = currentVariation();
  const addons = currentAddons();
  const t = calcTotals();

  const fresh = LunaData.loadState();
  const ref = LunaData.nextRef(fresh);
  const booking = {
    ref,
    createdAt: LunaData.todayISO(0),
    serviceId: s.id,
    serviceName: s.name,
    variationName: v ? v.name : 'Standard',
    addons: addons.map(a => ({ name: a.name, price: a.price })),
    date: draft.date,
    time: draft.time,
    duration: t.duration,
    total: t.price,
    name: draft.name,
    email: draft.email,
    mobile: draft.mobile,
    notes: draft.notes,
    status: 'Pending'
  };
  fresh.bookings.push(booking);
  LunaData.saveState(fresh);
  window.__lastRef = ref;
  go(9);
}

/* ---------- STEP 9 — Confirmation ---------- */
function renderStepConfirm() {
  const fresh = LunaData.loadState();
  const b = fresh.bookings.find(x => x.ref === window.__lastRef) || fresh.bookings[fresh.bookings.length - 1];
  const s = fresh.services.find(x => x.id === b.serviceId);
  const meta = LunaData.STATUS_META[b.status] || { cls: 'badge-pending', icon: '⏳' };

  $('stepper').classList.add('hide');
  $('summaryBar').classList.add('hide');

  $('bookBody').innerHTML = `
    <div class="confirm-wrap">
      <div class="confirm-icon">✓</div>
      <h2 style="margin-bottom:.15em;">Booking request received!</h2>
      <p class="text-soft" style="max-width:52ch;margin:0 auto 20px;">
        Thank you, ${escapeText(b.name.split(' ')[0] || b.name)}. Your appointment request has been sent to
        ${fresh.settings.businessName}. We'll confirm it shortly.
      </p>

      <div class="ref-pill">
        <small>Booking Reference</small>
        <b>${b.ref}</b>
      </div>

      <div style="margin-bottom:22px;">
        <span class="badge ${meta.cls}">${meta.icon} ${b.status}</span>
      </div>

      <div class="rb-body" style="border:1px solid var(--line);border-radius:var(--radius);text-align:left;">
        <div class="rb-row"><span class="k">Service</span><span class="v">${s ? s.icon : '✨'} ${b.serviceName}</span></div>
        <div class="rb-row"><span class="k">Variation</span><span class="v">${b.variationName}</span></div>
        <div class="rb-row"><span class="k">Add-ons</span><span class="v">${b.addons.length ? b.addons.map(a => a.name).join(', ') : 'None'}</span></div>
        <div class="rb-row"><span class="k">Date</span><span class="v">${LunaData.dayName(b.date)}, ${LunaData.fmtDate(b.date)}</span></div>
        <div class="rb-row"><span class="k">Time</span><span class="v">${LunaData.fmtTime(b.time)} · ${LunaData.fmtDuration(b.duration)}</span></div>
        <div class="rb-row"><span class="k">Name</span><span class="v">${escapeText(b.name)}</span></div>
        <div class="rb-row"><span class="k">Email</span><span class="v" style="word-break:break-all;">${escapeText(b.email)}</span></div>
        <div class="rb-row"><span class="k">Mobile</span><span class="v">${escapeText(b.mobile)}</span></div>
        ${b.notes ? `<div class="rb-row"><span class="k">Notes</span><span class="v" style="font-weight:500;">${escapeText(b.notes)}</span></div>` : ''}
        <div class="rb-row total"><span class="k" style="font-weight:600;color:var(--ink);">Total</span><span class="v">${LunaData.peso(b.total)}</span></div>
      </div>

      <div class="demo-note" style="text-align:left;">
        <span class="dn-ico">📌</span>
        <span><strong>What happens next:</strong> the studio reviews your request and confirms it — you'll get a message on the mobile number or email you provided. Your booking is currently <strong>Pending</strong>. No payment is taken online in this package.</span>
      </div>

      <div class="demo-note" style="text-align:left;background:var(--blue-bg);border-color:#C9DBF0;color:var(--blue);">
        <span class="dn-ico">🧪</span>
        <span><strong>This is a demo booking.</strong> Open the Demo Admin to see this appointment appear as Pending — then try Confirming, Completing, or Canceling it.</span>
      </div>

      <div class="flex center-x gap-1 wrap-flex mt-3" style="justify-content:center;">
        <a class="btn btn-primary" href="admin-login.html?ref=${b.ref}">View in Demo Admin →</a>
        <a class="btn btn-ghost" href="booking.html" onclick="location.reload();return false;">Book Another</a>
      </div>
      <p class="small text-soft mt-2">Or <a href="index.html">return to the website</a>. Keep your reference <strong>${b.ref}</strong> handy.</p>
    </div>`;
}

/* ---------- Boot ---------- */
(function boot() {
  // Pre-select service from ?service=
  const params = new URLSearchParams(location.search);
  const pre = params.get('service');
  if (pre && state.services.some(s => s.id === pre && s.active)) {
    draft.serviceId = pre;
    const s = state.services.find(x => x.id === pre);
    if (s.variations && s.variations.length === 1) draft.variationId = s.variations[0].id;
  }
  go(1);
})();
