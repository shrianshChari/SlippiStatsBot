import { MessageAttachment, MessageEmbed } from "discord.js";
import { Discord, On, Client, ArgsOf } from "discordx";

import { SlippiGame } from "@slippi/slippi-js";

import axios, {AxiosResponse} from "axios";

import { table } from 'table';

import fs from 'fs';
import * as slpJSON from './slpJSON';

@Discord()
export abstract class AppDiscord {
  @On("messageDelete")
  onMessageDelete([message]: ArgsOf<"messageDelete">, client: Client) {
    console.log("Message Deleted", client.user?.username, message.content);
  }

  @On("messageCreate")
  private onMessage([message]: ArgsOf<"messageCreate">, client: Client) {
    if (!client.user) return; // If the bot user is null for some reason
    if (!message.mentions.has(client.user)) return; // Bot should be mentioned for analysis to start
    if (!message.attachments) return; // @ message should contain an attachment

    // Looping through collection of attachments (even though each message can only have one)
    message.attachments.forEach((attachment, map) => {
      if (!attachment) return;
      if (!attachment.name) return;

      let filename = attachment.name;
      if (filename.length < 4) return;
      if (filename.substring(filename.length - 4, filename.length) === ".slp") {
        // Run slippi analysis
        console.log(`Conducting analysis on ${filename}`);

        let game: SlippiGame;

        const response = axios.get(attachment.url,  { responseType: 'arraybuffer' })
        .then((value: AxiosResponse<unknown, any>) => {
          if (value.data instanceof Buffer) {
            game = new SlippiGame(value.data);

            if (game == null) {
              let nullData = new MessageEmbed();
              nullData.setColor([33, 186, 69]);
              nullData.setTitle("Error conducting analysis of Slippi replay file");
              nullData.setDescription("It seems as though an error occurred while trying to get your file. If you want to receive help for this issue, please open an issue on [GitHub](https://github.com/shrianshChari/SlippiStatsBot/issues).");

              message.reply({embeds: [nullData]});
              return;
            }

            let data = slpJSON.getDataFromSLP(game);
            if (data == null) {
              let nullData = new MessageEmbed();
              nullData.setColor([33, 186, 69]);
              nullData.setTitle("Error conducting analysis of Slippi replay file");
              nullData.setDescription("It seems as though an error occurred while trying to get your file. If you want to receive help for this issue, please open an issue on [GitHub](https://github.com/shrianshChari/SlippiStatsBot/issues).");

              message.reply({embeds: [nullData]});
              return;
            }

            if (data.gameData.numPlayers > 2) {
              let tooManyPlayers = new MessageEmbed();
              tooManyPlayers.setTitle("Number of Players Unsupported");
              tooManyPlayers.setDescription("Unfortunately, [SlippiStatsBot](https://github.com/shrianshChari/SlippiStatsBot) currently only supports analysis of Slippi replay files of singles matches. This means no replays of doubles or free-for-alls. While support for these games will come in the future, that will require more development. If you wish to see doubles and free-for-alls on SlippiStatsBot, consider contributing on GitHub!");
              tooManyPlayers.setColor([33, 186, 69]);
              message.reply({embeds: [tooManyPlayers]});
              return;
            }

            if (data.gameData.isTeams) {
              let tooManyPlayers = new MessageEmbed();
              tooManyPlayers.setTitle("Teams Games Unsupported");
              tooManyPlayers.setDescription("Unfortunately, [SlippiStatsBot](https://github.com/shrianshChari/SlippiStatsBot) currently only supports analysis of Slippi replay files of singles matches. This means no replays of doubles or free-for-alls. While support for these games will come in the future, that will require more development. If you wish to see doubles and free-for-alls on SlippiStatsBot, consider contributing on GitHub!");
              tooManyPlayers.setColor([33, 186, 69]);
              message.reply({embeds: [tooManyPlayers]});
              return;
            }

            if (data.gameData.playableFrameCount == 0) {
              let noGame = new MessageEmbed();
              noGame.setTitle("Not a Replay File");
              noGame.setDescription("It appears the file that you've submitted for analysis doesn't have a replay to analyze. In other words, its length is 0. If you want to receive help for this issue, please open an issue on [GitHub](https://github.com/shrianshChari/SlippiStatsBot/issues).");
              noGame.setColor([33, 186, 69]);
              message.reply({embeds: [noGame]});
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

            let dateTimeString: string

            if (data.gameData.startAt != null) {
              let date = data.gameData.startAt;

              const options: Intl.DateTimeFormatOptions = {
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric'
              }

              let dateTimeFormat = new Intl.DateTimeFormat('default', options)

              dateTimeString = date.toUTCString();
            } else {
              dateTimeString = "";
            }

            console.log(dateTimeString);

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

              gameLength = `${gameHours}:${gameMinutes < 0 ? "0" + gameMinutes : gameMinutes}:${gameSeconds < 0 ? "0" + gameSeconds : gameSeconds}`;
            } else {
              gameLength = `${gameMinutes < 0 ? "0" + gameMinutes : gameMinutes}:${gameSeconds < 0 ? "0" + gameSeconds : gameSeconds}`;
            }

            let summaryDesc = `(${data.player1.characterName}) ${data.player1.name} vs. (${data.player2.characterName}) ${data.player2.name}`;
            if (dateTimeString) {
              summaryDesc = summaryDesc + `\n\n**Game Start:** ${dateTimeString}`
            }

            let gameSummaryEmbed = new MessageEmbed();
            gameSummaryEmbed.setAuthor(`${data.player1.name} vs. ${data.player2.name}`);
            gameSummaryEmbed.setTitle("Game Summary:");
            gameSummaryEmbed.setColor([33, 186, 69]);
            gameSummaryEmbed.addFields(
              { name: 'Stage', value: data.gameData.stageName, inline: true },
              { name: 'Platform', value: data.gameData.platform, inline: true },
              { name: 'Game Length', value: gameLength, inline: true }
            );
            gameSummaryEmbed.setDescription(summaryDesc);

            let tableEmbed1 = new MessageEmbed();
            tableEmbed1.setAuthor(`${data.player1.name} vs. ${data.player2.name}`)
            tableEmbed1.setTitle("Game Statistics:");
            tableEmbed1.setDescription(`\`\`\`${table(tableDataOne)}\`\`\``);
            tableEmbed1.setColor([33, 186, 69]);

            message.reply({embeds: [tableEmbed1]});

            return;
          } else {
            console.log("Value.data is not a Buffer!");

            return;
          }
        });
      }
    });
  }
}
