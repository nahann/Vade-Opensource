import { SharderEvents, ShardingManager } from "kurasuta";
import { join } from 'path';
import djs from 'discord.js-light';

const sharder = new ShardingManager(join(__dirname, 'vade.ts'), {
client: djs.Client,
clientOptions: {
  ws: { intents: djs.Intents.ALL },
  partials: ["MESSAGE", "CHANNEL", "REACTION", "GUILD_MEMBER", "USER"],
  messageCacheLifetime: 180,
  messageCacheMaxSize: 200,
  messageEditHistoryMaxSize: 200,
  messageSweepInterval: 180,
  restTimeOffset: 0,
  cacheGuilds: true,
  cacheChannels: true,
  cacheOverwrites: false,
  cacheRoles: true,
  cacheEmojis: true,
  cachePresences: true,
},
shardCount: 1,
guildsPerShard: 100,
retry: true,
respawn: true,
development: true
})

sharder.spawn();

process.on("SIGINT", signal => {
  sharder.clusters.forEach(shard => {
      console.warn("[Kurasuta] [Shutdown] Destroying shard " + shard.id)
      shard.kill()
  })
  process.exit()
})