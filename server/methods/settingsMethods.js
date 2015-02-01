if(Meteor.isServer){
	//Essentially methods used to disallow users from changing things on the client and passing unsupported data types and values
	Meteor.methods({
		addQuestion: function(questionData){
			if(Meteor.user()){
				if(Questions.find({"authorId": this.userId, userGenerated: true}).count() < 5){
					if(questionData.question != ""){
						Questions.insert({"authorId": Meteor.userId(), "question": questionData.question, "correctAnswer": questionData.correctAnswer, "userGenerated": true});
					}
				}else{
					throw new Meteor.Error("Max limit of questions has reached.")
				}
	    	}
		}
	})
}