import "reflect-metadata";
import path from "path";
import { Intents, Interaction, Message } from "discord.js";
import { Client } from "discordx";

import * as fs from 'fs';

import { loadEnv, env } from "./env";

loadEnv();

fs.mkdir('data', { recursive: true }, (err) => {
  console.log('Was unable to create data folder. Either it already exists or I cannot create directories.')
});

const client = new Client({
  prefix: "!",
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
  classes: [
    path.join(__dirname, "commands", "**/*.{ts,js}"),
    path.join(__dirname, "events", "**/*.{ts,js}"),
  ],
  botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],
  silent: true,
});

client.once("ready", async () => {
  await client.initApplicationCommands({
    guild: { log: true },
    global: { log: true },
  });
  await client.initApplicationPermissions();

  console.log("Bot started");
});

client.on("interactionCreate", (interaction: Interaction) => {
  client.executeInteraction(interaction);
});

client.on("messageCreate", (message: Message) => {
  client.executeCommand(message);
});

client.login(env.BOT_TOKEN ?? ""); // provide your bot token
