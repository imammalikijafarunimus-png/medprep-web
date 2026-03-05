# MedPrep Web

Platform belajar kedokteran untuk persiapan UKMPPD (Uji Kompetensi Mahasiswa Pendidikan Dokter) dengan Bank Soal CBT, Checklist OSCE, dan Wawasan Bioetika Islam.

## Daftar Isi

- [Fitur](#fitur)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Instalasi](#instalasi)
- [Konfigurasi Environment](#konfigurasi-environment)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [Struktur Project](#struktur-project)
- [Scripts](#scripts)
- [Testing](#testing)
- [Deployment](#deployment)
- [Kontribusi](#kontribusi)
- [Lisensi](#lisensi)

## Fitur

### Bank Soal CBT (Computer Based Test)
- Ribuan soal latihan dengan pembahasan
- Simulasi ujian dengan timer
- Analisis performa per sistem organ
- Tracking progress belajar

### Checklist OSCE (Objective Structured Clinical Examination)
- Station-stations OSCE lengkap
- Checklist pemeriksaan fisik
- Panduan komunikasi dengan pasien
- Skoring otomatis

### Flashcard Drill
- Spaced repetition learning
- Kartu flashcard interaktif
- Tracking mastery level

### Fitur Tambahan
- Dark/Light theme
- Mode Islami (wawasan bioetika & waktu sholat)
- Multi-university support
- Admin dashboard
- Subscription system

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.x | UI Library |
| TypeScript | 5.x | Type Safety |
| Vite | 7.x | Build Tool |
| Firebase | 12.x | Backend & Authentication |
| Tailwind CSS | 3.x | Styling |
| React Router | 7.x | Routing |
| Vitest | 2.x | Testing |
| Lucide React | Latest | Icons |

## Prerequisites

Pastikan sudah terinstall:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 atau **bun** (recommended)
- **Git**

## Instalasi

1. **Clone repository**
   ```bash
   git clone https://github.com/imammalikijafarunimus-png/medprep-web.git
   cd medprep-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   # atau dengan bun (lebih cepat)
   bun install
   ```

3. **Setup environment variables**
   
   Copy file `.env.example` ke `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   
   Lalu isi dengan konfigurasi Firebase Anda (lihat [Konfigurasi Environment](#konfigurasi-environment)).

4. **Jalankan development server**
   ```bash
   npm run dev
   ```

5. **Buka browser** di `http://localhost:5173`

## Konfigurasi Environment

Buat file `.env.local` di root project dengan variabel berikut:

```env
# Firebase Configuration
VITE_API_KEY=your_firebase_api_key
VITE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_PROJECT_ID=your_project_id
VITE_STORAGE_BUCKET=your_project.appspot.com
VITE_MESSAGING_SENDER_ID=your_sender_id
VITE_APP_ID=your_app_id
```

### Cara Mendapatkan Firebase Config

1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Buat project baru atau pilih project existing
3. Klik **Project Settings** (gear icon)
4. Scroll ke bagian **Your apps** > **Web apps**
5. Klik app atau buat baru
6. Copy konfigurasi ke `.env.local`

### Firebase Services yang Dibutuhkan

- **Authentication** - Email/Password & Google Sign-In
- **Firestore Database** - User data & progress
- **Storage** (optional) - User avatars

## Menjalankan Aplikasi

### Development Mode
```bash
npm run dev
```
Aplikasi akan berjalan di `http://localhost:5173` dengan Hot Module Replacement (HMR).

### Production Build
```bash
npm run build
```
Hasil build akan ada di folder `dist/`.

### Preview Production Build
```bash
npm run preview
```

## Struktur Project

```
medprep-web/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI/CD
├── functions/                  # Firebase Cloud Functions
│   ├── src/
│   │   └── index.ts           # Role management functions
│   ├── package.json
│   └── tsconfig.json
├── scripts/
│   └── set-initial-superadmin.ts  # Setup script
├── public/
│   └── logo.jpg                # Logo aplikasi
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── Layout/             # Layout components (Sidebar, Header, etc)
│   │   ├── MarkdownAlert.tsx   # Markdown alert component
│   │   ├── PremiumLock.tsx     # Premium content lock
│   │   └── PrivateRoute.tsx    # Auth route guard with role support
│   ├── config/                 # App configuration
│   │   └── navigation.ts       # Navigation items config
│   ├── context/                # React Context providers
│   │   ├── AuthContext.tsx     # Authentication context with Custom Claims
│   │   ├── ThemeContext.tsx    # Theme context
│   │   └── IslamicModeContext.tsx
│   ├── data/                   # Static data
│   │   ├── cases/              # Case studies per system
│   │   ├── stations/           # OSCE stations data
│   │   ├── categories.ts       # Question categories
│   │   ├── flashcard_data.ts   # Flashcard content
│   │   └── universities.ts     # University list
│   ├── hooks/                  # Custom React hooks
│   │   ├── useRoleManagement.ts  # Role management hook
│   │   └── ...
│   ├── lib/                    # Utilities & configurations
│   │   ├── firebase.ts         # Firebase initialization
│   │   ├── validation.ts       # Input validation & sanitization
│   │   ├── rateLimiter.ts      # Rate limiting utility
│   │   └── markdownSanitizer.ts
│   ├── pages/                  # Page components
│   │   ├── Dashboard.tsx
│   │   ├── CBTCenter.tsx
│   │   ├── OSCECenter.tsx
│   │   ├── UserManagement.tsx  # Superadmin user management
│   │   ├── AdminPanel.tsx      # Admin content management
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── ...
│   ├── test/                   # Test utilities
│   │   ├── setup.ts            # Test setup
│   │   ├── test-utils.tsx      # Testing utilities
│   │   └── mock/               # Mock data
│   ├── types/                  # TypeScript type definitions
│   │   ├── auth.ts             # Auth types with UserRole
│   │   └── user.ts             # User profile types
│   ├── utils/                  # Helper functions
│   │   └── device.ts           # Device fingerprinting
│   ├── App.tsx                 # Main app component
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
├── firestore.rules             # Firestore security rules
├── firebase.json               # Firebase configuration
├── eslint.config.js            # ESLint configuration
├── package.json
├── tailwind.config.js          # Tailwind CSS config
├── tsconfig.json               # TypeScript config
├── vite.config.js              # Vite config
└── vitest.d.ts                 # Vitest type declarations
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Jalankan development server |
| `npm run build` | Build untuk production (dengan typecheck) |
| `npm run build:force` | Build tanpa typecheck |
| `npm run preview` | Preview production build |
| `npm run lint` | Jalankan ESLint |
| `npm run lint:fix` | Fix ESLint errors |
| `npm run typecheck` | Cek TypeScript types |
| `npm run test` | Jalankan tests (watch mode) |
| `npm run test:run` | Jalankan tests sekali |
| `npm run test:coverage` | Tests dengan coverage report |
| `npm run security:audit` | Security audit dependencies |

## Testing

Project menggunakan **Vitest** + **React Testing Library**.

### Menjalankan Tests
```bash
# Watch mode
npm run test

# Run once
npm run test:run

# Dengan coverage
npm run test:coverage
```

### Test Structure
```
src/
├── test/
│   ├── setup.ts          # Test configuration
│   ├── test-utils.tsx    # Custom render dengan providers
│   └── mock/
│       └── firebase.ts   # Firebase mocks
└── **/*.test.ts(x)       # Test files
```

## Deployment

### Vercel (Recommended)
1. Connect repository ke Vercel
2. Set environment variables di Vercel Dashboard
3. Deploy otomatis setiap push ke main

### Netlify
1. Connect repository ke Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Set environment variables

### Manual Deployment
```bash
# Build
npm run build

# File statis ada di folder dist/
# Upload ke hosting pilihan Anda
```

### Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Init hosting
firebase init hosting

# Deploy
firebase deploy --only hosting
```

## Keamanan

Project ini mengimplementasikan beberapa fitur keamanan:

- **Firebase Custom Claims** - Role-based access control server-side
- **Input Validation & Sanitization** - Mencegah XSS attacks
- **Rate Limiting** - Mencegah brute force attacks
- **Device Fingerprinting** - Deteksi multi-device
- **Environment Validation** - Validasi konfigurasi Firebase
- **Password Strength Check** - Validasi kekuatan password
- **Firestore Security Rules** - Database protection berbasis role

### Role-Based Access Control (RBAC)

Aplikasi menggunakan Firebase Custom Claims untuk role management:

| Role | Akses |
|------|-------|
| `student` | Akses konten pembelajaran |
| `admin` | Kelola konten (soal, materi OSCE) |
| `superadmin` | Akses penuh termasuk kelola role user |

### Setup Superadmin Pertama

1. **Deploy Cloud Functions**
   ```bash
   cd functions
   npm install
   cd ..
   firebase deploy --only functions
   ```

2. **Set Secret Key**
   ```bash
   firebase functions:secrets:set SUPERADMIN_INIT_SECRET
   # Masukkan random string yang kuat
   ```

3. **Setup Superadmin**
   ```bash
   # Download serviceAccountKey.json dari Firebase Console
   # Project Settings → Service Accounts → Generate new private key
   
   # JALANKAN SCRIPT (jangan commit serviceAccountKey.json!)
   GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json \
   SUPERADMIN_EMAIL=your@email.com \
   npx ts-node scripts/set-initial-superadmin.ts
   
   # HAPUS file key setelah selesai!
   rm serviceAccountKey.json
   ```

4. **Deploy Firestore Rules**
   ```bash
   firebase deploy --only firestore:rules
   ```

> ⚠️ **PENTING**: 
> - Jangan pernah commit `serviceAccountKey.json` ke git!
> - User perlu logout & login ulang setelah role diubah
> - Semua perubahan role tercatat di `audit_logs` Firestore

## Kontribusi

Kami sangat mengapresiasi kontribusi! Silakan ikuti langkah berikut:

1. **Fork** repository ini
2. Buat **branch** fitur (`git checkout -b feature/amazing-feature`)
3. **Commit** perubahan (`git commit -m 'Add amazing feature'`)
4. **Push** ke branch (`git push origin feature/amazing-feature`)
5. Buat **Pull Request`

### Coding Standards
- Ikuti ESLint rules yang sudah dikonfigurasi
- Tulis tests untuk fitur baru
- Update dokumentasi jika diperlukan
- Gunakan conventional commits

## Tim Pengembang

- **MedPrep Team** - *Initial work*

## Lisensi

Project ini dilisensikan di bawah **MIT License** - lihat file [LICENSE](LICENSE) untuk detail.

---

## Support

Jika mengalami masalah atau memiliki pertanyaan:

1. Buka **Issue** di GitHub repository
2. Sertakan:
   - Deskripsi masalah
   - Langkah untuk reproduce
   - Screenshot (jika ada)
   - Environment (OS, Node version, dll)

---

**MedPrep Web** - Belajar kedokteran dengan lebih efektif! 🏥📚