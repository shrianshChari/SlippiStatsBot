import {MessageAttachment} from "discord.js";
import { Discord, On, Client, ArgsOf } from "discordx";


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
    if (!message.attachments) return; // @ message should contain an attatchment

    // Looping through collection of attatchments (even though each message can only have one)
    message.attachments.forEach((attatchment, key, map) => {
      if (!attatchment) return;
      if (!attatchment.name) return;

      let filename = attatchment.name;
      console.log(filename);
      if (filename.length < 4) return;
      console.log(filename.substring(filename.length - 4, filename.length));
      if (filename.substring(filename.length - 4, filename.length) === ".slp") {
        // Run slippi analysis
        console.log(`Conducting analysis on ${filename}`);
        return;
      }
    });
  }
}
