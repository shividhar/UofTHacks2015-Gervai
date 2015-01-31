var Schema = {};

Schema.QuestionsAnswered = new SimpleSchema({
    createdAt: {
        type: Number,
        optional: false
    },
    question: {
    	type: String,
    	optional: false
    },
    correct: {
    	type: Boolean,
    	optional: false
    },
    difficult: {
    	type: Boolean,
    	optional: false
    }
    
})

QuestionsAnswered = new Meteor.Collection("questionsAnswered");
QuestionsAnswered.attachSchema(Schema.QuestionsAnswered);