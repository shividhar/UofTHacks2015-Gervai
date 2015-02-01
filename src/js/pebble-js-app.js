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
var config_url = "http://gervai.com/";
var username = "defaultJS", password = "defaultJS";

function getTimestamp(){
	var milliseconds = (new Date).getTime();
	return milliseconds;
}

function sendCoordinates(lat, lon){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function(){
		if(xmlhttp.readyState === 4 && xmlhttp.status === 200){
			console.log("(Response: '" + xmlhttp.responseText + "')");
		}
		console.log("status " + xmlhttp.status);
		console.log("response " + xmlhttp.responseText);
	}
	xmlhttp.open("POST", "http://gervai.com/api/maps", true);
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlhttp.send("username=" + getUsername() + "&password=" + getPassword() + "&lat=" + lat + 
		"&lon=" + lon + "&timestamp=" + getTimestamp());
	console.log("sending coordinates request: " + "username=" + getUsername() + "&password=" + getPassword() + "&lat=" + lat + 
		"&lon=" + lon + "&timestamp=" + getTimestamp());
}

function getUsername(){
	return "edwin";
	if(username === "defaultJS"){
		username = localStorage.getItem("userNameSavedGE");
	}
	console.log("returning username " + username);
	return username;
}

function getPassword(){
	return "sucked";
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
			console.log("(Response: '" + xmlhttp.responseText + "')");
		}
	}
	xmlhttp.open("POST", "http://gervai.com/api/insert", true);
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlhttp.send("username=" + getUsername() + "&password=" + getPassword() + "&question=" + string + 
		"&correct=" + correct + "&timestamp=" + timestamp + "&difficult=" + difficult);
	console.log("params: \n" + "username=" + getUsername() + "&password=" + getPassword() + "&question=" + string + 
		"&correct=" + correct + "&timestamp=" + timestamp + "&difficult=" + difficult);
	console.log("sending write request.");
}

var names = ["qc_1", "qc_2", "qc_3", "qc_4", "qc_5", "qc_1_a", "qc_2_a", "qc_3_a", "qc_4_a", "qc_5_a"];
var data = [];

function convertB(str){
	var toR = 0;
	if(str === "true"){
		toR = 1;
	}
	return toR;
}

function send(){
	console.log("sending");
	Pebble.sendAppMessage({
		"qc_1":data[0],
		"qc_2":data[1],
		"qc_3":data[2],
		"qc_4":data[3],
		"qc_5":data[4],
		"qc_1_a":convertB(data[5]),
		"qc_2_a":convertB(data[6]),
		"qc_3_a":convertB(data[7]),
		"qc_4_a":convertB(data[8]),
		"qc_5_a":convertB(data[9]),
	});
	console.log("sent");
}

function sendAPIData(){
	var xmlhttp = new XMLHttpRequest();
	var obj;
	xmlhttp.onreadystatechange = function(){
		if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
			console.log("response: " + xmlhttp.responseText);
			obj = JSON.parse(xmlhttp.responseText);
			var lengthofdata = obj.entries.length;
			for(var i = 0; i < lengthofdata; i++){
				data[i] = obj.entries[i].question;

				data[i+5] = obj.entries[i].correctAnswer;
				console.log("entry " + data[i] + " correct " + data[i+5]);
				var nn = names[i];
				var nn2 = names[i+5];
			}
			send();
		}
		console.log("status of api data " + xmlhttp.status);
	}
	xmlhttp.open("POST", "http://gervai.com/api/custom", true);
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlhttp.send("username=" + getUsername() + "&password=" + getPassword());
	console.log("Sending api request.");
}

function checkInternetConnection(){
  var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function(){
		if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
			console.log("response: " + xmlhttp.responseText);
			Pebble.sendAppMessage({
				"success":1
			});
			fireLocWatch();
		}
		console.log("status " + xmlhttp.status);
	}
	xmlhttp.open("POST", "http://gervai.com/", true);
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlhttp.send("");
	console.log("Sending load request.");
}

var fetched = 0;

function locationSuccess(pos) {
	if(fetched === 1){
		return;
	}
  var coordinates = pos.coords;
  sendCoordinates(coordinates.latitude, coordinates.longitude);
  console.log("lat " + coordinates.latitude + " lon " + coordinates.longitude);
  fetched = 1;
  sendAPIData();
}

function locationError(err) {
  console.warn('Location error (' + err.code + '): ' + err.message);
	var workingLatitude = localStorage.getItem("latitude1");
	var workingLongitude = localStorage.getItem("longitude1");

	console.log("Fetching previous working temperature from latitude: " + workingLatitude + " and longitude: " + workingLongitude);
	sendAPIData();
}

function fireLocWatch(){
	locationWatcher = window.navigator.geolocation.watchPosition(locationSuccess, locationError, locationOptions);
}

var locationOptions = { "timeout": 15000, "maximumAge": 60000 }; 

Pebble.addEventListener("ready", 
						function(e) {
							console.log("Ready for messages.");
							//sendAPIData();
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
										var ff = false;
										if(e.payload.qp_a === 1){
											ff = true;
										}
										writeDataToServer(e.payload.qp_q, ff, e.payload.qp_ts, e.payload.qp_dif);
									}
									break;
								case 53:
									fireLocWatch();
									break;
							}
                        });

Pebble.addEventListener("showConfiguration", function(e) {
        Pebble.openURL(config_url);
        console.log(config_url);
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
			console.log("USERNAME " + username);
			localStorage.setItem("userNameSavedGE", username);
			password = values.password;
			console.log("PASSWORD " + password);
			localStorage.setItem("passwordSavedGE", password);
		}
		console.log("Username: " + username);
		Pebble.sendAppMessage(values);
	}
});
