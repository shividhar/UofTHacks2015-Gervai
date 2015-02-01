Template.settingsPage.helpers({
	userEditedQuestions: function(){
		var userQuestionsSubscribe = Meteor.subscribe("userQuestions", Meteor.user().profile.userName);

		if(userQuestionsSubscribe.ready()){
			return Questions.find({"authorId": Meteor.userId()}).fetch();
		}
	},
	userName: function(){
		return Meteor.user().profile.userName;
	}
})

Template.settingsPage.events({
	'submit form[name=questions]': function(event){
		var question = $("input[name=question]").val();
		var correctAnswer = $("#truefalse").val() === "true";
		
		Meteor.call("addQuestion", {"question": question, "correctAnswer": correctAnswer}, function(err){
			if(err) {return(alert(err.message))}
			$("#question").val("");
			$("#truefalse").val("true");
		})

		return false;
		event.preventDefault();
	},
	'click button[name=sync]': function(event){
        var options = {
          'username':     $("input[name=username]").val(),
          'password':     $("input[name=password]").val(),
        };
        
       if (typeof window.localStorage !== "undefined") {
        if (window.localStorage.bops) {
          ls_pto = JSON.parse(window.localStorage.bops);
          $("input[name=key0]").val(ls_pto["input[name=username]"]);
          $("input[name=key1]").val(ls_pto["input[name=password]"]);
        }
       }
        function saveAccount() {
          console.log("Submit");
          ls_pto = JSON.stringify(saveOptions());
          if (typeof window.localStorage !== "undefined") {
            window.localStorage.bops = ls_pto;
          }
          var location = "pebblejs://close#" + ls_pto;
          console.log("Warping to: " + location);
          console.log(location);
          document.location = location;
        };

		event.preventDefault();
		return false;
	}
})


Template.settingsPage.rendered = function(){
	

    };
