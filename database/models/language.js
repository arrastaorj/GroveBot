const { Schema, model } = require('mongoose');

const language = new Schema({
    guildId: { type: String, required: true },
    language: { type: String },
})

module.exports = model('language', language)