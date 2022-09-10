import "reflect-metadata";
import { Interaction, Message, IntentsBitField } from "discord.js";
import { Client } from "discordx";
import { dirname, importx, isESM } from "@discordx/importer";

import * as fs from 'fs';

import { loadEnv, env } from "./env";

loadEnv();

fs.mkdir('data', { recursive: true }, (err) => {
  console.log('Was unable to create data folder. Either it already exists or I cannot create directories.')
});

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMessageReactions,
  ],
  botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],
  silent: true,
});

client.once("ready", async () => {
  await client.guilds.fetch()

  await client.initApplicationCommands();

  console.log("Bot started");
});

client.on("interactionCreate", (interaction: Interaction) => {
  client.executeInteraction(interaction);
});

client.on("messageCreate", (message: Message) => {
  client.executeCommand(message);
});

async function run() {
  await importx(`${__dirname}/{commands,events}/**.{ts,js}`)
    .then(() => {
      console.log(`${__dirname}`);
      
      console.log('All commands imported!')
    })

  client.login(env.BOT_TOKEN ?? ""); // provide your bot token
}

run();
