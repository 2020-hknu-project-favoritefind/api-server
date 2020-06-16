var express = require('express');
const { Client } = require("pg");
var pw = require("./password.js")
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json({ "Hello": "World!" });
});

module.exports = router;
