var Schema = {};

Schema.QuestionsAnswered = new SimpleSchema({
    createdAt: {
        type: Date,
        defaultValue: new Date()
    },
    
})

QuestionsAnswered = new Meteor.Collection("questionsAnswered");
QuestionsAnswered.attachSchema(Schema.QuestionsAnswered);