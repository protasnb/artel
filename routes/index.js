var express = require('express');
const router = express.Router();

router.get('/', function(req, res){
	res.render('index');
});

// Logout Page - GET
router.get('/logout', function(req, res){
	res.render('logout');
});

router.get('/about', function(req, res){
	res.render('about');
});

router.get('/contact', function(req, res){
	res.render('contact');
});

router.get('/portfolio', function(req, res){
	res.render('portfolio');
});

module.exports = router;