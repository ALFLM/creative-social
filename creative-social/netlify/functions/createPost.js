const { Client } = require('pg');

exports.handler = async (event) => {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });

    await client.connect();

    const { userId, drawingData } = JSON.parse(event.body);

    try {
        const res = await client.query(
            'INSERT INTO posts (user_id, drawing_data) VALUES ($1, $2) RETURNING *',
            [userId, drawingData]
        );

        const newPost = res.rows[0];

        return {
            statusCode: 200,
            body: JSON.stringify(newPost),
        };
    } catch (error) {
        console.error('Error creating post:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to create post' }),
        };
    } finally {
        await client.end();
    }
};