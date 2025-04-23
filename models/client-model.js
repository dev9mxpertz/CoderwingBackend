const mongoose = require("mongoose")


const clientSchema = new mongoose.Schema({
    villaName: {
        type: String,
        required: true,  
    },
    location: {
        type: String,
        required: true,  
    },
    guest: {
        type: String,
        required: true,  
    },
    bedroom: {
        type: String,
        required: true,  
    },
    bathroom: {
        type: String,
        required: true,  
    },
    checkin: {
        type: String,
        required: true, 
    },
    checkout: {
        type: String,
        required: true, 
    },
})


const Client = mongoose.model("Client", clientSchema)
module.exports = Client



