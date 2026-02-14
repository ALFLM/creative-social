const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = 'creativeSocial';
const secretKey = process.env.JWT_SECRET;

exports.handler = async (event) => {
    const { httpMethod, body } = event;

    await client.connect();
    const db = client.db(dbName);
    const usersCollection = db.collection('users');

    if (httpMethod === 'POST') {
        const { username, password } = JSON.parse(body);

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = { username, password: hashedPassword };

        await usersCollection.insertOne(user);

        const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });

        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'User created', token }),
        };
    } else if (httpMethod === 'GET') {
        const { username, password } = JSON.parse(body);
        const user = await usersCollection.findOne({ username });

        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });

            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Login successful', token }),
            };
        } else {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'Invalid credentials' }),
            };
        }
    }

    return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Method not allowed' }),
    };
};