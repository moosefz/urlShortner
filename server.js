// server requirements
const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require("./models/shortUrl"); // import model

// mongodb setup
mongoose.connect("mongodb://localhost/urlShortner", {useNewUrlParser:     true, useUnifiedTopology: true});

// express initializing into app var
const app = express();


// ejs setup
app.set("view engine", "ejs"); // ejs setup
app.use(express.static(__dirname + "/public")); // CSS Stylesheets and js scripts
app.use(express.urlencoded({ extended: false })); // allows use of URLS in express

// ROOT ROUTE
app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("index", { shortUrls: shortUrls });
})

// POST ROUTE 
app.post("/shortUrls", async (req, res) => {
  await ShortUrl.create({ full: req.body.urlInput })
  res.redirect("/");
})

app.get("/:shortUrl", async (req, res) => {
  // search mongodb for our short URL
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
  // if it does not exist, send 404 error
  if(shortUrl == null) return res.sendStatus(404);

  // else found, increment click counter
  shortUrl.clicks++
  // save updated click counter to db
  shortUrl.save();

  // redirect to the full corresponding full url
  res.redirect(shortUrl.full);
})

// LISTENER
app.listen(process.env.PORT || 3000, () => {
  console.log("URLShortner started on port 3000");
});
