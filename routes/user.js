var express = require('express');
var router = express.Router();
var debug = require('debug')("zeev:user");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send("user");
});

module.exports = router;
