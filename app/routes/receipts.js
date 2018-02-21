const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');

// Load Receipt Model
require('../models/Receipt');
const Receipt = mongoose.model('receipt');

// Receipts Index
router.get('/', ensureAuthenticated, (req, res) => {
  Receipt.find({user: req.user.id})
    .sort({date: 'desc'})
    .then(receipts => {
      res.render('receipt/index', {
        receipts
      });

    });
});

router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('receipt/add');
});

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Receipt.findOne({
    _id: req.params.id
  })
    .then(receipt => {
        if (receipt.user != req.user.id) {
            req.flash('error_msg', 'Not Authorized');
            res.redirect('/receipt');
        } else {
            res.render('receipt/edit', {receipt})
        }
    });
});

router.post('/', ensureAuthenticated, (req, res) => {
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
      details: req.body.details,
      user: req.user.id
    };
    new Receipt(newReceipt)
      .save()
      .then(receipt => {
        req.flash('success_msg', 'Receipt added');
        res.redirect('/receipt');
      })
  }
});

router.put('/:id', ensureAuthenticated, (req, res) => {
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

router.delete('/:id', ensureAuthenticated, (req, res) => {
  Receipt.remove({_id: req.params.id})
    .then(() => {
      req.flash('success_msg', 'Receipt removed');
      res.redirect('/receipt')
    })
});

module.exports = router;