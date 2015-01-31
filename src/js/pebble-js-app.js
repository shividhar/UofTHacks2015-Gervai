Pebble.addEventListener("ready",
                        function(e) {
							console.log("Connect: " + e.ready);
							console.log(e.type);
                        });

Pebble.addEventListener("appmessage",
                        function(e) {
							console.log(e.type);
                        });

var values = 0;
var config_url = "http://www.gervai.com/";
var username = "defaultJS", password = "defaultJS";

function getUsername(){
	if(username === "defaultJS"){
		username = localStorage.getItem("userNameSavedGE");
	}
	console.log("returning username " + username);
	return username;
}

function getPassword(){
	if(password === "defaultJS"){
		password = localStorage.getItem("passwordSavedGE");
	}
	console.log("returning password");
	return password;
}

function writeDataToServer(string, correct, timestamp, difficult){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function(){
		if(xmlhttp.readyState === 4 && xmlhttp.status === 200){
			console.log("response: " + xmlhttp.responseText);
		}
	}
	xmlhttp.open("POST", "http://www.gervai.com/api/", true);
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlhttp.send("username=" + getUsername() + "&password=" + getPassword() + "&question=" + string + 
		"&correct=" + correct + "&timestamp=" + timestamp + "&difficult=" + difficult);
	console.log("params: \n" + "username=" + getUsername() + "&password=" + getPassword() + "&question=" + string + 
		"&correct=" + correct + "&timestamp=" + timestamp + "&difficult=" + difficult);
	console.log("sending write request.");
}

function checkInternetConnection(){
  var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function(){
		if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
			console.log("response: " + xmlhttp.responseText);
			Pebble.sendAppMessage({
				"success":1
			});
		}
	}
	xmlhttp.open("POST", "http://www.gervai.com/", true);
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlhttp.send("");
	console.log("Sending load request.");
}

Pebble.addEventListener("ready", 
						function(e) {
							console.log("Ready for messages.");
							checkInternetConnection();
                        });

Pebble.addEventListener("appmessage",
                        function(e) {
							switch(e.payload.define){
								case 51:
									console.log("type: connection check");
									checkInternetConnection();
									break;
								case 52:
									console.log("type: write request");
									if(e.payload.qp_ts === 0){
										console.log("Invalid package, not writing. Timestamp: " + e.payload.qp_ts);
									}
									else{
										writeDataToServer(e.payload.qp_q, e.payload.qp_a, e.payload.qp_ts, e.payload.qp_dif);
									}
									break;
							}
                        });

Pebble.addEventListener("showConfiguration", function(e) {
        Pebble.openURL(config_url + getUsername() + "&password=" + getPassword());
        console.log(config_url + getUsername() + "&password=[REDACTED FOR SECURITY]");
});

Pebble.addEventListener("webviewclosed", function (e) {
    console.log("Configuration closed");
    console.log("Response = " + e.response.length + "   " + e.response);
    if (e.response) { // user clicked Save/Submit, not Cancel/Done
		console.log("User hit save");
		values = JSON.parse(decodeURIComponent(e.response));
		console.log("stringified options: " + JSON.stringify((values)));
		for(var key in values) {
			localStorage.setItem(key, values[key]);
		}
		if(values.username){
			username = values.username;
			localStorage.setItem("userNameSavedGE", username);
			password = values.password;
			localStorage.setItem("passwordSavedGE", password);
		}
		else{
			if(values.logout){
				localStorage.setItem("userNameSavedGE", "");
				username = "defaultJS";
				localStorage.setItem("passwordSavedGE", "");
				password = "defaultJS";
			}
		}
		console.log("Username: " + username);
		Pebble.sendAppMessage(values);
	}
});
