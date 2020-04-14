const routes = require('express').Router();
const scraping = require('../app/scraping');

//Definição das rotas
routes.get('/', (req, res) => {
    res.send(scraping);
})

module.exports = routes;