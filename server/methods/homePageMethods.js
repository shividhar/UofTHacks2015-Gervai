if(Meteor.isServer){
	Meteor.methods({
	    apiCall: function () {
	        return Meteor.http.post("http://gervai.com/api/getprofile", {params: {"username": "edwin"}});
	    }
	});
}