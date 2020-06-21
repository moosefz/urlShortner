// server requirements
const express = require("express");
const passport = require("passport");
const mongoose = require("mongoose");
const ShortUrl = require("./models/shortUrl"); // import model
const User = require("./models/user");
const LocalStrategy = require("passport-local");

// mongodb setup
mongoose.connect("mongodb://localhost/urlShortner", {useNewUrlParser:     true, useUnifiedTopology: true});

// express initializing into app var
const app = express();

// ejs setup
app.set("view engine", "ejs"); // ejs setup
app.use(express.static(__dirname + "/public")); // CSS Stylesheets 
app.use(express.urlencoded({ extended: false })); // URLs in Express

// Session Configuration
app.use(require("express-session")({
  secret: "urlShortner",
  resave: false,
  saveUninitialized: false
}));

// passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middle ware for checking current user login
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

// ===== ROUTES ===== //

// ROOT ROUTE
app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("index", { shortUrls: shortUrls });
})

// === AUTH ROUTES === //
app.get("/register", (req, res) => {
  res.render("register");
})

// REGISTER ROUTE
app.post("/register", (req, res) => {
  // create new user
  let newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, (err, user) => {
    if(err) {
      console.log(err);
      return res.render("register");
    }

    // 
    passport.authenticate("local")(req, res, () => {
      res.redirect("/");
    })
  })
})

// Login Form
app.get("/login", (req, res) => {
  res.render("login");
})

// Login Request
app.post("/login", passport.authenticate("local", 
  { 
    successRedirect: "/",
    failureRedirect: "/login"
  }), (req, res) => {
    // no call back
  });

// Logout
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
})

// POST ROUTE 
app.post("/shortUrls", async (req, res) => {
  await ShortUrl.create({ full: req.body.urlInput })
  res.redirect("/");
})

// ROUTE REDIRECTION FOR SHORTENED LINK
app.get("/:shortUrl", async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
  if(shortUrl == null) return res.sendStatus(404);
  shortUrl.clicks++
  shortUrl.save();

  // redirect to the full corresponding full url
  res.redirect(shortUrl.full);
})


// LISTENER
app.listen(process.env.PORT || 3000, () => {
  console.log("URLShortner started on port 3000");
});
