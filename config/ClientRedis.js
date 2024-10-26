const redis = require('redis');

require('dotenv').config();
const client = redis.createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`   
});

client.on('connect', () => {
console.log('Connected to Redis');
console.log('Redis Host:', process.env.REDIS_HOST);
console.log('Redis Port:', process.env.REDIS_PORT);

});

client.on('error', (err) => {
    console.error('Redis connection error:', err);
});

module.exports = client;