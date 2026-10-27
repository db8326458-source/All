# HELP WORLD - Find Trusted Help, Anywhere

**HELP WORLD** is a global local services marketplace connecting customers with nearby verified electricians, plumbers, mechanics, carpenters, AC repair technicians, cleaners, appliance repairers, and painters.

Designed as an authentic, production-oriented commercial suite ready for the Google Play Store, this project includes three complete products powered by the same shared backend and database:
1. **HELP WORLD CUSTOMER APP** (`com.helpworld.customer`)
2. **HELP WORLD PARTNER APP** (`com.helpworld.partner`)
3. **HELP WORLD ADMIN PANEL** (Operations & Moderation Console)

---

## 📱 Mobile-First for Android Phone Users (No Computer Required)

You do **not** need a computer or Android Studio to edit, run, test, or generate installable Android APKs. Everything is pre-configured to work inside your mobile browser and in the cloud:

- **Browser Testing:** Switch between Customer, Partner, and Admin apps directly in your mobile browser using the top navigation bar.
- **Interactive Simulation:** Test the full booking lifecycle: placing a booking, accepting as a partner, updating job progress, filing disputes, and approving trade licenses as an administrator.
- **Cloud APK Builder:** Build official `.apk` files directly in GitHub Actions from your phone's browser and download the `.apk` directly onto your phone.

---

## 🏗️ Core Architecture & Products

### 1. HELP WORLD Customer App
- **Splash & Onboarding:** Brand animation and 3-step value carousel.
- **Customer Home:** Global city & country switcher, GPS permission simulation, popular categories, top-rated nearby pros, active booking shortcuts, and safety guarantees.
- **Service Categories:** Electricians, Plumbers, Mechanics, AC Repair, Carpenters, Cleaners, Appliance Technicians, Painters, and Locksmiths.
- **Professional Search & Interactive Map:** Filter by trade, price range, distance radius (5–50 km), customer rating (4.0+ to 4.8+), and "Available Immediately" on-duty status.
- **Detailed Professional Profile:** Real portraits, verified badges, licensing details, hourly rates, visit fees, verified customer reviews, work gallery, and direct WhatsApp & Call actions.
- **Booking Request Flow:** Select issue, pick scheduled date & time window, choose saved service address, attach job photos, see estimated charges breakdown, and submit with celebratory confetti.
- **My Bookings:** Categorized tabs (Pending, Accepted, In Progress, Completed, Cancelled) with live status timelines.
- **Real-Time Chat:** In-app messaging between customer and technician with quick reply chips.
- **Verified Customer Reviews:** Star rating, compliment tags, and written feedback (only available after job completion).
- **Customer Profile:** Manage saved service addresses (Home, Work), display language, currency preferences, and notification toggles.

### 2. HELP WORLD Partner App
- **Partner Dashboard:** Online/Offline availability toggle, real-time earnings tracker, and active job monitor.
- **Verification Management:** Dynamic status tracker (`not_submitted`, `pending_review`, `approved`, `rejected` with admin rejection feedback).
- **Incoming Booking Requests:** Instant notifications for new service calls with Accept and Decline actions.
- **Job Progress Stepper:**
  - *Accepted* → Mark arrived on site (*In Progress*)
  - *In Progress* → Input final labor & parts charges, add repair notes, and generate completion invoice (*Completed*).
- **Earnings & Payouts:** Gross revenue, 10% platform fee calculation, net balance, and instant bank payout simulator.
- **Service Charges & Coverage:** Adjust hourly rates, on-site visit diagnosis fees, coverage radius in km, and specialized skills.
- **Security Rule:** Partners cannot self-approve their accounts or alter other technicians' profiles.

