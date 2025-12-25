# ⚠️ MySQL Not Running - Quick Fix

## Start MySQL First

Before running MEATHUB, you need to start MySQL server.

### Option 1: Start MySQL Service (Windows)
1. Open **Services** (Win+R → `services.msc`)
2. Find **MySQL** or **MySQL80** service
3. Right-click → **Start**
4. Verify it's running

### Option 2: Start MySQL via Command Line
```batch
# If MySQL is installed as Windows Service:
net start MySQL80

# Or try:
net start MySQL

# Or if XAMPP/WAMP:
# Start MySQL from XAMPP/WAMP control panel
```

### Option 3: Start MySQL Manually
```batch
# Navigate to MySQL bin directory (example paths):
cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"
mysqld.exe --console

# Or if XAMPP:
cd C:\xampp\mysql\bin
mysqld.exe
```

### Option 4: Use XAMPP/WAMP
If you have XAMPP or WAMP installed:
1. Open XAMPP/WAMP Control Panel
2. Start MySQL service
3. Verify it's running on port 3306

---

## Verify MySQL is Running

After starting MySQL, verify:
```batch
# Test connection:
mysql -uroot -proot -e "SELECT 'MySQL OK' AS status;"
```

If this works, MySQL is running! ✅

---

## Then Run MEATHUB

Once MySQL is running:
```batch
START_MEATHUB.bat
```

---

## MySQL Configuration

MEATHUB expects:
- **Host:** localhost
- **Port:** 3306
- **Username:** root
- **Password:** root

If your MySQL uses different credentials, you'll need to update the `application.properties` files in each service.

---

**Start MySQL first, then run START_MEATHUB.bat again! 🚀**

