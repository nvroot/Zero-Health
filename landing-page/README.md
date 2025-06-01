# Zero Health - Landing Page

This is a static landing page for the Zero Health educational healthcare security platform. It's designed to be safely deployed on Cloudflare Pages without exposing any vulnerable functionality.

## What's Included

- **Professional landing page** showcasing the educational purpose
- **Clear security warnings** emphasizing this is for learning only
- **Prominent GitHub links** directing visitors to the repository
- **No backend functionality** - completely static and safe
- **Responsive design** that works on all devices
- **Modern animations** and interactive elements

## Files

- `index.html` - Main landing page
- `style.css` - Modern, professional styling
- `script.js` - Interactive features and animations
- `favicon.svg` - Zero Health logo icon

## Features

### 🔒 Security-First Design
- No vulnerable functionality exposed
- Clear educational warnings throughout
- Directs users to GitHub for the actual application

### 🎨 Professional Presentation
- Modern gradient design with healthcare-inspired colors
- Responsive grid layouts for features and vulnerabilities
- Smooth animations and hover effects
- Professional typography and spacing

### 📱 Fully Responsive
- Mobile-first design approach
- Optimized for all screen sizes
- Touch-friendly interactive elements

### 🚀 Performance Optimized
- Pure HTML/CSS/JS - no frameworks
- Optimized images and assets
- Fast loading times
- Perfect for Cloudflare Pages

## Cloudflare Pages Deployment

### Option 1: Direct Upload (Recommended)

1. **Prepare the files:**
   ```bash
   # Create a zip file with all landing page files
   cd landing-page
   zip -r zero-health-landing.zip .
   ```

2. **Deploy to Cloudflare Pages:**
   - Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Go to "Workers & Pages" → "Pages"
   - Click "Upload assets"
   - Upload the zip file or drag & drop the folder
   - Set a project name (e.g., "zero-health-landing")
   - Click "Deploy site"

### Option 2: Git Integration

1. **Create a separate repository:**
   ```bash
   # Create a new repository for just the landing page
   cd landing-page
   git init
   git add .
   git commit -m "Initial landing page"
   git remote add origin https://github.com/yourusername/zero-health-landing.git
   git push -u origin main
   ```

2. **Connect to Cloudflare Pages:**
   - In Cloudflare Pages, click "Connect to Git"
   - Connect your GitHub account
   - Select the landing page repository
   - Configure build settings (leave empty for static site)
   - Deploy

### Build Settings

For static deployment, use these settings:

- **Build command:** (leave empty)
- **Build output directory:** `/`
- **Root directory:** `/`
- **Environment variables:** (none needed)

## Custom Domain Setup

1. In Cloudflare Pages, go to your project
2. Click "Custom domains"
3. Add your domain (e.g., `zero-health.yoursite.com`)
4. Follow DNS setup instructions

## Content Customization

### Update GitHub Links
Make sure all GitHub links point to your repository:
```html
<a href="https://github.com/aligorithm/zero-health" target="_blank">
```

### Modify Contact Information
Update footer and contact sections as needed.

### Add Analytics (Optional)
To add Google Analytics or other tracking:

1. Add tracking code to `index.html` before `</head>`
2. Uncomment analytics code in `script.js`
3. Replace placeholder tracking IDs

### SEO Optimization
The page includes:
- Proper meta descriptions
- Keywords relevant to cybersecurity education
- Open Graph tags for social sharing
- Structured data for search engines

## Security Considerations

✅ **Safe for Public Deployment:**
- No server-side code
- No database connections
- No user input processing
- No file uploads
- No vulnerable functionality

✅ **Educational Focus:**
- Clear warnings about educational purpose
- Emphasis on controlled learning environments
- Proper disclaimers about not using in production

## Maintenance

This static site requires minimal maintenance:

- **Updates:** Modify HTML/CSS/JS files as needed
- **Security:** No backend security concerns
- **Monitoring:** Use Cloudflare Analytics for traffic insights
- **Backups:** Files are version controlled in Git

## Support

For issues with the landing page:
1. Check Cloudflare Pages deployment logs
2. Validate HTML/CSS using online validators
3. Test responsive design on multiple devices
4. Ensure all external links are working

For the main Zero Health application, refer to the [main repository](https://github.com/aligorithm/zero-health). 