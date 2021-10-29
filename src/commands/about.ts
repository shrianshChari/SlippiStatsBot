import {CommandInteraction, MessageEmbed} from "discord.js";
import { Discord, Slash } from "discordx";

@Discord()
class About {
  @Slash('about', { description: "Information about the bot and usage." })
  private about(interaction: CommandInteraction) {
    let aboutEmbed = new MessageEmbed();
    aboutEmbed.setTitle('About SlippiStatsBot');
    aboutEmbed.setDescription('SlippiStatsBot is a Discord bot that analyzes your Slippi replay file and displays it on Discord.\n\nTo use it, just mention this bot while also uploading your Slippi replay file, and the bot will return statistics about the game played.');
    aboutEmbed.setURL('https://github.com/shrianshChari/SlippiStatsBot');
    aboutEmbed.setColor([33, 186, 69]);

    interaction.reply({ embeds: [aboutEmbed] });
  }
}
