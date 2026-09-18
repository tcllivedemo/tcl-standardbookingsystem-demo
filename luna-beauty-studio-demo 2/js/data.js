/* ============================================================
   Luna Beauty Studio — Demo Data Layer
   Demo only. No real transactions. Stored in localStorage.
   ============================================================ */

const LS_KEY = 'luna_demo_state_v1';

const DEFAULT_SERVICES = [
  {
    id: 'svc-manicure-classic',
    name: 'Classic Manicure',
    tagline: 'Clean, shaped, and polished to perfection.',
    description:
      'A timeless nail care ritual — cuticle care, gentle shaping, buffing, hand massage, and a flawless classic polish finish in the shade of your choice.',
    price: 350,
    duration: 45,
    icon: '💅',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=80',
    category: 'Nails',
    variations: [],
    addons: [
      { id: 'ao-1', name: 'French Tip Finish', price: 120, duration: 15 },
      { id: 'ao-2', name: 'Paraffin Hand Treatment', price: 180, duration: 20 },
      { id: 'ao-3', name: 'Gel Top Coat Seal', price: 150, duration: 15 }
    ],
    active: true
  },
  {
    id: 'svc-manicure-gel',
    name: 'Gel Manicure',
    tagline: 'Glossy, chip-resistant colour that lasts.',
    description:
      'Everything in our classic manicure, finished with a cured gel polish system for a high-shine, long-wearing result — up to three weeks of wear.',
    price: 650,
    duration: 60,
    icon: '✨',
    image: 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=900&q=80',
    category: 'Nails',
    variations: [
      { id: 'v-1', name: 'Solid Colour', price: 650, duration: 60 },
      { id: 'v-2', name: 'Chrome / Cat-Eye Finish', price: 780, duration: 70 },
      { id: 'v-3', name: 'French Gel', price: 750, duration: 70 }
    ],
    addons: [
      { id: 'ao-4', name: 'Nail Repair (per nail)', price: 50, duration: 5 },
      { id: 'ao-5', name: 'Cuticle Oil Care Set', price: 90, duration: 5 },
      { id: 'ao-6', name: 'Extra Length Shaping', price: 150, duration: 15 }
    ],
    active: true
  },
  {
    id: 'svc-lash-classic',
    name: 'Classic Lash Extensions',
    tagline: 'Soft, natural, one-to-one lash elegance.',
    description:
      'A single classic extension applied to each natural lash for a soft, fluttery, effortlessly awake look. Includes lash mapping and a gentle aftercare brief.',
    price: 899,
    duration: 90,
    icon: '👁️',
    image: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&w=900&q=80',
    category: 'Lashes',
    variations: [
      { id: 'v-4', name: 'Natural Volume', price: 899, duration: 90 },
      { id: 'v-5', name: 'Doll Eye Mapping', price: 999, duration: 100 },
      { id: 'v-6', name: 'Hybrid Set', price: 1150, duration: 110 }
    ],
    addons: [
      { id: 'ao-7', name: 'Lash Tint', price: 250, duration: 20 },
      { id: 'ao-8', name: 'Under-Eye Hydrogel Patch', price: 120, duration: 10 }
    ],
    active: true
  },
  {
    id: 'svc-brow-styling',
    name: 'Brow Styling',
    tagline: 'Framed, filled, and flattering.',
    description:
      'Expert brow mapping to suit your face shape, gentle shaping, trimming, and a tint to fill in sparse areas — a clean, defined arch that lasts for weeks.',
    price: 450,
    duration: 45,
    icon: '🌙',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=80',
    category: 'Brows',
    variations: [
      { id: 'v-7', name: 'Shape & Wax', price: 450, duration: 45 },
      { id: 'v-8', name: 'Shape + Tint', price: 620, duration: 55 },
      { id: 'v-9', name: 'Brow Lamination', price: 850, duration: 70 }
    ],
    addons: [
      { id: 'ao-9', name: 'Brow Henna Finish', price: 200, duration: 15 },
      { id: 'ao-10', name: 'Serum Aftercare Roll-On', price: 150, duration: 5 }
    ],
    active: true
  },
  {
    id: 'svc-nail-art',
    name: 'Signature Nail Art',
    tagline: 'Hand-painted detail, made only for you.',
    description:
      'Our signature artist-led set — hand-painted accents, minimalist line work, florals, or chrome detailing designed around your chosen concept. Gel base included.',
    price: 850,
    duration: 90,
    icon: '🎨',
    image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=900&q=80',
    category: 'Nails',
    variations: [
      { id: 'v-10', name: 'Minimal Line Art', price: 850, duration: 90 },
      { id: 'v-11', name: 'Floral / Botanical Set', price: 980, duration: 100 },
      { id: 'v-12', name: 'Chrome & Marble Luxe', price: 1100, duration: 110 }
    ],
    addons: [
      { id: 'ao-11', name: '3D Pearl Accent (per nail)', price: 60, duration: 5 },
      { id: 'ao-12', name: 'Swatch Consultation', price: 100, duration: 10 }
    ],
    active: true
  },
  {
    id: 'svc-facial',
    name: 'Glow Facial',
    tagline: 'A reset for tired, dull skin.',
    description:
      'A 60-minute deep cleanse, gentle exfoliation, extraction, and a calming hydration mask — finished with SPF. Ideal before an event.',
    price: 1200,
    duration: 75,
    icon: '🌿',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=80',
    category: 'Skin',
    variations: [
      { id: 'v-13', name: 'Hydrating Glow', price: 1200, duration: 75 },
      { id: 'v-14', name: 'Brightening Vitamin C', price: 1350, duration: 80 }
    ],
    addons: [
      { id: 'ao-13', name: 'LED Light Therapy', price: 300, duration: 20 },
      { id: 'ao-14', name: 'Collagen Eye Mask', price: 180, duration: 15 }
    ],
    active: true
  }
];

