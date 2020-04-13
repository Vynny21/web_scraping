'use-strict';
var mongoose = require('mongoose');
var host = 'mongodb+srv://black_mirror:S0TC23S2jb0r0mTW@cluster0-5pniq.mongodb.net/test'

var ScrapingSchema = new mongoose.Schema({
    titulo: {type: String},
    data: {type: String},
    ementa: {type: String},
    situacao: {type: String},
    assunto: {type: String},
    autor: {type: String},
    projeto: {type: String},
    entrada: {type: String},
    prazo: {type: Number},
    devolucao: {type: Date}
})


module.exports = ScrapingSchema;