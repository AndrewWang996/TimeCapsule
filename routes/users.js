/**
 * This file is probably NOT GOING TO BE USED
 * Routes have been moved into app.js
 *      ex: "app.get('/', etcController.getIndex);
 *          where etcController is a controller from the /controllers directory
 *
 */

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
