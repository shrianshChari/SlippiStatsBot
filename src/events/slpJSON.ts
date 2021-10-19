import { SlippiGame, OverallType, PlayerType, ActionCountsType } from "@slippi/slippi-js";

export interface SlippiData {
  gameData: {
    stage: string
    numPlayers: number
    isTeams: boolean
  }
  player1: Player
  player2: Player
}

export interface Player {
  name: string
  playerIndex: number
  character: string
  colorId: number | null
  overall: OverallType // TODO: implement game and player statistics using getStats().OverallType and getStats.ActionType
  actionCounts: ActionCountsType
}

export function getDataFromSLP(slpGame: SlippiGame): SlippiData | null {
  let data: SlippiData;

  if (slpGame == null) return null;

  let stats = slpGame.getStats();
  if (stats == null) return null;

  let metadata = slpGame.getMetadata();
  if (metadata == null) return null;

  let settings = slpGame.getSettings()
  if (settings == null) return null;

  let player1: Player = {
    name: getNameFromPlayer(settings.players[0]),
    playerIndex: settings.players[0].playerIndex,
    colorId: settings.players[0].characterColor,
    character: getCharFromID(settings.players[0].characterId),
    overall: stats.overall[0],
    actionCounts: stats.actionCounts[0],
  };

  let player2: Player = {
    name: getNameFromPlayer(settings.players[1]),
    playerIndex: settings.players[1].playerIndex,
    colorId: settings.players[1].characterColor,
    character: getCharFromID(settings.players[1].characterId),
    overall: stats.overall[1],
    actionCounts: stats.actionCounts[1],
  };

  data = {
    player1: player1,
    player2: player2,
    gameData: {
      stage: getStageFromId(settings.stageId),
      numPlayers: settings.players.length,
      isTeams: settings.isTeams ? settings.isTeams : false, // Accounts for if isTeams is null
    }
  }
  return data;
}

function getCharFromID(characterID: number | null): string {
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

function getStageFromId(stageId: number | null): string {
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

function getNameFromPlayer(player: PlayerType): string {
  if (player == null) return "Unknown player";
  
  let name: string;

  if (player.displayName) {
    name = player.displayName;
  } else if (player.nametag) {
    name = player.displayName;
  } else {
    name = `Player ${player.port}`;
  }

  return name;
}