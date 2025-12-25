# 🚀 MEATHUB - DEPLOYMENT GUIDE

## 📋 **PROJECT OVERVIEW**

**What We're Deploying:**

### **Frontend (3 Portals):**
1. Customer Portal (React + Vite)
2. Admin Portal (React + Vite)
3. Butcher Portal (React + Vite)

### **Backend (8 Microservices):**
1. API Gateway (Port 8000)
2. Auth Service (Port 8001)
3. User Service (Port 8002)
4. Butcher Service (Port 8003)
5. Order Service (Port 8004)
6. Pet Service (Port 8005)
7. AI Service (Port 8006)
8. Gym Service (Port 8007)

### **Database:**
- MySQL (for all services)

---

## 🎯 **DEPLOYMENT OPTIONS**

### **Option 1: Quick Deploy (Frontend Only) - FREE** ⭐ EASIEST

**Best for:** Testing, portfolio, demo
**Cost:** FREE
**Time:** 15 minutes

**Deploy frontends to Vercel/Netlify:**
- ✅ Customer Portal → vercel.com
- ✅ Admin Portal → vercel.com
- ✅ Butcher Portal → vercel.com
- ✅ Keep using mock data (already working!)

**Pros:**
- ✅ FREE forever
- ✅ Fast deployment
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Works perfectly with mock data

**Cons:**
- ❌ No real backend (uses mock data)
- ❌ Can't process real orders

---

### **Option 2: Full Cloud Deployment** ⭐ RECOMMENDED

**Best for:** Production, real business
**Cost:** $20-50/month
**Time:** 2-4 hours

**Platform Options:**

#### **A. AWS (Amazon Web Services)**
- Frontend: S3 + CloudFront
- Backend: EC2 or ECS
- Database: RDS MySQL
- **Cost:** ~$30-40/month

#### **B. Google Cloud Platform (GCP)**
- Frontend: Firebase Hosting
- Backend: Cloud Run
- Database: Cloud SQL
- **Cost:** ~$25-35/month

#### **C. Microsoft Azure**
- Frontend: Static Web Apps
- Backend: App Service
- Database: Azure Database for MySQL
- **Cost:** ~$30-45/month

#### **D. Digital Ocean** ⭐ SIMPLEST
- Frontend: App Platform
- Backend: Droplets
- Database: Managed MySQL
- **Cost:** ~$20-30/month

---

### **Option 3: Docker Deployment**

**Best for:** Self-hosting, VPS
**Cost:** $5-10/month (VPS)
**Time:** 3-5 hours

**Deploy to:**
- AWS ECS
- Google Cloud Run
- Azure Container Instances
- Any VPS (DigitalOcean, Linode, Vultr)

---

### **Option 4: Free Tier Deployment** ⭐ BEST FOR LEARNING

**Best for:** Students, learning, testing
**Cost:** FREE (with limitations)
**Time:** 1-2 hours

**Services to use:**
- Frontend: Vercel/Netlify (Free)
- Backend: Railway.app (Free tier)
- Database: Railway.app MySQL (Free tier)

**Limitations:**
- Limited requests
- Limited uptime
- Slower performance

---

## 🚀 **STEP-BY-STEP: QUICK DEPLOY (Option 1)**

### **Deploy Frontend Only (15 Minutes)**

#### **Step 1: Build Frontends**

```powershell
# Customer Portal
cd meatup-frontend
npm run build

# Admin Portal
cd ../admin-portal
npm run build

# Butcher Portal
cd ../butcher-portal
npm run build
```

#### **Step 2: Deploy to Vercel**

**For each portal:**

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "New Project"
4. Import from Git or upload folder
5. Configure:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Click "Deploy"

**Result:**
- customer.vercel.app
- admin.vercel.app
- butcher.vercel.app

**Done in 15 minutes!** ✅

---

## 🚀 **STEP-BY-STEP: FULL DEPLOYMENT (Option 2)**

### **Deploy Everything to AWS** (Recommended for production)

#### **Phase 1: Setup AWS Account (10 min)**

1. Create AWS account
2. Set up billing alerts
3. Create IAM user
4. Install AWS CLI

#### **Phase 2: Deploy Database (30 min)**

```bash
# Create RDS MySQL instance
aws rds create-db-instance \
  --db-instance-identifier meathub-db \
  --db-instance-class db.t3.micro \
  --engine mysql \
  --master-username admin \
  --master-user-password YourSecurePassword \
  --allocated-storage 20
```

