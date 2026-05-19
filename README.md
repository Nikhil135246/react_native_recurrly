# Recurrly 📱

A modern cross-platform mobile application for managing, tracking, and optimizing recurring subscriptions. Built with React Native, Recurrly helps users gain insights into their subscription spending and make informed decisions about their recurring payments.

---

## 📸 App Screenshots

<div style="display: flex; gap: 10px;">
<img src="https://github.com/user-attachments/assets/af237068-ba9f-4c3f-aa6f-5a979df83a84" width="280" alt="Monthly insights screen" />
<img src="https://github.com/user-attachments/assets/dbb6fc52-1f23-44e6-a4bd-0c58b0ad42b4" width="280" alt="Subscription management" />
</div>

---

## ✨ Key Features

- **💳 Subscription Management** - Add, edit, and delete all your recurring subscriptions in one place
- **📊 Financial Insights** - Get detailed analytics on your monthly, yearly, and total spending across all subscriptions
- **📅 Upcoming Reminders** - Stay informed with upcoming subscription renewal dates and payment reminders
- **🎨 Intuitive Dashboard** - Clean and modern UI for quick overview of all active subscriptions
- **🔐 Secure Authentication** - Enterprise-grade authentication via Clerk with encrypted secure storage
- **📱 Cross-Platform** - Works seamlessly on iOS, Android, and Web
- **⚡ Real-time Sync** - Instant updates across all your devices
- **🎯 Smart Categorization** - Organize subscriptions by category for better tracking
- **💰 Cost Analysis** - Track spending patterns and identify savings opportunities

---

## 🛠️ Tech Stack

