var express = require('express');
var passport = require('passport');
const { gmail } = require('googleapis/build/src/apis/gmail');
var app = express();
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID: "654161318371-tbod9al25ht1hne1c4befbgrpgtlschh.apps.googleusercontent.com",
    clientSecret: "9kLBT-SRWmynMmNZvYZKpykQ",
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    //    User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //     if (err) { return done(err); }
    //     done(null, user);
    //    });
    console.log('profile',profile)
    console.log('profile.name  email',profile.name,profile.email)
    
    return done(null,profile.id);
  }
));

app.set('view engine','ejs');

app.get('/gmail/login',(req, res)=>{
    res.render('gmail_login')
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/gmail/login' }),
  function(req, res) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    const gmail_code = query.code; 

    res.send(gmail_code);
  });

 app.listen(3000)