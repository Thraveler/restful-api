const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const mongoose = require('mongoose');
const User = require('./models/users');

router
  .get('/', (req, res, next) => {

    User.find()
      .select('email')
      .exec()
      .then(docs => {
        console.log(docs);
        res.status(200).json({
          count: docs.length,
          user: docs.map(doc => {
            return {
              name: doc.email,
              request: {
                type: 'GET',
                url: `http://localhost:3000/users/${doc._id}`
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
  })
  .post('/signup', (req, res, next) => {

    bcrypt.hash(req.body.password, 10, (err, hash) => {
      if(err) {
        res.status(500),json({
          err: err
        });
      } else {

        const user = new User({
          _id: new mongoose.Types.ObjectId(),
          email: req.body.email,
          password: hash
        });
    
        user.save()
          .then(result => {
            console.log(result);
            res.status(201).json({
              message: 'User saved successfully!',
              user: {
                email: result.email
              },
              request: {
                type: 'GET',
                url: `http://localhost:3000/users/${result._id}`
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
    });

    // res.status(201).json({
    //   message: `User saved successfully!`
    // });
  });

router
  .post('/login', (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;

    User.find({ email: email })
      .exec()
      .then(docs => {
        console.log(docs);
        
        if(docs.length >= 1 ) {

          bcrypt.compare(
            password,
            docs[0].password
          )
          .then(result => {

            if(result) {

              const token = jwt.sign(
                {
                  _id: docs[0]._id,
                  email: docs[0].email,
                }, 
                process.env.SECRET_PASSWD,
                {
                  expiresIn: '1h'
                }
              );

              res.status(200).json({
                message: 'Auth successfully!',
                token: token
              });

            } else {
              
              res.status(401).json({
                message: 'Auth error'
              });

            }

          });

        } else {
          res.status(401).json({
            message: 'Auth error'
          });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });

  });
    
router
  .get('/:id', (req, res, next) => {

    const id = req.params.id;

    User.findOne({ _id: id})
      .select('email')
      .exec()
      .then(doc => {
        console.log(doc);
        res.status(200).json({
          user: doc,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/users'
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
    //   message: `User with id: ${req.params.id}`
    // });
  })
  .delete('/:id', (req, res, next) => {

    const id = req.params.id;

    User.deleteOne({ _id: id })
    .exec()
    .then(result => {
      console.log(result);
      res.status(500).json({
        message: 'User deleted successfully!',
        request: {
          type: 'POST',
          url: 'http://localhost:3000/signup',
          body: { email: 'String', password: 'String' }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });

  });

module.exports = router;