const puppeteer = require('puppeteer'); 
const cheerio = require('cheerio');
const request = require('request-promise');
const mongoose = require('mongoose');
const ScrapingSchema = require('./ScrapingSchema');

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

            const data = await scraping.page.evaluate(() => {

                console.log("Entrou no scraping!!!");
                let titulo = document.querySelectorAll('div.card-header').innerText
                let data = document.querySelectorAll('h6.card-subtitle').innerText;
                let situacao = document.querySelectorAll('dd.col-sm-9').innerText;
                let assunto = document.querySelectorAll('dd.col-sm-9').innerText;
                let autor = document.querySelectorAll('dd.col-sm-9').innerText;
                let ementa = document.querySelectorAll('p.card-text').innerText;

                //Tramites
                const projetos_tramites = {}
                document.querySelectorAll('div#idTramite.mt-2')
                    .forEach(projeto_tramite => {
                        projetos_tramites.projeto = projeto_tramite.getElementsByTagName('dt').innerText;
                        projetos_tramites.entrada = projeto_tramite.getElementsByClassName('info-col')[0].innerText;
                        projetos_tramites.prazo = projeto_tramite.getElementsByClassName('info-col')[1].innerText;
                        projetos_tramites.devolucao = projeto_tramite.getElementsByClassName('info-col')[2].innerText;
                    })


                return {
                    titulo,
                    data,
                    situacao,
                    assunto,
                    autor,
                    ementa,
                    projetos_tramites
                }
            })

            console.log(data)

        
        }catch(err){
            console.log("Erro no scraping:", err);
        }
    },

    map_cards: async () => {
        try{
            //Cria e mapeia o array de cards e clica nos botões
            console.log("Mapeou os cards!!!")

            await scraping.page.waitForSelector('div[class="card"]')
            const cards = await scraping.page.$$('div[class="card"]')

            await scraping.page.waitForSelector('div[class="card-body"]')
            const tramites = await scraping.page.$$('div[class="card-body"]')


            for(const card of cards){
                console.log("Entrou na iteração!!!")
                const button = await card.$('a.btn.btn-outline-secondary.float-right.d-flex.justify-content-between.align-items-center');
                button.click('a.btn.btn-outline-secondary.float-right.d-flex.justify-content-between.align-items-center');

                for(const tramite of tramites){
                    console.log("Abriu os tramites!!!")
                    const btn_tramites = await tramite.$('span.btn.btn-outline-secondary.btn-block.btn-block.d-flex.justify-content-between.align-items-start');
                    btn_tramites.click('span.btn.btn-outline-secondary.btn-block.btn-block.d-flex.justify-content-between.align-items-start');

                    //scraping.handle_button_scraping();
                }
                
            }


        }catch(err){
            console.log("Erro na iteração:", err);
        }
    },

    //Salva no banco de dados mongodb
    save_db: async () => {
        const objdados = await scraping.handle_button_scraping();
        mongoose.connect('', {
            useNewUrlParser: true
        }).then(result => {
            console.log("MongoDB conectado.")
        }).catch(error => {
            console.log("Houve um problema com a coneção.", error)
        })

        const tbdados = await mongoose.model('tbdados', ScrapingSchema);
        const consulta = await tbdados.find({dados:objdados.titulo});

        function estavazio(){
            for(prop in obj){
                if(obj.hasOwnProperty(prop))
                return false
            }
            return true
        }
        if(estavazio(consulta)){
            const resultado = new tbdados({
                titulo:objdados.titulo,
                situacao:objdados.situacao,
                assunto:objdados.assunto,
                autor:objdados.autor,
                ementa:objdados.ementa,
                projetos_tramites:objdados.projetos_tramites
            });
            resultado.save(function(error, resultado){
                if(error)
                return console.log(error)
            });
            console.log("Cadastro realizado com sucesso!")
        }else{
            console.log("Este concurso já existe.")
        }

    }

}

module.exports = scraping;
