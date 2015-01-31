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
    	this.route("splashPage", {
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
                                Router.go("home");
                            }    
                        }else{
                            this.next();
                        }
                    }
                    
                    document.title = 'Welcome to Notebulb';
                    $('document, body').removeAttr('class');
                }
            },
    		template: "splash",
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
        })
    })
})