function todayISO(offsetDays = 0) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offsetDays);
  return isoOf(d);
}
function isoOf(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

function defaultBookings() {
  return [
    {
      ref: 'LBS-2481', createdAt: todayISO(-4),
      serviceId: 'svc-manicure-gel', serviceName: 'Gel Manicure',
      variationName: 'Chrome / Cat-Eye Finish',
      addons: [{ name: 'Cuticle Oil Care Set', price: 90 }],
      date: todayISO(0), time: '09:30', duration: 75, total: 870,
      name: 'Andrea Villanueva', email: 'andrea.villanueva@example.com',
      mobile: '0917 442 8890', notes: 'Please keep the chrome subtle po.',
      status: 'Confirmed'
    },
    {
      ref: 'LBS-2482', createdAt: todayISO(-3),
      serviceId: 'svc-lash-classic', serviceName: 'Classic Lash Extensions',
      variationName: 'Doll Eye Mapping', addons: [],
      date: todayISO(0), time: '11:00', duration: 100, total: 999,
      name: 'Kimberly Santos', email: 'kimberly.santos@example.com',
      mobile: '0928 771 0041', notes: 'First time getting lashes.',
      status: 'Pending'
    },
    {
      ref: 'LBS-2483', createdAt: todayISO(-3),
      serviceId: 'svc-brow-styling', serviceName: 'Brow Styling',
      variationName: 'Shape + Tint', addons: [{ name: 'Brow Henna Finish', price: 200 }],
      date: todayISO(0), time: '14:00', duration: 70, total: 820,
      name: 'Patricia Lim', email: 'patricia.lim@example.com',
      mobile: '0906 218 7712', notes: '',
      status: 'Confirmed'
    },
    {
      ref: 'LBS-2484', createdAt: todayISO(-2),
      serviceId: 'svc-nail-art', serviceName: 'Signature Nail Art',
      variationName: 'Floral / Botanical Set',
      addons: [
        { name: '3D Pearl Accent (per nail)', price: 60 },
        { name: 'Swatch Consultation', price: 100 }
      ],
      date: todayISO(1), time: '10:00', duration: 115, total: 1140,
      name: 'Joanna Reyes', email: 'joanna.reyes@example.com',
      mobile: '0995 330 1188', notes: 'Bridal shower — soft florals please.',
      status: 'Confirmed'
    },
    {
      ref: 'LBS-2485', createdAt: todayISO(-2),
      serviceId: 'svc-facial', serviceName: 'Glow Facial',
      variationName: 'Brightening Vitamin C',
      addons: [{ name: 'LED Light Therapy', price: 300 }],
      date: todayISO(2), time: '13:30', duration: 100, total: 1650,
      name: 'Michelle Tan', email: 'michelle.tan@example.com',
      mobile: '0917 900 2255', notes: '',
      status: 'Pending'
    },
    {
      ref: 'LBS-2476', createdAt: todayISO(-9),
      serviceId: 'svc-manicure-classic', serviceName: 'Classic Manicure',
      variationName: 'Standard', addons: [{ name: 'French Tip Finish', price: 120 }],
      date: todayISO(-6), time: '15:00', duration: 60, total: 470,
      name: 'Grace Aquino', email: 'grace.aquino@example.com',
      mobile: '0939 112 6677', notes: '',
      status: 'Completed'
    },
    {
      ref: 'LBS-2477', createdAt: todayISO(-8),
      serviceId: 'svc-manicure-gel', serviceName: 'Gel Manicure',
      variationName: 'French Gel', addons: [],
      date: todayISO(-5), time: '09:00', duration: 70, total: 750,
      name: 'Hannah Cruz', email: 'hannah.cruz@example.com',
      mobile: '0918 445 3321', notes: '',
      status: 'Completed'
    },
    {
      ref: 'LBS-2478', createdAt: todayISO(-7),
      serviceId: 'svc-brow-styling', serviceName: 'Brow Styling',
      variationName: 'Shape & Wax', addons: [],
      date: todayISO(-4), time: '16:30', duration: 45, total: 450,
      name: 'Rica Domingo', email: 'rica.domingo@example.com',
      mobile: '0977 663 9008', notes: 'Rescheduling next month.',
      status: 'Canceled'
    },
    {
      ref: 'LBS-2479', createdAt: todayISO(-5),
      serviceId: 'svc-lash-classic', serviceName: 'Classic Lash Extensions',
      variationName: 'Hybrid Set', addons: [{ name: 'Lash Tint', price: 250 }],
      date: todayISO(-2), time: '11:30', duration: 130, total: 1400,
      name: 'Alyssa Bautista', email: 'alyssa.bautista@example.com',
      mobile: '0920 887 1143', notes: '',
      status: 'Completed'
    },
    {
      ref: 'LBS-2480', createdAt: todayISO(-1),
      serviceId: 'svc-nail-art', serviceName: 'Signature Nail Art',
      variationName: 'Minimal Line Art', addons: [],
      date: todayISO(3), time: '15:30', duration: 90, total: 850,
      name: 'Trisha Gomez', email: 'trisha.gomez@example.com',
      mobile: '0947 220 5566', notes: '',
      status: 'Pending'
    }
  ];
}

const DEFAULT_SETTINGS = {
  businessName: 'Luna Beauty Studio',
  tagline: 'Nails · Lashes · Brows · Skin',
  mobile: '0917 555 8899',
  landline: '(02) 8555 2211',
  email: 'hello@lunabeautystudio.ph',
  address: 'Unit 4B, Verde Commercial Center, 128 Katipunan Avenue, Quezon City, Metro Manila 1108',
  facebook: 'https://facebook.com/lunabeautystudio.ph',
  instagram: 'https://instagram.com/lunabeautystudio.ph',
  tiktok: 'https://tiktok.com/@lunabeautystudio.ph',
  policy:
    'A 15-minute grace period is given for late arrivals. Bookings not confirmed by the studio within 24 hours may be released. Please give at least 12 hours notice to reschedule or cancel. Walk-ins are accommodated based on availability.',
  hours: [
    { day: 'Monday', open: true, from: '10:00', to: '19:00' },
    { day: 'Tuesday', open: true, from: '10:00', to: '19:00' },
    { day: 'Wednesday', open: true, from: '10:00', to: '19:00' },
    { day: 'Thursday', open: true, from: '10:00', to: '19:00' },
    { day: 'Friday', open: true, from: '10:00', to: '20:00' },
    { day: 'Saturday', open: true, from: '09:00', to: '20:00' },
    { day: 'Sunday', open: false, from: '10:00', to: '18:00' }
  ]
};

const DEFAULT_AVAILABILITY = {
  slotMinutes: 30,
  blockedDates: [todayISO(4)],
  blockedDatesNote: { [todayISO(4)]: 'Team training day' },
  blockedSlots: {
    [todayISO(0)]: ['13:00', '13:30'],
    [todayISO(1)]: ['09:00', '09:30', '16:00']
  }
};

/* ---------- State ---------- */
function clone(o) { return JSON.parse(JSON.stringify(o)); }

function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      if (s && s.services && s.bookings && s.settings) return s;
    }
  } catch (e) { /* corrupted — fall through to defaults */ }
  return resetState(false);
}

