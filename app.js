const express = require('express');
const morgan = require('morgan');
const body_parser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

const productsRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');
const usersRoutes = require('./api/routes/users');

mongoose.connect(
    'mongodb+srv://node-rest:'
    + process.env.MONGO_ATLAS_PASSWD
    + '@node-rest-api-5vjvs.mongodb.net/test?retryWrites=true',
    {
      useNewUrlParser: true
    },
    err => {
      if(err) {
        console.log(err);
      } else {
        console.log('Connection to database successfully!');
      }
    }
  );

app.use(morgan("dev"));
app.use('/uploads', express.static('uploads'));
app.use(body_parser.urlencoded({extended: false}));
app.use(body_parser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers", 
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if(req.method === "OPTIONS") {
      res.header(
        "Access-Control-Allow-Methods",
        "PUT, POST, PATCH, DELETE, GET"
        );
        return res.status(200).json({});
      }
      next();
    });


/* Filter, handler*/
app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);
app.use('/users', usersRoutes);

app.use((req, res, next) => {
  let error = new Error("Route not found!");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

// app.use((req, res) => {
//   res.status(400).json({
//     message: "It works!"
//   });
// });

module.exports = app;