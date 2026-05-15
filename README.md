# 🛒 Ecommerce Fullstack Design

A full-stack ecommerce web application built with **React** (frontend) and **Node.js/Express** (backend), using **Supabase** as the database and deployed on **Vercel** (frontend) + **Railway** (backend).

---

## 🌐 Live Demo

- **Frontend:** [Vercel Deployment](https://your-vercel-url.vercel.app)
- **Backend API:** [https://ecommerce-fullstack-design-production-fa24.up.railway.app](https://ecommerce-fullstack-design-production-fa24.up.railway.app)

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, React Router |
| Backend | Node.js, Express.js |
| Database | Supabase (PostgreSQL) |
| Auth | JWT (JSON Web Tokens) + bcryptjs |
| Deployment | Vercel (frontend), Railway (backend) |

---

## 📁 Project Structure

```
ecommerce-fullstack-design/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── ProductListing.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   ├── Cart.jsx
│   │   │   └── admin/
│   │   │       └── AdminPanel.jsx
│   │   └── App.jsx
│   └── .env
├── backend/
│   ├── config/
│   │   └── supabase.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── productController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   └── cartRoutes.js
│   └── server.js
└── README.md
```

---

## ✨ Features

- 🔐 User registration and login with JWT authentication
- 🛍️ Product listing with search, category filter, and sort
- 📦 Product detail page with related products
- 🛒 Cart management (add, update quantity, remove, clear)
- 👤 Admin panel for product management (CRUD)
- 📱 Fully responsive — mobile and desktop layouts
- 💾 Guest cart saved to localStorage; synced on login
- 🏷️ Coupon code support (try `SAVE10`)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project
- Git

### 1. Clone the repository

```bash
git clone https://github.com/iman-123-coder/ecommerce-fullstack-design.git
cd ecommerce-fullstack-design
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
JWT_SECRET=your-jwt-secret
PORT=8080
```

Start the backend:

```bash
node server.js
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` folder:

```env
VITE_API_URL=http://localhost:8080
```

Start the frontend:

```bash
npm run dev
```

---

## 🗄️ Supabase Database Tables

Run these SQL statements in your Supabase SQL editor:

```sql
-- Users table
create table users (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text unique not null,
  password text not null,
  role text default 'user',
  created_at timestamp default now()
);

-- Products table
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric not null,
  image text,
  category text,
  discount numeric default 0,
  stock int default 0,
  created_at timestamp default now()
);

-- Cart table
create table cart (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  quantity int default 1,
  created_at timestamp default now()
);
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT token |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products (supports `?search=` and `?category=`) |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create product (admin only) |
| PUT | `/api/products/:id` | Update product (admin only) |
| DELETE | `/api/products/:id` | Delete product (admin only) |

### Cart (requires JWT)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get user's cart |
| POST | `/api/cart` | Add item to cart |
| PATCH | `/api/cart/:id` | Update item quantity |
| DELETE | `/api/cart/:id` | Remove single item |
| DELETE | `/api/cart` | Clear entire cart |

---

## ☁️ Deployment

### Backend — Railway

1. Push your code to GitHub
2. Create a new project on [Railway](https://railway.app)
3. Connect your GitHub repo
4. Set environment variables: `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `JWT_SECRET`
5. Set the port to `8080` in Railway → Settings → Networking

### Frontend — Vercel

1. Import your GitHub repo on [Vercel](https://vercel.com)
2. Set the root directory to `frontend`
3. Add environment variable: `VITE_API_URL=https://your-railway-url.up.railway.app`
4. Deploy

---

## ⚠️ Known Notes

- Backend runs on Node.js 18 on Railway — the `ws` package is used to provide WebSocket support for Supabase Realtime since Node 18 lacks native WebSocket.
- Upgrade to Node.js 20+ on Railway to remove this requirement.

---

## 📄 License

MIT License — feel free to use and modify.

---

## 👨‍💻 Author

**iman-123-coder** — [GitHub](https://github.com/iman-123-coder)
