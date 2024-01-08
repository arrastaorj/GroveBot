const mongoose = require('mongoose');

const auditlogs = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
        unique: true,
    },
    auditlogs: {
        type: String,
        required: true,
        default: false,
    },

    canal: {
        type: String
    },
});

module.exports = mongoose.model('auditlogs', auditlogs)