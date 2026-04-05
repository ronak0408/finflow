# FinFlow — Financial Dashboard

A modern, fully responsive financial dashboard built with **React + Vite**. Track income, expenses, and financial insights with a clean dark/light UI.

---

## Features

### Core
- **Dashboard Overview** — Net balance card with sparkline, total income & expenses, balance trend line chart, spending doughnut chart
- **Transactions** — Searchable, filterable (category / type / date range), sortable table with pagination
- **Role-Based UI** — Toggle between `Admin` (add / edit / delete) and `Viewer` (read-only) modes
- **Insights** — Top spending category, savings rate, expense trend, monthly income vs expense bar chart, comparison bars

### Bonus
- **Dark / Light mode** with `localStorage` persistence
- **localStorage** data persistence across sessions
- **Export CSV & JSON** from the transactions view
- **Smooth fade-in animations** on tab switch
- **6 months of realistic mock data** generated on first load

---

## Tech Stack

| Layer         | Choice                        |
|---------------|-------------------------------|
| Framework     | React 18                      |
| Bundler       | Vite 5                        |
| Charts        | Chart.js 4                    |
| State         | React Context API + useState  |
| Styling       | Plain CSS with CSS variables  |
| Persistence   | localStorage                  |

---

## Project Structure

```
finflow/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx       # Overview tab
│   │   ├── Insights.jsx        # Insights tab
│   │   ├── Nav.jsx             # Tab navigation
│   │   ├── Topbar.jsx          # Header with role & theme toggle
│   │   ├── Transactions.jsx    # Transactions tab
│   │   └── TxModal.jsx         # Add / edit transaction modal
│   ├── context/
│   │   └── AppContext.jsx      # Global state (transactions, theme, role)
│   ├── data/
│   │   └── mockData.js         # Transaction generator & constants
│   ├── hooks/
│   │   └── useTransactionFilter.js  # Filter / sort / paginate hook
│   ├── styles/
│   │   └── global.css          # CSS variables & all styles
│   ├── utils/
│   │   └── format.js           # fmt(), exportCSV(), exportJSON()
│   ├── App.jsx                 # Root component
│   └── main.jsx                # React entry point
├── index.html
├── vite.config.js
├── package.json
└── .gitignore
```

---

## Setup Instructions

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9 (or yarn / pnpm)

### Install & Run

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/finflow.git
cd finflow

# 2. Install dependencies
npm install

# 3. Start development server (opens at http://localhost:3000)
npm run dev
```

### Build for Production

```bash
npm run build       # outputs to /dist
npm run preview     # preview the production build locally
```

---

## Uploading to GitHub

```bash
# Inside the project folder
git init
git add .
git commit -m "Initial commit — FinFlow financial dashboard"

# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/finflow.git
git branch -M main
git push -u origin main
```

---

## Design Decisions

- **CSS Variables** for theming — zero runtime overhead, instant dark/light switch
- **Context API** over Redux — sufficient for this scale, no boilerplate
- **Custom hook** (`useTransactionFilter`) isolates all filter/sort/pagination logic
- **Chart.js** loaded from CDN in the HTML artifact version; installed as an npm package in the project version for proper tree-shaking
- **localStorage** used for both theme preference and transaction persistence so data survives page refreshes
- **Mock data generator** produces realistic 6-month history with randomised amounts; runs once on first load and is cached in localStorage

---

## Live Demo
finflow-4rbfj2nq9-ronaks-projects-51fb0959.vercel.app
