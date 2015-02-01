if(Meteor.isServer){
	//Used to make sure Meteor.user() is not undefined
	Meteor.publish("mapData", function(username){
		return Maps.find({"userName": username});
	})

}