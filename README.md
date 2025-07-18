# Daniel Le - Portfolio

A modern, responsive portfolio website built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Deployment to GitHub Pages

This portfolio is configured for automatic deployment to GitHub Pages. Here's how to set it up:

### Prerequisites

1. Make sure your repository is named `MyPortfolio` (or update the `basePath` in `next.config.mjs`)
2. Ensure your repository is public

### Setup Steps

1. **Enable GitHub Pages:**
   - Go to your repository settings
   - Navigate to "Pages" in the sidebar
   - Under "Source", select "GitHub Actions"

2. **Push your code:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

3. **Monitor deployment:**
   - Go to the "Actions" tab in your repository
   - You should see the deployment workflow running
   - Once complete, your site will be available at `https://yourusername.github.io/MyPortfolio`

### Manual Deployment (Alternative)

If you prefer manual deployment:

1. Build the project:
   ```bash
   npm run build
   ```

2. The static files will be generated in the `out/` directory

3. Upload the contents of the `out/` directory to your GitHub Pages branch

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

- `app/` - Next.js app directory
- `components/` - Reusable UI components
- `public/` - Static assets (images, videos)
- `portfolio.tsx` - Main portfolio component

## 🎨 Features

- Responsive design
- Smooth scroll animations
- Interactive timeline
- Project carousel
- Contact section
- Dark theme
- Modern UI with Tailwind CSS

## 🔧 Technologies Used

- Next.js 14
- TypeScript
- Tailwind CSS
- Lucide React Icons
- Radix UI Components 