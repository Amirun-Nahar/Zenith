# Netlify Deployment Guide for Zenith Frontend

## Prerequisites

1. Node.js (v18 or higher)
2. npm (v8 or higher)
3. A Netlify account
4. The Netlify CLI (optional for local testing)

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   - Copy `.env.production` to `.env.local` for local development
   - Set up the following environment variables in Netlify:
     - `VITE_API_URL`: Your backend API URL
     - `VITE_APP_ENV`: Set to 'production'
     - `VITE_APP_NAME`: Your app name

3. **Local Development**
   ```bash
   # Start development server
   npm run dev

   # Or with Netlify CLI
   npm run netlify:dev
   ```

4. **Build for Production**
   ```bash
   npm run netlify:build
   ```

## Deployment

### Option 1: Automatic Deployment (Recommended)

1. Connect your GitHub repository to Netlify
2. Configure build settings:
   - Build command: `npm run netlify:build`
   - Publish directory: `dist`
   - Node version: 18

### Option 2: Manual Deployment

1. Build the project locally:
   ```bash
   npm run netlify:build
   ```

2. Deploy using Netlify CLI:
   ```bash
   netlify deploy --prod
   ```

## Important Notes

- The `_redirects` file handles client-side routing
- All API requests should use the environment variable `VITE_API_URL`
- Static assets are served from the `public` directory
- The site is configured with security headers in `netlify.toml`

## Troubleshooting

1. **404 Errors on Routes**
   - Ensure `_redirects` file is present in the `dist` directory
   - Check Netlify redirects configuration

2. **Build Failures**
   - Verify Node.js version (should be 18+)
   - Check for environment variables
   - Review build logs in Netlify dashboard

3. **API Connection Issues**
   - Verify API URL in environment variables
   - Check CORS configuration in backend
   - Review network requests in browser console

## Monitoring

- Use Netlify Analytics for traffic insights
- Enable notifications for build failures
- Monitor performance in Netlify dashboard

## Support

For additional support:
1. Check Netlify documentation
2. Review project issues on GitHub
3. Contact the development team
