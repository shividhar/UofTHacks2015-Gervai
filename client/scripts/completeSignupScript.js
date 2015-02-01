Template.completeSignup.events({
	'click #submit' : function(e, t){
		// retrieve the input field values
		var userName = t.find("#userName").value,
			firstName = t.find('#firstName').value,
			lastName = t.find('#lastName').value,
			age = t.find("#age").value,
			gender = t.find("#gender").value,
			mothersName = t.find("#mothersName").value,
			fathersName = t.find("#fathersName").value;

			var userProfileSubscribe = Meteor.subscribe("userProfile");

			if(userProfileSubscribe.ready()){
				if(!Meteor.users.findOne({"profile.userName": userName})){
					Meteor.call("signupComplete", {firstName: firstName, lastName: lastName, age: age, gender: gender, mothersName: mothersName, fathersName: fathersName}, function(err){
						if(err) {return alert(err.message)}
						Router.go("homePage");
					})
				}else{
					return (alert("Username is already taken"));
				}
			}
		e.preventDefault();
		return false; 
	}
});