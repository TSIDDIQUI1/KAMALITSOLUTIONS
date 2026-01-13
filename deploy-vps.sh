#!/bin/bash

# Kamal IT Solutions - VPS Deployment Script
# This script automates deployment to Hostinger VPS with Ubuntu 22.04 LTS
# Run this script on your VPS after connecting via SSH

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored function
print_step() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}📦 $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if running as root
if [[ $EUID -ne 0 ]]; then
    print_error "This script must be run as root (use sudo)"
    exit 1
fi

echo ""
print_step "Kamal IT Solutions - VPS Deployment Script"
echo ""
echo "This script will:"
echo "  1. Update system packages"
echo "  2. Install Node.js 20.x"
echo "  3. Install and configure PM2"
echo "  4. Clone your repository"
echo "  5. Install dependencies"
echo "  6. Configure environment variables"
echo "  7. Install Nginx"
echo "  8. Configure SSL certificate"
echo ""
read -p "Do you want to continue? (y/n): " confirm
if [[ $confirm != "y" && $confirm != "Y" ]]; then
    echo "Deployment cancelled."
    exit 0
fi

# ============================================================================
# STEP 1: Update System
# ============================================================================
print_step "Step 1: Updating System Packages"

apt update -y
apt upgrade -y

print_success "System updated successfully"

# ============================================================================
# STEP 2: Install Node.js 20.x
# ============================================================================
print_step "Step 2: Installing Node.js 20.x"

# Install curl if not present
if ! command -v curl &> /dev/null; then
    apt install -y curl
fi

# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -

# Install Node.js
apt install -y nodejs

# Verify installation
NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)

print_success "Node.js $NODE_VERSION installed"
print_success "npm $NPM_VERSION installed"

# ============================================================================
# STEP 3: Install PM2 Process Manager
# ============================================================================
print_step "Step 3: Installing PM2 Process Manager"

npm install -g pm2

# Setup PM2 startup script
pm2 startup | tail -n 1

print_success "PM2 installed and configured"

# ============================================================================
# STEP 4: Install Nginx
# ============================================================================
print_step "Step 4: Installing Nginx"

apt install -y nginx

# Start and enable Nginx
systemctl start nginx
systemctl enable nginx

print_success "Nginx installed and running"

# ============================================================================
# STEP 5: Install Certbot for SSL
# ============================================================================
print_step "Step 5: Installing Certbot for SSL"

apt install -y certbot python3-certbot-nginx

print_success "Certbot installed"

# ============================================================================
# STEP 6: Create Deploy User (Optional)
# ============================================================================
print_step "Step 6: Setting Up Deployment Directory"

# Create project directory
mkdir -p /var/www/kamal-it-solutions
cd /var/www/kamal-it-solutions

# Clone repository
print_warning "Cloning repository from GitHub..."
git clone https://github.com/TSIDDIQUI1/KAMALITSOLUTIONS.git .

print_success "Repository cloned"

# ============================================================================
# STEP 7: Install Dependencies
# ============================================================================
print_step "Step 7: Installing Node.js Dependencies"

npm install

print_success "Dependencies installed"

# ============================================================================
# STEP 8: Configure Environment Variables
# ============================================================================
print_step "Step 8: Configuring Environment Variables"

if [ ! -f .env ]; then
    print_warning "Creating .env file..."
    cat > .env << EOF
# Kamal IT Solutions - Environment Variables
# IMPORTANT: Never commit this file to GitHub!

# Email Configuration (for contact form notifications)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Server Configuration
PORT=3000
NODE_ENV=production
EOF
    print_warning "Please edit .env file with your actual credentials!"
    print_warning "Run: nano /var/www/kamal-it-solutions/.env"
else
    print_success ".env file already exists"
fi

# ============================================================================
# STEP 9: Start Application with PM2
# ============================================================================
print_step "Step 9: Starting Application with PM2"

# Stop existing process if running
pm2 delete kamal-it-solutions 2>/dev/null || true

# Start application
pm2 start server.js --name "kamal-it-solutions"

# Save PM2 process list
pm2 save

print_success "Application started with PM2"

# ============================================================================
# STEP 10: Configure Nginx
# ============================================================================
print_step "Step 10: Configuring Nginx"

