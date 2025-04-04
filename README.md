# Clash of Apps 🚀

Track & Analyze Your App Competitors with ease. An open-source competitor tracking platform built with modern technologies.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)

## 🌟 Features

- **App Competitor Tracking**: Monitor your competitors' app performance
- **Analytics Dashboard**: Beautiful, intuitive analytics interface
- **Real-time Updates**: Stay up-to-date with competitor changes
- **Secure Authentication**: Built with Better Auth for robust security
- **Modern UI/UX**: Crafted with Tailwind CSS and Shadcn components
- **Fully Typed**: End-to-end type safety with TypeScript

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or Bun
- PostgreSQL database
- pnpm (recommended) or npm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/clash-of-apps.git
   cd clash-of-apps
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up your environment variables:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your database and API credentials.

4. Initialize the database:

   ```bash
   pnpm db:push
   ```

5. Create an admin user:

   ```bash
   bunx tsx src/scripts/seed-admin.ts
   ```

6. Start the development server:
   ```bash
   pnpm dev
   ```

Visit `http://localhost:3000` to see your app!

## 🛠 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [Better Auth](https://better-auth.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [Shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [TanStack Query](https://tanstack.com/query)
- **API Layer**: [tRPC](https://trpc.io/)
- **Deployment**: [Vercel](https://vercel.com)

## 📦 Project Structure

```
.
├── src/
│   ├── app/           # Next.js App Router pages
│   ├── components/    # React components
│   ├── lib/          # Utility functions
│   ├── server/       # Server-side code
│   └── styles/       # Global styles
├── prisma/           # Database schema and migrations
├── public/           # Static assets
└── scripts/         # Utility scripts
```

## 🔒 Authentication

We use Better Auth for secure authentication with the following features:

- Magic Link Authentication (Production)
- Email/Password Authentication (Development)
- Admin User Management
- Session Management

## 🤝 Contributing

We love contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [T3 Stack](https://create.t3.gg/)
- [Better Auth](https://better-auth.com/)
- [Shadcn/ui](https://ui.shadcn.com/)
- All our amazing contributors!

---

Built with ❤️ by [Your Name/Team]
