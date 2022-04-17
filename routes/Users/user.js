const user = (app, pool) => {
    // app.get('/api/users', async (request, response) => {
    //     await pool.query('SELECT * FROM Users', (error, result) => {
    //         if (error) throw error;
    //
    //         response.send(result);
    //     });
    // });
    // Display a single user by ID
    app.get('/api/users/:email', async (request, response) => {
        const email = request.params.email;

        await pool.query('SELECT id, username, email FROM Users WHERE email = ?', email, (error, result) => {
            if (error) throw error;

            response.send(result[0]);
        });
    });
    // Add a new user
    app.post('/api/users', (request, response) => {
        pool.query('INSERT INTO Users SET ?', request.body, (error, result) => {
            if (error) throw error;

            response.status(201).send(`User added with ID: ${result.insertId}`);
        });
    });
    // Update an existing user
    app.put('/users/:id', (request, response) => {
        const id = request.params.id;

        pool.query('UPDATE Users SET ? WHERE id = ?', [request.body, id], (error, result) => {
            if (error) throw error;

            response.send('User updated successfully.');
        });
    });
    // Delete a user
    app.delete('/users/:id', (request, response) => {
        const id = request.params.id;

        pool.query('DELETE FROM Users WHERE id = ?', id, (error, result) => {
            if (error) throw error;

            response.send('User deleted.');
        });
    });
}

module.exports = user
