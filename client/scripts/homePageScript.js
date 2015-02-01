Template.homePage.helpers({
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
			return Meteor.user().profile.gender;
		}
	},
	mothersName: function(){
		if(Meteor.user()){
			return Meteor.user().profile.mothersName;
		}
	},
	fathersName: function(){
		if(Meteor.user()){
			return Meteor.user().profile.fathersName;
		}
	}
})