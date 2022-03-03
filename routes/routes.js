// Load the MySQL pool connection
const pool = require('../data/config');
const user = require('./Users/user')
const experience =require('./Experiences/experience')

const router = app => {
    app.get('/api', (request, response) => {
        response.send({
            message: 'Now I am really a fucking pro'
        });
    });
    app.get('/api/test', async (request, response) => {
        response.send({
            message: 'this is a test lol'
        });
    });
    user(app, pool)
    experience(app, pool)
}

module.exports = router;
