if(Meteor.isServer){
	//Essentially methods used to disallow users from changing things on the client and passing unsupported data types and values
	Meteor.methods({
		signupComplete: function(signupCompleteData){
			if(Meteor.user()){
				//Making sure they don't run it without setting their school and grade
				var userName = signupCompleteData.userName;
				var firstName = signupCompleteData.firstName;
				var lastName = signupCompleteData.lastName;
				var fullName = firstName + " " + lastName;
				var age = signupCompleteData.age;
				var gender = signupCompleteData.gender;
				if(!!userName && !!firstName && !!lastName && !!fullName && !!age && !!gender){
	    			Meteor.users.update(Meteor.userId(), {$set: {userName: userName, firstName: firstName, lastName: lastName, fullName: fullName, age: age, gender: gender, "signupComplete": true } });
	    		}else{
	    			throw new Meteor.Error("Please fill the field properly");
	    		}
	    	}
		}
	})
}