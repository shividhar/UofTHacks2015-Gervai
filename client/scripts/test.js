if (Meteor.isClient) {
  // counter starts at 0
Euphoria = new Mongo.Collection("euphoria");



  Template.hello.helpers({
 
    euphorias: [
      { text: "This is task 1" },
      { text: "This is task 2" },
      { text: "This is task 3" }
    ]

  });

  Template.hello.events({
   


  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
