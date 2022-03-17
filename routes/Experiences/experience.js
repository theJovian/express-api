const experience = (app, pool) => {
    app.get('/api/experiences', async (request, response) => {
        await pool.query('SELECT * FROM Experiences', (error, result) => {
            if (error) throw error;

            response.send(result);
        });
    });
    // Display a single Experience by ID
    app.get('/api/experiences/:id', async (request, response) => {
        const id = request.params.id;

        await pool.query('SELECT * FROM Experiences WHERE id = ?', id, (error, result) => {
            if (error) throw error;

            response.send(result[0]);
        });
    });
    // Add a new Experience
    app.post('/api/experiences', (request, response) => {
        pool.query('INSERT INTO Experiences SET ?', request.body, (error, result) => {
            if (error) throw error;

            response.status(201).send(`Experience added with ID: ${result.insertId}`);
        });
    });
    // Update an existing Experience
    app.put('/api/experiences/:id', (request, response) => {
        const id = request.params.id;

        pool.query('UPDATE Experiences SET ? WHERE id = ?', [request.body, id], (error, result) => {
            if (error) throw error;

            response.send('Experience updated successfully.');
        });
    });
    // Delete a Experience
    app.delete('/api/experiences/:id', (request, response) => {
        const id = request.params.id;

        pool.query('DELETE FROM Experiences WHERE id = ?', id, (error, result) => {
            if (error) throw error;

            response.send('Experience deleted.');
        });
    });

    app.delete('/api/experiences', (request, response) => {
        const ids = request.body
        pool.query('DELETE FROM Experiences WHERE id in (?)', [ids], (error, result) => {
            if (error) throw error;

            response.send('Experiences deleted.');
        });
    });
}

module.exports = experience
