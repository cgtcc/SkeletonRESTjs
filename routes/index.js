var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send('<p>You first need to create an admin user at http://localhost/api/setup <br />and then authenticate at http://localhost/api/authenticate</p>');
});





module.exports = router;
