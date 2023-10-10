const db = require('mongoose')

const cargos = new db.Schema({
    guildId: { type: String, required: true },
    cargo1Id: { type: String },
    cargo2Id: { type: String },
    cargo3Id: { type: String },
    cargo4Id: { type: String },
    cargo5Id: { type: String },
});


module.exports = db.model('autorole', cargos)
