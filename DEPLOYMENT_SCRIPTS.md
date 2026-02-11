# 🚀 AUTOMATED DEPLOYMENT SCRIPTS

## 📋 **Overview**

Two deployment scripts are provided for easy Vercel deployment:
- **`deploy.bat`** - Windows Batch file (classic)
- **`deploy.ps1`** - PowerShell script (recommended)

Both scripts automate the entire deployment process from build to production!

---

## ✨ **Features**

### **What These Scripts Do:**
1. ✅ Check if Vercel CLI is installed
2. ✅ Run build test to catch errors
3. ✅ Check Git status for uncommitted changes
4. ✅ Optionally commit and push to GitHub
5. ✅ Deploy to Vercel (Preview or Production)
6. ✅ Provide colored output and error handling

---

## 🎯 **Quick Start**

### **Method 1: PowerShell (Recommended)**

**Double-click** `deploy.ps1` or run:
```powershell
.\deploy.ps1
```

**If you get execution policy error:**
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
.\deploy.ps1
```

### **Method 2: Batch File**

**Double-click** `deploy.bat` or run:
```cmd
deploy.bat
```

---

## 📝 **Step-by-Step Usage**

### **When You Run the Script:**

**Step 1: Vercel CLI Check**
```
[1/5] Checking Vercel CLI...
✓ Vercel CLI found: 50.15.1
```
- If not found, install with: `npm install -g vercel`

**Step 2: Build Test**
```
[2/5] Running build test...
✓ Build successful
```
- Ensures your code compiles before deploying
- Catches TypeScript errors early

**Step 3: Git Status**
```
[3/5] Checking Git status...
Changes detected:
M tools/src/pages/Home.tsx

Do you want to commit and push changes? (y/n):
```
- Shows uncommitted changes
- Optionally commit and push to GitHub

**Step 4: Choose Deployment Type**
```
[4/5] Deploying to Vercel...

Choose deployment type:
  1. Preview deployment (test)
  2. Production deployment

Enter choice (1 or 2):
```
- **Preview (1):** Test deployment with unique URL
- **Production (2):** Live deployment to main URL

**Step 5: Deploy!**
```
[5/5] Deployment complete!

========================================
  ✓ Deployment Successful!
========================================

