Template.mainPage.events({
	'submit #login-form' : function(e, t){
		e.preventDefault();
		// retrieve the input field values
		var email = t.find('#login-email').value
		, password = t.find('#login-password').value;

		// Trim and validate your fields here.... 

		// If validation passes, supply the appropriate fields to the
		// Meteor.loginWithPassword() function.
		Meteor.loginWithPassword(email, password, function(err){
		if (err){return alert("Login failed. Try Again.")}
			console.log(err)
			Router.go("homePage");
		});
		return false; 
	}
})

Template.mainPage.events({
'submit #register-form' : function(e, t) {
  e.preventDefault();
  var email = t.find('#account-email').value
    , password = t.find('#account-password').value;

    // Trim and validate the input

  Accounts.createUser({email: email, password : password}, function(err){
      if (err) {
      	console.log(err)
       return(alert("Registration failed. Try again."))
      } else {
        Router.go("homePage");
      }

    });

  return false;
}
});