const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Order = require('./models/orders');
const Product = require('./models/products');

router.get('/', (req, res, next) => {

  Order.find()
    .select('quantity product')
    .exec()
    .then(docs => {

      console.log(docs);
      res.status(200).json({
        count: docs.length,
        orders: docs.map(order => {

          return {
            quantity: order.quantity,
            product: order.product,
            request: {
              type: 'GET',
              url: `http:localhost:3000/orders/${order._id}`
            }
          }

        })
      });

    })
    .catch(err => {

      console.log(err);
      res.status(500).json({
        error: err
      });

    });

  // res.status(200).json({
  //   message: "Orders were fetched"
  // });
});

router.post('/', (req, res, next) => {

  const productId = req.body.productId;

  Product.findById(productId)
  .then(doc => {

    if(!doc) {
      res.status(404).json({ message: 'Product not found...' });
    } else {
      
      const order = new Order({

        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: productId

      });

      order
        .save()
        .then(result => {

          console.log(result);
          res.status(201).json({
            message: 'Order stored successfully!',
            order: {
              quantity: result.quantity,
              product: result.product
            },
            request: {
              type: 'GET',
              url: `http:localhost:3000/orders/${result._id}`
            }
          });

        })
        .catch(err => {

          console.log(err);
          res.status(500).json({
            error: err
          });

        });

    }

  })
  .catch(err => {

    console.log(err);
    res.status(500).json({
      error: err
    });

  });
  
  // const order = {
  //   name: req.body.name,
  //   price: req.body.price
  // }

  // console.log(req.body)

  // res.status(201).json({
  //   message: "Orders was created",
  //   order: order
  // });
});

router.get('/:orderId', (req, res, next) => {

  const id = req.params.orderId;

  Order.findById(id)
    .exec()
    .then(order => {

      if(!order) {

        res.status(404).json({
          message: 'Order not found with that id!'
        });

      } else {

        res.status(200).json({
          order: order,
          request: {
            type: 'GET',
            url: `http://localhost:3000/orders/`
          }
        });

      }

    })
    .catch(err => {

      console.log(err);
      res.status(500).json({
        error: err
      });

    });

  // res.status(200).json({
  //   message: 'Order details',
  //   orderId: req.params.orderId
  // });

});

router.delete('/:orderId', (req, res, next) => {

  const id = req.params.orderId;

  Order.deleteOne({ _id: id })
    .exec()
    .then(result => {

      res.status(200).json({
        message: 'Order deleted successfully!',
        request: {
          type: 'POST',
          url: 'http://localhost:3000/orders',
          body: { quantity: 'Number', orderId: 'Id' }
        }
      });

    })
    .catch(err => {
      
      console.log(err);
      res.status(500).json({
        error: err
      });

    });

  // res.status(200).json({
  //   message: 'Order deleted'
  // });

});

module.exports = router;