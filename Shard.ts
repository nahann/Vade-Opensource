import config from './config.json';
import { ShardingManager } from 'discord.js-light';

const shard = new ShardingManager('./index.ts', {
    token: config.token,
    totalShards: "auto"
});

shard.on("shardCreate", shard => console.log(`[SHARD] Shard ${shard.id} launched.`));
shard.spawn("auto");