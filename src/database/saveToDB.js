const mongoose = require('mongoose');
const ScrapingSchema = require('../models/ScrapingDB');
const dados = require('../index');

async function saveToDB(dados) {
    const objdados = await dados;
    mongoose.connect("mongodb+srv://black_mirror:S0TC23S2jb0r0mTW@cluster0-5pniq.mongodb.net/test", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(result => {
        console.log("MongoDB conectado!!!")
    }).catch(error => {
        console.log("Houve um problema com a conexão!", error)
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
                console.log("Cadastro realizado com sucesso!", result);
            } else {
                return console.log("Erro no cadastro dos dados:", error);
            }
        });

    } else {
        console.log("Este scraping já existe.")
    }
}

module.exports = saveToDB;