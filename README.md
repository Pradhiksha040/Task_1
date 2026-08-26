# Task 1: HTML Structure and Basic Server Interaction

A beginner-friendly full-stack web application built for **Cognifyz IT Solutions Internship (Task 1)**. This project introduces core web development concepts including semantic HTML5 structure, form handling, Node.js + Express backend setup, HTTP GET/POST endpoints, form validation, and Server-Side Rendering (SSR) using EJS templates.

---

## 📌 Project Objective

The primary objective of Task 1 is to understand how client-side user input flows through an HTTP POST request to a backend Express server and returns dynamically rendered HTML content back to the browser using EJS (Embedded JavaScript) templates.

---

## 🛠️ Technologies Used

- **HTML5**: Semantic web page markup (`<header>`, `<main>`, `<section>`, `<form>`, `<label>`, `<input>`, `<textarea>`, `<button>`, `<footer>`).
- **CSS3**: Responsive flexbox layout, custom CSS properties, modern glassmorphism styling, and interactive hover states.
- **JavaScript (ES6+)**: Node.js backend logic and async execution.
- **Node.js**: Server runtime environment.
- **Express.js**: Fast, unopinionated web framework for Node.js routing and middleware handling.
- **EJS (Embedded JavaScript)**: Server-side templating engine for generating dynamic HTML pages.

---

## 📁 Project Structure

```text
project/
├── public/
│   └── style.css       # Custom stylesheet for glassmorphism card UI & responsive layout
├── views/
│   ├── index.ejs       # Homepage template containing the contact form
│   ├── result.ejs      # Result page template displaying submitted data dynamically
│   ├── error.ejs       # Friendly error page for missing form data
│   └── 404.ejs         # Custom 404 Not Found page for invalid routes
├── .gitignore          # Git ignore rules for node_modules and temporary files
├── package.json        # Node.json configuration, dependencies, and start scripts
├── server.js           # Express server setup, middleware, and route handlers
└── README.md           # Comprehensive project documentation
```

---

## ⚙️ How Express Works in This Project

Express.js serves as the HTTP web server. When a user requests a URL or submits a form in their browser, Express receives the HTTP request, processes it through middleware, executes the corresponding route handler, and sends back an HTTP response.

In `server.js`, we configure three essential Express features:
1. `express.urlencoded({ extended: true })`: Parses incoming form submissions and exposes data on `req.body`.
2. `express.static('public')`: Serves static assets (such as `style.css`) directly to the browser.
3. `app.set('view engine', 'ejs')`: Sets EJS as the view engine to compile and render `.ejs` files into plain HTML.

---

## 🛣️ Route Breakdown

### 1. `GET /`
- **Purpose**: Displays the main page with the contact form.
- **Flow**: When a user navigates to `http://localhost:3000/`, Express handles the request and calls `res.render('index')`. Express locates `views/index.ejs`, compiles it into HTML, and returns it to the browser.

### 2. `POST /submit`
- **Purpose**: Processes form input submitted by the user.
- **Flow**:
  1. The HTML form sends a `POST` request to `/submit` containing `name`, `email`, and `message` in the request body (`req.body`).
  2. The server performs validation to ensure no required field is empty or whitespace-only.
  3. If validation succeeds, Express calls `res.render('result', { name, email, message, submittedAt })`, passing the data to `result.ejs`.
  4. If validation fails, Express renders `error.ejs` with HTTP status `400` without crashing the server.

---

## 🖥️ What Server-Side Rendering (SSR) Means

**Server-Side Rendering (SSR)** is a technique where HTML pages are generated dynamically on the server for each request rather than being constructed purely in the browser with client-side JavaScript.

1. The browser requests a page or submits form data.
2. The Node.js/Express server reads the template (`result.ejs`) and injects dynamic backend data into it.
3. The server converts the EJS template into complete HTML.
4. The server sends the fully formed HTML document back to the browser.

---

## 🧩 Dynamic Data Display with EJS

EJS allows embedding standard JavaScript logic directly within HTML files. In `result.ejs`, we use EJS output tags (`<%= %>`) to dynamically inject values received from `req.body`:

```html
<h2>Thank You, <%= name %>!</h2>
<p>Email: <%= email %></p>
<p>Message: <%= message %></p>
```

When Express executes `res.render('result', { name: "Alex", ... })`, EJS replaces `<%= name %>` with `"Alex"`, outputting `<h2>Thank You, Alex!</h2>`.

---

## 🚀 Installation & How to Run

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v14+ recommended).

### 1. Install Dependencies
Open your terminal in the project root directory and run:

```bash
npm install
```

### 2. Start the Server
Run the Express application using either of the following commands:

```bash
npm start
```
or
```bash
node server.js
```

### 3. Open in Browser
Visit the following URL in your browser:
```text
http://localhost:3000
```

---

## 🧪 Testing Checklist

1. **Homepage Test**: Open `http://localhost:3000` and confirm the header, form fields (Name, Email, Message), and submit button load cleanly.
2. **Valid Submission Test**: Fill out all form fields and click "Submit Data to Server". Verify that the page redirects to `/submit` and displays "Thank You, [Name]!" alongside the submitted details.
3. **HTML Validation Test**: Try leaving a field empty or typing an invalid email format. HTML5 client-side validation should prompt you to correct the input.
4. **Server Validation Test**: Submit an empty request via Postman or modified request. The server should gracefully display `views/error.ejs` without crashing.
5. **404 Route Test**: Navigate to `http://localhost:3000/random-page` and verify the custom 404 error page renders cleanly.

---

## 📜 License & Acknowledgments

Created for **Cognifyz IT Solutions** Web Development Internship - Task 1.
