// (server-side)
Accounts.onCreateUser(function(options, user) {
  user.profile = {
  	signupComplete: false
  };

  // we wait for Meteor to create the user before sending an email

  return user;
});