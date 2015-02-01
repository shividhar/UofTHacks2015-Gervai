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
	},
	questionsAnsweredData: function(){
		if(Meteor.user()){
			var questionsAnsweredSubscribe = Meteor.subscribe("questionsAnswered", Meteor.user().profile.username);
			if(questionsAnsweredSubscribe.ready()){
				return QuestionsAnswered.find({"userName": Meteor.user().profile.userName}, {fields: {correct: 1}}, {$sort: {createdAt: 1}}).fetch();
			}
		}
	}
})