# MEATHUB - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Maven 3.8+
- MySQL 8.0+
- Node.js 20+
- Docker & Docker Compose (optional)

### 1. Database Setup

```bash
# Start MySQL
mysql -u root -p

# Create databases
CREATE DATABASE meathub_auth;
CREATE DATABASE meathub_order;
CREATE DATABASE meathub_user;
CREATE DATABASE meathub_subscription;
CREATE DATABASE meathub_media;
# ... (other services)

# Run migrations (if any)
# Database schemas are auto-created via JPA ddl-auto=update
```

### 2. Backend Services

```bash
# Start API Gateway
cd api-gateway
mvn spring-boot:run

# Start Order Service
cd order-service
mvn spring-boot:run

# Start other services similarly
# Each service runs on its configured port (see application.properties)
```

### 3. Frontend

```bash
cd "MEATHUB Application Design"
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

### 4. Access Points

- **Frontend**: http://localhost:5173
- **API Gateway**: http://localhost:8000
- **Swagger UI**: http://localhost:8084/swagger-ui.html (dev only)
- **Prometheus**: http://localhost:9090 (if monitoring is running)
- **Grafana**: http://localhost:3000 (if monitoring is running)

### 5. Docker Deployment (Recommended)

```bash
# Development
docker-compose up -d

# Production
docker-compose -f docker-compose.production.yml up -d

# With Monitoring
docker-compose -f docker-compose.monitoring.yml up -d
```

### 6. Environment Variables

Create `.env` file:
```bash
DB_ROOT_PASSWORD=your_password
JWT_SECRET=your_256_bit_secret
RAZORPAY_KEY_ID=your_key
RAZORPAY_SECRET=your_secret
REDIS_PASSWORD=your_redis_password
SENTRY_DSN=your_sentry_dsn
```

### 7. Test the System

1. **Register a user**: http://localhost:5173
2. **Add items to cart**
3. **Place an order**
4. **Check Swagger docs**: http://localhost:8084/swagger-ui.html
5. **Monitor metrics**: http://localhost:9090

---

## 🔧 Common Issues

### Port Already in Use
```bash
# Find and kill process
netstat -ano | findstr :8084
taskkill /PID <PID> /F
```

### Database Connection Failed
- Check MySQL is running
- Verify credentials in `application.properties`
- Ensure database exists

### CORS Errors
- Verify API Gateway CORS configuration
- Check frontend API URL matches gateway

---

## 📖 Next Steps

1. Read `README-PRODUCTION.md` for production deployment
2. Check `PRODUCTION-READINESS-SUMMARY.md` for feature overview
3. Explore Swagger UI for API documentation
4. Set up monitoring with Prometheus/Grafana

---

## 🆘 Support

For issues or questions:
- Check logs: `logs/` directory
- Review error messages in Swagger UI
- Check health endpoints: `/actuator/health`

