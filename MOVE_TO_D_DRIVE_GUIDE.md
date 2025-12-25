# 📁 MOVING MEATHUB TO D: DRIVE - COMPLETE GUIDE

## ✅ **WHY MOVE TO D: DRIVE?**

### **Benefits:**
1. ✅ **No OneDrive sync issues** - Faster, no file locks
2. ✅ **More space** - D: typically has more free space
3. ✅ **Better performance** - Local drive is faster
4. ✅ **Less memory usage** - OneDrive sync uses RAM
5. ✅ **No sync conflicts** - Better for development
6. ✅ **Easier paths** - Shorter, cleaner paths

---

## 🚀 **HOW TO MOVE (EASY - 3 STEPS)**

### **Step 1: Stop All Running Services**

**Kill all processes first:**
```powershell
.\STOP_ALL.ps1
```

**Or manually close:**
- All PowerShell windows
- All browser tabs (portals)
- Any running Java processes

---

### **Step 2: Run the Move Script**

```powershell
.\MOVE_TO_D_DRIVE.ps1
```

**What it does:**
1. ✅ Copies entire project to `D:\myProject_MEAT`
2. ✅ Updates all script paths automatically
3. ✅ Verifies successful copy
4. ✅ Asks if you want to delete old folder

**Time:** ~2-5 minutes (depending on size)

---

### **Step 3: Start from New Location**

```powershell
cd D:\myProject_MEAT
.\START_ALL.ps1
```

**Done!** ✅

---

## 📋 **WHAT WILL BE MOVED:**

Everything in your project:

```
myProject_MEAT/
├── admin-portal/           ✅ Admin Portal
├── butcher-portal/         ✅ Butcher Portal
├── meatup-frontend/        ✅ Customer Portal
│
├── api-gateway/            ✅ API Gateway
├── auth-service/           ✅ Auth Service
├── user-service/           ✅ User Service
├── butcher-service/        ✅ Butcher Service
├── order-service/          ✅ Order Service
├── pet-service/            ✅ Pet Service
├── ai-service/             ✅ AI Service
├── gym-service/            ✅ Gym Service
│
├── All .ps1 scripts        ✅ Startup scripts
├── All .md docs            ✅ Documentation
└── node_modules/           ✅ Dependencies
```

**Total size:** ~500MB-1GB

---

## 🔄 **WHAT GETS UPDATED AUTOMATICALLY:**

The script will update these files with new paths:

1. ✅ `START_ALL.ps1` - Main startup
2. ✅ `STOP_ALL.ps1` - Stop all services
3. ✅ `START_BACKEND_LOW_MEMORY.ps1` - Backend startup
4. ✅ `CHECK_BACKEND.ps1` - Health check

**Old path:**
```
C:\Users\sango\OneDrive\Desktop\myProject_MEAT
```

**New path:**
```
D:\myProject_MEAT
```

---

## ⚙️ **AFTER MOVING:**

### **New Commands:**

```powershell
# Navigate to project
cd D:\myProject_MEAT

# Start everything
.\START_ALL.ps1

# Stop everything  
.\STOP_ALL.ps1

# Check health
.\CHECK_BACKEND.ps1
```

### **New URLs (SAME):**

- Customer Portal: http://localhost:5173
- Admin Portal: http://localhost:5174
- Butcher Portal: http://localhost:5175

---

## 🎯 **STEP-BY-STEP INSTRUCTIONS:**

### **1. Prepare**
```powershell
# Stop all services
.\STOP_ALL.ps1

# Close browser tabs
# Close VS Code (or any editor)
```

### **2. Move**
```powershell
# Run move script
.\MOVE_TO_D_DRIVE.ps1

# Wait for completion (~2-5 min)
# Answer prompts
```

### **3. Verify**
```powershell
# Navigate to new location
cd D:\myProject_MEAT

# Check files are there
dir

# Start services
.\START_ALL.ps1
```

### **4. Test**
```
# Open browsers
http://localhost:5174  (Admin)
http://localhost:5175  (Butcher)
http://localhost:5173  (Customer)
```

### **5. Clean Up (Optional)**
```powershell
# Manually delete old folder if needed
# C:\Users\sango\OneDrive\Desktop\myProject_MEAT
```

---

## ⚠️ **IMPORTANT NOTES:**

### **Before Moving:**
- ✅ Stop all running services
- ✅ Close all editors (VS Code, etc.)
- ✅ Close browser tabs
- ✅ Make sure D: has ~2GB free space

### **During Move:**
- ✅ Don't interrupt the copy
- ✅ Wait for "COMPLETED" message
- ✅ Check for any error messages

### **After Moving:**
- ✅ Update VS Code workspace if you use it
- ✅ Re-open project from D:\myProject_MEAT
- ✅ Git settings will be preserved

---

## 🐛 **IF SOMETHING GOES WRONG:**

### **Problem: Copy fails**
**Solution:**
```powershell
# Manually copy folder
# Then update paths in scripts manually
```

### **Problem: Services won't start**
**Solution:**
```powershell
cd D:\myProject_MEAT
# Run each script from new location
```

### **Problem: Old folder still there**
**Solution:**
```powershell
# Manually delete after verifying D: drive copy works
Remove-Item -Recurse -Force "C:\Users\sango\OneDrive\Desktop\myProject_MEAT"
```

---

## 💾 **DISK SPACE:**

**Before moving, check:**
```powershell
# Check D: drive space
Get-PSDrive D
```

**Need:** ~2GB free (for project + growth)

---

## ✅ **BENEFITS AFTER MOVING:**

1. ✅ **Faster file access** (no OneDrive sync)
2. ✅ **Less memory usage** (OneDrive not syncing)
3. ✅ **No file locks** (OneDrive conflicts gone)
4. ✅ **Cleaner workspace** (Desktop less cluttered)
5. ✅ **Better for Git** (no sync issues)
6. ✅ **May fix memory issues** (freed RAM from OneDrive)

---

## 🎉 **READY TO MOVE?**

**Run this command:**
```powershell
cd C:\Users\sango\OneDrive\Desktop\myProject_MEAT
.\MOVE_TO_D_DRIVE.ps1
```

**Follow the prompts, and you're done!** 🚀

---

## 📞 **NEED HELP?**

If anything goes wrong:
1. Don't panic - old folder is safe
2. Try manual copy
3. Update script paths manually
4. Both versions can coexist temporarily

**The move is SAFE and REVERSIBLE!**
