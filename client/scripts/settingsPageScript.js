Template.settingsPage.helpers({
	userEditedQuestions: function(){
		var userQuestionsSubscribe = Meteor.subscribe("userQuestions");

		if(userQuestionsSubscribe.ready()){
			return Questions.find({"_id": this.authorId, userGenerated: true});
		}
	}
})

Template.settingsPage.helpers({
	"click #submit": function(event){
		var question = $("#question").val();
		var correctAnswer = $("#truefalse").val() === "true";
		var userQuestionsSubscribe = Meteor.subscribe("userQuestions");
		console.log(question);
		if(userQuestionsSubscribe.ready()){
			if(Questions.find({"authorId": this.authorId, userGenerated: true}).count < 5){
				if(question != ""){
					Questions.insert({"authorId": Meteor.userId(), "question": question, "correctAnswer": correctAnswer, "userGenerated": true});
				}
			}else{
				return(alert("Max question limit reached."));
			}
		}

		event.preventDefault();
		return false;
	}
})