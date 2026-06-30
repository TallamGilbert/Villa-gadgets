# Villa Gadgets

A modern e-commerce platform for premium electronics in Nairobi, Kenya. Built with React, TypeScript, Supabase, and Paystack.

## Live Demo

[villagadgets.vercel.app](https://villagadgets.vercel.app)

## Tech Stack

| Layer      | Technology                           |
| ---------- | ------------------------------------ |
| Frontend   | React 19, TypeScript, Vite           |
| Styling    | Tailwind CSS                         |
| Animation  | Motion (Framer Motion)               |
| Backend/DB | Supabase (PostgreSQL)                |
| Auth       | Supabase Auth (Email + Google OAuth) |
| Payments   | Paystack (M-Pesa + Card)             |
| Hosting    | Vercel                               |

## Features

### Storefront

- Product catalog with category and brand filtering
- Multi-image product gallery
- Dynamic product attributes per category (phones show RAM/camera, laptops show processor/display etc.)
- Product tags and search
- Featured products on homepage
- Category browse section

### Cart & Checkout

- Persistent cart -- syncs to Supabase for logged-in users, localStorage for guests
- Smart merge on login -- guest cart merges with saved cart
- Multi-step checkout with delivery details
- Paystack payment (M-Pesa + card)
- Order confirmation with WhatsApp follow-up

### Accounts

- Google OAuth and email/password sign up
- Order history
- Admin panel access for authorized users

### Admin Panel

- Dashboard with revenue, order, and stock KPIs
- Product management -- add, edit, delete with multi-image upload
- Dynamic spec fields per product category
- Tag management
- Order management with status updates and WhatsApp customer contact
- Low stock and out-of-stock alerts
- Business settings

## Project Structure

```text
src/
├── components/
│   ├── admin/                  # AdminLayout
│   ├── layout/                 # Navbar, Footer
│   └── ui/                     # Button, ProductCard, ProtectedRoute
├── context/
│   ├── AuthContext.tsx         # Auth state, Google login, sign out
│   ├── CartContext.tsx         # Cart state, DB sync, merge logic
│   └── SettingsContext.tsx     # Store-wide settings from DB
├── pages/
│   ├── admin/                  # Dashboard, Products, Orders, Settings
│   ├── Home.tsx
│   ├── Shop.tsx
│   ├── ProductDetail.tsx
│   ├── Cart.tsx
│   ├── Checkout.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   └── Account.tsx
├── services/
│   └── productService.ts       # All product-related Supabase queries
├── lib/
│   ├── supabase.ts             # Supabase client
│   └── utils.ts                # formatCurrency, cn
└── types.ts                    # All TypeScript interfaces
```

## Database Schema

- **categories** -- product categories (phones, laptops, tvs etc.)
- **products** -- core product data
- **product_images** -- multiple images per product with position ordering
- **product_attributes** -- flexible key-value specs per product (RAM, Storage etc.)
- **product_tags** -- junction table linking products to tags
- **tags** -- reusable tag names
- **orders** -- customer orders with payment reference
- **order_items** -- individual line items per order (relational)
- **carts** -- persistent cart rows (user_id + product_id + quantity)
- **settings** -- singleton store configuration row

All tables have Row Level Security (RLS) enabled. Public users can read products and insert orders. Cart and order history are scoped to authenticated users by `user_id`.

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project
- A Paystack account
- A Google Cloud project (for OAuth)

### Installation

```bash
git clone https://github.com/TallamGilbert/villa-gadgets.git
cd villa-gadgets
npm install --legacy-peer-deps
```

### Environment Variables

Create a `.env` file in the root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_key
```

### Database Setup

Run the migration SQL in your Supabase SQL editor. The full schema is in `/supabase/schema.sql`.

### Run Locally

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Deployment

The project is deployed on Vercel with Supabase as the backend.

- Push to GitHub
- Import the repo on vercel.com
- Add your environment variables in the Vercel dashboard
- Deploy

**Important:** Due to a peer dependency conflict between React 19 and react-paystack, make sure your Vercel project uses the following build settings:

**Install Command:**

```bash
npm install --legacy-peer-deps
```

**Build Command:**

```bash
npm run build
```

To configure this in Vercel:

- Go to your project Settings
- Navigate to Build & Development Settings
- Set Install Command to `npm install --legacy-peer-deps`

Alternatively, ensure the `.npmrc` file in your repository contains:

```text
legacy-peer-deps=true
```

For Paystack, switch `VITE_PAYSTACK_PUBLIC_KEY` from `pk_test_` to `pk_live_` when going live.

## Admin Access

The admin panel at `/admin` is protected by email whitelist. Only the configured admin email can access it. To change the admin email, update `ADMIN_EMAIL` in `src/context/AuthContext.tsx`.

## Payment Flow

- Customer fills delivery details, order saved to DB as pending
- Paystack popup opens (M-Pesa or card)
- On success, order status updated to paid automatically
- On cancel, order stays as pending (visible in admin as abandoned)

## Known Limitations

- Paystack payment verification is client-side only. For production hardening, add a Supabase Edge Function to verify the payment server-side before marking as paid.
- M-Pesa STK push (Safaricom Daraja) is not implemented. M-Pesa payments go through Paystack's mobile money flow instead.
- No email notifications on order placement.

## Roadmap

- Server-side Paystack verification via Supabase Edge Functions
- Email notifications (order confirmation, status updates)
- Product reviews and ratings
- Stock history log
- Delivery fee calculator by county
- Sales analytics dashboard

## Author

Gilbert Tallam

Full-stack developer based in Nairobi, Kenya

GitHub: @TallamGilbert

## License

MIT
