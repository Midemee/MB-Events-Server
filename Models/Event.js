const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    photo: {
        type: String,
        required: true,
    },
    title : {
        type: String,
        required: true,
        trim: true,
    },
    date: {
        type : Date,
        required : true,
    }, 
    timeStart: {
        type : String,
        required : true,
    },
    timeEnd: {
        type: String,
        required: true, 
    },
    location: {
        type: String,
        required : function (){
            return this.online === false
        },
    },
    //location is only required if online is false
    online : {
        type : Boolean,
        default: false,
    },
    description : {
        type : String,
        required : true,
        trim: true,
    },
    category : {
        type: String,
        enum : ["sports", "party", "concert", "tech", "religion", "education"],
        required: true,
    },
    //Enum helps select one from the array
    tags : {
        type : [String],
        required: true,
    },
    //tags saved as an array e.g "sport, party, concert"
    //split into ["sport", "fun", "night"]
    free: {
        type: Boolean,
        default: false,
    },
    regularEnabled: {
        type: Boolean,
        default : false
    },
    regular : {
        type: Number,
        required : function (){
            return !this.free && this.regularEnabled
        },
        min : 0,
    },
    //only required if event is free and toggle is true
    vipEnabled : {
        type: Boolean,
        default: false,
    },
    vip : {
        type: Number,
        required : function (){
            return !this.free && this.vipEnabled
        },
        min : 0,
    },
    //only required if event is free and toggle is true
    hostedBy : {
        type: String,
        ref: "User",
        required : true,
    }
},
{timestamps : true}
);

module.exports = mongoose.model("Event", eventSchema)