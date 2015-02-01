if(Meteor.isServer){
	//Used to make sure Meteor.user() is not undefined
	Meteor.publish("userQuestions", function(){
		return Questions.find({"authorId": this.userId, userGenerated: true});
	})

}