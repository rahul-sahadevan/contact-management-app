
const mongoose = require("mongoose")

const Schema = mongoose.Schema

const contactSchema = new Schema({


    username:{
        type:String,
        require:true
    },
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    phone:{
        type:String,
        require:true
    }
})


module.exports = mongoose.model('contact',contactSchema)