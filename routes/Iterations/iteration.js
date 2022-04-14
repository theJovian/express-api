const iteration = (app, pool) => {
    app.get('/api/iterations/:id', async (request, response) => {
        const id = request.params.id;
        await pool.query('SELECT * FROM Iterations WHERE experienceId = ?', id, (error, result) => {
            if (error) throw error;

            response.send(result);
        });
    });
    // Display a single iteration by ID
    app.get('/api/iteration/:id', async (request, response) => {
        const id = request.params.id;

        await pool.query('SELECT * FROM Iterations WHERE id = ?', id, async(error, iteration) => {
            if (error) throw error;

            await pool.query('SELECT * FROM Items WHERE id = ?', id, (error, items) => {
                if (error) throw error;

                const result = {
                    ...iteration[0],
                    items: items
                }
                response.send(result);
            });
        });
    });
    // Add a new iteration
    app.post('/api/iteration', (request, response) => {
        pool.query('INSERT INTO Iterations SET ?', request.body, (error, result) => {
            if (error) throw error;

            response.status(201).send(`iteration added with ID: ${result.insertId}`);
        });
    })
    // Update an existing iteration
    app.put('/api/iteration/:id', (request, response) => {
        const id = request.params.id;

        pool.query('UPDATE Iterations SET ? WHERE id = ?', [request.body, id], (error, result) => {
            if (error) throw error;

            response.send('iteration updated successfully.');
        });
    });
    // Delete a iteration
    app.delete('/api/iteration/:id', (request, response) => {
        const id = request.params.id;

        pool.query('DELETE FROM Iterations WHERE id = ?', id, (error, result) => {
            if (error) throw error;

            response.send('iteration deleted.');
        });
    });

    app.delete('/api/iterations', (request, response) => {
        const ids = request.body
        pool.query('DELETE FROM Iterations WHERE id in (?)', [ids.trash], (error, result) => {
            if (error) throw error;
            if(result.affectedRows === 0){
                response.send('iterations ID does not exists: ' + ids.trash)
            }else {
                response.send('iterations deleted successfully');
            }
        });
    });
}

module.exports = iteration