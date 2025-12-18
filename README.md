<img width="1475" height="675" alt="lak-lms" src="https://github.com/user-attachments/assets/d4007cba-d977-4405-9faf-14c5c291f887" />

An advanced, full-stack Learning Management System built with Next.js 16, Prisma, Stripe, and AWS S3. Designed to provide a seamless educational experience with features like course creation, secure student enrollment, video content delivery, and real-time progress tracking.

## 🚀 Key Features

- **🔐 Robust Authentication**: Secure sign-up/login using **Better Auth** with Email OTP and GitHub/Google OAuth.
- **👥 Role-Based Access**: Distinct roles for **Admins**, **Tutors**, and **Students** with protected routes and dashboards.
- **📚 Course Management**: Comprehensive tools for instructors to create, edit, and publish courses with rich text descriptions (TipTap) and video lessons.
- **🎥 Video Streaming**: High-performance video content delivery powered by **AWS S3** with secure, presigned URLs.
- **💳 Secure Payments**: Integrated **Stripe** checkout for one-time course purchases and subscription models (e.g., "Become a Tutor").
- **📈 Progress Tracking**: Real-time tracking of lesson completion and overall course progress for students.
- **🛡️ Advanced Security**: Protected by **Arcjet** for bot detection, rate limiting, and SQL injection prevention.
- **📧 Transactional Emails**: Automated email notifications and OTPs via **Resend**.
- **📊 Interactive Dashboard**: Visual analytics and stats using **Recharts** and **TanStack Table**.
- **🎨 Modern UI/UX**: fast and responsive interface built with **Tailwind CSS 4** and **Radix UI(Shadcn)** components.

## 🛠️ Tech Stack

### Frontend

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Components**: [Radix UI](https://www.radix-ui.com/), [Shadcn UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Rich Text**: [TipTap](https://tiptap.dev/)
- **Charts**: [Recharts](https://recharts.org/)

### Backend

- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Auth**: [Better Auth](https://better-auth.com/)
- **Server Actions**: Next.js Server Actions for mutations

### Infrastructure & Services

- **Storage**: [AWS S3](https://aws.amazon.com/s3/)
- **Payments**: [Stripe](https://stripe.com/)
- **Email**: [Resend](https://resend.com/)
- **Security**: [Arcjet](https://arcjet.com/)


## 🏗️ Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- **Node.js** (v20+ recommended)
- **pnpm** (Package Manager)
- **PostgreSQL** Database URL
- Accounts for **Stripe**, **AWS**, **Resend**, and **Arcjet**

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/lak_lms_system.git
   cd lak_lms_system
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add the following keys:

   ```env
   # Database
   DATABASE_URL="postgresql://..."

   # Authentication (Better Auth)
   BETTER_AUTH_SECRET="your_generated_secret"
   BETTER_AUTH_URL="http://localhost:3000"
   AUTH_GITHUB_CLIENT_ID="your_github_client_id"
   AUTH_GITHUB_SECRET="your_github_secret"
   AUTH_GOOGLE_CLIENT_ID="your_google_client_id"
   AUTH_GOOGLE_SECRET="your_google_secret"

   # Email (Resend)
   RESEND_API_KEY="re_..."

   # Security (Arcjet)
   ARCJET_KEY="aj_..."

   # Storage (AWS S3)
   AWS_ACCESS_KEY_ID="your_access_key"
   AWS_SECRET_ACCESS_KEY="your_secret_key"
   AWS_REGION="us-east-1"
   NEXT_PUBLIC_S3_NAME_IMGES="your_bucket_name"

   # Payments (Stripe)
   STRIPE_API_KEY="sk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   STRIPE_TUTOR_PRODUCT_ID="prod_..."
   ```

4. **Setup the Database:**
   Push the schema to your database.

   ```bash
   npx prisma db push
   ```

5. **Run the Development Server:**

   ```bash
   pnpm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

   ---

## 📁 Project Structure

```bash
lak_lms_system/
├── app/                  # Next.js App Router pages and API routes
│   ├── (auth)/           # Authentication routes
│   ├── (public)/         # Publicly accessible pages
│   ├── admin/            # Admin dashboard and controls
│   ├── dashboard/        # Student dashboard
│   └── api/              # Backend API endpoints
├── components/           # Reusable UI components
├── lib/                  # Utility functions and service configurations
├── prisma/               # Database schema
└── public/               # Static assets
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is proprietary and confidential.

---

Made with ❤️ by [Sakila Lakmal](https://github.com/Sakilalakmal)
