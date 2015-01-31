var Schema = {};

Schema.Questions = new SimpleSchema({
    authorId: {
        type: String,
        optional: false
    },
    incId: {
        type: Number,
        optional: false
    },
    question: {
        type: String,
        optional: false
    },
    correctAnswer: {
        type: Boolean,
        optional: true
    },
    userGenerated: {
        type: Boolean,
        defaultValue: false,
        optional: true
    }

})

Questions = new Meteor.Collection("questions");
Questions.attachSchema(Schema.Questions);