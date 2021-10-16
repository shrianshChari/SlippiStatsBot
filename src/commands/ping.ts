import {CommandInteraction} from "discord.js";
import { Discord, Slash } from "discordx";

@Discord()
class ping {
  @Slash("ping", { description: "Pings the bot and returns the latency." })
  async ping(interaction: CommandInteraction) {
    interaction.reply(`**Pong**, replied in ${(new Date).getTime() - interaction.createdTimestamp}ms.`);
  }
}
