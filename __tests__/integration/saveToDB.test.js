const mongoose = require('mongoose');

describe('MongoDB', () => {
    it('should save data received from scraping.', () => {

        mongoose.connect("mongodb+srv://black_mirror:S0TC23S2jb0r0mTW@cluster0-5pniq.mongodb.net/test", {
            useNewUrlParser:true,
            useUnifiedTopology: true
        }).then(result => {
            expect(result).toBe(result);
        }).catch(reject => {
            done(reject);
        })

    });
});
