Meteor.startup(function () {
    Router.configure({
      notFoundTemplate: '404'
    });

    loggedInUserCheck = RouteController.extend({
        waitOn: function(){
            return Meteor.subscribe("userSettings");
        },
        onBeforeAction: function(){
            if(this.ready()){
                if(Meteor.user() !== undefined){
                    if(Meteor.user()){
                        if(Meteor.user().signupComplete == false){
                            Router.go("completeSignup")
                        }else{
                            this.next()
                        }    
                    }else{
                        Router.go("/")
                    }
                }
            }
        }
    });
    loggedOutUserCheck = RouteController.extend({
        waitOn: function(){
            return Meteor.subscribe("userSettings");
        },
        onBeforeAction: function(){
            if(this.ready()){
                if(Meteor.user() !== undefined){
                    if(Meteor.user()){
                        if(Meteor.user().signupComplete == false){
                            Router.go("completeSignup")
                        }else{
                            Router.go("/")
                        }    
                    }else{
                        this.next();
                    }
                }
            }
        }
    });




    Router.map(function() {
    	this.route("mainPage", {
    		path: "/",
            waitOn: function(){
                return Meteor.subscribe("userSettings");
            },
            onBeforeAction: function(){
                if(this.ready()){
                    if(Meteor.user() !== undefined){
                        if(Meteor.user()){
                            if(!Meteor.user().signupComplete){
                                Router.go("completeSignup")
                            }else{
                                Router.go("homePage");
                            }    
                        }else{
                            this.next();
                        }
                    }
                    
                    document.title = 'Welcome to Gervai';
                    $('document, body').removeAttr('class');
                }
            },
    		template: "mainPage",
    		data: function(){

            }
    	}),
        this.route("homePage", {
            path: "/homepage",
            controller: 'loggedInUserCheck',
            onBeforeAction: function(){  
                document.title = 'Homepage';
                this.next();
            },
            template: "homePage",
            data: function(){

            }
        }),
        this.route("settingsPage", {
            path: "/settingspage",
            controller: 'loggedInUserCheck',
            onBeforeAction: function(){  
                document.title = 'Settings';
                this.next();
            },
            template: "settingsPage",
            data: function(){

            }
        }),
        this.route("completeSignup", {
            path: "/completesignup",
            waitOn: function(){
                return Meteor.subscribe("userSettings");
            },
            onBeforeAction: function(){
                if(this.ready()){
                    if(Meteor.user() !== undefined){
                        if(Meteor.user()){
                            if(Meteor.user().signupComplete == false){
                                    this.next();
                                }else{
                                    Router.go("homePage");
                                }    
                        }else{
                            Router.go("mainPage");
                        }
                    }
                    document.title = 'Almost there...';
                }
            },
            template: "completeSignup",
            data: function(){}
        })
        this.route("chartsPage", {
            path: "/chartspage",
        // controller: "loggedINUserCheck",
            template: "chartsPage"
        }),
        this.route('apiInsert', {
            path: '/api/insert',
            where: 'server',
            waitOn: function(){
                return Meteor.subscribe("userName", this.request.body.username);
            },
            action: function () {
                if(this.ready()){
                    var username = this.request.body.username,
                        password = this.request.body.password,
                        timestamp = parseInt(this.request.body.timestamp),
                        question = this.request.body.question,
                        correct = !!this.request.body.correct,
                        difficult = !!this.request.body.difficult;

                    if(username != "" && password != "" && question != ""){
                        var digest = {digest: CryptoJS.SHA256(password).toString(), algorithm: 'sha-256'};
                            var result = Accounts._checkPassword(Meteor.users.findOne({"profile.userName": username}), digest);

                        if(result.error == null){
                            QuestionsAnswered.insert({createdAt: new Date(timestamp*1000), "userName": userName, "question": question, "correct": correct, "difficult": difficult});
                            this.response.writeHead(200);
                            this.response.end("Alright!");
                        }else{
                            this.response.writeHead(401);
                            this.response.end("Unauthorized" + result.error);
                        }
                        
                    }
                }
            }
        }),
        this.route("apiMaps", {
            path: '/api/maps',
            where: 'server',
            waitOn: function(){
                return Meteor.subscribe("userName", this.request.body.username);
            },
            action: function () {
                if(this.ready()){
                    var username = this.request.body.username,
                        password = this.request.body.password,
                        timestamp = parseInt(this.request.body.timestamp),
                        latitude = this.request.body.lat,
                        longitude = this.request.body.lon;

                        if(username != "" && password != "" && latitude != "" && longitude != ""){
                            var digest = {digest: CryptoJS.SHA256(password).toString(), algorithm: 'sha-256'};
                            var result = Accounts._checkPassword(Meteor.users.findOne({"profile.userName": username}), digest);

                            if(result.error == null){
                                Maps.insert({"createdAt": new Date(timestamp*1000), "authorId": Meteor.users.findOne({})._id, "latitude": latitude, "longitude": longitude});
                                this.response.writeHead(200);
                                this.response.end("Alright!");
                            }else{
                                this.response.writeHead(401);
                                this.response.end("Unauthorized" + result.error);
                            }
                            
                        }
                    }
                }
        }),
        this.route("apiGet", {
            path: '/api/get',
            where: 'server',
            waitOn: function(){
                return Meteor.subscribe("questionsAnswered", this.request.body.username);
            },
            action: function () {
                if(this.ready()){
                    var username = this.request.body.username;

                        if(username != "" && QuestionsAnswered.findOne({"userName": username})){
                            var resp = {"entries": QuestionsAnswered.find({"userName": username}, {fields: {"createdAt": 1, "question": 1, "correct": 1, "difficult": 1}}).fetch()}
                            this.response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                            this.response.end(JSON.stringify(resp));
                        }else{
                            this.response.writeHead(400);
                            this.response.end("Bad request.")
                        }
                    }
                }
        }),
        this.route("apiGetProfile", {
            path: '/api/getProfile',
            where: 'server',
            waitOn: function(){
                return Meteor.subscribe("userName", this.request.body.username);
            },
            action: function () {
                if(this.ready()){
                    var username = this.request.body.username;

                        if(username != "" && Meteor.users.findOne({"profile.userName": username})){
                            var resp = {"entries": Meteor.users.findOne({"profile.userName": username}).fetch()}
                            this.response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                            this.response.end(JSON.stringify(resp));
                        }else{
                            this.response.writeHead(400);
                            this.response.end("Bad request.")
                        }
                    }
                }
        }),
        this.route("apiLogin", {
            path: "/api/login",
            where: 'server',
            action: function () {
                var userName = this.request.body.userId,
                    password = this.request.body.password

                if(userId != "" && password){
                    var digest = {digest: CryptoJS.SHA256(password).toString(), algorithm: 'sha-256'};
                    var result = Accounts._checkPassword(userId, digest);

                    if(result.error == null){
                        var questionsAnsweredSubscribe = Meteor.subscribe("questionsAnswered");
                        if(questionsAnsweredSubscribe.ready()){
                            var resp = {data: QuestionsAnswered.find({"_id": Meteor.userId()})};
                            this.response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                            this.response.end(JSON.stringify(resp));
                        }
                        
                    }else{
                        this.response.writeHead(401);
                        this.response.end("Access Denied.");
                    }

                    
                }
            }
        })
    })
})