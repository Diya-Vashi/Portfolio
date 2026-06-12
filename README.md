<div align="center">
  <h1>✨ Diya Vashi | Developer Portfolio</h1>
  <p>A modern, full-stack developer portfolio built with Next.js, Tailwind CSS, Prisma, and PostgreSQL.</p>

  <div>
    <img src="https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Prisma-7.8-2D3748?style=for-the-badge&logo=prisma" alt="Prisma" />
    <img src="https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  </div>
</div>

---

## 🚀 Features

- **Modern UI/UX**: Fully responsive, beautifully designed dark/light mode interface using standard web aesthetics.
- **Dynamic Content**: Data is driven entirely by a PostgreSQL database, making updates seamless.
- **Secure Admin Panel**: A private backend dashboard protected by JWT authentication.
- **Live Device Preview**: Instantly view how the portfolio responds to mobile, tablet, and desktop directly from the admin panel.
- **Real-Time Analytics**: Built-in tracking for visitors, engagement rates, and incoming contact messages.
- **SEO Optimized**: Built for high performance and discoverability.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (Hosted on Neon.tech)
- **ORM**: [Prisma Client](https://www.prisma.io/)
- **Authentication**: JWT & bcryptjs
- **Icons**: [Lucide React](https://lucide.dev/)

---

## ⚙️ Local Development

Follow these steps to run the project locally.

### 1. Clone the repository
```bash
git clone https://github.com/your-username/portfolio.git
cd portfolio
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Environment Variables
Create a `.env` file in the root of the project and add your credentials:
```env
# Database configuration
DATABASE_URL="postgresql://user:password@hostname/dbname?sslmode=require"

# Admin Authentication
JWT_SECRET="your-super-secret-key-12345"

# Email Notifications (Optional)
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
```

### 4. Push the Database Schema
Sync the Prisma schema with your new PostgreSQL database:
```bash
npx prisma generate
npx prisma db push
```

### 5. Start the Application
Run the local development server:
```bash
npm run dev
```

The application will be running at [http://localhost:3000](http://localhost:3000).

> **Note:** To create your first Admin user, run your local server and temporarily visit `http://localhost:3000/api/admin/seed`. This will generate the master admin account `vashidiya@gmail.com` with the password `admin`.

---

## 🌐 Deployment

This project is optimized for deployment on **Vercel**.

1. Push your code to GitHub.
2. Import the repository into your Vercel dashboard.
3. Ensure you add all the Environment Variables from your `.env` file into Vercel's Environment Variables settings.
4. Click **Deploy**. Vercel will handle the Next.js build and database generation automatically.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
