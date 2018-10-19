function myRegister(req, res){
	// Get Form Values
	var name     		= req.body.name;
	var email    		= req.body.email;
	var username 		= req.body.username;
	var password 		= req.body.password;
	var password2 		= req.body.password2;
	console.log("in the handler");
	// Validation
	req.checkBody('name', 'Name field is required').notEmpty();
	req.checkBody('email', 'Email field is required').notEmpty();
	req.checkBody('email', 'Please use a valid email address').isEmail();
	req.checkBody('username', 'Username field is required').notEmpty();
	req.checkBody('password', 'Password field is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	// Check for errors
	var errors = req.validationErrors();

	if(errors){
		console.log('Form has errors...');
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
	}
}