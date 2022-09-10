import { ActionRowBuilder, Attachment, ApplicationCommandOptionType, CommandInteraction, EmbedBuilder, Message, SelectMenuBuilder, SelectMenuInteraction, SelectMenuOptionBuilder } from "discord.js";
import { Discord, SelectMenuComponent, Slash, SlashOption } from "discordx";

import { SlippiGame } from "@slippi/slippi-js";

import axios, { AxiosResponse } from "axios";

import { table } from "table";

import * as slpJSON from './analyze/slpJSON';
import {inputData, outputData, ReplayEmbedData} from "./analyze/files";


@Discord()
class Analyze {
  @Slash(
    {
      name: 'analyze',
      description: "Analyze an attached SLP replay file."
    }
  )
  private analyze(
    @SlashOption({
      description: "Replay to analyze",
      name: "replay",
      required: true,
      type: ApplicationCommandOptionType.Attachment,
    })
    attachment: Attachment,
    interaction: CommandInteraction) {
    console.log(`Conducting analysis on ${attachment.name}`);

    let game: SlippiGame;

    const response = axios.get(attachment.url,  { responseType: 'arraybuffer' })
    .then((value: AxiosResponse<unknown, any>) => {
      if (value.data instanceof Buffer) {
        game = new SlippiGame(value.data);

        if (game == null) {
          let nullData = new EmbedBuilder();
          nullData.setColor([33, 186, 69]);
          nullData.setTitle("Error conducting analysis of Slippi replay file");
          nullData.setDescription("It seems as though an error occurred while trying to get your file. If you want to receive help for this issue, please open an issue on [GitHub](https://github.com/shrianshChari/SlippiStatsBot/issues).");

          interaction.reply({embeds: [nullData]});
          return;
        }

        let data = slpJSON.getDataFromSLP(game);
        if (data == null) {
          let nullData = new EmbedBuilder();
          nullData.setColor([33, 186, 69]);
          nullData.setTitle("Error conducting analysis of Slippi replay file");
          nullData.setDescription("It seems as though an error occurred while trying to get your file. If you want to receive help for this issue, please open an issue on [GitHub](https://github.com/shrianshChari/SlippiStatsBot/issues).");

          interaction.reply({embeds: [nullData]});
          return;
        }

        if (data.gameData.numPlayers > 2) {
          let tooManyPlayers = new EmbedBuilder();
          tooManyPlayers.setTitle("Number of Players Unsupported");
          tooManyPlayers.setDescription("Unfortunately, [SlippiStatsBot](https://github.com/shrianshChari/SlippiStatsBot) currently only supports analysis of Slippi replay files of singles matches. This means no replays of doubles or free-for-alls. While support for these games will come in the future, that will require more development. If you wish to see doubles and free-for-alls on SlippiStatsBot, consider contributing on GitHub!");
          tooManyPlayers.setColor([33, 186, 69]);
          interaction.reply({embeds: [tooManyPlayers]});
          return;
        }

        if (data.gameData.isTeams) {
          let tooManyPlayers = new EmbedBuilder();
          tooManyPlayers.setTitle("Teams Games Unsupported");
          tooManyPlayers.setDescription("Unfortunately, [SlippiStatsBot](https://github.com/shrianshChari/SlippiStatsBot) currently only supports analysis of Slippi replay files of singles matches. This means no replays of doubles or free-for-alls. While support for these games will come in the future, that will require more development. If you wish to see doubles and free-for-alls on SlippiStatsBot, consider contributing on GitHub!");
          tooManyPlayers.setColor([33, 186, 69]);
          interaction.reply({embeds: [tooManyPlayers]});
          return;
        }

        if (data.gameData.playableFrameCount == 0) {
          let noGame = new EmbedBuilder();
          noGame.setTitle("Not a Replay File");
          noGame.setDescription("It appears the file that you've submitted for analysis doesn't have a replay to analyze. In other words, its length is 0. If you want to receive help for this issue, please open an issue on [GitHub](https://github.com/shrianshChari/SlippiStatsBot/issues).");
          noGame.setColor([33, 186, 69]);
          interaction.reply({embeds: [noGame]});
          return;
        }

        // Cleaning up percentages and ratios for output
        data.player1.overall.totalDamage = Math.round(10 * data.player1.overall.totalDamage) / 10;
        data.player2.overall.totalDamage = Math.round(10 * data.player2.overall.totalDamage) / 10;

        if (data.player1.overall.successfulConversions.ratio == null) {
          data.player1.overall.successfulConversions.ratio = 0
        }
        if (data.player2.overall.successfulConversions.ratio == null) {
          data.player2.overall.successfulConversions.ratio = 0
        }

        data.player1.overall.successfulConversions.ratio = Math.round(10000 * data.player1.overall.successfulConversions.ratio) 
          / 100
        data.player2.overall.successfulConversions.ratio = Math.round(10000 * data.player2.overall.successfulConversions.ratio) 
          / 100

        if (data.player1.overall.openingsPerKill.ratio == null) {
          data.player1.overall.openingsPerKill.ratio = 0
        }
        if (data.player2.overall.openingsPerKill.ratio == null) {
          data.player2.overall.openingsPerKill.ratio = 0
        }

        data.player1.overall.openingsPerKill.ratio = Math.round(100 * data.player1.overall.openingsPerKill.ratio) / 100
        data.player2.overall.openingsPerKill.ratio = Math.round(100 * data.player2.overall.openingsPerKill.ratio) / 100

        if (data.player1.overall.damagePerOpening.ratio == null) {
          data.player1.overall.damagePerOpening.ratio = 0
        }
        if (data.player2.overall.damagePerOpening.ratio == null) {
          data.player2.overall.damagePerOpening.ratio = 0
        }

        data.player1.overall.damagePerOpening.ratio = Math.round(10 * data.player1.overall.damagePerOpening.ratio) / 10
        data.player2.overall.damagePerOpening.ratio = Math.round(10 * data.player2.overall.damagePerOpening.ratio) / 10

        if (data.player1.overall.inputsPerMinute.ratio == null) {
          data.player1.overall.inputsPerMinute.ratio = 0
        }
        data.player1.overall.inputsPerMinute.ratio = Math.round(10 * data.player1.overall.inputsPerMinute.ratio) / 10

        if (data.player2.overall.inputsPerMinute.ratio == null) {
          data.player2.overall.inputsPerMinute.ratio = 0
        }
        data.player2.overall.inputsPerMinute.ratio = Math.round(10 * data.player2.overall.inputsPerMinute.ratio) / 10

        if (data.player1.overall.digitalInputsPerMinute.ratio == null) {
          data.player1.overall.digitalInputsPerMinute.ratio = 0
        }
        data.player1.overall.digitalInputsPerMinute.ratio = Math.round(10 * data.player1.overall.digitalInputsPerMinute.ratio) / 10

        if (data.player2.overall.digitalInputsPerMinute.ratio == null) {
          data.player2.overall.digitalInputsPerMinute.ratio = 0
        }
        data.player2.overall.digitalInputsPerMinute.ratio = Math.round(10 * data.player2.overall.digitalInputsPerMinute.ratio) / 10


        let tableDataOne = [
          ["", data.player1.name, data.player2.name],
          ["Kills", data.player1.overall.killCount, data.player2.overall.killCount],
          ["Damage Done", data.player1.overall.totalDamage, data.player2.overall.totalDamage],
          ["Opening Conversion Rate", `${data.player1.overall.successfulConversions.ratio}%`, `${data.player2.overall.successfulConversions.ratio}%`],
          ["Openings / Kill", data.player1.overall.openingsPerKill.ratio, data.player2.overall.openingsPerKill.ratio],
          ["Damage / Opening", data.player1.overall.damagePerOpening.ratio, data.player2.overall.damagePerOpening.ratio],

          ["Neutral Wins", data.player1.overall.neutralWinRatio.count, data.player2.overall.neutralWinRatio.count],
          ["Counter Hits", data.player1.overall.counterHitRatio.count, data.player2.overall.counterHitRatio.count],
          ["Beneficial Trades", data.player1.overall.beneficialTradeRatio.count, data.player2.overall.beneficialTradeRatio.count],

        ];

        let tableDataTwo = [
          ["", data.player1.name, data.player2.name],
          ["Rolls / Air Dodge / Spot Dodge", 
            `${data.player1.actionCounts.rollCount} / ${data.player1.actionCounts.airDodgeCount} / ${data.player1.actionCounts.spotDodgeCount}`, 
            `${data.player2.actionCounts.rollCount} / ${data.player2.actionCounts.airDodgeCount} / ${data.player2.actionCounts.spotDodgeCount}`],
          ["Wavedash / Waveland / Dash Dance / Ledgegrab", 
            `${data.player1.actionCounts.wavedashCount} / ${data.player1.actionCounts.wavelandCount} / ${data.player1.actionCounts.dashDanceCount} / ${data.player1.actionCounts.ledgegrabCount}`,
            `${data.player2.actionCounts.wavedashCount} / ${data.player2.actionCounts.wavelandCount} / ${data.player2.actionCounts.dashDanceCount} / ${data.player2.actionCounts.ledgegrabCount}`
          ],

          ["Inputs / Minute", data.player1.overall.inputsPerMinute.ratio, data.player2.overall.inputsPerMinute.ratio],
          ["Digital Inputs / Minute", data.player1.overall.digitalInputsPerMinute.ratio, data.player2.overall.digitalInputsPerMinute.ratio],
          ["L-Cancel Success Rate", 
            `${data.player1.actionCounts.lCancelCount.success} / ${data.player1.actionCounts.lCancelCount.fail + data.player1.actionCounts.lCancelCount.success}`,
            `${data.player2.actionCounts.lCancelCount.success} / ${data.player2.actionCounts.lCancelCount.fail + data.player2.actionCounts.lCancelCount.success}`
          ]
        ]

        let tableDataTwoOptions = { // The max width of the table on the embed is 56 chars, the borders add 10 chars of padding
          columns: [
            { width: 22, wrapWord: true },
            { width: 12, wrapWord: true },
            { width: 12, wrapWord: true }
          ]
        }

        let dateTimeString: string

        if (data.gameData.startAt != null) {
          let date = data.gameData.startAt;
          dateTimeString = date.toUTCString();
        } else {
          dateTimeString = "";
        }

        let gameLength: string;
        let gameSeconds = (data.gameData.playableFrameCount - data.gameData.playableFrameCount % 60) / 60; // Should now be in seconds
        let gameMinutes: number;
        if (gameSeconds > 60) {
          gameMinutes = (gameSeconds - gameSeconds % 60) / 60; // Now # of minutes in the game
          gameSeconds -= 60 * gameMinutes;
        } else {
          gameMinutes = 0;
        }

        let gameHours: number; // Hey, you never know
        if (gameMinutes > 60) {
          gameHours = (gameMinutes - gameMinutes % 60) / 60;
          gameMinutes -= 60 * gameHours;
        } else {
          gameHours = 0
        }

        if (gameHours > 0) {

          gameLength = `${gameHours}:${gameMinutes < 10 ? "0" + gameMinutes.toString() : gameMinutes}:${gameSeconds < 10 ? "0" + gameSeconds.toString() : gameSeconds}`;
        } else {
          gameLength = `${gameMinutes}:${gameSeconds < 10 ? "0" + gameSeconds.toString() : gameSeconds}`;
        }

        let summaryDesc = `(${data.player1.characterName}) ${data.player1.name} vs. (${data.player2.characterName}) ${data.player2.name}`;
        if (dateTimeString) {
          summaryDesc = summaryDesc + `\n\n**Game Start:** ${dateTimeString}`
        }

        let gameSummaryEmbed = new EmbedBuilder();
        gameSummaryEmbed.setAuthor({ name: `${data.player1.name} vs. ${data.player2.name}` });
        gameSummaryEmbed.setTitle("Game Summary:");
        gameSummaryEmbed.setColor([33, 186, 69]);
        gameSummaryEmbed.addFields(
          { name: 'Stage', value: data.gameData.stage.name, inline: true },
          { name: 'Platform', value: data.gameData.platform, inline: true },
          { name: 'Game Length', value: gameLength, inline: true }
        );
        gameSummaryEmbed.setDescription(summaryDesc);
        if (data.gameData.stage.id != -1) {
          gameSummaryEmbed.setThumbnail(`https://raw.githubusercontent.com/shrianshChari/slippi-stage-imgs/main/img/${data.gameData.stage.id}.png`)
        }

        let gameStatisticsEmbed = new EmbedBuilder();
        gameStatisticsEmbed.setAuthor({ name: `${data.player1.name} vs. ${data.player2.name}` });
        gameStatisticsEmbed.setTitle("Game Statistics:");
        gameStatisticsEmbed.setDescription(`\`\`\`${table(tableDataOne)}\`\`\``);
        gameStatisticsEmbed.setColor([33, 186, 69]);

        let actionCountsEmbed = new EmbedBuilder();
        actionCountsEmbed.setAuthor({ name: `${data.player1.name} vs. ${data.player2.name}` });
        actionCountsEmbed.setTitle("Action Counts:");
        actionCountsEmbed.setDescription(`\`\`\`${table(tableDataTwo, tableDataTwoOptions)}\`\`\``);
        actionCountsEmbed.setColor([33, 186, 69]);

        let gameSummary = new SelectMenuOptionBuilder();
        gameSummary.setLabel('Game Summary');
        gameSummary.setValue('gameSummaryEmbed');

        let gameStatistics = new SelectMenuOptionBuilder();
        gameStatistics.setLabel('Game Statistics');
        gameStatistics.setValue('gameStatisticsEmbed');

        let actionCounts = new SelectMenuOptionBuilder();
        actionCounts.setLabel('Action Counts');
        actionCounts.setValue('actionCountsEmbed');

        let embedMenu = [
          gameSummary,
          gameStatistics,
          actionCounts
        ];

        let embeds: { label: string, value: EmbedBuilder }[] = []; 

        embeds.push(
          {
            label: embedMenu[0].data.value ?? "",
            value: gameSummaryEmbed
          }
        );
        embeds.push(
          {
            label: embedMenu[1].data.value ?? "",
            value: gameStatisticsEmbed
          }
        );
        embeds.push(
          {
            label: embedMenu[2].data.value ?? "",
            value: actionCountsEmbed
          }
        );

        const menu = new SelectMenuBuilder()
        .addOptions(embedMenu)
        .setCustomId("replay-menu")

        const buttonRow = new ActionRowBuilder<SelectMenuBuilder>().addComponents(menu);

        interaction.reply(
          {
            content: "Analysis",
            embeds: [gameSummaryEmbed],
            components: [buttonRow],
            fetchReply: true,
          }
        )
          .then((reply: Message<boolean>) => {

            let messageId = reply.id;

            // console.log(reply.id)

            if (!interaction.guildId) {
              interaction.guildId = "";
            }

            let messageData: ReplayEmbedData = {
              embedMenu: embedMenu,
              embeds: embeds,
              guildId: interaction.guildId,
              messageId: messageId
            }

            outputData(messageData);
          });


        return;
      } else {
        console.log("Value.data is not a Buffer!");

        return;
      }
    });

    // interaction.reply(`Analysis coming on ${attachment.name}!`)
  }

  @SelectMenuComponent({ id: "replay-menu" })
  private async handle(interaction: SelectMenuInteraction) {
    const embedValue = interaction.values[0];

    if (interaction.guildId === null) {
      interaction.guildId = ""
    }

    let ourData = inputData(interaction.guildId, interaction.message.id);

    let embed: EmbedBuilder | null = null;

    if (ourData) {
      for (let i = 0; i < ourData.embeds.length; i++) {
        if (ourData.embeds[i].label == embedValue) {
          embed = ourData.embeds[i].value;
        }
      }

      if (embed) {
        const menu = new SelectMenuBuilder()
        .addOptions(ourData.embedMenu)
        .setCustomId("replay-menu")

        const buttonRow = new ActionRowBuilder<SelectMenuBuilder>().addComponents(menu);

        interaction.update({embeds: [embed]})
      }

    } else {
      console.log('Not embedValue')
      return await interaction.followUp("You've provided an invalid page to navigate to, try again.");

    }

    return;
  }
}