### Frontend Framework
- **[React Native](https://reactnative.dev/)** (v0.81.5) - Cross-platform mobile development
- **[Expo](https://expo.dev/)** (v54.0.33) - Managed React Native workflow with SDK 54
- **[Expo Router](https://docs.expo.dev/router/introduction/)** (v6.0.23) - File-based routing for navigation
- **[React](https://react.dev/)** (v19.1.0) - UI component library

### Styling & UI
- **[NativeWind](https://www.nativewind.dev/)** (v5.0.0-preview.3) - Tailwind CSS for React Native
- **[Tailwind CSS](https://tailwindcss.com/)** (v4.2.2) - Utility-first CSS framework
- **[Expo Vector Icons](https://icons.expo.fyi/)** (v15.0.3) - Comprehensive icon set

### Authentication & Security
- **[Clerk](https://clerk.dev/)** (v3.2.4) - Enterprise authentication platform
- **[Expo Secure Store](https://docs.expo.dev/modules/expo-secure-store/)** - Secure credential storage

### Navigation & Gestures
- **[React Navigation](https://reactnavigation.org/)** (v7.1.8) - Routing and navigation
- **[React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)** (v2.28.0) - Touch handling
- **[React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)** (v4.1.1) - Smooth animations

### Utilities & Libraries
- **[TypeScript](https://www.typescriptlang.org/)** (v5.9.2) - Type-safe JavaScript
- **[Day.js](https://day.js.org/)** (v1.11.20) - Lightweight date library
- **[clsx](https://github.com/lukeed/clsx)** (v2.1.1) - Conditional className utility
- **[Expo Haptics](https://docs.expo.dev/modules/expo-haptics/)** - Haptic feedback support
- **[Expo Constants](https://docs.expo.dev/modules/expo-constants/)** - App constants and metadata
- **[Expo Font](https://docs.expo.dev/modules/expo-font/)** - Custom font loading

### Development Tools
- **[ESLint](https://eslint.org/)** (v9.25.0) - Code quality and style
- **[PostCSS](https://postcss.org/)** (v8.5.8) - CSS transformation

---

## 🎯 Use Cases

### For Individual Users
- **Personal Finance Management** - Track all monthly subscriptions and understand spending patterns
- **Budget Planning** - Identify which subscriptions are worth keeping based on actual usage
- **Expense Optimization** - Find opportunities to reduce recurring costs by analyzing spending

### For Financial Planners
- **Client Advisory** - Help clients review and optimize their subscription expenses
- **Comprehensive Analysis** - Show detailed breakdowns of recurring costs across all categories
- **Savings Identification** - Identify redundant or underutilized subscriptions

### For Students & Young Professionals
- **Budget Awareness** - Stay on top of subscription costs during tight financial periods
- **Spending Control** - Monitor discretionary spending and make informed decisions
- **Financial Habits** - Build healthy financial habits by understanding true recurring expenses

### For Families
- **Family Budget Control** - Aggregate all family subscriptions in one dashboard
- **Shared Expense Tracking** - See who is subscribed to what and coordinate overlaps
- **Savings Opportunities** - Find family plans or consolidate duplicate services

---

## 💳 Subscription Plans (Future Enhancement)

### Basic - Free
- ✅ Manage up to 5 subscriptions
- ✅ Basic analytics and reporting
- ✅ Mobile app access (iOS & Android)
- ✅ Basic notifications

### Pro - $4.99/month
- ✅ Unlimited subscriptions
- ✅ Advanced analytics and insights
- ✅ Custom categories and tags
- ✅ Export reports (PDF/CSV)
- ✅ Cloud backup and sync
- ✅ Priority support

### Premium - $9.99/month
- ✅ All Pro features
- ✅ AI-powered spending insights
- ✅ Subscription recommendations
- ✅ Integration with bank accounts
- ✅ Family plan management
- ✅ Advanced budget forecasting
- ✅ Dedicated account support

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Nikhil135246/react_native_recurrly.git
   cd react_native_recurrly
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Add your Clerk API keys to the `.env.local` file

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on your platform**
   - **iOS**: Press `i` in terminal
   - **Android**: Press `a` in terminal
   - **Web**: Press `w` in terminal
   - **Expo Go**: Scan the QR code with Expo Go app

### Available Scripts

- `npm start` - Start the Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run web` - Run on web browser
- `npm run lint` - Run ESLint to check code quality

---

## 📁 Project Structure

```
react_native_recurrly/
├── app/                          # App screens and routing
│   ├── (auth)/                   # Authentication screens
│   │   ├── sign-in.tsx
│   │   └── sign-up.tsx
│   ├── (tabs)/                   # Main app tabs
│   │   ├── index.tsx            # Dashboard/Home
│   │   ├── subscriptions.tsx     # Subscriptions list
│   │   ├── insights.tsx          # Analytics & insights
│   │   └── settings.tsx          # User settings
│   ├── subscriptions/[id].tsx    # Subscription details
│   ├── onboarding.tsx            # First-time user setup
│   └── _layout.tsx               # Root layout
├── components/                   # Reusable UI components
│   ├── SubscriptionCard.tsx
│   ├── UpcomingSubscriptionCard.tsx
│   └── ListHeading.tsx
├── constants/                    # App constants and data
├── lib/                          # Utility functions
├── assets/                       # Images, fonts, and icons
└── package.json
```

---

## 🔐 Security

- **Clerk Authentication** - Secure OAuth and password-based authentication
- **Encrypted Storage** - Sensitive data stored securely using Expo Secure Store
- **No Server-Side Storage** - User data remains private and secure
- **Regular Security Updates** - Dependencies kept up-to-date with latest security patches

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Quality Standards
- Run `npm run lint` before submitting PRs
- Follow the existing code style and patterns
- Add tests for new features when applicable
- Update documentation for significant changes

---

## 📚 Learning Resources

- [Expo Documentation](https://docs.expo.dev/) - Official Expo guides and API reference
- [React Native Docs](https://reactnative.dev/docs/getting-started) - React Native fundamentals
- [Clerk Documentation](https://clerk.com/docs) - Authentication setup and best practices
- [NativeWind Guide](https://www.nativewind.dev/) - Tailwind CSS for React Native

---

## 🐛 Bug Reports & Feature Requests

Found a bug or have a feature request? Please [open an issue](https://github.com/Nikhil135246/react_native_recurrly/issues) on GitHub!

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

**Nikhil** - [@Nikhil135246](https://github.com/Nikhil135246)

---

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev/) - The universal React framework
- Authentication powered by [Clerk](https://clerk.dev/)
- Styling with [Tailwind CSS](https://tailwindcss.com/) and [NativeWind](https://www.nativewind.dev/)
- Icons from [Expo Vector Icons](https://icons.expo.fyi/)

---

**Happy tracking! 🎉 Keep your subscriptions organized and your wallet happy!**
