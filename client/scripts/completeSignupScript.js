Template.completeSignup.events({
	'click #submit' : function(e, t){
		e.preventDefault();
		// retrieve the input field values
		var userName = t.find($("#userName")).value,
			firstName = t.find($("#firstName").value,
			lastName = t.find($("#lastName")).value,
			age = t.find($("#age").value,
			gender = t.find($("#gender").value,
			mothersName = t.find($("#mothersName")).value,
			fathersName = t.find($("#fathersName")).value;
			var userNameSubscribe = Meteor.subscribe("userName", userName);

			if(userNameSubscribe.ready()){
				if(!Meteor.users.findOne({"userName": userName})){
					Meteor.call("signupComplete", {firstName: firstName, lastName: lastName, age: age, gender: gender, mothersName: mothersName, fathersName: fathersName}, function(err){
						if(err) {return alert(err.message)}
						Router.go("homePage");
					})
				}else{
					return (alert("Username is already taken"));
				}
			}
		
		return false; 
	}
});