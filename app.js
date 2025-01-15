import express from 'express';
import pool from './db/connection.js';

const app = express();
app.use(express.json());

// Reitti elokuvagenreen
app.post('/genres', async (req, res) => {
    const { name } = req.body;
    try {
        const result = await pool.query('INSERT INTO genres (name) VALUES ($1) RETURNING *', [name]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Reitti elokuvan lisäämiseen
app.post('/movies', async (req, res) => {
    const { name, year, genre_id } = req.body;
    try {
        // elokuva tietokantaan ja palauta lisätty elokuva
        const result = await pool.query(
            'INSERT INTO movies (name, year, genre_id) VALUES ($1, $2, $3) RETURNING *',
            [name, year, genre_id]
        );
        res.status(201).json(result.rows[0]);  // Lähetetään lisätyn elokuvan tiedot
    } catch (err) {
        console.error('Error inserting movie:', err);
        res.status(500).json({ error: 'Failed to add movie' });
    }
});



// Reitti elokuvan hakemiseen ID:n perusteella
app.get('/movies/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM movies WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).send('Movie not found');
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Reitti elokuvan poistamiseen ID:n perusteella
app.delete('/movies/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM movies WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).send('Movie not found');
        }
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Reitti kaikkien elokuvien hakemiseen
app.get('/movies', async (req, res) => {
    const { page = 1 } = req.query;
    const limit = 10;
    const offset = (page - 1) * limit;

    try {
        const result = await pool.query('SELECT * FROM movies LIMIT $1 OFFSET $2', [limit, offset]);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Elokuvan arvostelun lisääminen
app.post('/reviews', async (req, res) => {
    const { user_id, movie_id, stars, review_text } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO reviews (user_id, movie_id, stars, review_text) VALUES ($1, $2, $3, $4) RETURNING *',
            [user_id, movie_id, stars, review_text]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error inserting review:', error);
        res.status(500).json({ error: 'Failed to add review' });
    }
});

// Palvelimen käynnistys
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
