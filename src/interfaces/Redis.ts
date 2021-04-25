import redis, { RedisClient } from 'redis';
import { redisPath } from '../../config.json';

const main = async (): Promise<RedisClient> => {
  return await new Promise((resolve, reject) => {
    const client = redis.createClient({
      url: redisPath,
    });

    client.on('error', (err) => {
      console.error(`Redis error: `, err);
      client.quit();
      reject(err);
    });

    client.on('ready', () => {
      resolve(client);
      console.log(`Redis has connected`);
    });
  });
};

export default main;
