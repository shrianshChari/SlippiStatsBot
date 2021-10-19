import { MessageAttachment } from "discord.js";
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
              console.log("Game is null!")
              return;
            }

            let data = slpJSON.getDataFromSLP(game);
            if (data == null) {
              console.log('data is null!');
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

            data.player1.overall.damagePerOpening.ratio = Math.round(100 * data.player1.overall.damagePerOpening.ratio) / 100
            data.player2.overall.damagePerOpening.ratio = Math.round(100 * data.player2.overall.damagePerOpening.ratio) / 100

            if (data.player1.overall.inputsPerMinute.ratio == null) {
              data.player1.overall.inputsPerMinute.ratio = 0
            }
            data.player1.overall.inputsPerMinute.ratio = Math.round(100 * data.player1.overall.inputsPerMinute.ratio) / 100

            if (data.player2.overall.inputsPerMinute.ratio == null) {
              data.player2.overall.inputsPerMinute.ratio = 0
            }
            data.player2.overall.inputsPerMinute.ratio = Math.round(100 * data.player2.overall.inputsPerMinute.ratio) / 100

            if (data.player1.overall.digitalInputsPerMinute.ratio == null) {
              data.player1.overall.digitalInputsPerMinute.ratio = 0
            }
            data.player1.overall.digitalInputsPerMinute.ratio = Math.round(100 * data.player1.overall.digitalInputsPerMinute.ratio) / 100

            if (data.player2.overall.digitalInputsPerMinute.ratio == null) {
              data.player2.overall.digitalInputsPerMinute.ratio = 0
            }
            data.player2.overall.digitalInputsPerMinute.ratio = Math.round(100 * data.player2.overall.digitalInputsPerMinute.ratio) / 100


            let tableData = [

              ["", data.player1.name, data.player2.name],
              ["Offense", "", ""],
              ["Kills", data.player1.overall.killCount, data.player2.overall.killCount],
              ["Damage Done", data.player1.overall.totalDamage, data.player2.overall.totalDamage],
              ["Opening Conversion Rate", `${data.player1.overall.successfulConversions.ratio}%`, `${data.player2.overall.successfulConversions.ratio}%`],
              ["Openings / Kill", data.player1.overall.openingsPerKill.ratio, data.player2.overall.openingsPerKill.ratio],
              ["Damage / Opening", data.player1.overall.damagePerOpening.ratio, data.player2.overall.damagePerOpening.ratio],

              ["Defense", "", ""],
              ["Rolls / Air Dodge / Spot Dodge", 
                `${data.player1.actionCounts.rollCount} / ${data.player1.actionCounts.airDodgeCount} / ${data.player1.actionCounts.spotDodgeCount}`, 
                `${data.player2.actionCounts.rollCount} / ${data.player2.actionCounts.airDodgeCount} / ${data.player2.actionCounts.spotDodgeCount}`],

                ["Neutral", "", ""],
                ["Neutral Wins", data.player1.overall.neutralWinRatio.count, data.player2.overall.neutralWinRatio.count],
                ["Counter Hits", data.player1.overall.counterHitRatio.count, data.player2.overall.counterHitRatio.count],
                ["Beneficial Trades", data.player1.overall.beneficialTradeRatio.count, data.player2.overall.beneficialTradeRatio.count],
                ["Wavedash / Waveland / Dash Dance / Ledgegrab", 
                  `${data.player1.actionCounts.wavedashCount} / ${data.player1.actionCounts.wavelandCount} / ${data.player1.actionCounts.dashDanceCount} / ${data.player1.actionCounts.ledgegrabCount}`,
                  `${data.player2.actionCounts.wavedashCount} / ${data.player2.actionCounts.wavelandCount} / ${data.player2.actionCounts.dashDanceCount} / ${data.player2.actionCounts.ledgegrabCount}`
                ],

                ["General", "", ""],
                ["Inputs / Minute", data.player1.overall.inputsPerMinute.ratio, data.player2.overall.inputsPerMinute.ratio],
                ["Digital Inputs / Minute", data.player1.overall.digitalInputsPerMinute.ratio, data.player2.overall.digitalInputsPerMinute.ratio],
                ["L-Cancel Success Rate", 
                  `${data.player1.actionCounts.lCancelCount.success} / ${data.player1.actionCounts.lCancelCount.fail + data.player1.actionCounts.lCancelCount.success}`,
                  `${data.player2.actionCounts.lCancelCount.success} / ${data.player2.actionCounts.lCancelCount.fail + data.player2.actionCounts.lCancelCount.success}`
                ]
            ];

            console.log(table(tableData));

            /*

               let gameData = {
playedOn: metadata.playedOn
};
let player1 = {
name: "",
characterID: settings.players[0].characterId,
colorID: settings.players[0].characterColor
};

let player2 = {
name: "",
characterID: settings.players[1].characterId,
colorID: settings.players[1].characterColor
};

if (metadata.playedOn == 'dolphin') { // On Dolphin
player1.name = settings.players[0].displayName;
player2.name = settings.players[1].displayName;
} else {
if (settings.players[0].nametag) { // On Console
player1.name = settings.players[0].nametag;
} else {
player1.name = "Player 1";
}

if (settings.players[1].nametag) {
player2.name = settings.players[1].nametag;
} else {
player2.name = "Player 2";
}
}


let information = {};
             */
            return;
          } else {
            console.log("Value.data is not a Buffer!");
            // console.log(`Value.data is a ${value.data}`);

            return;
          }
          // TODO: Figure out how to resolve this AxiosResponse into an AxiosResponse<ArrayBuffer>
        });


        // let slpFilePromise = attachment.attachment;
        // console.log(slpFilePromise);


        // TODO: Continue SlippiGame analysis




      }
    });
  }
}
