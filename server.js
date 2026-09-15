/**
 * ============================================================================
 * COGNIFYZ IT SOLUTIONS - TASKS 1 to 8 FULL STACK APPLICATION
 * ============================================================================
 * 
 * Tech Stack: Node.js, Express.js, EJS, Bootstrap 5, MongoDB / Mongoose, 
 *             JWT Auth, express-validator, Rate Limiting, Redis Caching, 
 *             Background Jobs, External Weather Proxy.
 * 
 * Port: http://localhost:3000
 */

// Load Environment Variables from .env
require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');

// Internal Config & Database Modules
const { connectDB } = require('./config/db');
const { apiLimiter } = require('./config/rateLimiter');

// Middleware Imports
const requestLogger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

// Route Handlers
const tempRoutes = require('./routes/tempRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const externalRoutes = require('./routes/externalRoutes');

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Database Connection
connectDB();

// ============================================================================
// MIDDLEWARE CONFIGURATION
// ============================================================================

// 1. Task 8 HTTP Request Duration & Status Logger
app.use(requestLogger);

// 2. CORS & Security Policy
app.use(cors());

// 3. Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Serve Static Files (CSS, JS, Media)
app.use(express.static(path.join(__dirname, 'public')));

// 5. Template Engine Setup (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ============================================================================
// TASK 1 BACKWARDS COMPATIBILITY ROUTES
// ============================================================================

/**
 * GET /
 * Renders master layout containing Task 1 to Task 8 interactive sections
 */
app.get('/', (req, res) => {
  res.render('index', { error: null });
});

/**
 * POST /submit (Task 1 Form Route)
 */
app.post('/submit', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message || name.trim() === '' || email.trim() === '' || message.trim() === '') {
    return res.status(400).render('error', {
      errorMessage: 'All fields (Name, Email, and Message) are required. Please fill out the entire form.'
    });
  }

  const submittedAt = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'medium'
  });

  res.render('result', {
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
    submittedAt: submittedAt
  });
});

// ============================================================================
// TASK 2 – 8 API ROUTES & RATE LIMITING
// ============================================================================

// Apply Task 7 Rate Limiter to /api/ routes
app.use('/api', apiLimiter);

// Mount Modular API Routes
app.use('/api', tempRoutes);       // Task 2: /api/temp-submit & /api/temp-submissions
app.use('/api/auth', authRoutes);  // Task 6: /api/auth/register, /api/auth/login, /api/auth/logout
app.use('/api/users', userRoutes); // Task 5 & 8: REST CRUD /api/users
app.use('/api', externalRoutes);   // Task 7 & 8: /api/external/weather & /api/jobs/:id

// ============================================================================
// TASK 4 SPA CLIENT ROUTING FALLBACKS
// Allows direct browser reloads on /register, /users, /external, /about
// ============================================================================
app.get(['/register', '/users', '/external', '/about'], (req, res) => {
  res.render('index', { error: null });
});

// ============================================================================
// ERROR & 404 HANDLERS
// ============================================================================

// Catch-all 404 Route
app.use((req, res) => {
  if (req.xhr || req.headers.accept?.includes('application/json') || req.path.startsWith('/api/')) {
    return res.status(404).json({
      success: false,
      message: `HTTP 404 Not Found: Path '${req.originalUrl}' does not exist on this server.`
    });
  }
  res.status(404).render('404');
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// ============================================================================
// START SERVER
// ============================================================================
app.listen(PORT, () => {
  console.log(`===========================================================`);
  console.log(`🚀 Cognifyz Full Stack App (Tasks 1 - 8) is running!`);
  console.log(`🌐 Local Server URL: http://localhost:${PORT}`);
  console.log(`===========================================================`);
});
