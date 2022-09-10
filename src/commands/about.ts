import {CommandInteraction, EmbedBuilder} from "discord.js";
import { Discord, Slash } from "discordx";

@Discord()
class About {
  @Slash(
    {
      name: 'about',
      description: "Information about the bot and usage."
    }
  )
  private about(interaction: CommandInteraction) {
    let aboutEmbed = new EmbedBuilder();
    aboutEmbed.setTitle('About SlippiStatsBot');
    aboutEmbed.setDescription('SlippiStatsBot is a Discord bot that analyzes your Slippi replay file and displays it on Discord.\n\nTo use it, just call `/analyze` while also uploading your Slippi replay file, and the bot will return statistics about the game played.\n\n__[GitHub Repository](https://github.com/shrianshChari/SlippiStatsBot)__');
    aboutEmbed.setColor([33, 186, 69]);

    interaction.reply({ embeds: [aboutEmbed] });
  }
}
