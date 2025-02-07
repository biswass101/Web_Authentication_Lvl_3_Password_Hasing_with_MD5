const mongoose = require('mongoose')
const usrSchema = new mongoose.Schema ({
    email : {
        type: String,
        required: true
    },
    pswd : {
        type: String,
        required: true
    },
    createdOn : {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("User", usrSchema)