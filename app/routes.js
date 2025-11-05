// Require necessary modules
const dish = require('./models/dish'); // my MongoDB Dish model
const multer = require('multer');      // file uploads (images)
const path = require('path');          // work with file/folder paths

// Multer setup for image uploads =========================
  // referenced from https://www.npmjs.com/package/multer and https://www.geeksforgeeks.org/file-uploading-in-node-js-using-multer/
  // understanding and set up of multer referenced from Learning Mode on AI tools

// Set storage engine for uploaded images =========================
const storage = multer.diskStorage({
  destination: './public/uploads/', // save images here (folder must exist)
  filename: function(req, file, cb){
    // set a unique filename: fieldname + current timestamp + original extension
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize multer upload =========================
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: function(req, file, cb){
    const filetypes = /jpeg|jpg|png|gif/; // only allow image file types
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if(mimetype && extname){
      return cb(null, true); // accept file
    } else {
      cb('Error: Images only!'); // reject file
    }
  }
}); 

// Export routes function =========================
module.exports = function(app, passport, db) {
  const express = require('express'); // express for routing
  const router = express.Router();     // router (not used heavily here)

// Home page route =========================
  app.get('/', function(req, res) {
      res.render('index.ejs'); // render the homepage
  });

// Profile page (protected) =========================
  app.get('/profile', isLoggedIn, function(req, res) {
    db.collection('dishes').find().toArray((err, dishes) => { // fetch all dishes from database
      if(err) return res.send(err);
      res.render('profile.ejs', { // render profile.ejs with the user and dishes data
        user: req.user,
        dishes: dishes
      });
    });
  });

// Logout route =========================
  app.get('/logout', function(req, res) {
      req.logout(() => {
        console.log('User has logged out!');
      });
      res.redirect('/'); // go back to home
  });

  // View all dishes =========================
  app.get('/dishes', isLoggedIn, async (req, res) => {
    try {
      const dishes = await dish.find().lean(); // lean() makes plain JS objects for EJS
      res.render('dishes.ejs', { dishes, user: req.user });
    } catch (err) {
      console.error(err);
      res.send('Error fetching dishes');
    }
  });

  // Add a new dish (with image) =========================
  app.post('/dishes', isLoggedIn, upload.single('image'), async (req, res) => {
    const { name, description } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : ''; // Set image path
    await dish.create({
      name,
      description,
      imageUrl,
      createdBy: req.user._id // track who added the dish
    });
    res.redirect('/profile'); // go back to profile
  });

  // Thumbs Up a dish =========================
  app.put('/dishes/thumbUp', async (req, res) => {
    try {
      const id = req.body._id; // dish ID from front-end
      const result = await dish.findByIdAndUpdate(id, 
        { $inc: { thumbsUp: 1 } }, { new: true });
      res.json(result); // send updated dish back
      console.log("Thumbs Up route",result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Thumbs Down a dish =========================
  app.put('/dishes/thumbDown', async (req, res) => {
    try {
      const id = req.body._id;
      const result = await dish.findByIdAndUpdate(id, 
        { $inc: { thumbsDown: 1 } }, { new: true });
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Delete a dish =========================
  app.delete('/dishes', async (req, res) => {
    try {
      const id = req.body._id;
      await dish.findByIdAndDelete(id);
      res.json({ status: 'deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

// Authentication routes =========================

  // Show login form =========================
  app.get('/login', (req, res) => {
      res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  // Process login form =========================
  app.post('/login', passport.authenticate('local-login', {
      successRedirect : '/profile', 
      failureRedirect : '/login',
      failureFlash : true
  }));

  // Show signup form =========================
  app.get('/signup', (req, res) => {
      res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // Process signup form =========================
  app.post('/signup', passport.authenticate('local-signup', {
      successRedirect : '/profile', 
      failureRedirect : '/signup',
      failureFlash : true
  }));

  // Unlink local account =========================
  app.get('/unlink/local', isLoggedIn, (req, res) => {
      var user = req.user;
      user.local.email = undefined;
      user.local.password = undefined;
      user.save(err => {
          res.redirect('/profile');
      });
  });

};

// Middleware: check login ==========================
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated())
      return next(); // if logged in, continue
  res.redirect('/');   // otherwise, go to home
}

//Citations:
//Modified code from youtube tutorial: https://www.youtube.com/watch?v=z5UgtXOxEEk
//Reference code from https://www.mongodb.com/resources/languages/express-mongodb-rest-api-tutorial#setting-up-the-project
//Use of dotenv package to hide sensitive info: https://www.npmjs.com/package/dotenv
//Use of Learning Mode on AI tools to help with code structure,syntax and debugging  