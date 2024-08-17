const { Schema, model } = require('mongoose');

const stremerSchema = new Schema({
    guildId: { type: String, required: true },
    stremer: { type: String, required: true },
    canal1: { type: String, required: true },
});

module.exports = model('Stremer', stremerSchema);
