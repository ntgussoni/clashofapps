# Clash of Apps 🚀

https://github.com/user-attachments/assets/f7d3368c-eab0-4b95-99fe-8b88a4f26968

Track & Analyze Your App Competitors.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)

## Overview

Clash of Apps helps you understand your competition in the app stores through data-driven insights. Compare app store listings, analyze reviews, and track market positions across both Google Play Store and Apple App Store.

## 🌟 Features

### Available Now

- **Multi-Platform Support**: Analyze apps from both Google Play Store and Apple App Store
- **Cross-Platform Comparison**: Side-by-side analysis of app store listings, reviews, and ratings across iOS and Android
- **AI-Powered Review Analysis**: Advanced sentiment analysis of competitor reviews from both platforms
- **Unified Analytics Dashboard**: Clean, intuitive interface for viewing insights across both stores
- **Platform Detection**: Automatic detection of app store platform from URLs or app IDs

### Coming Soon

- **Real-time Cross-Platform Tracking**: Monitor competitor changes and updates across both stores
- **Custom Alerts**: Notifications for important competitor changes on any platform
- **Historical Data**: Track changes over time across iOS and Android
- **Automated Reports**: Scheduled competitor analysis reports covering both platforms

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or Bun
- PostgreSQL database
- npm
- OpenAI API KEY

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
   npm run db:generate
   npm run db:push
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## � Supported Platforms

### Google Play Store
- App metadata and reviews
- Competitive analysis
- Feature extraction
- Sentiment analysis
- Market positioning

### Apple App Store  
- App information and reviews
- Cross-platform comparison
- iOS-specific insights
- Feature performance tracking
- User sentiment analysis

## 🔧 Usage

### Analyzing Google Play Store Apps

```
Enter any of these formats:
- https://play.google.com/store/apps/details?id=com.example.app
- com.example.app
```

### Analyzing Apple App Store Apps

```
Enter any of these formats:
- https://apps.apple.com/us/app/app-name/id123456789
- https://itunes.apple.com/us/app/app-name/id123456789  
- 123456789
```

The platform automatically detects the store and provides comprehensive analysis.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Better Auth
- **Data Sources**: 
  - Google Play Scraper for Android apps
  - App Store Scraper for iOS apps
- **AI Analysis**: OpenAI GPT-4
- **Deployment**: Vercel

## � Analysis Features

- **Sentiment Analysis**: Understand user sentiment across both platforms
- **Feature Extraction**: Identify key features mentioned in reviews
- **Competitive Positioning**: Compare against competitors on both stores
- **Market Insights**: Gain insights into market trends across iOS and Android
- **Recommendation Engine**: Get actionable insights for improvement

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.txt](LICENSE.txt) file for details.

## 🙏 Acknowledgments

- [Google Play Scraper](https://github.com/facundoolano/google-play-scraper) for Android app data
- [App Store Scraper](https://github.com/facundoolano/app-store-scraper) for iOS app data
- [OpenAI](https://openai.com/) for AI-powered analysis
- [Vercel](https://vercel.com/) for hosting and deployment

## 📞 Support

If you have any questions or need help, please:

1. Check our [Documentation](docs/)
2. Open an [Issue](https://github.com/yourusername/clash-of-apps/issues)
3. Join our [Discord Community](https://discord.gg/clashofapps)

---

Built with ❤️ for developers, by developers.
