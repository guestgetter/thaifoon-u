# Production Deployment Guide - ThaifoonU.com

## 🚀 **Production Database Setup**

### Option 1: Vercel Postgres (Recommended)
1. **Vercel Dashboard** → Your Project → **Storage** → **Create Database**
2. **Select Postgres** → **Hobby Plan** ($20/month)
3. **Database automatically connected** - `DATABASE_URL` added to environment variables

### Option 2: Railway Postgres
1. **Railway.app** → **New Project** → **Provision PostgreSQL**
2. **Copy connection string** to Vercel environment variables
3. **Cost:** $5/month starter plan

## 🌐 **Domain Configuration**

### Setup ThaifoonU.com Domain
1. **Vercel Dashboard** → Project Settings → **Domains**
2. **Add Domain:** `thaifoon-u.com` and `www.thaifoon-u.com`
3. **DNS Configuration** (in your domain registrar):
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   
   Type: A
   Name: @
   Value: 76.76.19.61
   ```

## 🔐 **Environment Variables for Production**

Add these in **Vercel** → Project Settings → **Environment Variables**:

```bash
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# NextAuth Configuration  
NEXTAUTH_SECRET="super-long-random-production-secret-key-here"
NEXTAUTH_URL="https://thaifoon-u.com"

# File Storage (Choose one)
# Option 1: Cloudinary (Easiest)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"  
CLOUDINARY_API_SECRET="your-api-secret"

# Option 2: AWS S3 (Most Scalable)
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_S3_BUCKET_NAME="thaifoon-university-files"
```

## 📦 **File Storage Setup**

### Option 1: Cloudinary (Recommended for Start)
1. **Sign up:** [cloudinary.com](https://cloudinary.com) (Free tier: 25GB)
2. **Get credentials** from dashboard
3. **Add environment variables** above
4. **Cost:** Free → $89/month (when you scale)

### Option 2: AWS S3 (Enterprise Scale)
1. **Create S3 bucket:** `thaifoon-university-files`
2. **Set public read permissions** for uploaded files
3. **Create IAM user** with S3 access
4. **Cost:** ~$0.023/GB/month + bandwidth

## 📋 **Deployment Checklist**

- [ ] **Database:** PostgreSQL set up and connected
- [ ] **Domain:** ThaifoonU.com configured  
- [ ] **Environment Variables:** All production variables added
- [ ] **File Storage:** Cloudinary or S3 configured
- [ ] **Database Migration:** Schema deployed to production
- [ ] **Seed Data:** Demo accounts and content added
- [ ] **SSL:** HTTPS enabled (automatic with Vercel)
- [ ] **Testing:** All features working on production domain

## 🎯 **Post-Deployment**

1. **Seed Production Database:**
   ```bash
   # After deployment, run once:
   npx prisma db push
   npx tsx scripts/seed.ts
   ```

2. **Test Demo Accounts:**
   - Admin: `admin@thaifoon.com` / `admin123`
   - Manager: `manager@thaifoon.com` / `manager123`
   - Staff: `staff@thaifoon.com` / `staff123`

3. **Monitor Performance:**
   - Vercel Analytics (included)
   - Database performance monitoring
   - File storage usage tracking

## 💰 **Monthly Costs Estimate**

- **Vercel Pro:** $20/month (for custom domain + team features)
- **Database:** $20/month (Vercel Postgres Hobby)
- **File Storage:** $0-89/month (Cloudinary free tier → paid)
- **Total:** ~$40-130/month (scales with usage)

## 🚨 **Important Notes**

- **Backup Strategy:** Vercel Postgres includes daily backups
- **Scaling:** Database can handle 500+ concurrent users
- **Security:** HTTPS enforced, environment variables encrypted
- **Monitoring:** Set up alerts for database connection issues