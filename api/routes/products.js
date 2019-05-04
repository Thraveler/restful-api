const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: "Handling a GET request!"
  });
});

router.post('/', (req, res, next) => {
  res.status(201).json({
    message: "Handling a POST request!"
  });
});

router.get('/:productId', (req, res, next) => {
  const id = req.params.productId;
  
  if(id === 'special') {
    res.status(200).json({
      message: "You sent an special id",
      id: id
    });
  } else {
    res.status(200).json({
      message: "You sent an id"
    });
  }
});

router.patch('/:productId', (req, res, next) => {
  res.status(200).json({
    message: 'Product updated'
  });
});

router.delete('/:productId', (req, res, next) => {
  res.status(200).json({
    message: 'Product deleted'
  });
});

module.exports = router;