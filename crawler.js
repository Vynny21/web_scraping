const puppeteer = require('puppeteer'); 
const jsdom = require("jsdom");
const { document } = jsdom;

const baseURL = "http://www.legislador.com.br/LegisladorWEB.ASP?WCI=ProjetoTramite&ID=";

const scraping = {

    browser: null,
    page: null,
    
    initialiaze: async () => {
        //Inicializa o rôbo
        try{

            console.log("Inicializou!!!")
            scraping.browser = await puppeteer.launch({headless:false}) //Mostra o navegador
            scraping.page = await scraping.browser.newPage();

        }catch(err){
            console.log("Erro na inicialização:", err)
        }
    },

    search_func: async (search) => {
        //Espera até a pagina terminar de carregar
        try{

            console.log("Fez a busca!!!")
            await scraping.page.goto(baseURL, {waitUntil: 'networkidle2'});
            await scraping.page.waitFor(100);
            await scraping.page.type('input[name="dsTexto"]', 'transporte');
            await scraping.page.keyboard.press('Enter');

        }catch(err){
            console.log("Erro na busca:", err)
        }
    },

    handle_button_scraping: async () => {
        //Seleciona e clica no botão
        try{

            console.log("Entrou no botão!!!")
            await scraping.page.waitForNavigation();
            await scraping.page.click('a.btn.btn-outline-secondary.float-right.d-flex.justify-content-between.align-items-center');

            const titles = []
            const dates = []
            const situacoes = []
            const assuntos = []
            const autores = []
            const ementas = []

            const scraping_data = await scraping.page.evaluate(() => {

                document.querySelectorAll('h5[class="card-title"]')
                    .forEach(title => titles.push(title.getAttribute('h5')));
                
                document.querySelectorAll('h6[class="card-subtitle mb-2 text-muted"]')
                    .forEach(date => dates.push(date.getAttribute('h6')));

                document.querySelectorAll('body > section > div > div:nth-child(2) > div > div.col-lg > dl > dd:nth-child(2)')
                    .forEach(situacao => situacoes.push(situacao.getAttribute('dd')));

                document.querySelectorAll('body > section > div > div:nth-child(2) > div > div.col-lg > dl > dd:nth-child(8)')
                    .forEach(assunto => assuntos.push(assunto.getAttribute('dd')));

                document.querySelectorAll('body > section > div > div:nth-child(2) > div > div.col-lg > dl > dd:nth-child(10)')
                    .forEach(autor => autores.push(autor.getAttribute('dd')));

                document.querySelectorAll('body > section > div > div:nth-child(2) > div > div.col-lg > dl > dd:nthbody > section > div > div:nth-child(5) > p-child(2)')
                    .forEach(ementa => ementas.push(ementa.getAttribute('dd')));

                return (
                    titles,
                    dates,
                    situacoes,
                    assuntos,
                    autores,
                    ementas
                )
            })

            return scraping_data
        
        }catch(err){
            console.log("Erro no botão:", err);
        }
    },

    map_cards: async (cards = []) => {
        try{
            //Cria e mapeia o array de headers e clica nos botões
            console.log("Mapeou os cards!!!")
        
            const cards_header = await scraping.page.evaluate(() => {
                const headers = []

                document.querySelectorAll('h5[class="card-title"]')
                    .forEach(header => headers.push(header.getAttribute('h5')));
                    for(header of headers){
                        this.handle_button_scraping()
                    }
 
                return (
                    console.log(headers) 
                )
            })

            return cards_header

        }catch(err){
            console.log("Erro no scraping:", err);
        }
    }

    

    //Manipulação do DOM e scraping

}

module.exports = scraping;
