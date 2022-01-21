# discordeno-cache-plugin

This is an unofficial plugin. This plugin provides a http server
that respond with stats used by Prometheus.
As of now, it will only provide memory usage.

## Requirements
- [Prometheus](https://prometheus.io/docs/prometheus/latest/getting_started/), prometheus fetches the server every x seconds/minutes and store them.
- [Grafana](https://grafana.com/grafana/download?pg=get&plcmt=selfmanaged-box1-cta1&edition=oss), grafana will be used to show the data in a great dashboard.

## Optional dependencies
[cache-plugin](https://github.com/discordeno/cache-plugin):
If cache-plugin is enabled, you will also be able to get the amount
of objects stored in cache.

## Running the server

```ts
// MOVE TO DEPS.TS AND USE SPECIFIC VERSION
import enablePrometheusPlugin from "https://deno.land/x/discordeno_prometheus_plugin/mod.ts";
// Create the bot object, THIS WILL NEED YOUR OPTIONS.
const bot = createBot({});
// Be sure to enable it after cache plugin, if you have it.
// Enable the prometheus plugin, the http server will starts on port 8888(default)
enablePrometheusPlugin(bot, 8888)
// Start your bot
await startBot(bot);
```

## Prometheus Configuration

You will have to configure prometheus, so it fetches the server.

You first need to find the prometheus.yml file.

On linux: `/etc/prometheus/prometheus.yml`

Then add this at the end of the file.
```yml
scrape_configs:
  # You probably have the prometheus job here, just keep it.

  # This is what you need to add
  - job_name: "YOUR_BOT_NAME"

    static_configs:
      - targets: ["localhost:YOUR_PORT"] # By default, the port is 8888
        labels:
          group: "production" # Anything you want
```

## Grafana Configuration
Once you have done all the above, you are ready to configure grafana.

You can either experiment yourself and make your own dashboard, or you can use the following template:

[https://grafana.com/grafana/dashboards/15521](https://grafana.com/grafana/dashboards/15521)
