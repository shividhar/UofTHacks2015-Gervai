if(Meteor.isServer){
	//Used to make sure Meteor.user() is not undefined
	Meteor.publish("questionsAnswered", function(){
		return QuestionsAnswered.find({"_id": this.authorId});
	})

}