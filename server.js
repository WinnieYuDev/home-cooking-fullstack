// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
const MongoClient = require('mongodb').MongoClient
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

var db

app.use(express.static('public')); // make sure this is in server.js

// configuration ===============================================================
mongoose.connect(configDB.url, (err, database) => {
  if (err) return console.log(err)
  db = database
  require('./app/routes.js')(app, passport, db);
}); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))


app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'rcbootcamp2021b', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);

//notes: to run server, use command "node server.js" in terminal
// Dependency	What it’s for	Install command
// express	The main web framework — handles routes, requests, and responses	
// npm install express
// mongodb	The official MongoDB driver (used to connect directly to the database)	
// npm install mongodb
// mongoose	MongoDB object modeling tool — simplifies database work	
// npm install mongoose
// passport	Handles authentication (login, signup, sessions, etc.)	
// npm install passport
// connect-flash	Used to store and display temporary messages (like “Login failed”)	
// npm install connect-flash
// morgan	Logs every request in the terminal — helpful for debugging	
// npm install morgan
// cookie-parser	Lets Express read and handle cookies	
// npm install cookie-parser
// body-parser	Parses data sent through HTML forms or JSON (now built into Express but still used sometimes)	
// npm install body-parser
// express-session	Manages user sessions (used by Passport to remember logged-in users)	
// npm install express-session
// ejs	Template engine used for rendering .ejs view files 
// npm install ejs
// passport-local	Provides the “local” login strategy (email/password)	
// npm install passport-local
// bcrypt (or bcryptjs)	Encrypts passwords before saving them	
// npm install bcrypt

//Citations:
//Modified code from youtube tutorial: https://www.youtube.com/watch?v=z5UgtXOxEEk
//Reference code from https://www.mongodb.com/resources/languages/express-mongodb-rest-api-tutorial#setting-up-the-project
//Use of dotenv package to hide sensitive info: https://www.npmjs.com/package/dotenv
//Use of Learning Mode on AI tools to help with code structure,syntax and debugging  