Your app is now live on Vercel!
```

---

## 🔐 **First-Time Setup**

### **Before First Deployment:**

1. **Login to Vercel CLI:**
   ```powershell
   vercel login
   ```
   - Opens browser for authentication
   - Links your Vercel account

2. **First Deploy (One-Time Setup):**
   ```powershell
   cd d:\WIP\LuckerLife\tools
   vercel
   ```
   
   **Answer the prompts:**
   ```
   ? Set up and deploy "~/LunkerLife/tools"? [Y/n] Y
   ? Which scope? [Your Vercel account]
   ? Link to existing project? [N]
   ? What's your project's name? lunkerlife-app
   ? In which directory is your code located? ./
   ? Want to override settings? [N]
   ```

3. **Add Environment Variables:**
   - Go to: https://vercel.com/dashboard
   - Select your project
   - Settings → Environment Variables
   - Add:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

4. **After First Setup:**
   - Use `deploy.ps1` or `deploy.bat` for all future deployments!
   - No need to answer prompts again

---

## 🎨 **Deployment Types Explained**

### **Preview Deployment (Option 1)**

**What it does:**
- Creates a test deployment
- Gets unique URL (e.g., `lunkerlife-app-abc123.vercel.app`)
- Doesn't affect production
- Perfect for testing changes

**When to use:**
- Testing new features
- Sharing with team for review
- Verifying fixes before production

**Command:**
```powershell
vercel
```

### **Production Deployment (Option 2)**

**What it does:**
- Deploys to main URL
- Updates live site
- Visible to all users

**When to use:**
- Ready to go live
- All testing complete
- Changes approved

**Command:**
```powershell
vercel --prod
```

---

## 🔄 **Typical Workflow**

### **Daily Development:**

1. **Make changes** to your code
2. **Test locally:** `npm run dev`
3. **Run deployment script:** `.\deploy.ps1`
4. **Choose Preview (1)** to test
5. **Verify** the preview URL works
6. **Run script again**
7. **Choose Production (2)** to go live

### **Quick Fix Workflow:**

```powershell
# Fix the bug
# Test locally
.\deploy.ps1
# Choose Production (2)
# Done!
```

---

## 🛠️ **Troubleshooting**

### **"Vercel CLI not found"**

**Solution:**
```powershell
npm install -g vercel
```

### **"Build failed"**

**Solution:**
1. Check error messages
2. Fix TypeScript errors
3. Test with: `npm run build`
4. Run deployment script again

### **"Git push failed"**

**Solution:**
1. Check internet connection
2. Verify GitHub credentials
3. Try manual push: `git push origin master`

### **"Deployment failed"**

**Solution:**
1. Check Vercel dashboard for errors
2. Verify environment variables are set
3. Check build logs in Vercel
4. Refer to `VERCEL_BUILD_ISSUES.md`

### **PowerShell Execution Policy Error**

**Error:**
```
cannot be loaded because running scripts is disabled
```

**Solution:**
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

---

## 📊 **What Happens During Deployment**

### **Local (Your Computer):**
1. Script checks Vercel CLI
2. Runs build test
3. Checks Git status
4. Commits/pushes if needed
5. Triggers Vercel deployment

### **Vercel (Cloud):**
1. Pulls latest code from GitHub
2. Installs dependencies (`npm install`)
3. Runs build (`npm run build`)
4. Deploys to CDN
5. Returns deployment URL

### **Total Time:**
- Preview: ~2-3 minutes
- Production: ~2-3 minutes

---

## 🎯 **Best Practices**

### **Before Deploying:**
- ✅ Test locally with `npm run dev`
- ✅ Run `npm run build` to check for errors
- ✅ Commit meaningful changes
- ✅ Write clear commit messages

### **During Deployment:**
- ✅ Use Preview for testing
- ✅ Use Production when ready
- ✅ Check deployment URL works
- ✅ Verify all features function

### **After Deployment:**
- ✅ Test the live site
- ✅ Check browser console for errors
- ✅ Verify images load
- ✅ Test database queries

---

## 🔑 **Environment Variables**

### **Required for Deployment:**

```env
VITE_SUPABASE_URL=https://gskbzaduwmsbaxddixmk.supabase.co
VITE_SUPABASE_ANON_KEY=[Your Supabase Anon Key]
```

### **How to Add in Vercel:**

1. Go to: https://vercel.com/dashboard
2. Select: Your project
3. Click: Settings → Environment Variables
4. Add both variables
5. Select: Production, Preview, Development
6. Save

**Note:** Only needed once! Vercel remembers them.

---

## 📝 **Manual Deployment (Alternative)**

If scripts don't work, deploy manually:

### **Preview:**
```powershell
cd d:\WIP\LuckerLife\tools
vercel
```

### **Production:**
```powershell
cd d:\WIP\LuckerLife\tools
vercel --prod
```

---

## 🚀 **Advanced Usage**

### **Deploy Specific Branch:**
```powershell
git checkout feature-branch
.\deploy.ps1
# Choose Preview to test branch
```

### **Deploy Without Git Push:**
```powershell
# When script asks to commit/push, choose 'n'
# Deploys current local code
```

### **Check Deployment Status:**
```powershell
vercel ls
```

### **View Deployment Logs:**
```powershell
vercel logs [deployment-url]
```

### **Rollback Deployment:**
```powershell
# Go to Vercel Dashboard
# Deployments → Select previous deployment
# Click "Promote to Production"
```

---

## 📚 **Related Documentation**

- `DEPLOYMENT_CHECKLIST.md` - Pre-deployment checklist
- `DEPLOYMENT_GUIDE.md` - Comprehensive guide
- `VERCEL_BUILD_ISSUES.md` - Build error solutions
- `READY_TO_DEPLOY.md` - Final deployment status

---

## 🎉 **Quick Reference**

### **Deploy to Preview:**
```powershell
.\deploy.ps1
# Choose option 1
```

### **Deploy to Production:**
```powershell
.\deploy.ps1
# Choose option 2
```

### **First Time Setup:**
```powershell
vercel login
cd tools
vercel
# Answer prompts
# Add env vars in dashboard
```

---

## ✅ **Checklist Before Running Script**

- [ ] Vercel CLI installed (`vercel --version`)
- [ ] Logged into Vercel (`vercel whoami`)
- [ ] Environment variables set in Vercel dashboard
- [ ] Code tested locally
- [ ] Build passes (`npm run build`)
- [ ] Changes committed (or ready to commit)

---

**You're ready to deploy with one command!** 🚀

Just run `.\deploy.ps1` and follow the prompts!
