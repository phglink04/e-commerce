# PlantWorld Client (Next.js App Router)

This folder is the migrated frontend from Vite React to Next.js App Router with TypeScript and Tailwind CSS.

## Highlights

- App Router + Route Groups:
  - `(client)` for customer-facing pages
  - `(admin)` for admin pages
  - `(deliveryPartner)` for delivery partner pages
- Middleware-based route protection for:
  - `/admin/*`
  - `/deliveryPartner/*`
  - `/profile/*`, `/cart/*`, `/myOrders/*`, `/settings/*`
- Server Components data fetching:
  - Shop/home/product pages use server-side `fetch` in `src/lib/api.ts`
- Image optimization:
  - `next/image` wrapper in `src/components/shared/plant-image.tsx`
  - Supports `/backend/plants/*` and backend uploaded `/images/*`
- State management:
  - Auth moved from Context API to Zustand store (`src/store/auth-store.ts`)

## Setup

1. Copy `.env.example` to `.env.local`.
2. Install dependencies:

```bash
npm install
```

3. Run development server:

```bash
npm run dev
```

## Routing Map (from old App.jsx)

- Client:
  - `/`, `/shop`, `/contact`, `/blog`, `/blog/:id`, `/plant/description/:plantId`, `/about`, `/faqs`
  - Protected: `/cart`, `/cart/address`, `/order-success`, `/profile`, `/myOrders`, `/settings`
- Admin:
  - `/admin/login`, `/admin/plants`, `/admin/orders`, `/admin/users`, `/admin/faqs`, `/admin/deliveryPartner`, `/admin/profile`
- Delivery Partner:
  - `/deliveryPartner/login`, `/deliveryPartner/orders`, `/deliveryPartner/profile`, `/deliveryPartner/settings`

## Notes

- Login uses NestJS endpoint `/api/users/login` and writes role/token to `plantworld_auth` cookie for middleware checks.
- Some deep feature pages are scaffolded and ready for progressive migration from old components.
