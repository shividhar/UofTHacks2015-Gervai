if(Meteor.isServer){
	//Essentially methods used to disallow users from changing things on the client and passing unsupported data types and values
	Meteor.methods({
		signupComplete: function(signupCompleteData){
			if(Meteor.user()){
				if(!Meteor.user().signupComplete){
					//Making sure they don't run it without setting their school and grade
					var userName = signupCompleteData.userName;
					var firstName = signupCompleteData.firstName;
					var lastName = signupCompleteData.lastName;
					var fullName = firstName + " " + lastName;
					var age = signupCompleteData.age;
					var gender = signupCompleteData.gender;
					var mothersName = signupCompleteData.mothersName;
					var fathersName = signupCompleteData.fathersName;
					Meteor.users.findOne({"profile.userName": userName})
					if(Meteor.users.findOne({"profile.userName": userName})){
						throw new Meteor.Error("Username is already taken.");
					}

					if(userName.indexOf("'") != 1 && firstName.indexOf("'") != 1 && lastName.indexOf("'") != 1 && !isNaN(age) && mothersName.indexOf("'") != 1 && fathersName.indexOf("'") != 1){
						if(!!userName && !!firstName && !!lastName && !!fullName && !!age && !!gender){
			    			Meteor.users.update(Meteor.userId(), {$set: {userName: userName, firstName: firstName, lastName: lastName, fullName: fullName, age: age, gender: gender, "signupComplete": true } });
			    			Questions.insert({"authorId": Meteor.userId(), question: "Is your first name " + lastName + "?", correctAnswer: false});
			    			Questions.insert({"authorId": Meteor.userId(), question: "Are you " + (age - 7) + " years old?", correctAnswer: false});
			    			Questions.insert({"authorId": Meteor.userId(),question: "Is your first name " + firstName + "?", correctAnswer: true});
			    			Questions.insert({"authorId": Meteor.userId(), question: "Is your last name " + lastName + "?", correctAnswer: true});
			    			Questions.insert({"authorId": Meteor.userId(), question: "Is your full name " + lastName + " " + firstName + "?", correctAnswer: false});
			    			Questions.insert({"authorId": Meteor.userId(), question: "Do you love " + mothersName + "?", correctAnswer: true});
			    			Questions.insert({"authorId": Meteor.userId(), question: "Is " + fathersName + " your mother" + "?", correctAnswer: false});
			    			Questions.insert({"authorId": Meteor.userId(), question: "Are you " + age + " years old?", correctAnswer: true});
			    			Questions.insert({"authorId": Meteor.userId(), question: "Is you last name " + fullName + " years old?", correctAnswer: false});
			    		}else{
			    			throw new Meteor.Error("Please fill the field properly");
			    		}
					}else{
						throw new Meteor.Error("Please don't use any apostrophes");
					}
	    		}
	    	}
		}
	})
}