function resetState(persist = true) {
  const state = {
    services: clone(DEFAULT_SERVICES),
    bookings: defaultBookings(),
    settings: clone(DEFAULT_SETTINGS),
    availability: clone(DEFAULT_AVAILABILITY),
    version: 1
  };
  if (persist) localStorage.setItem(LS_KEY, JSON.stringify(state));
  return state;
}

function saveState(state) {
  state.version = 1;
  localStorage.setItem(LS_KEY, JSON.stringify(state));
  return state;
}

function nextRef(state) {
  const nums = state.bookings
    .map(b => parseInt(String(b.ref).replace(/\D/g, ''), 10))
    .filter(n => !isNaN(n));
  const max = nums.length ? Math.max(...nums) : 2480;
  return 'LBS-' + (max + 1);
}

const STATUS_META = {
  Pending:   { cls: 'badge-pending',   icon: '⏳' },
  Confirmed: { cls: 'badge-confirmed', icon: '✅' },
  Canceled:  { cls: 'badge-canceled',  icon: '✕' },
  Completed: { cls: 'badge-completed', icon: '★' }
};

/* ---------- Utilities ---------- */
function peso(n) {
  return '₱' + Number(n || 0).toLocaleString('en-PH');
}
function fmtDate(iso, opts) {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString('en-PH', opts || { month: 'long', day: 'numeric', year: 'numeric' });
}
function fmtDateShort(iso) {
  return fmtDate(iso, { month: 'short', day: 'numeric', year: 'numeric' });
}
function fmtTime(t) {
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:${String(m).padStart(2, '0')} ${ampm}`;
}
function fmtDuration(min) {
  if (min < 60) return min + ' min';
  const h = Math.floor(min / 60), r = min % 60;
  return r ? `${h} hr ${r} min` : `${h} hr${h > 1 ? 's' : ''}`;
}
function dayName(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-PH', { weekday: 'long' });
}
function getService(state, id) {
  return state.services.find(s => s.id === id) || null;
}
function toMinutes(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}
function fromMinutes(tot) {
  const h = Math.floor(tot / 60) % 24, m = tot % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/* Available start times for a date given duration + settings */
function generateSlots(state, iso, duration) {
  const dn = dayName(iso);
  const hours = state.settings.hours.find(h => h.day === dn);
  if (!hours || !hours.open) return { slots: [], reason: 'closed' };
  if (state.availability.blockedDates.includes(iso)) return { slots: [], reason: 'blocked' };

  const step = state.availability.slotMinutes || 30;
  const open = toMinutes(hours.from);
  const close = toMinutes(hours.to);
  const blocked = state.availability.blockedSlots[iso] || [];

  const out = [];
  for (let t = open; t + duration <= close; t += step) {
    const label = fromMinutes(t);
    if (blocked.includes(label)) continue;
    out.push(label);
  }
  return { slots: out, reason: null };
}

/* Slots that are demo-"booked" so the customer sees real availability pressure */
function bookedSlotsFor(state, iso, duration) {
  const taken = new Set();
  state.bookings.forEach(b => {
    if (b.date !== iso) return;
    if (b.status === 'Canceled') return;
    const start = toMinutes(b.time);
    const end = start + (b.duration || 60);
    for (let t = start; t < end; t += (state.availability.slotMinutes || 30)) {
      taken.add(fromMinutes(t));
    }
  });
  // Add a few deterministic "walk-in / held" slots so the demo feels alive
  const seed = iso.split('-').reduce((a, x) => a + parseInt(x, 10), 0);
  const extras = ['10:00', '11:30', '15:00', '17:30'];
  extras.forEach((s, i) => {
    if ((seed + i) % 3 === 0) taken.add(s);
  });
  return taken;
}

window.LunaData = {
  LS_KEY, DEFAULT_SERVICES, DEFAULT_SETTINGS, DEFAULT_AVAILABILITY,
  loadState, resetState, saveState, clone, nextRef, STATUS_META,
  peso, fmtDate, fmtDateShort, fmtTime, fmtDuration, dayName, getService,
  generateSlots, bookedSlotsFor, isoOf, todayISO, toMinutes, fromMinutes
};
