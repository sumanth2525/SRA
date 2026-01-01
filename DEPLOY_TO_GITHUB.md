# Deploy to GitHub - Step by Step Guide

## ✅ Pre-Deployment Checklist

- [x] `.gitignore` is configured (sensitive files excluded)
- [x] `.env` files are in `.gitignore` (won't be uploaded)
- [x] README.md is ready
- [ ] GitHub account ready
- [ ] Git installed on your computer

## 🚀 Quick Deployment Steps

### Step 1: Initialize Git Repository

Open terminal in your project folder and run:

```bash
git init
```

### Step 2: Add All Files

```bash
git add .
```

### Step 3: Create First Commit

```bash
git commit -m "Initial commit: Productivity Tracker app"
```

### Step 4: Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right
3. Select **"New repository"**
4. Name it: `productivity-tracker` (or any name you like)
5. **DO NOT** check "Initialize with README" (we already have one)
6. Click **"Create repository"**

### Step 5: Connect Local Repository to GitHub

GitHub will show you commands. Use these (replace `YOUR_USERNAME` with your GitHub username):

```bash
git remote add origin https://github.com/YOUR_USERNAME/productivity-tracker.git
git branch -M main
git push -u origin main
```

### Step 6: Verify

Go to your GitHub repository page and you should see all your files!

## 📝 Important Notes

### ⚠️ Security Reminders

- **NEVER** commit `.env` files - they're already in `.gitignore`
- **NEVER** commit your Supabase keys
- If you accidentally committed sensitive files, use `git rm --cached .env` and commit again

### 📁 What Gets Uploaded

✅ **Will be uploaded:**
- Source code (src/, backend/)
- Configuration files (package.json, vite.config.js, etc.)
- Documentation (README.md, SETUP.md, etc.)
- SQL schema files

❌ **Will NOT be uploaded:**
- `.env` files (your Supabase credentials)
- `node_modules/` (dependencies)
- `__pycache__/` (Python cache)
- Build files

## 🔄 Updating Your Repository

After making changes:

```bash
git add .
git commit -m "Description of your changes"
git push
```

## 🌐 Making Repository Public vs Private

- **Private**: Only you can see it (recommended for personal projects)
- **Public**: Everyone can see it (good for portfolio/showcase)

You can change this in GitHub repository Settings → General → Danger Zone

## 📚 Next Steps After Deployment

1. Add a license file (MIT, Apache, etc.)
2. Add topics/tags to your repository
3. Create GitHub Pages for live demo (optional)
4. Set up GitHub Actions for CI/CD (optional)

## 🆘 Troubleshooting

**Error: "remote origin already exists"**
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/productivity-tracker.git
```

**Error: "failed to push"**
- Make sure you're authenticated: `git config --global user.name "Your Name"`
- Check your GitHub credentials

**Want to remove a file from Git?**
```bash
git rm --cached filename
git commit -m "Remove file"
git push
```

