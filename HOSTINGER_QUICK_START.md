# Kamal IT Solutions - Quick Hostinger Deployment Guide

## ✅ Already Done:

- ✅ Code pushed to GitHub: https://github.com/TSIDDIQUI1/KAMALITSOLUTIONS

## 🚀 Deploy to Hostinger (Choose Option 1 or 2)

---

## Option 1: Hostinger Shared Hosting (Easiest)

### Step 1: Login to Hostinger

1. Go to: https://hpanel.hostinger.com
2. Login with your credentials

### Step 2: Enable Node.js

```
Advanced → Node.js → Enable Node.js
→ Select Node.js 18.x or higher
→ Click "Enable"
```

### Step 3: Upload Files

1. Go to: **Files → File Manager**
2. Navigate to **public_html** folder
3. Upload ALL files from `/Users/sid/Desktop/wb/KTS/`:
   - package.json
   - server.js
   - public/ (entire folder)
   - All other files

### Step 4: Install Dependencies

1. Go to: **Advanced → Node.js**
2. Click: **"Run npm install"**
3. Wait for completion (green checkmark)

### Step 5: Configure Application

1. In Node.js settings:
   ```
   Application Startup File: server.js
   Application Mode: Production
   ```
2. Click: **"Save Changes"**
3. Click: **"Restart Application"**

### Step 6: Test Your Site

1. Click: **"Open"** button in Node.js section
2. Your website should load!

### Step 7: Add SSL (HTTPS)

1. Go to: **SSL** (left sidebar)
2. Select your domain
3. Click: **"Install Free SSL"**
4. Wait 5-10 minutes

### Step 8: Connect Your Domain

1. Go to: **Domains → Manage Domain**
2. Set as primary domain
3. Point to Node.js app

---

## Option 2: Deploy via Netlify (Free & Easier)

If Hostinger Node.js doesn't work, use Netlify:

### Step 1: Go to Netlify

https://app.netlify.com/signup

### Step 2: Sign Up with GitHub

- Click: **"Continue with GitHub"**
- Authorize Netlify

### Step 3: Add New Site

- Click: **"Add new site"**
- Select: **"Import an existing project"**

### Step 4: Connect GitHub

- Select: **KAMALITSOLUTIONS** repository

### Step 5: Configure

```
Build command: (leave empty)
Publish directory: public
```

- Click: **"Deploy site"**

### Step 6: Connect Domain (in Netlify)

1. Go to: **Domain Management**
2. Click: **"Add custom domain"**
3. Enter your domain (e.g., kamalitsolutions.com)

### Step 7: Update DNS at Hostinger

1. Go to Hostinger: **Domains → Manage DNS**
2. Change A record to Netlify IP (shown in Netlify)

---

## 🔧 Troubleshooting

### "Application failed to start"

- Check Node.js version is 18.x or higher
- Ensure all files are uploaded
- Check error logs in Node.js section

### "Module not found"

- Run npm install again in Node.js section
- Check package.json is in root folder

### Site shows "502 Bad Gateway"

- Restart application
- Check if server.js is set as startup file

### Domain not working

- Wait 1-2 hours for DNS propagation
- Check DNS settings at domain registrar

---

## 📞 Need Help?

- **Hostinger Support:** Available 24/7 in hPanel chat
- **Check your website:** https://github.com/TSIDDIQUI1/KAMALITSOLUTIONS

---

**Last Updated:** January 2024