### 3. HELP WORLD Admin Panel
- **Executive KPI Dashboard:** Real-time metrics for Gross Marketplace Value (GMV), total bookings, pending applications, and open disputes.
- **Verification Review Queue:** Inspect submitted trade licenses, government IDs, and insurance documents. Approve or reject applications with custom reasons. Approving a partner instantly makes them visible in customer search!
- **Partner & Customer Management:** Full directory with search, status filters, and instant account suspension or reactivation.
- **Dispute Resolution Console:** Review complaints filed by customers, record investigation notes, and resolve disputes.
- **Service Category Manager:** Enable or disable trade categories, add new services, and set baseline prices.
- **Administrative Audit Logs:** Immutable logs recording every approval, suspension, and dispute resolution with timestamps.

---

## 🗄️ Database & Supabase PostgreSQL Setup

The project includes production-ready SQL scripts located in `/supabase`:
- `/supabase/schema.sql`: 17 relational tables, foreign key constraints, indexes, custom ENUMs, and Row Level Security (RLS) policies.
- `/supabase/storage.sql`: Private storage buckets (`verification_documents`, `job_photos`) and public bucket (`profile_photos`) with RLS.

### How to Deploy Database from Mobile:
1. Open [supabase.com](https://supabase.com) in your mobile browser and create a free project.
2. In your Supabase dashboard, go to the **SQL Editor**.
3. Tap **New Query**, copy the contents of `/supabase/schema.sql` and `/supabase/storage.sql` (also viewable in the **SQL Schema** tab in this app), and tap **Run**.
4. Go to **Project Settings** → **API** to copy your `Project URL` and `anon public key`.
5. Add these to your `.env` file:
   ```env
   VITE_SUPABASE_URL="https://your-project.supabase.co"
   VITE_SUPABASE_ANON_KEY="eyJhbGciOi..."
   ```

---

## 📦 How to Build the Android APK on Your Phone (Zero PC Needed)

1. Open **GitHub** on your mobile phone in Chrome or Firefox.
2. Create a new repository named `help-world`.
3. In the repository, create the file `.github/workflows/build-apk.yml` and paste the workflow from the **Build APK** tab in this app.
4. Tap the **Actions** tab on GitHub on your phone.
5. Select **Build Android APK** and tap **Run workflow**.
6. GitHub's free cloud server will install dependencies, compile the React assets, run Capacitor, and build `app-debug.apk`.
7. Once finished (~2 minutes), tap the workflow run, go to **Artifacts**, and download `HelpWorld-Customer-Debug-APK.zip`.
8. Unzip on your Android phone and tap the `.apk` file to install the app directly!

---

## 🧪 Complete End-to-End Testing Checklist

1. **Customer Booking Flow:**
   - Open **Customer App**.
   - Tap **Electrician** or search "circuit breaker".
   - Select **Marcus Vance** and tap **Book Service**.
   - Select issue, date, and service address, then submit.
   - Verify celebratory confetti and reference number generation (`HW-XXXXXX`).
2. **Partner Acceptance Flow:**
   - Tap **Partner App** in top navigation.
   - Switch active pro to **Marcus Vance**.
   - View the new incoming booking request under **Incoming Job Requests**.
   - Tap **Accept Job**.
3. **In-Progress & Completion Flow:**
   - In Partner App, tap the accepted job.
   - Tap **Mark Arrived & Start Job**.
   - Enter final labor & parts charges and tap **Finalize Job & Submit Invoice**.
4. **Customer Review Flow:**
   - Switch back to **Customer App** → **Bookings**.
   - Tap **Rate & Review** on the completed booking.
   - Select 5 stars, choose tags ("Punctual", "Clean Work Area"), and submit.
   - Verify that the partner's rating and review count update immediately!
5. **Admin Verification Flow:**
   - In Partner App, switch demo pro to **Rahul Sharma** (Pending Review).
   - In Customer App, search for electricians — verify Rahul **does not appear** in customer search results.
   - Switch to **Admin Panel** → **Verification Queue**.
   - Review Rahul's trade license document and tap **Approve Application**.
   - Return to Customer App search — verify Rahul Sharma **now immediately appears** in search results!
