# Vercel Deployment Guide

## 🚀 Deploy to Vercel

This project is configured for easy deployment to Vercel. Follow these steps:

### Prerequisites
- Vercel account (sign up at [vercel.com](https://vercel.com))
- Git repository (GitHub, GitLab, or Bitbucket)

### Quick Deployment

1. **Connect to Vercel**
   ```bash
   # Install Vercel CLI (optional)
   npm i -g vercel
   
   # Or deploy directly from GitHub
   # Push your code to GitHub and import on Vercel dashboard
   ```

2. **Import Project**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect it's a Vite project

3. **Configure Environment Variables**
   Set these in Vercel Dashboard > Project Settings > Environment Variables:
   
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_N8N_RESUME_PARSER_URL=your_n8n_webhook_url
   VITE_N8N_MOCK_INTERVIEW_URL=your_n8n_mock_interview_url
   VITE_N8N_PROCESS_RESPONSE_URL=your_n8n_process_response_url
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically
   - Your app will be live at `https://your-project.vercel.app`

### Manual Deployment via CLI

```bash
# Login to Vercel
vercel login

# Deploy to preview (development)
vercel

# Deploy to production
vercel --prod

# Set environment variables
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add VITE_N8N_RESUME_PARSER_URL
```

### Build Configuration

The project includes:
- ✅ `vercel.json` - Vercel configuration
- ✅ SPA routing support 
- ✅ Asset caching headers
- ✅ Security headers
- ✅ Environment variable setup

### Custom Domain (Optional)

1. Go to Project Settings > Domains
2. Add your custom domain
3. Configure DNS records as instructed

### Troubleshooting

**Build Fails?**
- Check environment variables are set correctly
- Ensure all dependencies are in `package.json`
- Check build logs in Vercel dashboard

**404 on routes?**
- `vercel.json` handles SPA routing automatically
- All routes redirect to `index.html`

**Environment variables not working?**
- Ensure they start with `VITE_`
- Set in Vercel Dashboard, not just `.env` file
- Redeploy after setting variables

### Performance Tips

- Static assets are cached for 1 year
- Gzip compression enabled automatically
- CDN distribution worldwide

---

Ready to deploy! 🎉