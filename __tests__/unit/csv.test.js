const fs = require('fs');
const { Parser } = require('json2csv');
const { dados } = require('../../src/app/scraping');


describe('csv', () => {
    it('should be save data in cvs archive.', () => {

        let callbackCSV = file => new Promise((reject, resolve) => {
            const json2csvParser = new Parser();
            const csv = json2csvParser.parse(dados);
            fs.writeFileSync(file, csv, (err, csv) => {
                if(err){
                    reject(csv);
                }else{
                    resolve(csv);
                }
            })
        })
        callbackCSV('./src/app/csv/scraping_portal.csv')
            .then(contents => {
                String(contents);
                return callbackCSV('./src/app/csv/scraping_portal.csv', csv)
            }).then(contents => {
               expect(dados).toBe(contents)
            }).catch((error) => {
                //done(error);
            })
    })
})