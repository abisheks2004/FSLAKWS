const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const passport = require('passport');


const uploadRouter = require('./routers/serverupload');
const recordRouter = require('./routers/serverrecord');
const authRouter = require('./routers/auth'); // ✅ Import auth router

const app = express();
const port = process.env.PORT || 5500;


// in your connection code

const mongoose = require('mongoose');

const rawPass = 'abisheka067';  
const encodedPass = encodeURIComponent(rawPass);  
const uri = `mongodb+srv://abisheka067:${encodedPass}@cluster0.is6cuef.mongodb.net/fsla_kws?retryWrites=true&w=majority`;


// Middleware
app.use(cors({ origin: '*', methods: ['GET', 'POST'] }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session & Passport
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI, // add this to .env
    ttl: 14 * 24 * 60 * 60 // Session expiration in seconds
  })
}));
app.use(passport.initialize());
app.use(passport.session());

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Routes
app.use(uploadRouter);
app.use(recordRouter);
app.use(authRouter); // ✅ Enable auth routes

// 🔐 Redirect root to login if not authenticated
app.get('/', (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/login');
  res.redirect('/dashboard');
});

// ✅ Serve login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// app.get('/', (req, res) => {
//   res.send('✅ Railway deployment successful!');
// });


// ✅ Serve dashboard (index.html) only after login
app.get('/dashboard', (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/login');
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ Logout route
app.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect('/login');
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
