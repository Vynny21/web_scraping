const cheerio = require('cheerio');
const request = require('request-promise');
const fetch = require('node-fetch');
var iconv = require('iconv-lite');
const mongoose = require('mongoose');
const ScrapingSchema = require('./src/ScrapingSchema');


const baseURL = 'http://www.legislador.com.br/LegisladorWEB.ASP?WCI=ProjetoTramite&ID=20';

const search = '&dsVerbete=transporte';
var encoding = 'iso-8859-1';

async function search_crawler_url(searchTerm) {
    return fetch(`${baseURL}${searchTerm}`)
        .then(res => res.text())
}

search_crawler_url(search)
    .then(body => {
        const $ = cheerio.load(body, encoding);
        const links = $('div.card-body').map((i, card) => {
            const $button = $(card).find('.btn.btn-outline-secondary.float-right.d-flex.justify-content-between.align-items-center').attr('onclick');

            try {
                console.log('Links capturados! Formatando links...')
                if ($button) {
                    if ($button !== undefined || null) {
                        var link = $button;
                        var formattedURL = baseURL.substring(0, 51);
                        const mainPart = 'ProjetoTexto&ID='

                        var onePartURL = '&inEspecie=';
                        var mainLink = onePartURL + link;
                        var onePartNumberLink = mainLink.substring(0, 27);
                        var onePartFormatted = mainPart + onePartNumberLink.split('(')[1] + onePartURL;

                        var twoPartURL = '&nrProjeto=';
                        var mainLink = twoPartURL + link;
                        var twoPartNumberLink = mainLink.substring(0, 32);
                        var twoPartFormatted = twoPartNumberLink.split(',')[1] + twoPartURL;

                        var threePartURL = '&aaProjeto=';
                        var mainLink = threePartURL + link;
                        var threePartNumberLink = mainLink.substring(0, 32);
                        var threePartFormatted = threePartNumberLink.split(',')[2] + threePartURL;

                        var yearAndFetchPartURL = '&dsVerbete=';
                        var mainLink = yearAndFetchPartURL + link;
                        var yearPartLink = mainLink.substring(0, 38);
                        var yearPartFormatted = yearPartLink.split(',')[3] + yearAndFetchPartURL;

                        var fetchPartURL = '';
                        var mainLink = fetchPartURL + link;
                        var fetchPartLink = mainLink.substring(0, 39);
                        var firstFormatted = fetchPartLink.split(',')[4] + fetchPartURL;
                        var secondFormatted = firstFormatted.split(')') + fetchPartURL;
                        var thirdFormatted = secondFormatted.split(',')[0] + fetchPartURL;
                        var fourth = thirdFormatted.replace(/'transporte'/s, 'transporte') + fetchPartURL;
                        var fetchPartFormatted = fourth;

                        return formattedLink = formattedURL + onePartFormatted + twoPartFormatted + threePartFormatted + yearPartFormatted + fetchPartFormatted;
                    }
                }
            } catch (err) {
                console.log('Erro na captura dos links!!!')
            }

        }).get();

        scraping(links);

        console.log(links)
    });


async function scraping(links) {
    if (links) {
        if (links !== undefined || null) {
            await Promise.all(links.map(async (link) => {
                try {

                    const scrapPage = await request(link);
                    const $ = cheerio.load(scrapPage, encoding);

                    if (scrapPage) {
                        if (scrapPage !== undefined || null) {
                            console.log('Extraindo dados da pagina...')
                            let titulo = $('h5.card-title').text().trim();
                            let data = $('h6.card-subtitle.mb-2.text-muted').text().trim();
                            let ementa = $('div.card-body:nth-child(5) > p:nth-child(1)').text().trim();
                            let situacao = $('body > section > div > div:nth-child(2) > div > div.col-lg > dl > dd:nth-child(2)').text().trim();
                            let assunto = $('body > section > div > div:nth-child(2) > div > div.col-lg > dl > dd:nth-child(8)').text().trim();
                            let autor = $('body > section > div > div:nth-child(2) > div > div.col-lg > dl > dd:nth-child(10)').text().trim();
                            let projeto = $('#idTramite > table > tbody > tr:nth-child(1) > td:nth-child(1) > dl > dt').text().trim();
                            let entrada = $('#idTramite > table > tbody > tr:nth-child(1) > td:nth-child(2)').text().trim();
                            let prazo = $('#idTramite > table > tbody > tr:nth-child(1) > td:nth-child(3)').text().trim();
                            let devolucao = $('#idTramite > table > tbody > tr:nth-child(1) > td:nth-child(4)').text().trim();

                            dados = {
                                titulo,
                                data,
                                ementa,
                                situacao,
                                assunto,
                                autor,
                                projeto,
                                entrada,
                                entrada,
                                prazo,
                                devolucao
                            }

                            console.log(dados);
                        
                            saveToDB(dados);
                        
                        }else if(scrapPage == undefined || null){
                            return false
                        }
                    }

                } catch (err) {
                    console.log('Erro no scraping da pagina:', err)
                }
            }));
        }
    }
}


async function saveToDB(dados) {
    const objdados = await dados;
    mongoose.connect('mongodb//black_mirror:S0TC23S2jb0r0mTW@cluster0-5pniq.mongodb.net/test', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(result => {
        console.log("MongoDB conectado.")
    }).catch(error => {
        console.log("Houve um problema com a conexão!", error)
    })

    const tbdados = await mongoose.model('tbdados', ScrapingSchema);
    const consulta = await tbdados.find({dados:objdados.titulo});

    function estavazio() {
        for (prop in obj) {
            if (obj.hasOwnProperty(prop))
                return false
        }
        return true
    }
    if (estavazio(consulta)) {
        const resultado = new tbdados({
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
        resultado.save(function (error, resultado) {
            if (error)
                return console.log(error)
        });
        console.log("Cadastro realizado com sucesso!")
    } else {
        console.log("Este concurso já existe.")
    }
}