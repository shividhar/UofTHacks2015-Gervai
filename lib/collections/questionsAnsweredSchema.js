var Schema = {};

Schema.QuestionsAnswered = new SimpleSchema({
    createdAt: {
        type: Date,
        optional: true
    },
    userId: {
        type: String,
        optional: true
    },
    question: {
    	type: String,
    	optional: true
    },
    correct: {
    	type: Boolean,
    	optional: true
    },
    difficult: {
    	type: Boolean,
    	optional: true
    }
    
})

QuestionsAnswered = new Meteor.Collection("questionsAnswered");
QuestionsAnswered.attachSchema(Schema.QuestionsAnswered);