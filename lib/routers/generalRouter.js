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
                                    Router.go("home");
                                }    
                        }else{
                            Router.go("splashPage");
                        }
                    }
                    document.title = 'Almost there...';
                }
            },
            template: "completeSignup",
            data: function(){},
        }),
        this.route("chartsPage", {
            path: "/chartspage",
        // controller: "loggedINUserCheck",
            template: "chartsPage"
        })
        this.route('serverFile', {
            path: '/api/:userName',
            action: function () {
                var userName = this.params.userName;
                
                // resp = {'lat' : this.request.body.lat,
                //       'lon' : this.request.body.lon};
                // this.response.writeHead(200, {'Content-Type': 
                //                             'application/json; charset=utf-8'});
                // this.response.end(JSON.stringify(resp));
            }
        });
    })
})