Template.settingsPage.helpers({
	userEditedQuestions: function(){
		var userQuestionsSubscribe = Meteor.subscribe("userQuestions");

		if(userQuestionsSubscribe.ready()){
			return Questions.find({}).fetch();
		}
	},
	userName: function(){
		return Meteor.user().profile.userName;
	}
})

Template.settingsPage.events({
	'submit form[name=questions]': function(event){
		var question = $("#question").val();
		var correctAnswer = $("#truefalse").val() === "true";

		Meteor.call("addQuestion", {"question": question, "correctAnswer": correctAnswer}, function(err){
			if(err) {return(alert(err.message))}
			$("#question").val("");
			$("#truefalse").val("true");
		})

		return false;
		event.preventDefault();
		
	}
})
