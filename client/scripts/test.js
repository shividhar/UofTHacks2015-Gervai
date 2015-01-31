if (Meteor.isClient) {
  // counter starts at 0
Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});


  Template.main.helpers({
 

  });

  Template.main.events({
   


  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
