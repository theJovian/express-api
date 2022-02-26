// Load the MySQL pool connection
const pool = require('../data/config');

const router = app => {
    app.get('/api', (request, response) => {
        response.send({
            message: 'Now I am really a fucking pro'
        });
    });
    app.get('/api/users', async (request, response) => {
        await pool.query('SELECT * FROM users', (error, result) => {
            if (error) throw error;

            response.send(result);
        });
    });
    app.get('/api/test', async (request, response) => {
        response.send({
            message: 'this is a test lol'
        });
    });
    // Display a single user by ID
    app.get('/users/:id', (request, response) => {
        const id = request.params.id;

        pool.query('SELECT * FROM users WHERE id = ?', id, (error, result) => {
            if (error) throw error;

            response.send(result);
        });
    });
    // Add a new user
    app.post('/users', (request, response) => {
        pool.query('INSERT INTO users SET ?', request.body, (error, result) => {
            if (error) throw error;

            response.status(201).send(`User added with ID: ${result.insertId}`);
        });
    });
    // Update an existing user
    app.put('/users/:id', (request, response) => {
        const id = request.params.id;

        pool.query('UPDATE users SET ? WHERE id = ?', [request.body, id], (error, result) => {
            if (error) throw error;

            response.send('User updated successfully.');
        });
    });
    // Delete a user
    app.delete('/users/:id', (request, response) => {
        const id = request.params.id;

        pool.query('DELETE FROM users WHERE id = ?', id, (error, result) => {
            if (error) throw error;

            response.send('User deleted.');
        });
    });
}

module.exports = router;
