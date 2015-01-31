Template.completesignup.events({
	'click ###Form SUbmit button###' : function(e, t){
		e.preventDefault();
		// retrieve the input field values
		var userName = t.find("###ID for userName").value,
			firstName = t.find('####ID for firstName####').value,
			lastName = t.find('####ID for lastName####').value,
			age = t.find("####ID for age####").value,
			gender = t.find("###ID for gender").value;

			var userNameSubscribe = Meteor.subscribe("userName", userName);

			if(userNameSubscribe.ready()){
				if(!Meteor.users.findOne({"userName": userName})){
					Meteor.call("completeSignup", {firstName: firstName, lastName: lastName, age: age, gender: gender}, function(err){
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