# TUVAA – The United Voice of African Associations

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=flat-square&logo=mysql)](https://www.mysql.com/)

An enterprise-grade, high-performance web platform and Content Management System (CMS) for **The United Voice of African Associations (TUVAA)** operating across Southampton and Hampshire.

---

## 🌟 Key Features

- **⚡ Instant ISR Caching & High Performance**: Sub-10ms query execution via singleton Prisma connection pooling and Incremental Static Regeneration (ISR).
- **📰 Production News CMS**: Dynamic `/news`, `/news/[slug]`, and `/category/[slug]` with real-time search, category filtering, author attribution, and pagination.
- **💬 Interactive Comments System**: User comment submission on news articles with Zod validation and admin moderation.
- **✉️ Newsletter Subscriptions**: Integrated newsletter capture stored in database with admin export & subscriber management.
- **🔒 Enterprise Admin Dashboard (`/admin`)**:
  - Full CRUD management for **News Posts**, **Events**, **Services**, **Projects**, **Donation Campaigns**, **Gallery/Media**, **BBAM Directory**, **Community Groups**, and **User Access Control**.
  - Role-based permissions (`super_admin`, `admin`, `sub_admin`, `tester`).
- **📸 Cloudinary Media Integration**: Optimized asset uploads with automatic webp conversion and lazy loading.
- **🔍 Automated SEO & Webmaster Suite**: Dynamic `sitemap.xml`, `robots.txt`, and OpenGraph metadata generation for search engines.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router & Server Components)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Framer Motion
- **Database & ORM**: MySQL & Prisma ORM
- **Media Storage**: Cloudinary API
- **Icons**: Lucide React
- **Validation**: Zod & React Hook Form

---

## 🚀 Getting Started

### 1. Prerequisites

- Node.js `v18.x` or higher
- npm or pnpm
- MySQL database instance (e.g. Aiven, PlanetScale, Railway, or local MySQL)

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Vishwakarmasuraj333/TUVAA.git
cd TUVAA
npm install
```

### 3. Environment Variables Setup

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Define the following key variables in `.env`:

```env
DATABASE_URL="mysql://user:password@host:port/database?sslaccept=strict"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_nextauth_secret_key"

CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

ADMIN_EMAIL="superadmin@tuvaa.org.uk"
ADMIN_PASSWORD="admin_secure_password"
```

### 4. Database Initialization & Seeding

Sync database schema and seed initial production data:

```bash
npx prisma db push
npx tsx prisma/seed.ts
```

### 5. Running Development Server

Start the local development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the website.  
Visit [http://localhost:3000/admin/login](http://localhost:3000/admin/login) to access the Admin Dashboard.

---

## 📦 Production Deployment (Vercel)

### Deployment Steps:

1. Push code repository to GitHub.
2. Import project into Vercel Dashboard.
3. Configure Environment Variables (`DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXT_PUBLIC_APP_URL`, `CLOUDINARY_*`).
4. Set Build Command: `npx prisma generate && next build`.
5. Deploy.

---

## 📄 License

Copyright © 2026 TUVAA. All Rights Reserved.
