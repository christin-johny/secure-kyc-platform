# 🛡️ Secure KYC Authentication Platform (MERN)

An industrial-grade, full-stack MERN application engineered for secure user authentication and advanced Identity Verification (KYC). Built with a strong emphasis on exactly adhering to S.O.L.I.D. architectural principles, rigorous security standards, and high-performance React UI mechanics.

## 🚀 Key Features & Architectural Highlights

### 1. Enterprise-Grade Authentication
* **Dual-Token Architecture:** Mitigates XSS vulnerabilities by issuing a short-lived 15-minute standard `JWT Access Token` placed in memory, backed by a 7-day `Refresh Token` encrypted dynamically into an **HttpOnly, Secure, SameSite** cookie.
* **Axios Interceptors:** Features a seamless, silent HTTP interceptor network on the React frontend. If the Access Token expires, Axios transparently pauses the API request queue, polls the HTTP-only cookie for a fresh token, and flawlessly resumes the transaction without logging the user out.
* **Strict Validation & Hashing:** Implements rigorous `express-validator` regex structures. Passwords are mathematically shielded via a sophisticated `Mongoose Pre-Save Hook` generating a 10-round `bcryptjs` sequence.
* **Security Defenses:** Hardened globally with `helmet` for HTTP header masking, `express-mongo-sanitize` to intercept and shred NoSQL injection operators (`$gt`, `$ne`), and custom `express-rate-limit` closures capping brute-force credential stuffing attempts at the router level.

### 2. Native Biometric KYC Capture
* **Library-Free Telemetry:** Bypasses bloated third-party NPM capture libraries in favor of a profoundly optimized Custom React Hook (`useCamera.js`). Directly interfaces with raw HTML5 `navigator.mediaDevices.getUserMedia()`.
* **Mobile-First Readiness:** Strictly enforces `video: { facingMode: "user" }` for seamless integration across Android and iOS browsers.
* **Binary Artifact Compilation:** Utilizes the physical `<canvas>` API for high-resolution static WebP extraction, and the native `MediaRecorder` API to intercept audio/video streams instantly into compressed `Blob` chunks.
* **Direct-To-Cloud S3 Streaming:** Bypasses local disc I/O by actively mounting a Node.js `multer` RAM buffer. The memory buffer streams the payload flawlessly over TCP straight to an **AWS S3 Bucket** utilizing the `AWS SDK v3`.

### 3. Asynchronous Data Polling & Admin Dashboard
* **Dynamic Media Modals:** Intercepts and shields the raw AWS Object Keys. Rather than exposing internal database paths to the public URL track, the Node backend actively generates rotating, secure 1-hour **Presigned URLs** strictly upon authorized API polls from the dashboard. The frontend triggers custom Tailwind Modals to natively mount HTML5 `<video>` and `<img>` players locally.
* **Debounced Event Sourcing:** Features an isolated React `useDebounce` Custom Hook. Completely decouples the highly volatile UI Keystroke thread from the Network Request matrix, guaranteeing 0 millisecond pagination while strictly throttling search payload collisions. 
* **MongoDB Aggregation:** Executes Case-Insensitive `$regex` cross-column searches.

## 🎨 Tech Stack
* **Frontend:** React 18, Vite JS, Tailwind CSS v4 (Glassmorphism UI), Axios, React-Hot-Toast.
* **Backend:** Node.js, Express, MongoDB (Atlas/Mongoose).
* **Cloud & Security:** AWS S3 (SDK v3 Client), JSON Web Tokens, bcryptjs, Helmet, Express-Rate-Limit.

## 🛠️ Local Development Setup

### 1. Environment Configuration
Create a `.env` file mechanically synced to the `server` directory featuring:
```env
PORT=5000
MONGO_URI=your_mongodb_cluster_url
JWT_ACCESS_SECRET=your_super_secret_access_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key
JWT_ACCESS_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# S3 Configuration
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_BUCKET_NAME=your_bucket_name
```

### 2. Node Compilation
Open two completely isolated terminal sessions:

**Terminal 1 (Backend Node API):**
```bash
cd server
npm install
npm run dev
```

**Terminal 2 (Vite React UI):**
```bash
cd client
npm install
npm run dev
```
Navigate your browser to `http://localhost:5173/`. 
