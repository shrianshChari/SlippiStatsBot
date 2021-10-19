import {MessageAttachment} from "discord.js";
import { Discord, On, Client, ArgsOf } from "discordx";
import { SlippiGame } from "@slippi/slippi-js";

import fs from 'fs';
import axios, {AxiosResponse} from "axios";

@Discord()
export abstract class AppDiscord {
  @On("messageDelete")
  onMessageDelete([message]: ArgsOf<"messageDelete">, client: Client) {
    console.log("Message Deleted", client.user?.username, message.content);
  }

  @On("messageCreate")
  private onMessage([message]: ArgsOf<"messageCreate">, client: Client, guardPayload: any) {
    if (!client.user) return; // If the bot user is null for some reason
    if (!message.mentions.has(client.user)) return; // Bot should be mentioned for analysis to start
    if (!message.attachments) return; // @ message should contain an attachment

    // Looping through collection of attachments (even though each message can only have one)
    message.attachments.forEach((attachment, key, map) => {
      if (!attachment) return;
      if (!attachment.name) return;

      let filename = attachment.name;
      if (filename.length < 4) return;
      if (filename.substring(filename.length - 4, filename.length) === ".slp") {
        // Run slippi analysis
        console.log(`Conducting analysis on ${filename}`);

        let localFileName = `slpFile/${filename}`;

        let game: SlippiGame;

        const response = axios.get(attachment.url,  { responseType: 'arraybuffer' })
        .then((value: AxiosResponse<unknown, any>) => {
          if (value.data instanceof Buffer) {
            game = new SlippiGame(value.data);

            if (game == null) {
              fs.rmSync(localFileName);
              console.log(`game == null, ${localFileName} deleted!`);
              return;
            }

            console.log(game);

            // let metadata = game.getMetadata();
            // if (metadata == null) return;

            let settings;

            try {
              settings = game.getSettings();

              if (settings == null) {
                fs.rmSync(localFileName);
                console.log(`settings == null, ${localFileName} deleted!`);
                return;
              }


            } catch (err) {

            }

            console.log(settings);

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
            // fs.rmSync(localFileName);
            console.log(`${localFileName} deleted!`);
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
