# 🥩 MEATHUB - Multi-Portal Meat Delivery Platform

A comprehensive, production-ready meat delivery platform featuring three distinct web applications for customers, administrators, and butchers, built with modern full-stack technologies.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🌟 Features

### 🎯 Multi-Portal Architecture

**Customer Portal** - Modern e-commerce experience
- Browse premium meat products
- Smart shopping cart
- Order tracking system
- Pet meat section
- Gym protein plans
- Subscription management

**Admin Portal** - Professional management dashboard
- Real-time analytics dashboard with interactive charts
- AI-powered chatbot assistant
- Orders, users, and butchers management
- Complaints and refunds processing
- Beautiful glassmorphism dark theme
- Responsive design with smooth animations

**Butcher Portal** - Simple, accessible interface
- Large, touch-friendly UI
- Today's orders at a glance
- Earnings tracker
- Order status management
- Illiterate-friendly design

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with Hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Recharts** - Interactive data visualization
- **React Router** - Client-side routing

### Backend
- **Spring Boot 3.2** - Java microservices framework
- **Java 21** - Latest LTS version
- **Spring Cloud Gateway** - API Gateway
- **Spring Security + JWT** - Authentication & authorization
- **MySQL** - Relational database
- **Spring Data JPA** - Data persistence
- **Maven** - Build automation

## 📁 Project Structure

```
meathub/
├── 🌐 Frontend Portals
│   ├── admin-portal/          # Admin management portal
│   ├── butcher-portal/        # Butcher operations portal
│   └── meatup-frontend/       # Customer-facing application
│
├── ⚙️ Backend Services
│   ├── api-gateway/           # API Gateway (Port 8000)
│   ├── auth-service/          # Authentication (Port 8001)
│   ├── user-service/          # User management (Port 8002)
│   ├── butcher-service/       # Butcher operations (Port 8003)
│   ├── order-service/         # Order processing (Port 8004)
│   ├── pet-service/           # Pet meat products (Port 8005)
│   ├── ai-service/            # AI assistant (Port 8006)
│   └── gym-service/           # Gym proteins (Port 8007)
│
└── 📚 Documentation
    └── *.md files             # Comprehensive guides
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Java 21
- Maven 3.8+
- MySQL 8.0+

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/rahul955366/meathub.git
cd meathub
```

2. **Install frontend dependencies**
```bash
# Customer Portal
cd meatup-frontend
npm install

# Admin Portal
cd ../admin-portal
npm install

# Butcher Portal
cd ../butcher-portal
npm install
```

3. **Setup MySQL databases**
```sql
CREATE DATABASE meathub_auth;
CREATE DATABASE meathub_users;
CREATE DATABASE meathub_butchers;
CREATE DATABASE meathub_orders;
CREATE DATABASE meathub_pets;
CREATE DATABASE meathub_gym;
```

4. **Configure application.properties** for each service with your MySQL credentials

5. **Start all services**
```bash
# Windows
.\START_ALL.ps1

# Linux/Mac
./start_all.sh
```

## 🌐 Access Points

Once running, access the portals at:

- **Customer Portal**: http://localhost:5173
- **Admin Portal**: http://localhost:5174
  - Login: `admin@meathub.com` / `admin123`
- **Butcher Portal**: http://localhost:5175
  - Login: `butcher@meathub.com` / `butcher123`

- **API Gateway**: http://localhost:8000

## 📊 Key Features by Portal

### Admin Portal
- 📈 Real-time analytics dashboard
- 🤖 AI chatbot assistant
- 📦 Orders management with search & filters
- 👥 Users management
- 🥩 Butchers approval system
- 💰 Refunds processing
- ⚠️ Complaints management
- 📊 Interactive charts (Revenue, Orders, Categories, Products)

### Butcher Portal
- 📱 Mobile-first design
- 📦 Today's orders
- 💵 Earnings tracker
- ✅ Order status updates
- 👤 Profile management
- 🎨 Color-coded order status

### Customer Portal
- 🛒 Shopping cart
- 📦 Order tracking
- 🐾 Pet meat products
- 💪 Gym protein supplements
- 📅 Subscription management

## 🚀 Deployment

### Quick Deploy (Frontend Only - FREE)

Deploy to Vercel in 15 minutes:

```bash
# Build all portals
.\BUILD_FOR_DEPLOYMENT.ps1

# Upload dist folders to vercel.com
```

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for complete deployment options.

## 📚 Documentation

- [Deployment Guide](DEPLOYMENT_GUIDE.md) - Complete deployment instructions
- [Quick Deploy](QUICK_DEPLOY.md) - 15-minute deployment guide
- [Spring Boot Mastery Part 1](SPRINGBOOT_MASTERY_PART1.md) - Backend development guide
- [Spring Boot Mastery Part 2](SPRINGBOOT_MASTERY_PART2.md) - Advanced topics
- [Admin Portal Design System](ADMIN_PORTAL_DESIGN_SYSTEM.md) - Design guidelines
- [Butcher Portal Design](BUTCHER_PORTAL_DESIGN.md) - UI/UX specifications

## 🎯 Project Highlights

- ✅ **Production-Ready**: Fully functional with mock data
- ✅ **Modern UI/UX**: Beautiful, responsive design
- ✅ **AI Integration**: Smart chatbot assistant
- ✅ **Microservices**: Scalable architecture
- ✅ **Type-Safe**: Full TypeScript frontend
- ✅ **Secure**: JWT-based authentication
- ✅ **Well-Documented**: Comprehensive guides

## 🛡️ Security

- JWT-based authentication
- Role-based access control (RBAC)
- Secure password hashing
- CORS configuration
- Input validation

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Rahul Sangoju**
- GitHub: [@rahul955366](https://github.com/rahul955366)
- Email: sangojurahulbhargava@gmail.com

## 🙏 Acknowledgments

- React team for the amazing framework
- Spring Boot team for excellent documentation
- Tailwind CSS for the utility-first approach
- Vercel for free hosting

## 📞 Support

For support, email sangojurahulbhargava@gmail.com or open an issue on GitHub.

---

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by Rahul Sangoju
