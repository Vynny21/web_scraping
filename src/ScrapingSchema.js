'use-strict';
var mongoose = require('mongoose');

var ScrapingSchema = new mongoose.Schema({
    titulo: {type: String},
    data: {type: Date},
    ementa: {type: String},
    situacao: {type: String},
    assunto: {type: String},
    autor: {type: String},
    projeto: {type: String},
    entrada: {type: Date},
    prazo: {type: Number},
    devolucao: {type: Date}
})

module.exports = ScrapingSchema;