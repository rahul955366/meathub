# Deploying MeatHub to Railway (Via GitHub)

Since your code is pushed to [GitHub: rahul955366/meathub](https://github.com/rahul955366/meathub.git), you can set up continuous deployment in 5 minutes.

---

## 1. Add PostgreSQL Database
1. Go to the [Railway Dashboard](https://railway.app/).
2. Click **New Project** → **Provision PostgreSQL**.
3. Once created, click on the **Postgres** service card, go to the **Variables** tab, and keep this page open. We will need the database connection variables.
4. Go to the **Connect** tab in Postgres, open a SQL terminal (or run pgAdmin), and enable the vector extension:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```

---

## 2. Deploy the Backend (Django API)
1. In your Railway project, click **New** → **GitHub Repo** → select `rahul955366/meathub`.
2. Rename this service to `backend`.
3. Go to the **Settings** tab:
   - Under **Build**, set the **Root Directory** to `backend`.
4. Go to the **Variables** tab and click **New Variable** to add:
   - `DATABASE_URL`: Click **Add Reference** and select `Reference Database URL` from your Postgres service.
   - `DEBUG`: `False`
   - `SECRET_KEY`: Generate a random 50+ character string.
   - `ALLOWED_HOSTS`: `*` (or your backend railway domain name, e.g. `backend-production.up.railway.app`).
   - `CORS_ALLOWED_ORIGINS`: Add your frontend Railway domain name once created.
   - `GEMINI_API_KEY`: Your Google Gemini API Key.
   - `RAZORPAY_KEY_ID`: Your Razorpay Key ID (optional for test).
   - `RAZORPAY_KEY_SECRET`: Your Razorpay Key Secret (optional for test).
5. Go to the **Settings** tab and click **Generate Domain** under public networking to expose your API.

---

## 3. Deploy the Frontend (Next.js)
1. In your Railway project, click **New** → **GitHub Repo** → select `rahul955366/meathub`.
2. Rename this service to `frontend`.
3. Go to the **Settings** tab:
   - Under **Build**, set the **Root Directory** to `frontend`.
4. Go to the **Variables** tab and add:
   - `NEXT_PUBLIC_API_URL`: Use the domain generated for your `backend` service (e.g., `https://backend-production.up.railway.app`).
   - `INTERNAL_API_URL`: Same as above.
5. Go to the **Settings** tab and click **Generate Domain** under public networking to get your frontend web URL!

---

## 4. Run Seed Database Command
After backend is deployed and connected to Postgres, run the database seed script to populate products and shop categories.
1. Click on the **backend** service card.
2. Click **Command Terminal** (or go to the **Deployments** tab and click **Terminal**).
3. Run the following command:
   ```bash
   python manage.py shell -c "import seed_data; seed_data.seed_data()"
   ```
4. Also run the order seed if desired:
   ```bash
   python manage.py shell -c "import seed_orders; seed_orders.seed_orders()"
   ```
