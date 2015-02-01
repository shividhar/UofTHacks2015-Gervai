if(Meteor.isServer){
	//Used to make sure Meteor.user() is not undefined
	Meteor.publish("userQuestions", function(username){
		return Questions.find({userGenerated: true, "userName": username});
	})

}