/**
 * This file is probably NOT GOING TO BE USED
 * Routes have been moved into app.js
 *      ex: "app.get('/', etcController.getIndex);
 *          where etcController is a controller from the /controllers directory
 *
 */

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { project: 'Express' });
});

module.exports = router;
