if(Meteor.isServer){
	//Used to make sure Meteor.user() is not undefined
	Meteor.publish("userSettings", function(){
		if(this.userId){
			//Find how to only return one field
			return Meteor.users.find({_id : this.userId});
		}else{
			this.ready();
		}
	})

	Meteor.publish("userName", function(userName){
		if(this.userId){
			return Meteor.users.find({"userName": userName}, {fields: {userName: 1}});
		}
	})
}