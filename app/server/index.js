const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

//Initialize application
const app = express();

// Load Routes
const receipts = require('../routes/receipts');
const users = require('../routes/users');

// Connect to mongoose
mongoose.connect('mongodb://mongo:27017')
  .then(() => {
      console.log('MongoDb Connected... ')
  })
  .catch(err => console.log(err));


// Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

// Method override middleware
app.use(methodOverride('_method'));

// Express session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Passport middleware

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Static folder
app.use(express.static(path.join(__dirname, '../public')));

// Global variables

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;

  next();
});

// ROUTES:
app.get('/', (req, res) => {
    const title = 'Welcome';
    res.render('index', {title});
});

app.get('/about', (req, res) => {
    res.render('about');
});

// Use routes
app.use('/receipt', receipts);
app.use('/users', users);

// Passport Config
require('../config/passport')(passport);

const port = 3000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});