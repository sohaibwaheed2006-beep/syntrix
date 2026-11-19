# Syntrix - AI-Powered Synthetic Data Generator

An intelligent synthetic data generator built with **Next.js 15**, **Google Gemini AI**, and **Supabase**. Designed to analyze data schemas, model complex relationships, and generate high-fidelity test data across tabular and document formats.

**Live demo:** https://hackdatav2-woad.vercel.app

---

## ⚡ Features

- **Automated Schema Detection & Input Analysis**: Upload CSV, JSON, or SQL schema definitions to instantly detect column types, primary/foreign keys, distributions, and data constraints.
- **Relational Integrity Engine**: Maintains referential integrity across related parent-child tables with customizable cardinalities.
- **Document & Tabular Generation**: Supports tabular datasets as well as realistic financial and business documents (e.g. invoices, bank statements).
- **Multiple Export Formats**: Export generated datasets as CSV, JSON, or dependency-ordered SQL migrations with create and insert statements.
- **Modern UI**: Clean, professional interface with light and dark themes, a guided step-by-step workflow, live preview, and project management. Fully responsive on phones, tablets and desktops.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sohaibwaheed2006-beep/syntrix.git
   cd syntrix
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file based on `.env.local.example`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👥 Contributors

- **Sohaib Waheed** ([@sohaibwaheed2006-beep](https://github.com/sohaibwaheed2006-beep))
- **Muntaha Hammad** ([@muntahahammad](https://github.com/muntahahammad))
