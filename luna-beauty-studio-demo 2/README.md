# Luna Beauty Studio — Standard Booking Website/System (Demo)

A live demo of the **₱7,999 Standard Booking Website/System** by **TCL Systems & Digitals PH**.

This is a fictional client build ("Luna Beauty Studio" — a beauty & self-care studio) that
lets a potential customer experience **both sides** of the system:

1. **What their customers see** — a premium business website with a real multi-step booking flow.
2. **What the owner/admin sees** — a functional Demo Admin for managing bookings, services,
   availability, and basic business settings.

> 🧪 **Demo only.** Nothing here connects to a real business. Bookings, status changes, and settings
> are stored in the visitor's browser (localStorage) and reset with **Reset Demo Data**.

---

## How to open the demo

Just open **`index.html`** in any modern browser. No server, build step, or internet connection
required beyond the CDN fonts and sample imagery.

Everything runs client-side. On a hosting plan, the same folder can be uploaded as-is.

---

## Demo walkthrough (2 minutes)

1. **Browse the website** — Home, Services, About, Contact.
2. Click **Book an Appointment** → complete the 9-step booking flow.
3. On confirmation, note your **booking reference** (e.g. `LBS-2486`) and **Pending** status.
4. Click **View in Demo Admin** (or the **Demo Admin** button in the header).
5. Sign in with the pre-filled demo credentials (just press *Sign In*).
6. Find your new booking at the top of **Bookings** — try **Confirm → Complete**, or **Cancel**.
7. Visit **Services**, **Availability**, and **Settings** to simulate management.
8. Use **Reset Demo Data** to restore the original sample set.

---

## What's included in this package demo

### Customer website
- Home with hero, featured services, why-choose-us, about preview, business hours, testimonials, CTA
- Services page with categories, prices, durations, variations, and add-ons
- About page with story, values, philosophy, and gallery
- Contact page with address, contact details, socials, hours, map-style section, and policy
- Fully responsive, warm/cream + blush palette, elegant typography

### Online booking flow (9 steps)
1. Service selection
2. Variation selection (where applicable)
3. Add-ons (where applicable)
4. Date (calendar — past dates disabled, closed days and blocked dates shown)
5. Time (available slots; booked/held slots greyed out)
6. Customer information (name, email, mobile, notes) with validation
7. Review booking
8. Submit
9. Confirmation with booking reference and **Pending** status

*No payment gateway — as specified for the Standard package.*

### Booking statuses
`Pending` · `Confirmed` · `Canceled` · `Completed` — shown as colour-coded badges across the admin.

### Demo Admin
- **Dashboard** — Today's Bookings, Pending, Confirmed, Completed summary cards; today's schedule;
  recent bookings; booking status overview; quick actions
- **Bookings** — full table (reference, customer, service, date, time, amount, status), status
  filters, search, and actions: View / Confirm / Cancel / Mark Completed / Reopen
- **Booking detail modal** — complete customer info, service, variation, add-ons, duration, notes, total
- **Services** — add, edit, activate/deactivate; supports variations and add-ons
- **Availability** — operating days and hours, slot interval, blocked dates, unavailable time slots
  (these flow through to the customer booking calendar/time choices)
- **Settings** — business name, contact info, address, hours (link), basic booking policy text
- **Reset Demo Data** — one click to restore original samples

---

## Package boundaries

**Included** (₱7,999 Standard): customer website · services · online booking · variations/add-ons ·
date/time selection · customer info · booking confirmation/reference · four statuses · admin
dashboard · booking management · services management · availability management · basic settings ·
responsive interface · 2 months maintenance.

**Not included** (requires a Custom Business Website/System quotation): automated payment gateways ·
memberships/customer accounts · loyalty/points · subscriptions · staff-specific calendars ·
multi-branch management · automated SMS · advanced analytics · advanced custom roles/permissions ·
unusual/custom workflows.

---

## Files

```
luna-beauty-studio-demo/
├── index.html              Home
├── services.html           Services & prices
├── about.html              About & values
├── contact.html            Contact & location
├── booking.html            Booking flow host
├── admin-login.html        Demo Admin login (pre-filled)
├── admin.html              Demo Admin application
├── css/style.css           All styling
└── js/
    ├── data.js             Demo data, storage, availability logic
    ├── site.js             Shared chrome, toasts, modals
    ├── booking.js          Multi-step booking flow
    └── admin.js            Demo Admin application
```

---

**Powered by TCL Systems & Digitals PH**
