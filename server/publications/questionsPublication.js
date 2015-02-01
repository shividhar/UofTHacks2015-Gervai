if(Meteor.isServer){
	//Used to make sure Meteor.user() is not undefined
	Meteor.publish("userQuestions", function(){
		return Questions.find({"_id": this.authorId, userGenerated: true});
	})

}