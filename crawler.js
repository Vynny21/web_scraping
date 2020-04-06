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

            console.log("Entrou no scraping!!!")

            const titles = []
            const dates = []
            const situacoes = []
            const assuntos = []
            const autores = []
            const ementas = []

            const scraping_data = await scraping.page.evaluate(() => {
                console.log("Scraping de dados!!!")
                //const title = await scraping.$eval('h5[class="card-title"]');

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

                //Captura os tramites dentro de um modal expandido pelo botão "Trâmite"
                scraping.page.click('span.btn.btn-outline-secondary.btn-block.d-flex.justify-content-between.align-items-start');

                //Scraping da sessão Trâmites
                const entradas_tramites = []
                const prazos_tramites = []
                const devolucoes_tramites = []

                document.querySelectorAll('.table > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(2)')
                    .forEach(entrada_tramite => entradas_tramites.push(entrada_tramite.getAttribute('td')));
                
                document.querySelectorAll('.table > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(3)')
                    .forEach(prazo_tramite => prazos_tramites.push(prazo_tramite.getAttribute('td')));

                document.querySelectorAll('.table > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(4)')
                    .forEach(devolucao_tramite => devolucoes_tramites.push(devolucao_tramite.getAttribute('td')));

                return (
                    console.log(titles),
                    console.log(dates),
                    console.log(situacoes),
                    console.log(assuntos),
                    console.log(autores),
                    console.log(ementas),
                    console.log(entradas_tramites),
                    console.log(prazos_tramites),
                    console.log(devolucoes_tramites)
                )
            })

            return scraping_data
        
        }catch(err){
            console.log("Erro no botão:", err);
        }
    },

    map_cards: async () => {
        try{
            //Cria e mapeia o array de cards e clica nos botões
            console.log("Mapeou os cards!!!")

            await scraping.page.waitForSelector('div[class="card"]')
            const cards = await scraping.page.$$('div[class="card"]')

            for(const card of cards){
                console.log("Entrou na iteração!!!")
                const button = await card.$('a.btn.btn-outline-secondary.float-right.d-flex.justify-content-between.align-items-center');
                button.click();

                this.handle_button_scraping
            }


        }catch(err){
            console.log("Erro no scraping:", err);
        }
    },

    //Salva no banco de dados mongodb
    save_db: async () => {
        try{

        }catch(err){
            console.log("Erro ao salvar no DB:", err)
        }
    }

}

module.exports = scraping;
