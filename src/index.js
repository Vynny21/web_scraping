const cheerio = require('cheerio');
const request = require('request-promise');
const mongoose = require('mongoose');
const fs = require('fs');
const { Parser } = require('json2csv');

//Conexão e gravação de dados no MongoDB
const saveToDB = require('./database/saveToDB');

const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf8');

async function initialize_links() {

    const baseURL = 'http://www.legislador.com.br/LegisladorWEB.ASP?WCI=ProjetoTramite&ID=20';
    const search = '&dsVerbete=transporte';

    urlformat = baseURL + search;

    const html = await request(urlformat);
    const $ = cheerio.load(html);
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
                    var threePartNumberLink = mainLink.substring(0, 33);
                    var threePartFormatted = threePartNumberLink.split(',')[2] + threePartURL;

                    var yearAndFetchPartURL = '&dsVerbete=';
                    var mainLink = yearAndFetchPartURL + link;
                    var yearPartLink = mainLink.substring(0, 38);
                    var yearPartFormatted = yearPartLink.split(',')[3] + yearAndFetchPartURL;

                    var fetchPartURL = '';
                    var mainLink = fetchPartURL + link;
                    var fetchPartLink = mainLink.substring(0, 40);
                    var firstFormatted = fetchPartLink.split(',')[4] + fetchPartURL;
                    var secondFormatted = firstFormatted.split(')') + fetchPartURL;
                    var thirdFormatted = secondFormatted.split("'")[1];
                    var fourthFormatted = thirdFormatted.replace(/'transporte'/s, 'transporte');

                    return formattedLink = formattedURL + onePartFormatted + twoPartFormatted + threePartFormatted + yearPartFormatted + fourthFormatted;
                }
            }
        } catch (err) {
            console.log('Erro na captura dos links!!!')
        }

    }).get();

    console.log(links);
    scraping(links);
}


async function scraping(links, res) {
    if (links) {
        if (links !== undefined || null) {
            await Promise.all(links.map(async (link) => {
                try {
                    const scrapPage = await request(link);
                    const $ = cheerio.load(scrapPage, { decodeEntities: false });

                    if (scrapPage) {
                        if (scrapPage !== undefined || null) {
                            console.log('Extraindo dados da pagina...');


                            let titulo = $('h5.card-title').text().trim();
                            let getData = $('h6.card-subtitle.mb-2.text-muted').text().trim();
                            let data = getData.substring(3, 13);
                            let ementa = $('div.card-body:nth-child(5) > p:nth-child(1)').text().trim();
                            let situacao = $('body > section > div > div:nth-child(2) > div > div.col-lg > dl > dd:nth-child(2)').text().trim();
                            let assunto = $('body > section > div > div:nth-child(2) > div > div.col-lg > dl > dd:nth-child(8)').text().trim();
                            let autor = $('body > section > div > div:nth-child(2) > div > div.col-lg > dl > dd:nth-child(10)').text().trim();
                            let projeto = $('#idTramite > table > tbody > tr:nth-child(1) > td:nth-child(1) > dl > dt').text().trim();
                            let entrada = $('#idTramite > table > tbody > tr:nth-child(1) > td:nth-child(2)').text().trim();
                            let prazo = $('#idTramite > table > tbody > tr:nth-child(1) > td:nth-child(3)').text().trim();
                            let devolucao = $('#idTramite > table > tbody > tr:nth-child(1) > td:nth-child(4)').text().trim();

                            //Substituiçao de palavras acentuadas

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
                            };

                            try {
                                const json2csvParser = new Parser();
                                const csv = json2csvParser.parse(dados);
                                console.log(dados);
                                fs.writeFileSync('./src/csv/scraping_portal.csv', csv, 'utf8');
                                console.log('Arquivo CSV criado com sucesso!!!')

                            } catch (err) {
                                console.log("Erro na criação do csv:", err)
                            }

                            //salva no mongodb
                            saveToDB(dados);

                        } else if (scrapPage == undefined || null) {
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

initialize_links();