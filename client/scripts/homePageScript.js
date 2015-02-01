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

Template.homePage.rendered = function(){
var options={
	width: 600,
	height: 300
};


new Chartist.Line('.ct-chart', {
  labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  series: [
    [12, 9, 7, 8, 5]
  ]
},options);


// Create a new line chart object where as first parameter we pass in a selector
// that is resolving to our chart container element. The Second parameter
// is the actual data object.

};
