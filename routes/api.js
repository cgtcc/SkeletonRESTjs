var express = require('express');
var app = express();
var router = express();
var User   = require('../models/user'); // get our mongoose model
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config'); // get our config file
// API ROUTES -------------------



// route to show a random message (GET http://localhost:8080/api/)
router.get('/', function(req, res) {
  res.json({ message: 'Welcome to the coolest API on earth!' });
});





router.get('/setup', function(req, res) {

  // create a sample user
  var nick = new User({ 
    name: 'carl', 
    password: 'carl',
    admin: true 
  });

  // save the sample user
  nick.save(function(err) {
    if (err) throw err;

    console.log('User saved successfully');
    res.json({ success: true });
  });
});  

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
router.post('/authenticate', function(req, res) {

  // find the user
  User.findOne({
    name: req.body.name
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {

        // if user is found and password is right
        // create a token
        var token = jwt.sign({ username: user.username }, config.secret, { expiresIn: '24h' }); // Logged in: Give user token
        res.json({ success: true, message: 'User authenticated!', token: token });
      }   

    }

  });
});




//TOUT CE QUI VIENS APRÈS CETTE LIGNE SERA SOUMIS AU MIDDLEWARE QUI VALIDE L'AJOUT D'UN TOKEN À LA REQUÊTE

// route middleware to verify a token
router.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('config.secret'), function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
});

// route to return all users (GET http://localhost:8080/api/users)
router.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
}); 




module.exports = router;
