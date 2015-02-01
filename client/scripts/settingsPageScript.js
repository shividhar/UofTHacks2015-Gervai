Template.settingsPage.helpers({
	userEditedQuestions: function(){
		var userQuestionsSubscribe = Meteor.subscribe("userQuestions");

		if(userQuestionsSubscribe.ready()){
			return Questions.find({"_id": this.authorId, userGenerated: true});
		}
	}
})

Template.settingsPage.helpers({
	"submit ##FORM ID###": function(event){
		var question = $("##QUESTION ID##").val();
		var correctAnswer = $("##Correct Answer ID##").val() === "true";
		var userQuestionsSubscribe = Meteor.subscribe("userQuestions");

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