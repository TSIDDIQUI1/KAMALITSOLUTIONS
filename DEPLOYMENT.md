# Kamal IT Solutions - Deployment Guide

This document provides comprehensive deployment instructions for the Kamal IT Solutions website to various hosting platforms.

## Table of Contents
1. [Quick Deployment Options](#quick-deployment-options)
2. [Local Development](#local-development)
3. [Static Hosting (Recommended)](#static-hosting-recommended)
4. [Cloud Platforms](#cloud-platforms)
5. [VPS/Server Deployment](#vpsserver-deployment)
6. [Post-Deployment Steps](#post-deployment-steps)
7. [SSL/HTTPS Configuration](#sslhttps-configuration)
8. [Performance Optimization](#performance-optimization)
9. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Quick Deployment Options

### Option 1: Static Website Hosting (Easiest)
**Recommended for:** Static HTML/CSS/JS site without backend

**Platforms:**
- **Netlify** - Free, automatic deployments from Git
- **Vercel** - Free for personal projects, excellent performance
- **GitHub Pages** - Free, hosted directly from GitHub
- **Cloudflare Pages** - Free, global CDN included

### Option 2: Node.js Hosting
**Required for:** Backend API functionality

**Platforms:**
- **Railway** - Easy Node.js deployment, generous free tier
- **Render** - Free web service with automatic deployments
- **Heroku** - Popular PaaS, free tier available
- **Fly.io** - Edge deployment, good free tier

### Option 3: Traditional VPS
**For:** Full control, custom configurations

**Providers:**
- **DigitalOcean** - Droplets starting at $4/month
- **Linode** - Compute instances from $5/month
- **AWS EC2** - Scalable cloud computing
- **Google Cloud** - Compute Engine

---

## Local Development

### Prerequisites
- Node.js 14.0.0 or higher
- npm or yarn package manager

### Setup Steps

1. **Navigate to project directory:**
   ```bash
   cd /Users/sid/Desktop/wb/KTS
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Access locally:**
   Open http://localhost:3000 in your browser

### Development Mode Features
- Auto-reload on file changes
- Source maps for debugging
- Hot module replacement (if configured)

---

## Static Hosting (Recommended)

### Deploying to Netlify

1. **Prepare your site:**
   ```bash
   # Create optimized build
   npm run build
   ```
   *Note: Since this is a static site, the `public` folder is your deployment target*

2. **Connect to Netlify:**
   - Sign up at [netlify.com](https://netlify.com)
   - Click "Add new site" > "Import an existing project"
   - Connect your GitHub repository
   - Configure build settings:
     - Build command: `npm run build` (or leave empty for static)
     - Publish directory: `public`
   - Click "Deploy site"

3. **Custom Domain (Optional):**
   - Go to Domain Management in Netlify dashboard
   - Add your custom domain (e.g., kamalitsolutions.us)
   - Configure DNS settings as instructed

4. **SSL Certificate:**
   - Netlify automatically provisions Let's Encrypt SSL
   - Enabled by default for custom domains

### Deploying to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Follow prompts:**
   - Set up and deploy: Yes
   - Which scope: Your account
   - Link to existing project: No
   - Project name: kamal-it-solutions
   - Directory: ./
   - Want to modify settings?: No

4. **Production deployment:**
   ```bash
   vercel --prod
   ```

### Deploying to GitHub Pages

1. **Create gh-pages branch:**
   ```bash
   git checkout -b gh-pages
   ```

2. **Build and deploy:**
   ```bash
   npm run build
   cp -r public/* .
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin gh-pages
   ```

3. **Enable GitHub Pages:**
   - Go to repository Settings > Pages
   - Source: Deploy from a branch
   - Branch: gh-pages / (root)
   - Click Save

4. **Access your site:**
   `https://yourusername.github.io/kamal-it-solutions`

---

## Cloud Platforms

### Deploying to Railway

1. **Connect GitHub:**
   - Sign up at [railway.app](https://railway.app)
   - Connect your GitHub account
   - Select "Deploy from GitHub repo"

2. **Configure Deployment:**
   - Root directory: ./
   - Build command: `npm install`
   - Start command: `npm start`

3. **Environment Variables:**
   - Go to Variables tab
   - Add any required environment variables
   - PORT will be automatically set by Railway

4. **Deploy:**
   - Click "Deploy Now"
   - Railway will build and deploy automatically

5. **Custom Domain:**
   - Go to Settings > Domains
   - Add your custom domain
   - Update DNS as instructed

### Deploying to Render

1. **Create Web Service:**
   - Sign up at [render.com](https://render.com)
   - Click "New" > "Web Service"
   - Connect your GitHub repository

2. **Configure:**
   - Name: kamal-it-solutions
   - Root Directory: ./
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Deploy:**
   - Click "Create Web Service"
   - Render will build and deploy automatically

4. **Custom Domain:**
   - Go to Settings > Custom Domains
   - Add your domain
   - Configure DNS records

### Deploying to Heroku

1. **Install Heroku CLI:**
   ```bash
   npm i -g heroku
   ```

2. **Login and create app:**
   ```bash
   heroku login
   heroku create kamal-it-solutions
   ```

3. **Deploy:**
   ```bash
   git add .
   git commit -m "Initial deployment"
   git push heroku main
   ```

4. **Open app:**
   ```bash
   heroku open
   ```

---

## VPS/Server Deployment

### Using DigitalOcean Droplet

1. **Create Droplet:**
   - Sign up at [digitalocean.com](https://www.digitalocean.com)
   - Create new Droplet
   - Image: Ubuntu 20.04 LTS
   - Size: Basic ($4/month)
   - Datacenter: Choose closest to your audience

2. **Connect via SSH:**
   ```bash
   ssh root@your_droplet_ip
   ```

3. **Install Node.js:**
   ```bash
   # Update system
   apt update && apt upgrade -y

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
   apt-get install -y nodejs

   # Verify installation
   node --version
   npm --version
   ```

4. **Setup project:**
   ```bash
   # Create user
   adduser deploy
   usermod -aG sudo deploy

   # Switch to deploy user
   su - deploy

   # Clone repository
   git clone https://github.com/yourusername/kamal-it-solutions.git
   cd kamal-it-solutions

   # Install dependencies
   npm install --production

   # Create environment file
   cp .env.example .env
   nano .env
   ```

5. **Setup Process Manager (PM2):**
   ```bash
   # Install PM2 globally
   sudo npm i -g pm2

   # Start application
   pm2 start server.js --name "kamal-it-solutions"

   # Configure startup script
   pm2 startup
   sudo env PATH=$PATH:/usr/bin pm2 startup
   pm2 save

   # Monitor
   pm2 monit
   ```

6. **Setup Nginx:**
   ```bash
   # Install Nginx
   sudo apt install nginx -y

   # Create configuration
   sudo nano /etc/nginx/sites-available/kamal-it-solutions
   ```

   ```nginx
   server {
       listen 80;
       server_name kamalitsolutions.us www.kamalitsolutions.us;

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

   ```bash
   # Enable site
   sudo ln -s /etc/nginx/sites-available/kamal-it-solutions /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

7. **Setup Firewall:**
   ```bash
   sudo ufw allow OpenSSH
   sudo ufw allow 'Nginx Full'
   sudo ufw enable
   ```

---

## Post-Deployment Steps

### 1. Verify Deployment
- [ ] Test all pages load correctly
- [ ] Verify contact form submission
- [ ] Check responsive design on mobile
- [ ] Test all interactive features

### 2. Performance Testing
- **Google PageSpeed Insights:** https://pagespeed.web.dev/
- **GTmetrix:** https://gtmetrix.com/
- **WebPageTest:** https://www.webpagetest.org/

**Target metrics:**
- Page Load: < 3 seconds
- Time to Interactive: < 2.5 seconds
- Lighthouse Score: > 90

### 3. SEO Verification
- [ ] Google Search Console setup
- [ ] Bing Webmaster Tools
- [ ] XML sitemap submitted
- [ ] robots.txt configured
- [ ] Meta tags verified
- [ ] Structured data tested

### 4. Analytics Setup
**Google Analytics 4:**
1. Create GA4 property
2. Add tracking code to all pages
3. Set up conversions for contact form

**Google Search Console:**
1. Verify ownership
2. Submit sitemap
3. Check coverage report

---

## SSL/HTTPS Configuration

### Using Let's Encrypt (Free)

1. **Install Certbot:**
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   ```

2. **Obtain SSL certificate:**
   ```bash
   sudo certbot --nginx -d kamalitsolutions.us -d www.kamalitsolutions.us
   ```

3. **Auto-renewal:**
   ```bash
   sudo certbot renew --dry-run
   ```

### Cloudflare SSL (Free)

1. **Add site to Cloudflare:**
   - Sign up at cloudflare.com
   - Add your domain
   - Update nameservers at your registrar

2. **Configure SSL:**
   - Go to SSL/TLS > Edge Certificates
   - Enable "Always Use HTTPS"
   - Enable "TLS 1.3"

### Force HTTPS (Nginx)

```nginx
server {
    listen 80;
    server_name kamalitsolutions.us www.kamalitsolutions.us;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name kamalitsolutions.us www.kamalitsolutions.us;

    ssl_certificate /etc/letsencrypt/live/kamalitsolutions.us/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/kamalitsolutions.us/privkey.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;

    location / {
        proxy_pass http://localhost:3000;
        # ... rest of config
    }
}
```

---

## Performance Optimization

### 1. Image Optimization
- Use WebP format
- Compress all images
- Lazy load below-fold images

**Tools:**
- TinyPNG: https://tinypng.com
- Squoosh: https://squoosh.app

### 2. Minification
**CSS:**
- Remove whitespace and comments
- Shorten color values
- Optimize selectors

**JavaScript:**
- Uglify/minify code
- Remove dead code
- Tree shaking

**Build tool:**
```bash
npm install -g terser clean-css-cli
terser public/js/main.js -o public/js/main.min.js --compress
cleancss -o public/css/styles.min.css public/css/styles.css
```

### 3. Caching Strategy
**Browser caching (Nginx):**
```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js|webp)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

### 4. CDN Usage
**Cloudflare (Free CDN):**
1. Add site to Cloudflare
2. Enable "Speed" > "Auto Minify"
3. Enable "Speed" > "Rocket Loader"
4. Configure page rules for caching

### 5. Gzip Compression
**Nginx:**
```nginx
gzip on;
gzip_comp_level 5;
gzip_min_length 256;
gzip_proxied any;
gzip_vary on;
gzip_types
    application/javascript
    application/json
    application/xml
    text/css
    text/plain
    image/svg+xml;
```

---

## Monitoring & Maintenance

### 1. Uptime Monitoring
**Services:**
- UptimeRobot: https://uptimerobot.com (Free, 5-minute checks)
- Pingdom: https://pingdom.com (Paid, advanced features)
- StatusCake: https://statuscake.com (Free tier available)

**Setup:**
1. Create account
2. Add monitor for your URL
3. Configure alert methods (email, SMS, Slack)
4. Set check frequency (5 minutes recommended)

### 2. Error Tracking
**Sentry (Free tier):**
```bash
npm install @sentry/node @sentry/tracing
```

```javascript
const Sentry = require('@sentry/node');
Sentry.init({ dsn: 'your-dsn-here' });
```

### 3. Log Management
**Using PM2:**
```bash
# View logs
pm2 logs

# View logs with JSON format
pm2 logs --json

# Rotate logs
pm2 install pm2-logrotate
```

**Centralized logging (Optional):**
- Loggly: https://loggly.com
- Datadog: https://datadoghq.com
- ELK Stack: Self-hosted solution

### 4. Regular Maintenance

**Weekly Tasks:**
- [ ] Review error logs
- [ ] Check uptime reports
- [ ] Review security advisories

**Monthly Tasks:**
- [ ] Update dependencies
- [ ] Test backup restoration
- [ ] Review performance metrics
- [ ] Security audit

**Quarterly Tasks:**
- [ ] Penetration testing
- [ ] SSL certificate renewal check
- [ ] SEO audit
- [ ] Backup strategy review

### 5. Backup Strategy

**Files:**
```bash
# Create backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf /backups/kamal-it-solutions_$DATE.tar.gz /var/www/kamal-it-solutions

# Keep last 30 days
find /backups -name "*.tar.gz" -mtime +30 -delete
```

**Automated backups (Cron):**
```bash
# Edit crontab
crontab -e

# Add backup job (daily at 2 AM)
0 2 * * * /opt/scripts/backup.sh
```

### 6. Security Checklist

- [ ] SSL certificate installed and valid
- [ ] Firewall configured (ufw/iptables)
- [ ] SSH key authentication enabled
- [ ] Password authentication disabled for SSH
- [ ] Fail2ban installed and configured
- [ ] Regular security updates applied
- [ ] Database secured (if applicable)
- [ ] Environment variables secured
- [ ] No sensitive data in version control
- [ ] Security headers configured
- [ ] Rate limiting enabled

---

## Troubleshooting

### Common Issues

#### 1. Site Not Loading
**Checklist:**
- [ ] Server running: `pm2 status`
- [ ] Port open: `netstat -tulpn | grep :3000`
- [ ] Firewall rules: `sudo ufw status`
- [ ] Nginx status: `sudo systemctl status nginx`

**Commands:**
```bash
# Check if server is running
pm2 list

# Check server logs
pm2 logs kamal-it-solutions

# Test local connection
curl http://localhost:3000

# Check port listening
sudo lsof -i :3000
```

#### 2. SSL Certificate Issues
**Commands:**
```bash
# Check certificate
openssl s_client -connect kamalitsolutions.us:443 -servername kamalitsolutions.us

# Renew certificate
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run
```

#### 3. Performance Issues
**Tools:**
```bash
# Check server resources
htop

# Check memory usage
free -m

# Check disk usage
df -h

# Check Node.js process
pm2 monit
```

#### 4. DNS Issues
**Commands:**
```bash
# Check DNS resolution
dig kamalitsolutions.us

# Check WHOIS
whois kamalitsolutions.us

# Flush DNS cache (macOS)
sudo dscacheutil -flushcache
```

---

## Rollback Procedure

### From Git
```bash
# Check recent commits
git log --oneline -10

# Rollback to previous version
git checkout <commit-hash>

# Force push (if necessary)
git push -f origin main
```

### From PM2
```bash
# List previous versions
pm2 list

# Restore previous instance
pm2 delete kamal-it-solutions
pm2 start server.js --name "kamal-it-solutions"
```

---

## Support & Resources

### Documentation
- [Express.js Documentation](https://expressjs.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Let's Encrypt Documentation](https://letsencrypt.org/getting-started/)

### Community
- [Stack Overflow](https://stackoverflow.com/)
- [Server Fault](https://serverfault.com/)
- [r/webdev](https://www.reddit.com/r/webdev/)

### Emergency Contacts
- **Security Issues:** security@kamalitsolutions.us
- **Technical Support:** support@kamalitsolutions.us

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-01-01 | Initial deployment |

---

**Last Updated:** January 2024
**Maintained By:** Kamal IT Solutions Team
