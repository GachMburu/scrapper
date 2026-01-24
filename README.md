# 📊 DataMarket - The Enterprise Data Terminal

![Project Status](https://img.shields.io/badge/Status-MVP%20Complete-success)
![Tech Stack](https://img.shields.io/badge/Stack-Next.js_15_|_MongoDB_|_Tailwind-blue)
![License](https://img.shields.io/badge/License-MIT-gray)

**DataMarket** is a full-stack SaaS platform that functions as a professional data marketplace. It features a powerful "Vacuum" scraping engine, an Excel-like Admin Workbench for data cleaning, and a secured Freemium delivery system for end-users.

Designed with a **Financial Terminal** aesthetic using a "Dimmed Light" Sky-Blue theme.

---

## 🚀 Key Features

### 🛠 For Admins (The Mission Control)
*   **The Vacuum Scraper:** A custom engine (`lib/scraper.ts`) that ingests any URL and intelligently parses all HTML Tables, Lists, and Links found on the page.
*   **Data Workbench:** An in-browser, Excel-style editor. Admins can:
    *   Select specific scraped components to import.
    *   Manually edit cells, add columns, and delete rows.
    *   Append new scraped data to existing datasets.
*   **Inventory Dashboard:** A dense, high-utility table view to manage dataset status (Draft/Published) and revenue potential.
*   **Secure Gate:** Client-side passcode protection for admin routes.

### 💼 For Customers (The Terminal)
*   **Real-Time Dashboard:** A split-screen layout with a retractable sidebar, live search filtering, and instant grid updates.
*   **Freemium Security:** Server-side logic ensures free users **never** receive the full dataset.
    *   *Free:* View top 3 rows. The rest are blurred and locked.
    *   *Paid:* Instant unlock of all data.
*   **Delivery System:** "Send to Email" functionality allows paid users to export data immediately.

---

## 🛠 Tech Stack

**Frontend**
*   **Framework:** Next.js 15 (App Router)
*   **Library:** React 19 (Server & Client Components)
*   **Styling:** Tailwind CSS v4 (Custom Design System)
*   **Icons:** Lucide React

**Backend**
*   **Runtime:** Next.js API Routes (Serverless Functions)
*   **Database:** MongoDB (Atlas)
*   **ORM:** Mongoose (Flexible Schema Architecture)
*   **Scraping:** Axios + Cheerio

---

## 📸 Screenshots

*(Add your screenshots here)*

| Admin Workbench | Public Dashboard |
|:---:|:---:|
| *Excel-like editor for cleaning data* | *Real-time filtering and widget cards* |

---

## ⚡ Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/data-marketplace.git
cd data-marketplace
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
Create a `.env` file in the root directory:
```env
# MongoDB Connection
DATABASE_URL="mongodb+srv://user:pass@cluster.mongodb.net/datamarket?retryWrites=true&w=majority"

# Admin Security (Simple Passcode)
ADMIN_PASSCODE="funding2024"

# Optional: Future Integrations
# STRIPE_SECRET_KEY=...
# RESEND_API_KEY=...
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 📂 Project Structure

```
data-marketplace/
├── app/
│   ├── admin/             # Protected Admin Routes
│   │   ├── editor/        # The Unified Workbench (Create/Edit/Append)
│   │   └── page.tsx       # Inventory Dashboard
│   ├── api/               # Server-side API Endpoints
│   ├── dataset/           # Public Dataset View (Dynamic Route)
│   └── page.tsx           # Homepage (Marketplace Shell)
├── components/
│   └── dashboard/         # Client-side UI Logic (Search, Sidebar, Cards)
├── lib/
│   ├── db.ts              # Database Connection Caching
│   ├── scraper.ts         # The Vacuum Scraping Engine
│   └── models/            # Mongoose Schemas (Dataset, DataRow)
└── public/
```

---

## 🧠 Core Architecture Decisions

### 1. Flexible Data Schema
Unlike SQL databases, we use a flexible MongoDB schema for `DataRow`. The `content` field is an unstructured JSON object. This allows the system to scrape and store *any* website structure (Real Estate, Finance, E-commerce) without changing the database code.

### 2. Server-Side Security
The "Paywall" isn't just CSS. The API route `/api/dataset/[id]` checks the payment status. If the user hasn't paid, the database query limits the return to `limit(3)`. This prevents "Inspect Element" theft.

### 3. The "Vacuum" Strategy
Instead of writing custom scrapers for every website, the `scraper.ts` utility grabs **all** structured data components. The Admin then uses the **Workbench UI** to decide what is useful. This shifts the complexity from *Code* to *Content Selection*.

---

## 📝 License

This project is licensed under the MIT License.