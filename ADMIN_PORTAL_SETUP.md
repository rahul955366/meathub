# 🔐 Admin Portal - Complete Setup Instructions

## 🚀 Quick Start

### Step 1: Create Project
```powershell
cd "C:\Users\sango\OneDrive\Desktop\myProject_MEAT"

# Create admin portal
mkdir admin-portal
cd admin-portal

# Initialize with package.json
npm init -y

# Install Vite
npm install -D vite @vitejs/plugin-react

# Install React
npm install react react-dom react-router-dom

# Install TypeScript
npm install -D typescript @types/react @types/react-dom

# Install UI dependencies
npm install tailwindcss postcss autoprefixer
npm install recharts lucide-react sonner axios
npm install @tanstack/react-query
```

### Step 2: Configure Files

Create these configuration files in `admin-portal/`:

**vite.config.ts:**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174
  }
})
```

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**package.json** (update scripts):
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

**tailwind.config.js:**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**postcss.config.js:**
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### Step 3: Create Structure

```powershell
cd src

# Create directories
mkdir pages components api context types utils

# Navigate back
cd ..
```

### Step 4: Run

```powershell
npm run dev
```

Admin portal will run on **http://localhost:5174**

---

## ✅ Ready for Implementation

Now copy all the component files from the complete code file I'll create next!
