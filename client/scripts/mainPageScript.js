Template.mainPage.helpers({
	fullName: function(){
		if(Meteor.user()){
			return Meteor.user().profile.fullName;
		}
	},
	age: function(){
		if(Meteor.user()){
			return Meteor.user().profile.age;
		}
	},
	gender: function(){
		if(Meteor.user()){
			return Meteor.user().gender;
		}
	},
	mothersName: function(){
		if(Meteor.user()){
			return Meteor.user().mothersName;
		}
	},
	fathersName: function(){
		if(Meteor.user()){
			return Meteor.user().fathersName;
		}
	}
})