var express = require('express');
var router = express.Router();
var user = require('./user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = function(app){
  app.use("/", router);
  app.use("/user", user);
};
