const mongoose = require('mongoose');
const ScrapingSchema = require('../models/ScrapingDB');
const dados = require('../app/scraping');

async function saveToDB(dados) {
    const objdados = await dados;
    mongoose.connect("mongodb+srv://black_mirror:S0TC23S2jb0r0mTW@cluster0-5pniq.mongodb.net/test", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(result => {
        //console.log(result)
    }).catch(error => {
        //console.log(error)
    })

    const scrapingModel = mongoose.model('DadosScraping', ScrapingSchema);
    const consulta = scrapingModel.find({ dados: objdados.titulo });

    function estavazio(obj) {
        for (prop in obj) {
            if (obj.hasOwnProperty(prop))
                return false
        }
        return true
    }
    if (estavazio(consulta)) {
        const resultado = new scrapingModel({
            titulo: objdados.titulo,
            data: objdados.ementa,
            ementa: objdados.ementa,
            situacao: objdados.situacao,
            assunto: objdados.assunto,
            autor: objdados.autor,
            projeto: objdados.projeto,
            entrada: objdados.entrada,
            prazo: objdados.prazo,
            devolucao: objdados.devolucao
        });
        resultado.save((error, result) => {
            if (!error) {
                //console.log( result);
            } else {
                //return console.log(error);
            }
        });

    } else {
        //console.log(getS)
    }
}

module.exports = saveToDB;