const db = require('mongoose')

const cmd = new db.Schema({
    guildId: { type: String, required: true },
    userId: { type: String, required: true, },
    Img1: { type: String },
    Img2: { type: String },
    Img3: { type: String },

})


module.exports = db.model('skin', cmd)
