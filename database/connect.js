const { connect } = require("mongoose");
const mongoose = require('mongoose');
const chalk = require("chalk");

const colors = require('colors')

module.exports = {
  start() {
    mongoose.set('strictQuery', false);
    try {
      connect(process.env.mongourl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      console.log("[MongoDB]".bgGreen, "Conectado ao Banco de Dados.".green)
      
    } catch (err) {
      if (err) return console.log(`🚨 | [MongoDB]:`, err);
    }
  },
};