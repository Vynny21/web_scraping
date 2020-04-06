const scp = require('./crawler');

(async () => {

    await scp.initialiaze();
    await scp.search_func();
    //await scp.handle_button();
    await scp.map_cards(['']);

})();
