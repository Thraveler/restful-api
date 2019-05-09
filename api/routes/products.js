const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('./models/products');

const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {

  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

const upload = multer(
  { 
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
  });


router.get('/', (req, res, next) => {

  Product.find()
    .exec()
    .then(docs => {

      const response = {
        count: docs.length,
        producst: docs.map(doc => {
          return {
            _id: doc._id,
            name: doc.name,
            price: doc.price,
            productImage: doc.productImage
          };
        })
      }
      
      console.log(response);
      
      // if(docs.length > 0) {
      res.status(400).json(response);
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

router.post('/', upload.single('productImage'), (req, res, next) => {

  console.log(req.file);

  // const product = {
  //   product: req.body.product,
  //   quantity: req.body.price
  // };

  const product = new Product({

    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path

  });

  product.save()
    .then(result => {

      const response = {
        name: result.name,
        price: result.price
      }

      console.log(result);
      res.status(201).json({
        message: "Product created successfully!",
        cratedProduct: response,
        request: {
          type: 'GET',
          url: `http://localhost:3000/products/${result._id}`
        }
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
    .select('name price productImage')
    .exec()
    .then(doc => {
      console.log('From database', doc);
      
      if(doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/products'
          }
        },
          );
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
    res.status(200).json({
      message: "Product updated successfully!",
      request: {
        type: 'GET',
        url: `http:localhost:3000/products/${id}`
      }
    });

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
      res.status(200).json({
        message: 'Product deleted successfully!',
        request: {
          type: 'POST',
          url: "http://localhost:3000/products",
          body: { name: 'String', price: 'Number' }
        }
      });

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