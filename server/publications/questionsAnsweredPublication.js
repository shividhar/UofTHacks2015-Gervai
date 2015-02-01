if(Meteor.isServer){
	//Used to make sure Meteor.user() is not undefined
	Meteor.publish("questionsAnswered", function(username){
		return QuestionsAnswered.find({"userName": username});
	})

}