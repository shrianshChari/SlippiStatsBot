import { SlippiGame, OverallType } from "@slippi/slippi-js";

export interface SlippiData {
  gameData: {
    stage: string
    
  }
  player1: Player
  player2: Player
}

export interface Player {
  name: string
  playerIndex: number
  character: string
  colorId: number
  stats: OverallType // TODO: implement game and player statistics using getStats().OverallType and getStats.ActionType
}

function getCharFromID(characterID: number): string {
  if (characterID == null) return "Unknown character";
  else {
    const charList = [
      "Captain Falcon",
      "Donkey Kong",
      "Fox",
      "Game and Watch",
      "Kirby",
      "Bowser",
      "Link",
      "Luigi",
      "Mario",
      "Marth",
      "Mewtwo",
      "Ness",
      "Peach",
      "Pikachu",
      "Ice Climbers",
      "Jigglypuff",
      "Samus",
      "Yoshi",
      "Zelda",
      "Sheik",
      "Falco",
      "Young Link",
      "Dr Mario",
      "Roy",
      "Pichu",
      "Ganondorf"
    ];
    if (charList[characterID]) {
      return charList[characterID];
    } else {
      return "Unknown character";
    }
  }
}

function getStageFromId(stageId: number): string {
  if (stageId == null) return "Unknown stage";
  else {
    const stageList = [
      "Fountain of Dreams",
      "Pokemon Stadium",
      "Peachs Castle",
      "Kongo Jungle",
      "Brinstar",
      "Corneria",
      "Yoshis Story",
      "Onett",
      "Mute City",
      "Rainbow Cruise",
      "Jungle Japes",
      "Great Bay",
      "Hyrule Temple",
      "Brinstar Depths",
      "Yoshis Island",
      "Green Greens",
      "Fourside",
      "Mushroom Kingdom",
      "Mushroom Kingdom 2",
      "Venom",
      "Poke Floats",
      "Big Blue",
      "Icicle Mountain",
      "Icetop",
      "Flat Zone",
      "Dreamland",
      "Yoshis Island N64",
      "Kongo Jungle N64",
      "Battlefield",
      "Final Destination"
    ];

    if (stageList[stageId - 2]) { // -2 is because the enum values start at 2, not 0
      return stageList[stageId - 2];
    } else {
      return "Unknown stage";
    }
  }
}
