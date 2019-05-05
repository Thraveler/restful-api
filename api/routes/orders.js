const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: "Orders were fetched"
  });
});

router.post('/', (req, res, next) => {
  const order = {
    name: req.body.name,
    price: req.body.price
  }

  console.log(req.body)

  res.status(201).json({
    message: "Orders was created",
    order: order
  });
});

router.get('/:orderId', (req, res, next) => {
  res.status(200).json({
    message: 'Order details',
    orderId: req.params.orderId
  });
});

router.delete('/:orderId', (req, res, next) => {
  res.status(200).json({
    message: 'Order deleted'
  });
});

module.exports = router;