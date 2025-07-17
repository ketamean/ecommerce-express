import { createClient } from 'redis';
import 'dotenv/config';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

const redisCacheClient = createClient({
  url: process.env.MYCACHE_REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

(async () => {
  await redisClient.connect();
  await redisCacheClient.connect();
})();

export default redisClient;
export { redisCacheClient };