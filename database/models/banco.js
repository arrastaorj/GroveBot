const { Schema, model } = require('mongoose');

const userSchema = new Schema({

    guildId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    saldo: {
        type: Number,
        default: 0,
        required: true,
    },
    bank: {
        type: Number,
        default: 0,
        required: true,
    },
    pix: {
        type: String,
        default: 0,
        required: true,
    },
    valorDaily: {
        type: Number,
        default: 0,
        required: true,
    },

    lastDaily: {
        type: Number,
        reqired: true,
    },
    begTimeout: {
        type: Number,
    },
});

module.exports = model('Banco', userSchema);