/* Base Server */
export interface Server {
    data: BaseServerData;
}

/* Base Server Data */
interface BaseServerData {
    type: string;
    id: string;
    relationships: Relationships;
}

/* Rust Server */
export interface RustServer {
    data: RustServerData;
}

/* Rust Server Data */
export interface RustServerData extends BaseServerData {
    attributes: RustServerAttributes;
}

export interface ArkServerData extends BaseServerData {
    attributes: ArkServerAttributes;
}

/* Attributes */
interface ServerAttributesBase {
    id: string;
    name: string;
    address: null;
    ip: string;
    port: number;
    players: number;
    maxPlayers: number;
    rank: number;
    location: number[];
    status: string;
    private: boolean;
    createdAt: Date;
    updatedAt: Date;
    portQuery: number;
    country: string;
    queryStatus: string;
}

export interface RustServerAttributes extends ServerAttributesBase {
    details: RustServerDetails;
}

export interface ArkServerAttributes extends ServerAttributesBase {
    details: ArkServerDetails;
}

/* Server Attribute Details */
interface ArkServerDetails {
    modIds: string[];
    modHashes: string[];
    map: string;
    time: string;
    time_i: string;
    offical: boolean;
    gamemode: string;
    modNames: string[];
    pve: boolean;
    modded: boolean;
    crossplay: boolean;
    session_flags: string;
    serverSteamId: string;
}

interface RustServerDetails {
    official: boolean;
    rust_type: string;
    map: string;
    environment: string;
    rust_build: string;
    rust_ent_cnt_i: number;
    rust_fps: number;
    rust_fps_avg: number;
    rust_gc_cl: number;
    rust_gc_mb: number;
    rust_hash: string;
    rust_headerimage: string;
    rust_mem_pv: null;
    rust_mem_ws: null;
    pve: boolean;
    rust_uptime: number;
    rust_url: string;
    rust_world_seed: number;
    rust_world_size: number;
    rust_maps: RustMaps;
    rust_description: string;
    rust_modded: boolean;
    rust_queued_players: number;
    rust_gamemode: string;
    rust_born: string;
    rust_last_ent_drop: string;
    rust_last_seed_change: string;
    rust_last_wipe: string;
    rust_last_wipe_ent: number;
    serverSteamId: string;
}

interface RustMaps {
    seed: number;
    size: number;
    url: string;
    thumbnailUrl: string;
    monuments: number;
    barren: boolean;
}

/* Game Relationships */
interface Relationships {
    game: Game;
}

interface Game {
    data: GameData;
}

interface GameData {
    type: string;
    id: string;
}

/* Leaderboard */
export interface ServerLeaderboard {
    data: ServerLeaderboardPlayer[];
    links: EndpointSliderLinks;
}

/* Leaderboard Player */
export interface ServerLeaderboardPlayer {
    type: string;
    id: string;
    attributes: ServerLeaderboardPlayerAttributes;
}

/* Leaderboard Player Attributes */
interface ServerLeaderboardPlayerAttributes {
    name: string;
    value: number;
    rank: number;
}

/* Leaderboard Links */
export interface EndpointSliderLinks {
    next?: string;
    prev?: string;
}