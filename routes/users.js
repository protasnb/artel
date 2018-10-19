var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('passportapp', ['users']);
var bcrypt = require('bcryptjs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// Register Page - GET
router.get('/about', function(req, res){
	res.render('about');
});

// Login Page - GET
router.get('/login', function(req, res){
	res.render('login');
});

// Register Page - GET
router.get('/register', function(req, res){
	res.render('register');
});

// Register - POST
router.post('/register', function(req, res){
	// Get Form Values
	var name     		= req.body.name;
	var email    		= req.body.email;
	var username 		= req.body.username;
	var password 		= req.body.password;
	var password2 		= req.body.password2;
	console.log(req.body);
	// Validation
	req.checkBody('name', 'Name field is required').notEmpty();
	req.checkBody('email', 'Email field is required').notEmpty();
	req.checkBody('email', 'Please use a valid email address').isEmail();
	req.checkBody('username', 'Username field is required').notEmpty();
	req.checkBody('password', 'Password field is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
console.log("in the handler");
	// Check for errors
	var errors = req.validationErrors();

	if(errors){
		console.log('Form has errors...');
		console.log(errors);
		//res.render('register', {
		res.render('register', {	
			errors: errors,
			name: name,
			email: email,
			username:username,
			password: password,
			password2: password2
		});
	} else {
		var newUser = {
			name: name,
			email: email,
			username:username,
			password: password
		}

		console.log(newUser);
		bcrypt.genSalt(10, function(err, salt){
			bcrypt.hash(newUser.password, salt, function(err, hash){
				newUser.password = hash;

				db.users.insert(newUser, function(err, doc){
					if(err){
						res.send(err);
					} else {
						console.log('User Added...');

						//Success Message
						req.flash('success', 'You are registered and can now log in');

						// Redirect after register
						res.location('/');
						res.redirect('/');
					}
				});
			});
		});
	}
});

passport.serializeUser(function(user, done) {
	console.log("serialize user " + user);
  	done(null, user._id);
});

passport.deserializeUser(function(id, done) {
	console.log("deserialize user " + id);
 	db.users.findOne({_id: mongojs.ObjectId(id)}, function(err, user){
 		done(err, user);
 	});
});

passport.use(new LocalStrategy(
	function(username, password, done){
		console.log("local strategy");
		db.users.findOne({username: username}, function(err, user){
			if(err) {
				console.log("local strategy got error");
				return done(err);
			}
			if(!user){
				console.log("local strategy: incorrect user");
				return done(null, false, {message: 'Incorrect username'});
			}

			bcrypt.compare(password, user.password, function(err, isMatch){
				if(err) {
					console.log("local strategy: wrong pass");
					return done(err);
				}
				if(isMatch){
					console.log("local strategy: passed");
					return done(null, user);
				} else {
					console.log("local strategy: wrong pass");
					return done(null, false, {message: 'Incorrect password'});
				}
			});
		});
	}
));
/*	
router.post('/login', (req, res) => {
    passport.authenticate('local', function (err, user, info) {      
        if (err) {
           console.log("getting err " + err);
        }

        if (user) {
            console.log("getting auth");
        } else {
            console.log("not getting auth");
        }
    })(req, res);
    //console.log(res);
});

// Login Page - GET
console.log("doing login");
	passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/users/login',
                                   failureFlash: 'Invalid Username Or Password' });
			function(req, res){
  				console.log("getting auth");
  				console.log('Auth Successfull');
  				res.redirect('/');
  			}
	res.render('login');
};*/

router.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/users/login',
                                   failureFlash: 'Invalid Username Or Password' }), 
  function(req, res){
  	console.log("getting auth");
  	console.log('Auth Successfull');
  	res.redirect('/');
  });


module.exports = router;