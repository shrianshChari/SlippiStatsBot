import {CommandInteraction} from "discord.js";
import { Discord, Slash } from "discordx";

@Discord()
class ping {
  @Slash("ping")
  async ping(interaction: CommandInteraction) {
    interaction.reply("Pong!");
  }
}
