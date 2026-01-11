# Kamal IT Solutions - GitHub & Hostinger Deployment Guide

## Table of Contents

1. [Create GitHub Account & Repository](#1-create-github-account--repository)
2. [Upload Your Project to GitHub](#2-upload-your-project-to-github)
3. [Deploy to Hostinger](#3-deploy-to-hostinger)
4. [Connect Your Domain](#4-connect-your-domain)

---

## 1. Create GitHub Account & Repository

### If you don't have a GitHub account:

1. **Go to GitHub:** Visit https://github.com
2. **Sign Up:**
   - Click "Sign up"
   - Enter your email address
   - Create a password
   - Create a username
   - Verify your email
3. **Free Plan:** Choose the free plan (sufficient for this project)

### Create a New Repository:

1. **After logging in, click:** "+" → "New repository"
2. **Repository Details:**
   - Repository name: `kamal-it-solutions`
   - Description: "Professional website for Kamal IT Solutions"
   - Visibility: Public (recommended)
   - ✅ Do NOT check "Add a README file" (we'll create one)
3. **Click:** "Create repository"

---

## 2. Upload Your Project to GitHub

### Step 2.1: Initialize Git in Your Project

Open Terminal and run these commands:

```bash
cd /Users/sid/Desktop/wb/KTS
```

**Initialize Git repository:**

```bash
git init
```

**Configure your identity (required for commits):**

```bash
git config --global user.name "Your Name"
git config --global user.email "your-email@gmail.com"
```

**Example:**

```bash
git config --global user.name "Kamal IT Solutions"
git config --global user.email "kamal@your-email.com"
```

### Step 2.2: Add Files to Git

**Check what files are untracked:**

```bash
git status
```

**Add all files to Git:**

```bash
git add .
```

**Check status again (files should be green):**

```bash
git status
```

### Step 2.3: Create Your First Commit

**Create a commit with a message:**

```bash
git commit -m "Initial commit - Kamal IT Solutions website"
```

### Step 2.4: Connect to GitHub Repository

**Add your GitHub repository as remote (replace with YOUR username):**

```bash
git remote add origin https://github.com/YOURUSERNAME/kamal-it-solutions.git
```

**Example (if your username is "kamalit"):**

```bash
git remote add origin https://github.com/kamalit/kamal-it-solutions.git
```

### Step 2.5: Push to GitHub

**Push your code to GitHub:**

```bash
git branch -M main
git push -u origin main
```

**Enter your credentials when prompted:**

- Username: Your GitHub username
- Password: Your GitHub password (or Personal Access Token)

> ⚠️ **Important:** If you have 2FA enabled, you'll need a Personal Access Token instead of password.
>
> - Go to: Settings → Developer settings → Personal access tokens → Generate new token
> - Select: repo scope
> - Use this token as your password

### Step 2.6: Verify Upload

1. **Go to:** https://github.com/yourusername/kamal-it-solutions
2. **You should see all your files:**
   - package.json
   - server.js
   - public/index.html
   - public/css/
   - public/js/
   - public/images/
   - etc.

---

## 3. Deploy to Hostinger

### Option A: Hostinger VPS (Recommended for Node.js)

#### Step 3.1: Purchase VPS Plan

1. **Login to Hostinger:** https://hpanel.hostinger.com
2. **Navigate to:** VPS → Choose a plan
3. **Select:** Ubuntu 20.04 or 22.04 (recommended)
4. **Complete purchase**

#### Step 3.2: Access Your VPS

**Get these details from Hostinger dashboard:**

- IP Address (e.g., 123.456.789.123)
- Root password (sent to your email)

**Connect via Terminal:**

```bash
ssh root@123.456.789.123
```

_(Replace with your IP address)_

**Enter:** Your root password when prompted

#### Step 3.3: Install Node.js on VPS

**Update the server:**

```bash
apt update && apt upgrade -y
```

**Install Node.js 18.x:**

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs
```

**Verify installation:**

```bash
node --version
npm --version
```

#### Step 3.4: Upload Your Files to VPS

**Option 1: Clone from GitHub (Recommended)**

On your VPS:

```bash
# Create directory
mkdir -p /var/www
cd /var/www

# Clone your repository
git clone https://github.com/YOURUSERNAME/kamal-it-solutions.git
cd kamal-it-solutions

# Install dependencies
npm install --production
```

**Option 2: Upload via FTP/File Manager**

1. In Hostinger hPanel → File Manager
2. Upload all files to `/public_html/` or your domain folder
3. Extract files if uploaded as ZIP

#### Step 3.5: Install PM2 (Process Manager)

```bash
npm install -g pm2
```

**Start your application:**

```bash
pm2 start server.js --name "kamal-it-solutions"
pm2 startup
pm2 save
```

**Check if running:**

```bash
pm2 status
```

#### Step 3.6: Configure Firewall

```bash
ufw allow OpenSSH
ufw allow 80
ufw allow 443
ufw enable
```

#### Step 3.7: Setup Nginx (Reverse Proxy)

**Install Nginx:**

```bash
apt install nginx -y
```

**Create configuration:**

```bash
nano /etc/nginx/sites-available/kamal-it-solutions
```

**Add this configuration:**

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Enable the site:**

```bash
ln -s /etc/nginx/sites-available/kamal-it-solutions /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

---

### Option B: Hostinger Shared Hosting (with Node.js)

#### Step 3.1: Enable Node.js in Hostinger

1. **Login to hPanel:** https://hpanel.hostinger.com
2. **Navigate to:** Advanced → Node.js
3. **Click:** "Enable Node.js"
4. **Select:** Node.js version 18.x or higher
5. **Click:** "Enable"

#### Step 3.2: Upload Files via File Manager

1. **Go to:** Files → File Manager
2. **Navigate to:** public_html (or create a subfolder like "/app")
3. **Upload all files:**
   - Upload ZIP file or drag-and-drop files
   - Extract if needed
4. **Ensure these files are in root:**
   - package.json
   - server.js
   - public/ folder

#### Step 3.3: Install Dependencies

1. **In hPanel:** Go to Node.js
2. **Click:** "Run npm install"
3. **Wait for installation to complete**

#### Step 3.4: Configure Application

1. **In Node.js section:**

   - Application Startup File: `server.js`
   - Application URL: Your domain
   - Application Root: `public_html` or your folder

2. **Click:** "Restart Application"

#### Step 3.5: Set Port

In Hostinger Node.js settings:

- **Application Port:** Usually auto-assigned (3000, 5000, etc.)
- **Server expects app on port:** Use the port shown in settings

**Update server.js to use Hostinger port:**

```javascript
const PORT = process.env.PORT || 3000;
```

Hostinger sets `process.env.PORT` automatically.

---

## 4. Connect Your Domain

### If Your Domain is with Hostinger:

1. **In hPanel:** Go to Domains → Manage Domain
2. **Click:** "Point to VPS" or configure DNS
3. **Add DNS records:**

**For VPS:**

```
Type: A
Name: @
Value: YOUR_VPS_IP_ADDRESS
TTL: 3600

Type: A
Name: www
Value: YOUR_VPS_IP_ADDRESS
TTL: 3600
```

### If Domain is Elsewhere (e.g., GoDaddy, Namecheap):

1. **Login to your domain registrar**
2. **Go to DNS Management**
3. **Add/Edit A records:**

   ```
   A Record:
   - Host: @
   - Value: YOUR_VPS_IP
   - TTL: 3600

   A Record:
   - Host: www
   - Value: YOUR_VPS_IP
   - TTL: 3600
   ```

### Wait for DNS Propagation (up to 24 hours, usually 1-2 hours)

**Check propagation:**

```bash
dig your-domain.com
# or
nslookup your-domain.com
```

---

## SSL/HTTPS Setup (Free with Let's Encrypt)

### On VPS:

```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d your-domain.com -d www.your-domain.com
```

### On Shared Hosting:

1. **In hPanel:** Go to SSL
2. **Select:** Your domain
3. **Click:** "Install Free SSL"
4. **Wait:** 5-10 minutes for activation

---

## Verify Your Deployment

1. **Test your website:** Visit http://your-domain.com
2. **Test contact form:** Submit a test message
3. **Check all pages:**
   - http://your-domain.com/
   - http://your-domain.com/about
   - http://your-domain.com/services
   - http://your-domain.com/contact

---

## Troubleshooting

### Node.js not starting?

```bash
# Check errors
pm2 logs kamal-it-solutions

# Check if port in use
netstat -tulpn | grep :3000
```

### Website not loading?

- Check DNS propagation
- Verify firewall settings
- Check Nginx/Apache configuration

### 502 Bad Gateway?

- Check if Node.js app is running: `pm2 status`
- Restart app: `pm2 restart kamal-it-solutions`

---

## Quick Reference Commands

```bash
# SSH to server
ssh root@your-server-ip

# Check Node.js status
pm2 status

# View logs
pm2 logs kamal-it-solutions

# Restart app
pm2 restart kamal-it-solutions

# Check disk space
df -h

# Check memory
free -m

# Update from GitHub
cd /var/www/kamal-it-solutions
git pull origin main
pm2 restart kamal-it-solutions
```

---

## Support

- **Hostinger Support:** Available 24/7 in hPanel
- **GitHub Help:** https://docs.github.com
- **Node.js Docs:** https://nodejs.org/docs/

---

**Last Updated:** January 2024
