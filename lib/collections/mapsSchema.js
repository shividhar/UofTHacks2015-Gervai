var Schema = {};

Schema.Maps = new SimpleSchema({
    createdAt: {
        type: Date,
        optional: false
    },
    authorId: {
        type: String,
        optional: false
    },
    latitude: {
        type: Number,
        decimal: true,
        optional: true
    },
    longitude: {
        type: Number,
        decimal: true,
        optional: true
    }

})

Maps = new Meteor.Collection("maps");
Maps.attachSchema(Schema.Maps);