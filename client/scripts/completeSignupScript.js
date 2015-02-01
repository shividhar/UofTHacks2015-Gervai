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

			// var userNameSubscribe = Meteor.subscribe("userName", userName);
			
			// if(userNameSubscribe.ready()){
				console.log("HIT")
				console.log(Meteor.users.findOne())
				// if(!Meteor.users.findOne({"profile.userName": userName})){
					Meteor.call("signupComplete", {firstName: firstName, lastName: lastName, age: age, gender: gender, mothersName: mothersName, fathersName: fathersName}, function(err){
						if(err) {return alert(err.message)}
						Router.go("homePage");
					})
				// }else{
					// return (alert("Username is already taken"));
				// }
			// }
		e.preventDefault();
		return false; 
	}
});