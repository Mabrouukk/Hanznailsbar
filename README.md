# 💅 Hanz Nails Salon – Full Stack MERN Website

> **The Art of Timeless Polish** | Nasr City, Cairo

---

## 📁 Project Structure

```
hanz-nails/
├── backend/          ← Node.js + Express + MongoDB API
│   ├── models/       ← MongoDB schemas (User, Booking)
│   ├── routes/       ← API endpoints
│   ├── middleware/   ← Auth & admin guards
│   ├── utils/        ← Email service + birthday cron
│   ├── server.js     ← Main server entry
│   └── .env          ← Environment variables (edit this!)
├── frontend/         ← React app
│   ├── src/
│   │   ├── pages/    ← Home, Services, Booking, Login, Register, Dashboard, AdminDashboard
│   │   ├── components/ ← Navbar, Footer
│   │   └── context/  ← Auth context
│   └── public/       ← index.html with SEO schema
└── README.md
```

---

## ⚙️ SETUP GUIDE (Copy & Paste Ready)

### Step 1 – Prerequisites
Make sure you have installed:
- **Node.js** (v18+): https://nodejs.org
- **MongoDB Atlas** (free): https://mongodb.com/atlas
- A **Gmail account** for sending emails

---

### Step 2 – MongoDB Atlas Setup
1. Go to https://mongodb.com/atlas and create a free account
2. Create a new **Cluster** (free tier is fine)
3. Go to **Database Access** → Add a database user with password
4. Go to **Network Access** → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
5. Go to your cluster → **Connect** → **Connect your application**
6. Copy the connection string: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/`

---

### Step 3 – Configure Environment Variables
Open `backend/.env` and fill in your values:

```env
PORT=5000
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/hanz_nails?retryWrites=true&w=majority
JWT_SECRET=any_long_random_string_here_change_this_2024
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
ADMIN_EMAIL=your_email@gmail.com
CLIENT_URL=http://localhost:3000
```

#### Getting Gmail App Password:
1. Go to your Google Account → Security
2. Enable **2-Step Verification**
3. Go to **App Passwords** → Select app: Mail → Select device: Other → name it "Hanz Nails"
4. Copy the 16-character password → paste as `EMAIL_PASS`

---

### Step 4 – Install Dependencies

Open **two terminal windows**:

**Terminal 1 – Backend:**
```bash
cd hanz-nails/backend
npm install
```

**Terminal 2 – Frontend:**
```bash
cd hanz-nails/frontend
npm install
```

---

### Step 5 – Create Admin Account
After starting the backend, you need to manually set your account as admin.

1. Register on the website at http://localhost:3000/register
2. In MongoDB Atlas, go to your cluster → Browse Collections → `users` collection
3. Find your user document → Click Edit → Change `"role": "customer"` to `"role": "admin"`
4. Save → Now you can access http://localhost:3000/admin

---

### Step 6 – Run Development Servers

**Terminal 1 – Start Backend:**
```bash
cd hanz-nails/backend
npm run dev
```
Backend runs at: http://localhost:5000

**Terminal 2 – Start Frontend:**
```bash
cd hanz-nails/frontend
npm start
```
Frontend opens at: http://localhost:3000

---

## 🌐 DEPLOYMENT

### Deploy Backend to Railway (Recommended – Free)
1. Go to https://railway.app and create account
2. New Project → Deploy from GitHub repo
3. Select your repo → Choose the `backend` folder as root
4. Add environment variables (same as your .env file)
5. Railway gives you a URL like: `https://hanz-nails-backend.railway.app`

### Deploy Frontend to Vercel (Recommended – Free)
1. Go to https://vercel.com and create account
2. New Project → Import from GitHub
3. Select your repo → Set root directory to `frontend`
4. Add environment variable:
   - `REACT_APP_API_URL` = `https://your-railway-backend-url.railway.app/api`
5. Deploy → Vercel gives you a URL like: `https://hanznails.vercel.app`

### Update Backend CORS for Production
In `backend/.env`, update:
```env
CLIENT_URL=https://hanznails.vercel.app
```

---

## ✨ FEATURES INCLUDED

| Feature | Status |
|---------|--------|
| Homepage with hero, services preview, why us section | ✅ |
| Full services menu (Nails + Lashes + Packages) | ✅ |
| Online booking with date/time picker | ✅ |
| Customer registration & login | ✅ |
| Birthday date input → auto 50% discount on birthday | ✅ |
| Birthday email with discount code sent automatically | ✅ |
| Admin gets email on every new registration | ✅ |
| Customer gets welcome email on registration | ✅ |
| Booking confirmation email | ✅ |
| Admin dashboard (stats, all bookings, all customers) | ✅ |
| Customer dashboard (view/cancel bookings, discount codes) | ✅ |
| Opening hours display | ✅ |
| Social media links (Facebook, Instagram, TikTok, WhatsApp) | ✅ |
| Google Maps link | ✅ |
| SEO meta tags + Local Business Schema | ✅ |
| Free coffee/matcha mentioned throughout | ✅ |
| Mobile responsive | ✅ |
| JWT authentication | ✅ |
| Password hashing (bcrypt) | ✅ |

---

## 📞 Contact Info Configured
- **Address:** 19 Ali Amer St, Nasr City, Cairo
- **Phone 1:** +20 10 2056 4047
- **Phone 2:** +20 10 1366 6610
- **Email:** hanznailssalon@gmail.com

---

## 🔧 API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| GET | /api/services | Get all services |
| POST | /api/bookings | Create booking |
| GET | /api/bookings/my | Get my bookings |
| PUT | /api/bookings/:id/cancel | Cancel booking |
| GET | /api/discounts/my | Get my discount codes |
| POST | /api/discounts/validate | Validate discount code |
| GET | /api/admin/stats | Admin stats |
| GET | /api/admin/bookings | All bookings |
| GET | /api/admin/users | All users |
| PUT | /api/admin/bookings/:id/status | Update booking status |
| DELETE | /api/admin/users/:id | Delete user |

---

## 🎂 Birthday Discount System
The system runs a **cron job every day at 8:00 AM** that:
1. Finds all users whose birthday is today
2. Generates a unique `BDAY50-XXXXXXXX` code (50% off)
3. Saves the code to the user's account (valid 30 days)
4. Sends a beautiful birthday email with the discount code
5. Code can be applied at checkout

---

## 💡 Tips for Top Google Search
1. After deploying, submit your URL to **Google Search Console**: https://search.google.com/search-console
2. Add your business to **Google Business Profile**: https://business.google.com
3. Use the address: "19 Ali Amer Street, Nasr City, Cairo" consistently everywhere
4. Encourage customers to leave Google reviews
5. The SEO schema in index.html already declares the business to Google bots
