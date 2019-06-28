var express = require('express');
var router = express.Router();


// Get Home page
router.get('/',function(req, res) {
	res.render("../views/bank/home");
});