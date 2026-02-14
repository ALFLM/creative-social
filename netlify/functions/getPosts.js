const { Client } = require('pg');

exports.handler = async (event) => {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        await client.connect();
        const res = await client.query('SELECT * FROM posts ORDER BY created_at DESC');
        await client.end();

        return {
            statusCode: 200,
            body: JSON.stringify(res.rows),
        };
    } catch (error) {
        await client.end();
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to retrieve posts' }),
        };
    }
};