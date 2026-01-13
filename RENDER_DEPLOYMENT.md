# Kamal IT Solutions - Deploy to Render (Free)

## Free Node.js Hosting with Render

This guide covers deploying your Kamal IT Solutions website on Render.com's free tier.

---

## Table of Contents

1. [Why Render?](#why-render)
2. [Prerequisites](#prerequisites)
3. [Step-by-Step Deployment](#step-by-step-deployment)
4. [Configure Environment Variables](#configure-environment-variables)
5. [Custom Domain Setup](#custom-domain-setup)
6. [Update Your Site](#update-your-site)
7. [Troubleshooting](#troubleshooting)

---

## Why Render?

✅ **Completely Free** - 750 hours/month free tier  
✅ **Persistent** - Web service stays running  
✅ **Automatic SSL** - Free HTTPS certificate  
✅ **GitHub Integration** - Deploy from GitHub automatically  
✅ **Easy Setup** - No server management needed  
✅ **Good for Small Sites** - Perfect for business websites

---

## Prerequisites

Before starting, ensure you have:

- [x] GitHub account (already connected)
- [x] Repository pushed (already done)
- [x] Render account (we'll create one)

---

## Step-by-Step Deployment

### Step 1: Create Render Account

1. Go to: **https://render.com**
2. Click: **"Get Started"**
3. Sign up with **GitHub** (faster)
4. Authorize Render to access your GitHub

### Step 2: Create New Web Service

1. In Render dashboard, click: **"New +"**
2. Select: **"Web Service"**
3. Connect your GitHub repository:
   - Find: `TSIDDIQUI1/KAMALITSOLUTIONS`
   - Click: **"Connect"**

### Step 3: Configure Build Settings

Fill in these fields:

```
Name: kamal-it-solutions
Root Directory: (leave empty)

Build Command: npm install

Start Command: node server.js
```

**Environment**: `Node`

**Instance Type**: `Free` (should be selected by default)

### Step 4: Advanced Settings (Important!)

Click **"Advanced"** to expand:

```
Health Check Path: /
Environment Variables: (we'll add next)

Pull Request Previews: Off (saves hours)
```

### Step 5: Create Web Service

Click the **"Create Web Service"** button at the bottom.

### Step 6: Watch Deployment

Render will:

1. Clone your repository
2. Run `npm install`
3. Build your application
4. Start the server

You can watch the logs in real-time!

**Expected time**: 2-5 minutes

---

## Configure Environment Variables

After deployment, you need to set up environment variables for your contact form to work.

### Step 1: Go to Environment Variables

1. In your Render dashboard, click on your service name
2. Click **"Environment"** in the left sidebar
3. Scroll to **"Environment Variables"**

### Step 2: Add Variables

Add these variables one by one:

```
Key: EMAIL_USER
Value: your-email@gmail.com
```

```
Key: EMAIL_PASS
Value: your-app-password
```

```
Key: NODE_ENV
Value: production
```

```
Key: PORT
Value: 10000
```

### Step 3: Save and Redeploy

1. Click **"Save Changes"**
2. Render will automatically redeploy
3. Wait for deployment to complete (green checkmark)

### Important: Gmail App Password

If using Gmail, you need an **App Password** (not your regular password):

1. Go to: **https://myaccount.google.com/security**
2. Enable **2-Step Verification**
3. Go to: **https://myaccount.google.com/apppasswords**
4. Create a new app password
5. Use that 16-character password in `EMAIL_PASS`

---

## Custom Domain Setup

You can use your own domain with Render for free!

### Step 1: Get Your Render URL

After deployment, Render gives you a URL like:

```
https://kamal-it-solutions.onrender.com
```

### Step 2: Add Domain in Render

1. In Render dashboard, click **"Custom Domains"**
2. Click **"Add Custom Domain"**
3. Enter your domain: `kamalitsolutions.com`
4. Click **"Add Domain"**

### Step 3: Update DNS at Hostinger

1. Go to **Hostinger hPanel**
2. Navigate to **Domains → Manage DNS**
3. Add these records:

#### Option A: A Record (simpler)

```
Type: A
Name: @
Value: [Render's IP address - see below]
TTL: 3600
```

#### Option B: CNAME (recommended)

```
Type: CNAME
Name: www
Value: kamal-it-solutions.onrender.com
TTL: 3600
```

**Render's IP Address** (for A record):

```
104.21.4.100
172.67.132.100
```

> ⚠️ **Note**: For A record, use one of Render's IPs. CNAME is better if available.

### Step 4: Wait for DNS Propagation

DNS changes can take **1-48 hours** to propagate.

Check if ready:

```bash
# In Terminal
dig your-domain.com

# Or check online
# https://dnschecker.org
```

### Step 5: Enable SSL

Render automatically provisions SSL for custom domains!

1. In Render dashboard, click **"SSL"**
2. Your domain should show as **"Active"**
3. Your site will be accessible via `https://`

---

## Update Your Site

When you make changes to your code:

### Step 1: Push Changes to GitHub

```bash
# On your local machine
git add .
git commit -m "Updated website"
git push origin main
```

### Step 2: Render Auto-Deploys

Render automatically detects the new commit and redeploys!

1. Check Render dashboard for deployment progress
2. Wait for "Deploy succeeded" message
3. Your site is live!

### Manual Redeploy (if needed)

1. In Render dashboard, click **"Manual Deploy"**
2. Select **"Deploy latest commit"**

---

## Troubleshooting

### "Application failed to start"

**Check logs:**

1. In Render dashboard, click **"Logs"**
2. Look for error messages

**Common causes:**

- Missing environment variables
- Wrong `start command`
- Port not set to `10000`

**Solution:**

1. Add all environment variables
2. Set `PORT=10000`
3. Redeploy

### 502 Bad Gateway

**Cause:** Application crashed or not running

**Solution:**

1. Check logs for errors
2. Fix environment variables
3. Redeploy

### "Module not found"

**Cause:** Dependencies not installed

**Solution:**

1. Check `package.json` is correct
2. Redeploy (Render runs `npm install` automatically)

### Site Shows "503 Service Unavailable"

**Cause:** Render's free tier goes to sleep

**Solution:**

- This is normal for free tier
- Site wakes up when visited
- Consider upgrading to paid plan for 24/7 uptime

### Domain Not Working

**Checklist:**

1. ✅ DNS records are correct
2. ✅ DNS has propagated (wait 1-48 hours)
3. ✅ Domain added in Render
4. ✅ SSL certificate is active

**Verify DNS:**

```bash
dig your-domain.com
```

Should show Render's servers.

### Contact Form Not Working

**Check:**

1. ✅ `EMAIL_USER` is set
2. ✅ `EMAIL_PASS` is App Password (not regular password)
3. ✅ 2-Step verification enabled on Gmail
4. ✅ Check logs for email errors

---

## Performance Tips

### Reduce Cold Starts

Render's free tier puts services to sleep after 15 minutes of inactivity.

**Solution:**

1. Use a free uptime monitor (like UptimeRobot)
2. Ping your site every 5 minutes
3. Site stays awake!

**UptimeRobot Setup:**

1. Go to: **https://uptimerobot.com**
2. Sign up for free
3. Add monitor:
   - Monitor type: HTTPS
   - URL: `https://your-domain.com`
   - Interval: 5 minutes

### Optimize for Speed

1. **Enable compression** (already in your server.js)
2. **Optimize images** before uploading
3. **Use CDN** for static assets (optional)

---

## Render Free Tier Limitations

| Feature        | Free Tier         |
| -------------- | ----------------- |
| Hours/month    | 750               |
| Sleep after    | 15 min inactivity |
| Custom domains | Unlimited         |
| SSL            | Free auto-SSL     |
| Bandwidth      | 100 GB/month      |
| Build time     | 500 minutes/month |

**Note:** 750 hours = ~1 month of continuous running. With sleep mode, it lasts much longer!

---

## Cost Breakdown

| Service            | Cost          |
| ------------------ | ------------- |
| Render             | **FREE**      |
| Domain (Hostinger) | ~$12/year     |
| SSL Certificate    | **FREE**      |
| **Total**          | **~$12/year** |

Compared to VPS (~$5-10/month), you save **$48-108 per year**!

---

## Quick Reference

### Useful Render Commands/URLs

- **Dashboard**: https://dashboard.render.com
- **Your Service**: https://dashboard.render.com/YOUR_SERVICE_ID
- **Logs**: View in dashboard → "Logs" tab

### Environment Variables Summary

| Variable   | Value                | Required |
| ---------- | -------------------- | -------- |
| EMAIL_USER | your-email@gmail.com | ✅ Yes   |
| EMAIL_PASS | app-password         | ✅ Yes   |
| NODE_ENV   | production           | ✅ Yes   |
| PORT       | 10000                | ✅ Yes   |

### Git Commands for Updates

```bash
# Check status
git status

# Add all changes
git add .

# Commit
git commit -m "Your message"

# Push to GitHub
git push origin main

# Render auto-deploys!
```

---

## Support

- **Render Documentation**: https://render.com/docs
- **Render Status**: https://status.render.com
- **Community**: https://render.com/community

---

**Last Updated:** January 2024  
**Compatible with:** Kamal IT Solutions v1.0.0  
**Render Free Tier:** https://render.com/free
