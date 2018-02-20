const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');

//Initialize application
const app = express();

// Connect to mongoose
mongoose.connect('mongodb://mongo:27017')
  .then(() => {
      console.log('MongoDb Connected... ')
  })
  .catch(err => console.log(err));

// Load Receipt Model
require('../models/receipt');
const Receipt = mongoose.model('receipt');


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

app.use(flash());

// Global variables

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
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

app.get('/receipt', (req, res) => {
    Receipt.find({})
        .sort({date: 'desc'})
        .then(receipts => {
            res.render('receipt/index', {
                receipts
            });

        });
});

app.get('/receipt/add', (req, res) => {
    res.render('receipt/add');
});

app.get('/receipt/edit/:id', (req, res) => {
    Receipt.findOne({
        _id: req.params.id
    })
        .then(receipt => {
            res.render('receipt/edit', {receipt})
        });
});

app.post('/receipt', (req, res) => {
    let errors = [];
    if (!req.body.title) {
        errors.push({text: 'Please add a title'});
    }
    if (!req.body.details) {
        errors.push({text: 'Please add some details'});
    }

    if (errors.length > 0) {
        res.render('receipt/add', {errors, title: req.body.title, details: req.body.details});
    } else {
        const newReceipt = {
            title: req.body.title,
            details: req.body.details
        };
        new Receipt(newReceipt)
            .save()
            .then(receipt => {
              req.flash('success_msg', 'Receipt added');
              res.redirect('/receipt');
            })
    }
});

app.put('/receipt/:id', (req, res) => {
    Receipt.findOne({
        _id: req.params.id
    })
        .then(receipt => {
          receipt.title = req.body.title;
          receipt.details = req.body.details;
          receipt.save()
                .then(receipt => {
                    req.flash('success_msg', 'Receipt updated');
                    res.redirect('/receipt');
                });
        })
});

app.delete('/receipt/:id', (req, res) => {
  Receipt.remove({_id: req.params.id})
    .then(() => {
      req.flash('success_msg', 'Receipt removed');
      res.redirect('/receipt')
    })
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});