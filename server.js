/**
 * ============================================================================
 * COGNIFYZ IT SOLUTIONS - TASK 1: HTML STRUCTURE & SERVER INTERACTION
 * ============================================================================
 * 
 * Tech Stack: Node.js, Express.js, EJS, HTML5, CSS3
 * Port: http://localhost:3000
 * 
 * Key Concepts Covered in this File:
 * 1. Express Application Setup & Server Configuration
 * 2. Static File Middleware (express.static)
 * 3. Body Parser Middleware (express.urlencoded)
 * 4. View Engine Configuration (EJS)
 * 5. GET Route Handling (Rendering Templates)
 * 6. POST Route Handling & Form Validation
 * 7. Server-Side Rendering (SSR) with EJS variables
 * 8. Error Handling & 404 Route Catch-all
 */

// Import required core & third-party packages
const express = require('express');
const path = require('path');

// Initialize the Express application
const app = express();

// Define the server port
const PORT = process.env.PORT || 3000;

// ============================================================================
// MIDDLEWARE CONFIGURATION
// ============================================================================

/**
 * 1. Body Parser Middleware
 * `express.urlencoded({ extended: true })` parses incoming requests with
 * URL-encoded payloads (i.e., data sent from HTML <form> submissions).
 * It attaches the parsed form data to `req.body`.
 */
app.use(express.urlencoded({ extended: true }));

/**
 * 2. Static Files Middleware
 * `express.static('public')` serves static files such as CSS, images, and client JS
 * directly from the 'public' directory.
 */
app.use(express.static(path.join(__dirname, 'public')));

/**
 * 3. View Engine Configuration
 * Configure EJS (Embedded JavaScript) as the template rendering engine
 * and specify the directory where template views are located.
 */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ============================================================================
// ROUTE HANDLERS
// ============================================================================

/**
 * GET /
 * Purpose: Renders the homepage containing the HTML form.
 * Response: Renders views/index.ejs
 */
app.get('/', (req, res) => {
  res.render('index', { error: null });
});

/**
 * POST /submit
 * Purpose: Receives and processes the form submission.
 * Process:
 *  1. Extracts 'name', 'email', and 'message' from req.body.
 *  2. Performs server-side validation to ensure required fields are present.
 *  3. Dynamically renders views/result.ejs with the submitted data.
 */
app.post('/submit', (req, res) => {
  const { name, email, message } = req.body;

  // Server-Side Validation: Ensure no required field is empty or whitespace-only
  if (!name || !email || !message || name.trim() === '' || email.trim() === '' || message.trim() === '') {
    // Render error page gracefully without crashing the server (HTTP 400 Bad Request)
    return res.status(400).render('error', {
      errorMessage: 'All fields (Name, Email, and Message) are required. Please fill out the entire form.'
    });
  }

  // Format timestamp for display
  const submittedAt = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'medium'
  });

  /**
   * Server-Side Rendering (SSR) with EJS:
   * Pass the validated data variables to `result.ejs`.
   * EJS will interpolate <%= name %>, <%= email %>, <%= message %>, and <%= submittedAt %>.
   */
  res.render('result', {
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
    submittedAt: submittedAt
  });
});

// ============================================================================
// ERROR & 404 HANDLERS
// ============================================================================

/**
 * Express 404 Handler
 * Catch-all middleware for any requested route that does not match GET / or POST /submit.
 */
app.use((req, res) => {
  res.status(404).render('404');
});

/**
 * Global Error Handler
 * Catches unhandled errors thrown anywhere in the server code to prevent crash.
 */
app.use((err, req, res, next) => {
  console.error('Server Internal Error:', err.stack);
  res.status(500).send('Something broke on the server! Please try again later.');
});

// ============================================================================
// START SERVER
// ============================================================================
app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🚀 Cognifyz Task 1 Server is running successfully!`);
  console.log(`🌐 Local URL: http://localhost:${PORT}`);
  console.log(`===================================================`);
});
