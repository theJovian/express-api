const iteration = (app, pool) => {
    app.get('/api/iterations/:id', async (request, response) => {
        const id = request.params.id;
         await pool.query('SELECT Iterations.id as iterationId, n, notes, score, experienceId, image, text, state FROM Iterations, Items where Iterations.id = Items.iterationId and experienceId=?;', id, async(error, iterations) => {
            if (error) throw error;
            const result = []
             iterations.forEach(iteration => {
                 const index = result.findIndex((it) => it.id === iteration.iterationId)
                 if(index !== -1){
                    result[index].items.push({text: iteration.text, state: iteration.state})
                 }else{
                    result.push({
                        id: iteration.iterationId,
                        n: iteration.n,
                        notes: iteration.notes,
                        score: iteration.score,
                        experienceId: iteration.experienceId,
                        image: iteration.image,
                        items: [
                            {
                                text: iteration.text,
                                state: iteration.state
                            }
                        ]
                    })
                 }
             })
            response.send(result)

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
        console.log(JSON.stringify(request.body, null, 5))
        const iteration = {
            n: request.body.n,
            notes: request.body.notes,
            score: request.body.score,
            experienceId: request.body.experienceId
        }
        pool.query('INSERT INTO Iterations SET ?', iteration, (error, result) => {
            if (error) throw error;
            const items = request.body.items
            items.forEach(item => {
                const itemToInsert = {
                    text: item.text,
                    state: item.state,
                    iterationId: result.insertId
                }
                pool.query('INSERT INTO Items SET ?', itemToInsert, (error, result) => {
                    if (error) throw error;
                })
            })
            const id = {id: result.insertId}
            response.status(200).send(JSON.stringify(id))
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
