const express = require('express');
const app = express();
const productsRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');

/* Filter, handler*/
app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);

// app.use((req, res) => {
//   res.status(400).json({
//     message: "It works!"
//   });
// });

module.exports = app;