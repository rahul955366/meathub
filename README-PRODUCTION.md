# MEATHUB - Production Deployment Guide

## Overview
This guide covers production deployment, configuration, and best practices for MEATHUB.

## Prerequisites
- Docker & Docker Compose
- MySQL 8.0+
- Redis (for caching)
- Environment variables configured
- SSL certificates (for HTTPS)

## Environment Variables

### Required Variables
```bash
# Database
DB_ROOT_PASSWORD=your_secure_password
DB_USERNAME=meathub_user
DB_PASSWORD=your_secure_password

# JWT
JWT_SECRET=your_256_bit_secret_key

# Payment Gateway
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret

# Redis
REDIS_PASSWORD=your_redis_password

# Error Tracking
SENTRY_DSN=your_sentry_dsn

# Email/SMS (Optional)
EMAIL_PROVIDER=ses|sendgrid|smtp
EMAIL_API_KEY=your_email_api_key
SMS_PROVIDER=sns|twilio|msg91
SMS_API_KEY=your_sms_api_key
```

## Deployment Steps

### 1. Build Docker Images
```bash
docker-compose -f docker-compose.production.yml build
```

### 2. Start Services
```bash
docker-compose -f docker-compose.production.yml up -d
```

### 3. Initialize Database
```bash
# Run database migrations
docker exec -i meathub-mysql-prod mysql -uroot -p${DB_ROOT_PASSWORD} < database-setup.sql

# Create indexes
docker exec -i meathub-mysql-prod mysql -uroot -p${DB_ROOT_PASSWORD} < database-indexes.sql
```

### 4. Verify Health
```bash
# Check API Gateway
curl http://localhost:8000/actuator/health

# Check Order Service
curl http://localhost:8084/actuator/health
```

## Monitoring

### Prometheus & Grafana
```bash
docker-compose -f docker-compose.monitoring.yml up -d
```

Access:
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3000 (admin/admin)

### Logs
```bash
# View logs
docker-compose -f docker-compose.production.yml logs -f order-service

# Export logs
docker-compose -f docker-compose.production.yml logs > logs/order-service.log
```

## Security Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT secret (256-bit)
- [ ] Enable HTTPS/TLS
- [ ] Configure firewall rules
- [ ] Set up rate limiting
- [ ] Enable CORS only for trusted domains
- [ ] Use secrets manager (AWS Secrets Manager, HashiCorp Vault)
- [ ] Regular security updates
- [ ] Enable audit logging
- [ ] Configure backup strategy

## Performance Optimization

### Database
- Use connection pooling (HikariCP configured)
- Create indexes (see database-indexes.sql)
- Enable query caching
- Regular VACUUM/OPTIMIZE

### Caching
- Redis for session storage
- Cache frequently accessed data
- Set appropriate TTL values

### Application
- Enable gzip compression
- Use CDN for static assets
- Configure load balancer
- Horizontal scaling

## Backup Strategy

### Database Backup
```bash
# Daily backup
docker exec meathub-mysql-prod mysqldump -uroot -p${DB_ROOT_PASSWORD} meathub_order > backup_$(date +%Y%m%d).sql

# Restore
docker exec -i meathub-mysql-prod mysql -uroot -p${DB_ROOT_PASSWORD} meathub_order < backup_20241216.sql
```

### Automated Backups
Set up cron job or use cloud backup service (AWS RDS, etc.)

## Scaling

### Horizontal Scaling
```bash
# Scale order service
docker-compose -f docker-compose.production.yml up -d --scale order-service=3
```

### Load Balancer
Configure Nginx or AWS ALB to distribute traffic across instances.

## Troubleshooting

### Service Won't Start
1. Check logs: `docker-compose logs order-service`
2. Verify environment variables
3. Check database connectivity
4. Verify port availability

### High Memory Usage
1. Check JVM heap size
2. Review cache configuration
3. Analyze slow queries
4. Check for memory leaks

### Database Connection Issues
1. Verify MySQL is running
2. Check connection pool settings
3. Review firewall rules
4. Check credentials

## Support

For issues or questions:
- Email: support@meathub.com
- Documentation: https://docs.meathub.com
- Status Page: https://status.meathub.com

