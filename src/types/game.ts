/* Game Types */
export interface Game {
    data: GameData;
}

/* Game Data Types */
export interface GameData {
    type: string;
    id: string;
    attributes: GameAttributes;
}

/* Game Attributes */
interface GameAttributes {
    name: string;
    players: number;
    servers: number;
    metadata: GameMetadata;
    serversByCountry: { [key: string]: number };
    playersByCountry: { [key: string]: number };
    minPlayers24H: number;
    maxPlayers24H: number;
    minPlayers7D: number;
    maxPlayers7D: number;
    minPlayers30D: number;
    maxPlayers30D: number;
}

/* Game Metadata */
interface GameMetadata {
    appid?: number;
    gamedir?: string;
    noPlayerList?: boolean;
}