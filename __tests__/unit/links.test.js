const cheerio = require('cheerio');
const request = require('request-promise');

describe('Links', () => {
    it('should fetch and formatting links received.', () => {

        async function callbackLink(){

            const baseURL = 'http://www.legislador.com.br/LegisladorWEB.ASP?WCI=ProjetoTramite&ID=20';
            const search = '&dsVerbete=transporte';
            urlformat = baseURL + search;

            const html = await request(urlformat);
            const $ = cheerio.load(html);

            const links = $('div.card-body').map((i, card) => {
                const $button = $(card).find('.btn.btn-outline-secondary.float-right.d-flex.justify-content-between.align-items-center').attr('onclick');

                try {
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
                    done(err);
                }

            }).get();

            //Esperado
            expect(links).toBe(links);
        }

        callbackLink();
    });
});
