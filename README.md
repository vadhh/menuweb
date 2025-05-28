# 🚀 QR Menu Web Application: Your Restaurant's New Best Friend! 🍔📲

Tired of sticky, outdated paper menus? Say hello to the future! This project is a slick web application for a QR code-based menu system. It lets restaurants and cafes beam their delicious offerings straight to customers' phones via a quick QR scan. It's got a snazzy customer-facing menu and a power-packed admin panel for managing all the digital goodies.

## ✨ Features That Sizzle! ✨

---

### 🙋‍♂️ For Your Awesome Customers:

* **🛍️ Menu Surfing Fun:** Browse mouth-watering items by category – no more squinting at tiny print!
* **🧐 Dish Deep Dive:** Get the full scoop on each product (name, price, delectable description).
* **🛒 Cart Your Cravings:** Add items to a virtual cart with a tap.
* **💸 Quick Checkout:** A straightforward way to send their order to the kitchen (for now – more payment magic coming soon!).

---

### 🧑‍🍳 For the Amazing Admin Crew:

* **📊 Dashboard Delights:** Get a bird's-eye view of what's cookin' (with room to grow into a full command center!).
* **🗂️ Category Control:** Add, tweak, or toss categories like a pro.
* **🍔 Product Power:** Effortlessly add new dishes, update prices, or 86 an item.
* **🧾 Order Operations:** View incoming orders, track their journey (Pending ➡️ Processed ➡️ Completed!), and manage the queue.
* **🔑 Fort Knox Security:** User authentication to keep the admin panel safe and sound.

---

## 🛠️ Tech Stack: The Magic Ingredients! 🧙‍♂️

* **Frontend:** [Next.js](https://nextjs.org/) (The React Framework for Production 🚀), [TypeScript](https://www.typescriptlang.org/) (for code that behaves!), [Tailwind CSS](https://tailwindcss.com/) (for styling that pops!)
* **Backend:** Next.js API Routes (keeping it all in the Next.js family!), [Mongoose](https://mongoosejs.com/) (making MongoDB feel like home 🏡)
* **Database:** [MongoDB](https://www.mongodb.com/) (where all the tasty data lives!)
* **Authentication:** [NextAuth.js](https://next-auth.js.org/) (Guarding the gates of your admin panel!)
* **UI Components:** [Shadcn UI](https://ui.shadcn.com/) (Likely suspects for those sleek buttons and components! 😉)
* **Icons:** [React Icons](https://react-icons.github.io/react-icons/) (Fi, ChevronLeft, AlertTriangle - making things look sharp! ✨)

Heres a very detailed Documentation:
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/vadhh/menuweb)
---

## 🚀 Get Ready for Liftoff: Setup & Installation! 🛰️

1.  **Clone the Mothership:**
    ```bash
    git clone <repository_url>
    cd qrmenu
    ```

2.  **Install the Rocket Fuel (Dependencies):**
    ```bash
    npm install
    # or if you're a yarn fan: yarn install
    # or pnpm purist: pnpm install
    # or bun believer: bun install
    ```

3.  **Spill the Secret Sauce (Environment Variables):**
    Whip up a `.env.local` file in the root of your project (yep, right here: `c:\Users\DHOOM\qrmenu\qrmenu\`). Then, pour in these essential ingredients:

    ```env
    MONGODB_URI=your_mongodb_connection_string_goes_here_buddy
    NEXTAUTH_SECRET=your_super_secret_nextauth_key_shhh
    NEXTAUTH_URL=http://localhost:3000 # Or your fancy production URL
    ```
    * `MONGODB_URI`: Your MongoDB connection string. Think of it as the secret map to your data treasure! (e.g., `mongodb+srv://<user>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority`)
    * `NEXTAUTH_SECRET`: A super-secret random string to keep NextAuth.js sessions locked down. Generate one with a magic spell like `openssl rand -base64 32`.
    * `NEXTAUTH_URL`: The main URL of your app (e.g., `http://localhost:3000` when you're coding in your pajamas).

4.  **Plant Some Seeds (Optional Database Seeding):** 🌱
    Want some dummy data to play with? Use our handy seed script!
    ```bash
    # Make sure ts-node is your friend (install globally or locally)
    npx ts-node scripts/seed.ts
    ```
    *Heads Up!* You might need to give `scripts/seed.ts` a little TLC to match your current schema and dream data.


## 🎉 Let's Get This Party Started: Running the Project! 🥳

Fire up the development server:

```bash
npm run dev
# or your preferred command:
# yarn dev
# pnpm dev
# bun dev
```
Then, point your browser to http://localhost:3000 and behold! Your QR Menu app, live and kicking!

## 🗺️ Project Blueprint: A Quick Tour! 🧭

src/app/: The heart of your Next.js app, where pages and API routes live.
(customer)/: All the cool stuff your customers will see (like that gorgeous menu!).
admin/: The command center for admins (dashboard, categories, products, orders – oh my!).
api/: The digital kitchen where data gets cooked (e.g., /api/orders, /api/products, /api/categories, /api/auth).
src/components/: Reusable React building blocks – like digital LEGOs!
src/lib/: Your utility belt! Database connections, Mongoose models, and other smart tools.
lib/mongodb.ts: The direct line to your MongoDB.
lib/models/: The blueprints for your data (Order.ts, Product.ts, Category.ts, User.ts).
public/: Where your static stuff hangs out (images, fonts, etc.).
scripts/: Helpful little scripts for tasks like seeding.

## 👑 Accessing the Throne Room (Admin Panel) 🏰
Ready to rule your menu? Navigate to /admin. If you're not logged in, our trusty NextAuth.js will politely ask for your credentials. Make sure you've got a user account set up in your database!

## 🚧 Future Adventures & Epic Quests (TODO List) 📜

[ ] Role Call! Implement robust user roles (Admin vs. Super Admin vs. Mildly-Interested User).
[ ] Oopsie Daisies & High Fives! Better error handling and more encouraging user feedback.
[ ] Table Manners! Add pagination, filtering, and super-powered searching to admin tables.
[ ] Picture Perfect! Implement image uploads for products – because a picture is worth a thousand calories!
[ ] Ka-ching! Supercharge the customer checkout (Stripe? PayPal? The world is your oyster!).
[ ] Chart Toppers! Add analytics and reporting to the admin dashboard. See what's hot!
[ ] Need for Speed! Optimize database queries and API performance for lightning-fast service.
[ ] Scan Me If You Can! Dynamically generate those nifty QR codes.
Happy Coding, and may your menus always be digital and delightful! 🎉

