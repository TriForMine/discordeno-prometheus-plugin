import { Bot, serve } from "./deps.ts";

const handler = <B extends Bot = bot>(rawBot: B): Response => {
  const hasCachePlugin = rawBot.enabledPlugins.has("CACHE");

  const body = `# HELP memory_usage Memory usage from the main process
# TYPE memory_usage gauge
memory_usage{type="rss"} ${(Deno.memoryUsage().rss / 1000000).toFixed(2)}
memory_usage{type="heapTotal"} ${
    (Deno.memoryUsage().heapTotal / 1000000).toFixed(2)
  }
memory_usage{type="heapUsed"} ${
    (Deno.memoryUsage().heapUsed / 1000000).toFixed(2)
  }
memory_usage{type="external"} ${
    (Deno.memoryUsage().external / 1000000).toFixed(2)
  }${
    hasCachePlugin
      ? `\n\n# HELP cache_amount Amount of object stored in cache
# TYPE cache_amount gauge
cache_amount{type="guilds"} ${rawBot.guilds.size}
cache_amount{type="users"} ${rawBot.users.size}
cache_amount{type="members"} ${rawBot.members.size}
cache_amount{type="messages"} ${rawBot.messages.size}
cache_amount{type="channels"} ${rawBot.channels.size}
cache_amount{type="presences"} ${rawBot.presences.size}`
      : ""
  }`;

  return new Response(body, { status: 200 });
};

export default function enablePrometheusPlugin<B extends Bot>(
  rawBot: B,
  port = 8888,
) {
  rawBot.enabledPlugins.add("PROMETHEUS");

  serve(() => handler(rawBot), { port }).then((r) => console.log(r));
}