# Get domain name
read -p "Enter your domain name (e.g., kamalitsolutions.com): " DOMAIN_NAME

if [ -z "$DOMAIN_NAME" ]; then
    print_warning "No domain entered. Using localhost for now."
    DOMAIN_NAME="localhost"
fi

# Create Nginx configuration
cat > /etc/nginx/sites-available/kamal-it-solutions << EOF
server {
    listen 80;
    server_name $DOMAIN_NAME www.$DOMAIN_NAME;

    # Redirect to www
    if (\$host = $DOMAIN_NAME) {
        return 301 http://www.\$host\$request_uri;
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
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;

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
EOF

# Enable site
ln -sf /etc/nginx/sites-available/kamal-it-solutions /etc/nginx/sites-enabled/

# Remove default config
rm -f /etc/nginx/sites-enabled/default

# Test and reload Nginx
nginx -t
systemctl reload nginx

print_success "Nginx configured for $DOMAIN_NAME"

# ============================================================================
# STEP 11: Configure Firewall
# ============================================================================
print_step "Step 11: Configuring Firewall"

# Install UFW if not present
if ! command -v ufw &> /dev/null; then
    apt install -y ufw
fi

# Allow SSH
ufw allow OpenSSH

# Allow HTTP and HTTPS
ufw allow 'Nginx Full'

# Enable firewall
echo "y" | ufw enable

print_success "Firewall configured"

# ============================================================================
# STEP 12: SSL Certificate (Optional)
# ============================================================================
print_step "Step 12: SSL Certificate Setup"

read -p "Do you want to set up SSL/HTTPS now? (y/n): " setup_ssl

if [[ $setup_ssl == "y" || $setup_ssl == "Y" ]]; then
    read -p "Enter your email for SSL certificate: " SSL_EMAIL
    
    if [ -n "$SSL_EMAIL" ]; then
        print_warning "Obtaining SSL certificate from Let's Encrypt..."
        certbot --nginx -d $DOMAIN_NAME -d www.$DOMAIN_NAME --email $SSL_EMAIL --agree-tos --non-interactive
        
        if [ $? -eq 0 ]; then
            print_success "SSL certificate installed successfully!"
        else
            print_error "SSL certificate installation failed"
            print_warning "You can try later with: sudo certbot --nginx -d $DOMAIN_NAME -d www.$DOMAIN_NAME"
        fi
    else
        print_warning "No email provided. Skipping SSL setup."
        print_warning "You can setup SSL later using the guide in VPS_UBUNTU_DEPLOYMENT.md"
    fi
else
    print_warning "SSL setup skipped."
    print_warning "You can setup SSL later using: sudo certbot --nginx -d $DOMAIN_NAME -d www.$DOMAIN_NAME"
fi

# ============================================================================
# STEP 13: Final Summary
# ============================================================================
print_step "Deployment Complete!"

echo ""
echo -e "${GREEN}🎉 Your Kamal IT Solutions website is now deployed!${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Application Status:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
pm2 status
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 Access Your Website:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "  ${GREEN}HTTP:${NC}  http://$DOMAIN_NAME"
echo -e "  ${GREEN}Local:${NC} http://localhost:3000"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 Important Commands:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  View logs:      pm2 logs kamal-it-solutions"
echo "  Restart app:    pm2 restart kamal-it-solutions"
echo "  Monitor:        pm2 monit"
echo "  Check Nginx:    systemctl status nginx"
echo "  View Nginx logs: tail -f /var/log/nginx/access.log"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⚠️  Next Steps:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  1. Edit .env file with your email credentials:"
echo "     nano /var/www/kamal-it-solutions/.env"
echo ""
echo "  2. Point your domain DNS to this VPS IP address"
echo ""
echo "  3. If you didn't setup SSL, run this when ready:"
echo "     sudo certbot --nginx -d $DOMAIN_NAME -d www.$DOMAIN_NAME"
echo ""
echo "  4. To update your site in the future:"
echo "     cd /var/www/kamal-it-solutions"
echo "     git pull origin main"
echo "     npm install"
echo "     pm2 restart kamal-it-solutions"
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}⚠️  IMPORTANT: Restart the application after editing .env${NC}"
echo -e "${YELLOW}   Run: pm2 restart kamal-it-solutions${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

