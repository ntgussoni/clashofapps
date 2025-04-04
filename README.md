# Clash of Apps 🚀

https://github.com/user-attachments/assets/f7d3368c-eab0-4b95-99fe-8b88a4f26968


Track & Analyze Your App Competitors.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)

## Overview

Clash of Apps helps you understand your competition in the app stores through data-driven insights. Compare app store listings, analyze reviews, and track market positions across Google Play Store (App Store coming soon)

## 🌟 Features

### Available Now

- **App Comparison**: Side-by-side analysis of app store listings, reviews, and ratings
- **Review Analysis**: AI-powered sentiment analysis of competitor reviews
- **Analytics Dashboard**: Clean, intuitive interface for viewing insights

### Coming Soon

- **Real-time Tracking**: Monitoring of competitor changes and updates
- **Custom Alerts**: Notifications for important competitor changes
- **Historical Data**: Track changes over time
- **Automated Reports**: Scheduled competitor analysis reports

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or Bun
- PostgreSQL database
- npm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/clash-of-apps.git
   cd clash-of-apps
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up your environment variables:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your database and API credentials.

4. Initialize the database:

   ```bash
   npm db:push
   ```

5. Create an admin user:

   ```bash
   bunx tsx src/scripts/seed-admin.ts
   ```

6. Start the development server:
   ```bash
   npm dev
   ```

Visit `http://localhost:3000` to see your app!

## 🛠 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [Better Auth](https://better-auth.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [Shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [TanStack Query](https://tanstack.com/query)
- **API Layer**: [tRPC](https://trpc.io/)

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

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

---

Built with ❤️ by https://x.com/ntorresdev