#### **Phase 3: Deploy Backend Services (1-2 hours)**

**Option A: EC2 Instances**
```bash
# Launch EC2 instance
# Install Java 21
# Deploy JAR files
# Configure systemd services
```

**Option B: Elastic Beanstalk** (Easier)
```bash
# For each service
cd auth-service
mvn clean package
eb init
eb create meathub-auth
eb deploy
```

**Option C: ECS + Docker** (Best)
```bash
# Build Docker images
# Push to ECR
# Deploy to ECS Fargate
```

#### **Phase 4: Deploy Frontend (30 min)**

**To S3 + CloudFront:**
```bash
# For each portal
npm run build
aws s3 sync dist/ s3://meathub-customer
aws cloudfront create-distribution
```

#### **Phase 5: Configure (30 min)**

1. Set up domain names
2. Configure SSL/HTTPS
3. Set environment variables
4. Test everything

---

## 🐳 **DOCKER DEPLOYMENT GUIDE**

### **Step 1: Create Docker Files**

I'll create Dockerfiles for all services.

### **Step 2: Build Images**

```bash
# Backend services
docker build -t meathub/auth-service ./auth-service
docker build -t meathub/user-service ./user-service
# ... repeat for all services

# Frontend portals
docker build -t meathub/admin-portal ./admin-portal
docker build -t meathub/butcher-portal ./butcher-portal
docker build -t meathub/customer-portal ./meatup-frontend
```

### **Step 3: Deploy with Docker Compose**

```bash
docker-compose up -d
```

---

## 💰 **COST COMPARISON**

| Option | Monthly Cost | Setup Time | Difficulty |
|--------|-------------|------------|------------|
| **Frontend Only (Vercel)** | FREE | 15 min | ⭐ Easy |
| **Free Tier (Railway)** | FREE | 1-2 hours | ⭐⭐ Medium |
| **Digital Ocean** | $20-30 | 2-3 hours | ⭐⭐⭐ Medium |
| **AWS** | $30-40 | 3-4 hours | ⭐⭐⭐⭐ Hard |
| **Google Cloud** | $25-35 | 3-4 hours | ⭐⭐⭐⭐ Hard |

---

## 🎯 **MY RECOMMENDATION**

### **For NOW (Testing/Demo):**

**✅ Deploy Frontend Only to Vercel (Option 1)**

**Why:**
- ✅ FREE forever
- ✅ Takes 15 minutes
- ✅ Perfect for portfolio/demo
- ✅ Works with mock data
- ✅ Professional URLs
- ✅ Auto HTTPS

**How:**
1. Run `npm run build` for each portal
2. Upload to Vercel
3. Share links!

### **For LATER (Production):**

**✅ Full AWS Deployment (Option 2A)**

**Why:**
- ✅ Industry standard
- ✅ Scalable
- ✅ Reliable
- ✅ Good for resume

---

## 📝 **WHAT DO YOU WANT TO DO?**

**Choose ONE:**

1. **Quick Deploy (Vercel)** - I'll create deployment scripts NOW
2. **Full AWS Deploy** - I'll create complete AWS guide
3. **Docker Deploy** - I'll create Docker files
4. **Free Tier Deploy** - I'll set up Railway.app

**Tell me which option you prefer!**

---

## 🔧 **PREREQUISITES FOR DEPLOYMENT**

### **For Frontend Only:**
- ✅ Nothing! Just Vercel account

### **For Full Deployment:**
- AWS/GCP/Azure account
- Credit card (for cloud services)
- Domain name (optional, ~$10/year)
- Basic command line knowledge

### **For Docker:**
- Docker installed
- VPS server or cloud platform
- Basic Docker knowledge

---

## 📊 **DEPLOYMENT CHECKLIST**

**Before deploying:**
- [ ] Test locally (all portals working)
- [ ] Build all frontends successfully
- [ ] Backend services compile
- [ ] Database schema ready
- [ ] Environment variables prepared
- [ ] Domain name registered (if needed)

**After deploying:**
- [ ] All URLs accessible
- [ ] HTTPS working
- [ ] Database connected
- [ ] APIs responding
- [ ] Frontend-Backend communication working
- [ ] Error logging configured

---

**Which deployment option would you like me to help you with?** 🚀

1. Quick Frontend Deploy (15 min, FREE)
2. Full Cloud Deploy (AWS/GCP/Azure)
3. Docker Deployment
4. Free Tier (Railway/Render)

**Let me know and I'll create the complete deployment files!** 💪
