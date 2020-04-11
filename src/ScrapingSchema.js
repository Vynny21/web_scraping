'use-strict';
var mongoose = require('mongoose');

var ScrapingSchema = new mongoose.Schema({
    titulo: String,
    data: Date,
    ementa: String,
    situacao: String,
    assunto: String,
    autor: String,
    projeto: String,
    entrada: Date,
    prazo: Number,
    devolucao: Date
})

module.exports = ScrapingSchema;