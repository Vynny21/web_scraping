const app = require('./src/app');
const scraping = require('./src/app/scraping');

const routes = require('./src/routes/routes');
app.use('/', routes);

//app.listen(process.env.PORT || 3000);