const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Load Receipt Model
require('../models/receipt');
const Receipt = mongoose.model('receipt');

router.get('/', (req, res) => {
  Receipt.find({})
    .sort({date: 'desc'})
    .then(receipts => {
      res.render('receipt/index', {
        receipts
      });

    });
});

router.get('/add', (req, res) => {
  res.render('receipt/add');
});

router.get('/edit/:id', (req, res) => {
  Receipt.findOne({
    _id: req.params.id
  })
    .then(receipt => {
      res.render('receipt/edit', {receipt})
    });
});

router.post('/', (req, res) => {
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

router.put('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
  Receipt.remove({_id: req.params.id})
    .then(() => {
      req.flash('success_msg', 'Receipt removed');
      res.redirect('/receipt')
    })
});

module.exports = router;