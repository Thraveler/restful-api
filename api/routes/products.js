const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('./models/products');

router.get('/', (req, res, next) => {

  Product.find()
    .exec()
    .then(docs => {
      
      console.log(docs);
      
      // if(docs.length > 0) {
      res.status(400).json(docs);
      // } else {
      //   res.status(404).json({
      //     message: 'Not entries found'
      //   })
      // }

    })
    .catch(error => {

      res.status(500).json({
        error: error
      });

    });

  // res.status(200).json({
  //   message: "Handling a GET request!"
  // });

});

router.post('/', (req, res, next) => {

  // const product = {
  //   product: req.body.product,
  //   quantity: req.body.price
  // };

  const product = new Product({

    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price

  });

  product.save()
    .then(product => {

      console.log(product);
      res.status(201).json({
        message: "Handling a POST request to /producst!",
        cratedProduct: product
      });
      
    }).catch(error => {
      
      console.log(error);
      res.status(500).json({
        error: error
      });

    });

  // res.status(201).json({
  //   message: "Handling a POST request to /producst!",
  //   cratedProduct:product
  // });

});

router.get('/:productId', (req, res, next) => {

  const id = req.params.productId;
  
  Product.findById(id)
    .exec()
    .then(doc => {
      console.log('From database', doc);
      
      if(doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({
          message: 'Not valid entry found for tha Id'
        });
      }

    })
    .catch(err => {
      console.log(err);
      res.status(500).json( {error: err} );
    });

  // if(id === 'special') {

  //   res.status(200).json({
  //     message: "You sent an special id",
  //     id: id
  //   });

  // } else {

  //   res.status(200).json({
  //     message: "You sent an id"
  //   });

  // }

});

router.patch('/:productId', (req, res, next) => {

  const id = req.params.productId;
  const updateOps = {};

  for(const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }

  console.log(updateOps);

  Product.update(
    {_id: id},
    {
      $set: updateOps
      // {
      //   name: req.body.newName,
      //   price: req.body.newPrice
      // }
    }
  ).exec()
  .then(result => {

    console.log(result);
    res.status(200).json(result);

  })
  .catch(error => {
    
    console.log(error);
    res.status(500).json({
      error: error
    });

  });

  // res.status(200).json({
  //   message: 'Product updated'
  // });

});

router.delete('/:productId', (req, res, next) => {

  const id = req.params.productId;

  Product.deleteOne({ _id: id})
    .exec()
    .then(result => {

      console.log(result);
      res.status(200).json(result);

    })
    .catch(error => {

      console.log(error);
      res.status(500).json({
        error: error
      });

    });

  // res.status(200).json({
  //   message: 'Product deleted'
  // });

});

module.exports = router;