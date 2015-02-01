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

Template.settingsPage.rendered = function(){
	function saveAccount(){
        var options = {
          'username':     $("#username").val(),
          'password':     $("#password").val(),
        };
        return options;
      };
        
      
       if (typeof window.localStorage !== "undefined") {
        console.log("Not undefined :)");
        if (window.localStorage.bops) {
          ls_pto = JSON.parse(window.localStorage.bops);
          $("input[name=key0]").val(ls_pto["#username"]);
          $("input[name=key1]").val(ls_pto["#password"]);
        }
       }
        function sendOps() {
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

    };
