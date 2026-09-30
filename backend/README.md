# School Finder Zimbabwe - Backend Architecture
**Neon PostgreSQL + Cloudflare Workers + Clerk Authentication**

This backend architecture connects School Finder Zimbabwe with modern serverless edge infrastructure.

---

## 1. Quick Testing with Temp Credentials (No Setup Needed)

You can test immediately with pre-configured accounts directly on the web app:

### 🏫 School Admin Accounts
| School Name | Temp Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Prince Edward School** | `admin@princeedward.co.zw` | Any / `demo1234` | Full Headmaster & Bursar dashboard, live enquiries, profile editor |
| **Arundel School** | `admin@arundel.co.zw` | Any / `demo1234` | Arundel admissions portal, fee structures, applicant review |
| **Peterhouse Boys** | `admin@peterhouse.co.zw` | Any / `demo1234` | Marondera campus bursar desk & student intake |
| **St. George's College** | `admin@stgeorges.co.zw` | Any / `demo1234` | Jesuit College administration portal |

### 👨‍👩‍👧 Parent Accounts
| Name | Temp Email | Password | Features |
| :--- | :--- | :--- | :--- |
| **Tendai Moyo** | `parent@demo.co.zw` or `tendai.moyo@gmail.com` | Any / `demo1234` | Active applications, saved wishlists, fee budgets |
| **Chipo Ncube** | `chipo.ncube@zimfamily.co.zw` | Any / `demo1234` | Bulawayo family intake & interview status tracker |
| **Guest Explorer** | *(No login required)* | None | Search, compare, fee calculators, enquiries |

---

## 2. Neon Serverless PostgreSQL Database

### Setup
1. Create a free PostgreSQL database at [https://console.neon.tech](https://console.neon.tech).
2. Go to the Neon **SQL Editor** tab.
3. Run the schema creation script:
   ```bash
   backend/schema.sql
   ```
4. Run the seed data script to populate Zimbabwe schools, accounts, and sample admission enquiries:
   ```bash
   backend/seed.sql
   ```
5. Copy your connection string from the Neon dashboard:
   ```env
   DATABASE_URL=postgresql://neondb_owner:<password>@ep-cool-sample.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
6. Paste it into `.env` and `wrangler.toml`.

---

## 3. Cloudflare Workers Edge API

The edge backend runs on Cloudflare Workers using `@neondatabase/serverless` over HTTP/WebSocket.

### Local Development
To test the Cloudflare Worker locally:
```bash
npx wrangler dev
```

### Production Deployment
To deploy your backend to Cloudflare's global edge network:
```bash
# 1. Login to Cloudflare
npx wrangler login

# 2. Store your Neon DB URL and Clerk Secret securely
npx wrangler secret put DATABASE_URL
npx wrangler secret put CLERK_SECRET_KEY

# 3. Deploy
npx wrangler deploy
```

---

## 4. Clerk Authentication Setup

1. Create a free project at [https://dashboard.clerk.com](https://dashboard.clerk.com).
2. Under **API Keys**, copy:
   - `Publishable key`: e.g. `pk_test_...`
   - `Secret key`: e.g. `sk_test_...`
3. Add `VITE_CLERK_PUBLISHABLE_KEY` to your root `.env` file:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
   ```
4. To assign school administration rights to users in Clerk, set user metadata in the Clerk Dashboard:
   ```json
   {
     "publicMetadata": {
       "role": "school",
       "schoolId": "prince-edward"
     }
   }
   ```
   For parents:
   ```json
   {
     "publicMetadata": {
       "role": "parent"
     }
   }
   ```

---

## 5. API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Backend status & database connectivity check |
| `GET` | `/api/schools` | List schools with optional `?province=...` & `?q=...` |
| `GET` | `/api/schools/:id` | School details, fees, facilities & verified reviews |
| `PATCH` | `/api/schools/:id` | Update fees, pass rate, motto, phone (School Admin) |
| `GET` | `/api/enquiries` | Fetch enquiries filtered by `?schoolId=...` or `?parentEmail=...` |
| `POST` | `/api/enquiries` | Submit new admission enquiry |
| `PATCH` | `/api/enquiries/:id` | Update enquiry status (`New`, `Contacted`, `Interview`, `Enrolled`) |
| `GET` | `/api/reviews` | Fetch reviews for a school |
| `POST` | `/api/reviews` | Submit parent review |
