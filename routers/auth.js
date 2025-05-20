const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const authRouter = express.Router();

// Google OAuth Config
passport.use(new GoogleStrategy({
  clientID: '622437651855-udeqmi260rt9lso4oc44tbk5628kkju0.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: 'http://localhost:5500/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
  // You can store user info here
  return done(null, profile);
}));

// Serialize user (for session)
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Routes
authRouter.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

authRouter.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/',
    successRedirect: '/dashboard'  // Redirect after login
  })
);

module.exports = authRouter;
