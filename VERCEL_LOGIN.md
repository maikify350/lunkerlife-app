# 🔐 VERCEL LOGIN - QUICK START

## ⚡ **You Need to Login First!**

Before using the deployment scripts, you need to login to Vercel once.

---

## 🚀 **Login Now (One-Time Setup)**

### **Step 1: Run Login Command**

```powershell
vercel login
```

### **Step 2: Press ENTER**

The command will show:
```
Visit https://vercel.com/oauth/device?user_code=XXXX-XXXX
Press [ENTER] to open the browser
```

**Press ENTER** - It will open your browser

### **Step 3: Authorize in Browser**

1. Browser opens to Vercel login page
2. Sign in with your GitHub account
3. Click "Authorize" or "Confirm"
4. You'll see "Success! You are now logged in"

### **Step 4: Return to Terminal**

Terminal will show:
```
✓ Success! Authentication complete
```

### **Step 5: Verify Login**

```powershell
vercel whoami
```

Should show your Vercel username!

---

## ✅ **After Login**

You're ready to deploy! Use either:

### **Option 1: PowerShell Script (Recommended)**
```powershell
.\deploy.ps1
```

### **Option 2: Batch File**
```cmd
deploy.bat
```

### **Option 3: Manual Command**
```powershell
cd tools
vercel          # Preview deployment
vercel --prod   # Production deployment
```

---

## 🎯 **First Deployment Setup**

When you run `vercel` for the first time, it will ask:

```
? Set up and deploy "~/LunkerLife/tools"? [Y/n]
```
**Answer:** Y

```
? Which scope?
```
**Answer:** Select your Vercel account

```
? Link to existing project? [y/N]
```
**Answer:** N (first time)

```
? What's your project's name?
```
**Answer:** lunkerlife-app

```
? In which directory is your code located?
```
**Answer:** ./ (press ENTER)

```
? Want to override the settings?
```
**Answer:** N (press ENTER)

---

## 🔑 **Don't Forget Environment Variables!**

After first deployment:

1. Go to: https://vercel.com/dashboard
2. Select: lunkerlife-app
3. Click: Settings → Environment Variables
4. Add:
   - `VITE_SUPABASE_URL`: `https://gskbzaduwmsbaxddixmk.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: [Get from Supabase Dashboard]
5. Select: Production, Preview, Development
6. Save
7. Redeploy: `vercel --prod`

---

## 🎉 **You're Ready!**

After login and first setup, future deployments are just:

```powershell
.\deploy.ps1
```

That's it! 🚀
