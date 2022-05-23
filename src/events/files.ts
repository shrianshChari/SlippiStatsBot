import { MessageEmbed, MessageSelectOptionData} from "discord.js"
import * as fs from 'fs';

let folder = 'data';

export interface ReplayEmbedData {
  embedMenu: MessageSelectOptionData[],
  embeds: { label: string, value: MessageEmbed }[],
  guildId: string,
  messageId: string
}

export function outputData(input: ReplayEmbedData): void {
  console.log(`guildId: ${input.guildId}, messageId: ${input.messageId}`)
  try {
    let filepath;
    if (input.guildId.length > 0 && input.messageId.length > 0) {
      fs.mkdirSync(`./${folder}/${input.guildId}`, { recursive: true })
      filepath = `./${folder}/${input.guildId}/${input.messageId}.json`;
    } else {
      fs.mkdirSync(`./${folder}/default`, { recursive: true })
      filepath = `./${folder}/default/${nextDefaultValue()}.json`;
    }
    console.log(filepath)
    fs.writeFileSync(filepath, JSON.stringify(input));
  } catch (error) {
    console.error(error)
    console.log('An error occurred when writing file output.')
  }
}

export function nextDefaultValue(): string {
  let val = 0;
  while (fs.existsSync(`./${folder}/default/${val}.json`)) {
    val++;
  }
  return val.toString();
}

export function inputData(guildId: string, messageId: string): ReplayEmbedData | null {
  let dataBuff;
  let data;

  let fileURL: string;
  if (guildId.length == 0) {
    fileURL = `./${folder}/default/${messageId}.json`;
  } else {
    fileURL = `./${folder}/${guildId}/${messageId}.json`;
  }
  console.log(`guildID: ${guildId}, messageId: ${messageId}`)
  console.log(`fileURL: ${fileURL}`)
  dataBuff = fs.readFileSync(fileURL);
  data = JSON.parse(dataBuff.toString('utf8'));
  // Checks for the integrity of the data
  if (data.embedMenu && data.embeds) {
    let fileReplayData: ReplayEmbedData = {
      embedMenu: data.embedMenu,
      embeds: data.embeds,
      guildId: guildId,
      messageId: messageId 
    }
    return fileReplayData
  }
  return null;
}
