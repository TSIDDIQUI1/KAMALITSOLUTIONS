# Kamal IT Solutions - VPS Deployment Guide (Ubuntu 22.04 LTS)

## Hostinger VPS with Ubuntu - Complete Node.js Deployment

This guide covers deploying your Kamal IT Solutions Node.js website on a Hostinger VPS running Ubuntu 22.04 LTS.

---

## Table of Contents

1. [VPS Setup](#1-vps-setup)
2. [Node.js Installation](#2-nodejs-installation)
3. [Application Deployment](#3-application-deployment)
4. [PM2 Process Manager](#4-pm2-process-manager)
5. [Nginx Reverse Proxy](#5-nginx-reverse-proxy)
6. [SSL/HTTPS Setup](#6sslhttps-setup)
7. [Firewall Configuration](#7-firewall-configuration)
8. [Monitoring & Maintenance](#8-monitoring--maintenance)

---

## 1. VPS Setup

### Step 1.1: Connect to Your VPS

```bash
# Connect via SSH (replace with your VPS IP)
ssh root@your-vps-ip

# If using custom port (default is 22)
ssh -p 22 root@your-vps-ip
```

### Step 1.2: Update System

```bash
# Update package lists
apt update

# Upgrade all packages
apt upgrade -y

# Install essential tools
apt install -y curl wget git unzip software-properties-common
```

### Step 1.3: Create Non-Root User (Recommended for Security)

```bash
# Create new user
adduser deploy

# Add user to sudo group
usermod -aG sudo deploy

# Switch to new user
su - deploy

# Create project directory
mkdir -p ~/kamal-it-solutions
cd ~/kamal-it-solutions
```

---

## 2. Node.js Installation

### Step 2.1: Install Node.js 20.x (LTS)

```bash
# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js
sudo apt-get install -y nodejs

# Verify installation
node --version   # Should show v20.x.x
npm --version    # Should show 10.x.x
```

### Step 2.2: Install Yarn (Optional but Recommended)

```bash
# Install Yarn
npm install -g yarn

# Verify
yarn --version
```

### Step 2.3: Configure NPM for Global Packages

```bash
# Create global package directory
mkdir -p ~/.npm-global

# Configure npm to use new directory
npm config set prefix '~/.npm-global'

# Add to PATH (add to ~/.bashrc for persistence)
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

---

## 3. Application Deployment

### Step 3.1: Upload Your Code

**Option A: Via GitHub (Recommended)**

```bash
# Clone your repository
git clone https://github.com/TSIDDIQUI1/KAMALITSOLUTIONS.git ~/kamal-it-solutions

# Navigate to project directory
cd ~/kamal-it-solutions

# Checkout main branch
git checkout main
```

**Option B: Via FileZilla/WinSCP**

1. Use FileZilla to connect to your VPS
2. Upload files to `/home/deploy/kamal-it-solutions/`

### Step 3.2: Install Dependencies

```bash
# Navigate to project directory
cd ~/kamal-it-solutions

# Install Node.js dependencies
npm install

# Or if using Yarn
yarn install
```

### Step 3.3: Configure Environment Variables

```bash
# Create environment file
cp .env.example .env  # If you have an example file
nano .env

# Add your configuration
# EMAIL_USER=your-email@gmail.com
# EMAIL_PASS=your-app-password
# PORT=3000
```

### Step 3.4: Test Application Locally

```bash
# Start the server temporarily
node server.js

# Check if running (in another terminal)
curl http://localhost:3000

# Stop with Ctrl+C
```

---

## 4. PM2 Process Manager

PM2 keeps your Node.js application running continuously and handles automatic restarts.

### Step 4.1: Install PM2

```bash
# Install PM2 globally
sudo npm install -g pm2

# Verify installation
pm2 --version
```

### Step 4.2: Start Application with PM2

```bash
# Navigate to project directory
cd ~/kamal-it-solutions

# Start your application
pm2 start server.js --name "kamal-it-solutions"

# Check status
pm2 status

# View logs
pm2 logs kamal-it-solutions

# View specific number of log lines
pm2 logs kamal-it-solutions --lines 100
```

### Step 4.3: Configure PM2 Startup Script

```bash
# Generate startup script
pm2 startup

# Copy and run the command shown (usually something like:)
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u deploy --hp /home/deploy
```

### Step 4.4: Save PM2 Process List

```bash
# Save current process list
pm2 save

# Verify startup script is active
sudo systemctl status pm2-deploy  # or whatever your service is named
```

### Step 4.5: Useful PM2 Commands

```bash
# Restart application
pm2 restart kamal-it-solutions

# Stop application
pm2 stop kamal-it-solutions

# Delete application from PM2
pm2 delete kamal-it-solutions

# Monitor in real-time
pm2 monit

# View all logs
pm2 logs

# Clear all logs
pm2 flush

# Check CPU/memory usage
pm2 status
```

### Step 4.6: Configure PM2 Ecosystem File (Advanced)

Create `ecosystem.config.js` for better configuration:

```javascript
module.exports = {
  apps: [
    {
      name: "kamal-it-solutions",
      script: "server.js",
      cwd: "/home/deploy/kamal-it-solutions",
      instances: "max",
      exec_mode: "cluster",
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      error_file: "/home/deploy/.pm2/logs/server-error.log",
      out_file: "/home/deploy/.pm2/logs/server-out.log",
      log_file: "/home/deploy/.pm2/logs/combined.log",
      time: true,
    },
  ],
};
```

Then start with:

```bash
pm2 start ecosystem.config.js
```

---

## 5. Nginx Reverse Proxy

Nginx handles incoming traffic and forwards it to your Node.js application.

### Step 5.1: Install Nginx

```bash
# Install Nginx
sudo apt install -y nginx

# Start Nginx
sudo systemctl start nginx

# Enable Nginx on boot
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

### Step 5.2: Configure Nginx

```bash
# Create configuration file
sudo nano /etc/nginx/sites-available/kamal-it-solutions
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Redirect to www
    if ($host = your-domain.com) {
        return 301 http://www.$host$request_uri;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml;

    # Proxy settings
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static files caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Block access to hidden files
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}
```

**Important**: Replace `your-domain.com` with your actual domain name.

### Step 5.3: Enable Site Configuration

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/kamal-it-solutions /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### Step 5.4: Remove Default Configuration

```bash
# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

### Step 5.5: Configure Nginx for Multiple Domains (Optional)

If hosting multiple sites, create separate config files for each domain.

---

## 6. SSL/HTTPS Setup

### Option A: Using Certbot (Let's Encrypt) - Free

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain and configure SSL
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Follow prompts:
# - Enter email address
# - Agree to terms
# - Choose whether to redirect HTTP to HTTPS (recommended: yes)
```

### Option B: Auto-renewal Setup

```bash
# Test automatic renewal
sudo certbot renew --dry-run

# Add to cron for automatic renewal
sudo crontab -e

# Add this line to run twice daily
0 0,12 * * * certbot renew --quiet
```

### Option C: Manual SSL Setup (If Certbot Doesn't Work)

```bash
# Create SSL directory
sudo mkdir -p /etc/nginx/ssl

# Generate self-signed certificate (for testing)
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
-keyout /etc/nginx/ssl/server.key \
-out /etc/nginx/ssl/server.crt

# Update Nginx config to use SSL
sudo nano /etc/nginx/sites-available/kamal-it-solutions
```

Update config for HTTPS:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com www.your-domain.com;

    ssl_certificate /etc/nginx/ssl/server.crt;
    ssl_certificate_key /etc/nginx/ssl/server.key;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;

    # ... rest of config same as before
}
```

---

## 7. Firewall Configuration

### Step 7.1: Install and Configure UFW

```bash
# Install UFW
sudo apt install -y ufw

# Allow SSH (IMPORTANT - do this first!)
sudo ufw allow OpenSSH

# Allow HTTP and HTTPS
sudo ufw allow http
sudo ufw allow https

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

### Step 7.2: Configure UFW for Nginx

```bash
# Allow Nginx Full (HTTP + HTTPS)
sudo ufw allow 'Nginx Full'

# Remove old rules if needed
sudo ufw delete allow http
sudo ufw delete allow https

# Check status
sudo ufw status verbose
```

### Step 7.3: Additional Security

```bash
# Limit SSH connections (max 6 connections per minute)
sudo ufw limit 22/tcp

# Allow specific IP for SSH
sudo ufw allow from 192.168.1.100 to any port 22
```

---

## 8. Monitoring & Maintenance

### Step 8.1: PM2 Monitoring

```bash
# Real-time monitoring
pm2 monit

# View all processes
pm2 status

# View logs
pm2 logs kamal-it-solutions --lines 50

# Restart application after code updates
pm2 restart kamal-it-solutions

# Zero-downtime reload (recommended for updates)
pm2 reload kamal-it-solutions
```

### Step 8.2: Check Logs

```bash
# Application logs
tail -f /home/deploy/.pm2/logs/server-out.log
tail -f /home/deploy/.pm2/logs/server-error.log

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Step 8.3: System Resource Monitoring

```bash
# Check disk usage
df -h

# Check memory usage
free -h

# Check CPU load
top

# Check Node.js process
pm2 status

# Monitor with htop (install first)
sudo apt install htop
htop
```

### Step 8.4: Update Application

```bash
# Navigate to project directory
cd ~/kamal-it-solutions

# Pull latest code
git fetch origin main
git pull origin main

# Install new dependencies (if package.json changed)
npm install

# Restart PM2 process
pm2 restart kamal-it-solutions

# Check status
pm2 status
```

### Step 8.5: Backup Strategy

```bash
# Create backup script
nano ~/backup.sh
```

Add to backup.sh:

```bash
#!/bin/bash

# Variables
BACKUP_DIR=/home/deploy/backups
DATE=$(date +%Y%m%d_%H%M%S)
APP_DIR=/home/deploy/kamal-it-solutions

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup application files
tar -czf $BACKUP_DIR/kamal-it-solutions_$DATE.tar.gz $APP_DIR

# Backup messages.json (contact form submissions)
cp $APP_DIR/messages.json $BACKUP_DIR/messages_$DATE.json
cp $APP_DIR/newsletter.json $BACKUP_DIR/newsletter_$DATE.json 2>/dev/null || true

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
find $BACKUP_DIR -name "*.json" -mtime +30 -delete

echo "Backup completed: $DATE"
```

Make executable and schedule:

```bash
# Make script executable
chmod +x ~/backup.sh

# Add to crontab for daily backup
crontab -e

# Add line for daily backup at 3 AM
0 3 * * * /home/deploy/backup.sh >> /home/deploy/backup.log 2>&1
```

### Step 8.6: Health Check Script

Create `health-check.sh`:

```bash
#!/bin/bash

# Check if PM2 process is running
if pm2 status | grep -q "kamal-it-solutions"; then
    echo "✅ Application is running"

    # Check disk space
    DISK_USAGE=$(df -h / | tail -1 | awk '{print $5}' | cut -d'%' -f1)
    if [ $DISK_USAGE -lt 80 ]; then
        echo "✅ Disk usage: ${DISK_USAGE}%"
    else
        echo "⚠️  Disk usage: ${DISK_USAGE}% - Consider cleaning up"
    fi

    # Check memory
    FREE_MEM=$(free -m | awk '/^Mem:/ {print $7}')
    echo "✅ Free memory: ${FREE_MEM}MB"

    # Check Nginx
    if systemctl is-active --quiet nginx; then
        echo "✅ Nginx is running"
    else
        echo "❌ Nginx is not running"
        sudo systemctl start nginx
    fi
else
    echo "❌ Application is not running - Restarting..."
    cd /home/deploy/kamal-it-solutions && pm2 restart kamal-it-solutions
fi
```

---

## Quick Deployment Checklist

- [ ] Connect to VPS via SSH
- [ ] Update system: `apt update && apt upgrade -y`
- [ ] Create deploy user: `adduser deploy`
- [ ] Install Node.js: `curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -` then `apt-get install -y nodejs`
- [ ] Install PM2: `sudo npm install -g pm2`
- [ ] Clone repository or upload files
- [ ] Install dependencies: `npm install`
- [ ] Configure environment variables: `nano .env`
- [ ] Start application with PM2: `pm2 start server.js`
- [ ] Setup PM2 startup: `pm2 startup` and `pm2 save`
- [ ] Install Nginx: `apt install -y nginx`
- [ ] Configure Nginx: `/etc/nginx/sites-available/kamal-it-solutions`
- [ ] Enable site: `ln -s /etc/nginx/sites-available/kamal-it-solutions /etc/nginx/sites-enabled/`
- [ ] Test and reload Nginx: `nginx -t && systemctl reload nginx`
- [ ] Install SSL: `certbot --nginx -d your-domain.com -d www.your-domain.com`
- [ ] Configure firewall: `ufw allow 'Nginx Full'` and `ufw enable`
- [ ] Test website in browser
- [ ] Setup backups
- [ ] Document all credentials and settings

---

## Troubleshooting

### Application Won't Start

```bash
# Check PM2 logs
pm2 logs kamal-it-solutions

# Check if port is in use
sudo lsof -i :3000

# Kill process using port
sudo kill -9 <PID>

# Restart application
pm2 restart kamal-it-solutions
```

### Nginx 502 Bad Gateway

```bash
# Check if Node.js is running
pm2 status

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Test Node.js directly
curl http://localhost:3000

# Restart services
pm2 restart kamal-it-solutions
sudo systemctl restart nginx
```

### SSL Certificate Issues

```bash
# Check Certbot status
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Check if port 443 is open
sudo ufw status
```

### Domain Not Resolving

```bash
# Check DNS settings
dig your-domain.com

# Wait for propagation (can take up to 48 hours)
# Check if domain points to correct IP
nslookup your-domain.com
```

---

## Useful Commands Summary

```bash
# Application
pm2 status              # Check app status
pm2 logs                # View logs
pm2 restart all         # Restart all apps
pm2 monit               # Real-time monitoring

# Nginx
sudo nginx -t           # Test config
sudo systemctl reload nginx  # Reload config
sudo systemctl restart nginx # Restart Nginx

# System
df -h                   # Disk usage
free -h                 # Memory usage
top                     # Process monitor
htop                    # Better process monitor (install first)

# Firewall
sudo ufw status         # Check firewall
sudo ufw enable         # Enable firewall
sudo ufw disable        # Disable firewall

# SSL
sudo certbot certificates  # View certificates
sudo certbot renew         # Renew certificates
```

---

## Support

- **Hostinger VPS Support**: Available in hPanel
- **Node.js Documentation**: https://nodejs.org/docs/
- **PM2 Documentation**: https://pm2.keymetrics.io/docs/usage/quick-start/
- **Nginx Documentation**: https://nginx.org/en/docs/
- **Certbot Documentation**: https://certbot.eff.org/docs/

---

**Last Updated:** January 2024
**Compatible with:** Kamal IT Solutions v1.0.0
