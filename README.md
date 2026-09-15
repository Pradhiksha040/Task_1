# Cognifyz IT Solutions — Tasks 1 to 8 Progressive Full Stack Application

An enterprise-grade, beginner-friendly full-stack web application developed for **Cognifyz IT Solutions Internship (Tasks 1 through 8)**. Built progressively using **Node.js, Express.js, EJS, Bootstrap 5, MongoDB / Mongoose, JWT Authentication, Rate Limiting, External Weather API Proxy, Background Job Queues, and Server-Side Caching**.

GitHub Repository: [https://github.com/Pradhiksha040/Task_1](https://github.com/Pradhiksha040/Task_1)

---

## 🚀 Tasks Overview & Implemented Features

### Task 1: HTML Structure & Basic Server Interaction
- **Semantic HTML5 Markup**: Form structure with input fields, labels, semantic `<header>`, `<main>`, `<section>`, and `<footer>`.
- **Express Backend & EJS**: `POST /submit` handling URL-encoded payloads with Server-Side Rendering (`views/result.ejs`).

### Task 2: Inline Styles, Interaction & Server-Side Validation
- **Complex Form**: Fields for Full Name, Email, Phone Number, Date of Birth, Gender, Address, City, Password, Confirm Password, Terms checkbox.
- **Client & Server Validation**: Inline JavaScript error messages (`public/js/validation.js`) combined with independent `express-validator` rules (`middleware/validate.js`).
- **Temporary Server Storage**: In-memory store (`config/tempStore.js`) with endpoint `GET /api/temp-submissions`.

### Task 3: Advanced CSS Styling & Responsive Design
- **Bootstrap 5 & Glassmorphic Dark Theme**: Layered glassmorphism design system (`public/style.css`) with cards, gradients, and hover transitions.
- **Responsive Layout**: Designed for Desktop (> 992px), Tablet (576px – 992px), and Mobile (< 576px).

### Task 4: Complex Form Validation & Dynamic DOM Manipulation
- **Password Strength Calculator**: Live strength meter checking length, uppercase, lowercase, numbers, and special symbols with visual color bars.
- **Dynamic Interactions**: Password show/hide toggle, live character counter for Address, and Single Page Application (SPA) PushState client routing (`public/js/router.js`).

### Task 5: REST API Integration & Frontend Interaction
- **RESTful Endpoints**: Full CRUD endpoints (`GET`, `POST`, `PUT`, `DELETE` `/api/users`).
- **AJAX Fetch Integration**: Dynamic CRUD operations without full page reloads, edit modals, and loading states.

### Task 6: Database Integration & Authentication
- **Mongoose User Schema**: MongoDB schema (`models/User.js`) with pre-save `bcryptjs` password hashing.
- **JWT Auth & Authorization**: JSON Web Token issuance (`POST /api/auth/register`, `POST /api/auth/login`) with `middleware/auth.js`.

### Task 7: Advanced API & External API Integration
- **External Weather Proxy**: `GET /api/external/weather` proxying live public data from Open-Meteo REST API.
- **OAuth 2.0 Concept**: Interactive visual simulation modal detailing Authorization Code & Access Token flow.
- **Rate Limiting**: `express-rate-limit` returning HTTP 429 upon request excess.

### Task 8: Advanced Server-Side Functionality
- **Request Logging**: Middleware (`middleware/logger.js`) logging `[TIMESTAMP] METHOD URL STATUS DURATION_MS`.
- **Background Jobs**: Asynchronous job queue (`services/jobQueue.js`) processing welcome email simulations, queryable via `GET /api/jobs/:id`.
- **Response Caching**: Server-side caching (`config/redis.js`) for `GET /api/users` with automatic cache invalidation upon mutations.

---

## 📁 Repository Folder Structure

```text
Task 1/
├── config/
│   ├── tempStore.js          # Task 2 temporary in-memory store
│   ├── db.js                 # Task 6 MongoDB connection & fallback
│   ├── redis.js              # Task 8 caching middleware
│   └── rateLimiter.js        # Task 7 rate limiting rules
├── middleware/
│   ├── validate.js           # Server-side validation rules
│   ├── logger.js             # Request duration logging
│   ├── auth.js               # JWT authentication & authorization
│   └── errorHandler.js       # Centralized API error handler
├── models/
│   └── User.js               # Mongoose schema with bcrypt hashing
├── controllers/
│   ├── tempController.js     # Task 2 temporary submission controller
│   ├── authController.js     # Registration & login controller
│   ├── userController.js     # REST API User CRUD controller
│   └── externalController.js # External API & job status controller
├── routes/
│   ├── tempRoutes.js         # Temporary submission routes
│   ├── authRoutes.js         # Authentication routes
│   ├── userRoutes.js         # REST users API routes
│   └── externalRoutes.js     # External proxy & job routes
├── services/
│   ├── jobQueue.js           # Background job queue & worker
│   └── externalService.js    # External weather API client
├── views/
│   ├── index.ejs             # Master EJS view
│   ├── result.ejs            # Task 1 SSR result template
│   ├── error.ejs             # Task 1 SSR error template
│   ├── 404.ejs               # Custom 404 template
│   └── partials/             # Reusable Bootstrap UI partials
│       ├── navbar.ejs
│       ├── hero.ejs
│       ├── taskForm.ejs
│       ├── userTable.ejs
│       ├── externalApi.ejs
│       ├── features.ejs
│       └── loginModal.ejs
├── public/
│   ├── style.css             # Glassmorphism stylesheet & Bootstrap overrides
│   └── js/
│       ├── validation.js     # Inline validation & strength meter
│       ├── router.js         # SPA client router
│       ├── api.js            # REST API CRUD & Auth script
│       └── oauthDemo.js      # Weather proxy & OAuth simulation script
├── .env.example              # Environment configuration template
├── server.js                 # Express server entry point
├── package.json              # Project dependencies & scripts
└── scratch/
    └── test_all_tasks.js     # Automated test suite
```

---

## ⚙️ Environment Variables (`.env`)

```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/cognifyz_db
JWT_SECRET=cognifyz_super_secret_jwt_key_2026_key
REDIS_URL=redis://127.0.0.1:6379
```

---

## 🚀 How to Run the Project

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. Open in browser:
   ```text
   http://localhost:3000
   ```

---

## 🧪 Automated Testing

Run the automated test suite to verify all tasks (1 through 8):
```bash
node scratch/test_all_tasks.js
```

---

## 📜 License

Created for **Cognifyz IT Solutions** Web Development Internship.
